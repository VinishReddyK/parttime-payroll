import { useEffect, useState } from "react";
import { api } from "../../services/axios";
import {
  Button,
  Card,
  Paper,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@mui/material";
import TimesheetModal from "./TimesheetModal";

const Timesheet = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [currentUserTimesheet, setCurrentUserTimesheet] = useState(null);
  const [timer, setTimer] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState("00:00");
  const [totalHoursToday, setTotalHoursToday] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

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
      setTimesheets(userTimesheets);
      checkCurrentDayTimesheet(userTimesheets);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalOpen = (data = null) => {
    setEditData({ ...data });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModalSubmit = (formData) => {
    if (editData.id) {
      editTimesheet(editData.id, {
        date: formData.date,
        actual_start_time: formData.startTime,
        actual_end_time: formData.endTime,
      });
    } else {
      createNewTimesheet({
        date: formData.date,
        actual_start_time: formData.startTime,
        actual_end_time: formData.endTime,
      });
    }
    setEditData(null);
    handleModalClose();
  };

  const checkCurrentDayTimesheet = (timesheets) => {
    const today = getCurrentTimeInCDT().toISOString().slice(0, 10);
    const todayTimesheet = timesheets.find((ts) => ts.date === today);
    setCurrentUserTimesheet(todayTimesheet);
    if (todayTimesheet && todayTimesheet.actual_end_time) {
      setTotalHoursToday(timeDifference(todayTimesheet.actual_start_time, todayTimesheet.actual_end_time));
    }
  };

  function timeDifference(startTime, endTime) {
    const startParts = startTime.split(":").map(Number);
    const endParts = endTime.split(":").map(Number);
    const startTotalMinutes = startParts[0] * 60 + startParts[1];
    const endTotalMinutes = endParts[0] * 60 + endParts[1];
    let difference = endTotalMinutes - startTotalMinutes;
    const hours = Math.floor(difference / 60);
    const minutes = difference % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

  const startTimer = () => {
    const startTimeString = currentUserTimesheet.actual_start_time;
    setTimer(
      setInterval(() => {
        const endTimeString = getCurrentTimeInCDT().toISOString().slice(11, 16);
        setTimeElapsed(timeDifference(startTimeString, endTimeString));
      }, 1000)
    );
  };

  const createNewTimesheet = async (formData) => {
    const userId = localStorage.getItem("employee_id");
    const newTimesheet = {
      employee_id: parseInt(userId),
      date: formData.date,
      actual_start_time: formData.actual_start_time,
      actual_end_time: formData?.actual_end_time,
    };
    try {
      await api.post("/timesheet/new", newTimesheet);
      fetchTimesheets();
    } catch (error) {
      console.error("Error creating new timesheet:", error);
    }
  };

  function getCurrentTimeInCDT() {
    const now = new Date();
    const cdtOffset = -5; // CDT is UTC-5
    const cdtDate = new Date(now.getTime() + cdtOffset * 60 * 60 * 1000);
    return cdtDate;
  }

  const clockIn = async () => {
    const userId = localStorage.getItem("employee_id");
    const cdtTime = getCurrentTimeInCDT();

    const newTimesheet = {
      employee_id: parseInt(userId),
      date: cdtTime.toISOString().slice(0, 10),
      actual_start_time: cdtTime.toISOString().slice(11, 16),
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

    const cdtTime = getCurrentTimeInCDT();

    const updatedTimesheet = {
      ...currentUserTimesheet,
      actual_end_time: cdtTime.toISOString().slice(11, 16),
    };

    try {
      await api.put(`/timesheet/${currentUserTimesheet.id}`, updatedTimesheet);
      fetchTimesheets();
      setTotalHoursToday(timeDifference(updatedTimesheet.actual_start_time, updatedTimesheet.actual_end_time));
    } catch (error) {
      console.error("Error clocking out:", error);
    }
  };

  const editTimesheet = async (id, formData) => {
    const userId = localStorage.getItem("employee_id");
    try {
      await api.put(`/timesheet/${id}`, {
        employee_id: parseInt(userId),
        date: formData.date,
        actual_start_time: formData.actual_start_time,
        actual_end_time: formData?.actual_end_time,
      });
      fetchTimesheets();
    } catch (error) {
      console.error("Error updating timesheet:", error);
    }
  };

  const deleteTimesheet = async (id) => {
    try {
      await api.delete(`/timesheet/${id}`);
      fetchTimesheets();
    } catch (error) {
      console.error("Error deleting timesheet:", error);
    }
  };
  const renderTimesheetTable = () => (
    <TableContainer sx={{ mt: 2 }} component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Start Time</TableCell>
            <TableCell align="right">End Time</TableCell>
            <TableCell align="right">Total Hours</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {timesheets.map((row) => (
            <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.date}
              </TableCell>
              <TableCell align="right">{row.actual_start_time}</TableCell>
              <TableCell align="right">{row.actual_end_time}</TableCell>
              <TableCell align="right">{row.actual_end_time ? timeDifference(row.actual_start_time, row.actual_end_time) : "-"}</TableCell>
              <TableCell align="right">
                <Button key={row.id} onClick={() => handleModalOpen(row)}>
                  Edit
                </Button>
                <Button color="error" onClick={() => deleteTimesheet(row.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <>
      <Typography variant="h4" gutterBottom component="div">
        Timesheets
      </Typography>
      <Card sx={{ maxWidth: 800, mx: "auto", mt: 5 }}>
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
                  {timeElapsed}
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

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" onClick={() => handleModalOpen()}>
          Create New Timesheet
        </Button>
        {renderTimesheetTable()}
      </Box>

      <TimesheetModal open={modalOpen} handleClose={handleModalClose} handleSubmit={handleModalSubmit} initialData={editData} />
    </>
  );
};

export default Timesheet;
