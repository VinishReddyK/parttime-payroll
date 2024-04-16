import { useEffect, useState } from "react";
import { api } from "../../services/axios";
import { Button, Card, CardContent, Typography, Box } from "@mui/material";

const Timesheet = () => {
  const [currentUserTimesheet, setCurrentUserTimesheet] = useState(null);
  const [timer, setTimer] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [totalHoursToday, setTotalHoursToday] = useState(null);

  useEffect(() => {
    fetchTimesheets();
  }, []);

  useEffect(() => {
    if (currentUserTimesheet && currentUserTimesheet.actual_start_time && !currentUserTimesheet.actual_end_time) {
      startTimer();
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [currentUserTimesheet]);

  const fetchTimesheets = async () => {
    try {
      const result = await api.get("/timesheet");
      const userId = localStorage.getItem("employee_id");
      const userTimesheets = result.data.filter((ts) => ts.employee_id.toString() === userId);
      checkCurrentDayTimesheet(userTimesheets);
    } catch (error) {
      console.log(error);
    }
  };

  const checkCurrentDayTimesheet = (timesheets) => {
    const today = new Date().toISOString().slice(0, 10);
    const todayTimesheet = timesheets.find((ts) => ts.date === today);
    setCurrentUserTimesheet(todayTimesheet);
    if (todayTimesheet && todayTimesheet.actual_end_time) {
      calculateTotalHours(todayTimesheet);
    }
  };

  const startTimer = () => {
    const startTime = new Date(currentUserTimesheet.actual_start_time).getTime();
    setTimer(
      setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000)
    );
  };

  const calculateTotalHours = (timesheet) => {
    const startTime = new Date(timesheet.actual_start_time);
    const endTime = new Date(timesheet.actual_end_time);
    const duration = (endTime - startTime) / 3600000;
    setTotalHoursToday(duration.toFixed(2));
  };

  const clockIn = async () => {
    const userId = localStorage.getItem("employee_id");
    const newTimesheet = {
      employee_id: parseInt(userId),
      date: new Date().toISOString().slice(0, 10),
      actual_start_time: new Date().toISOString(),
      actual_end_time: null,
    };

    try {
      await api.post("/timesheet/new", newTimesheet);
      fetchTimesheets();
    } catch (error) {
      console.error("Error clocking in:", error);
    }
  };

  const clockOut = async () => {
    if (currentUserTimesheet && timer) {
      clearInterval(timer);
    }

    const updatedTimesheet = {
      ...currentUserTimesheet,
      actual_end_time: new Date().toISOString(),
    };

    try {
      await api.put(`/timesheet/${currentUserTimesheet.id}`, updatedTimesheet);
      calculateTotalHours(updatedTimesheet);
      fetchTimesheets();
    } catch (error) {
      console.error("Error clocking out:", error);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 5 }}>
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h4" gutterBottom component="div">
          Timesheet for Today
        </Typography>
        {currentUserTimesheet ? (
          currentUserTimesheet.actual_end_time ? (
            <Box>
              <Typography variant="h6">Total Hours Today</Typography>
              <Typography variant="h1" style={{ color: "#4285F4" }} sx={{ mb: 2 }}>
                {totalHoursToday}
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="h1" style={{ color: "#0F9D58" }} sx={{ mb: 2 }}>
                {`${Math.floor(timeElapsed / 3600)
                  .toString()
                  .padStart(2, "0")}:${Math.floor((timeElapsed % 3600) / 60)
                  .toString()
                  .padStart(2, "0")}:${(timeElapsed % 60).toString().padStart(2, "0")}`}
              </Typography>
              <Button variant="contained" color="primary" size="large" onClick={clockOut}>
                Clock Out
              </Button>
            </Box>
          )
        ) : (
          <Button variant="contained" color="primary" size="large" onClick={clockIn}>
            Clock In
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Timesheet;
