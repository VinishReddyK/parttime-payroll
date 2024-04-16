import { useEffect, useState } from "react";
import { api } from "../services/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Schedules = () => {
  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState({ employee_id: "", date: "", start_time: "", end_time: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchSchedules();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data } = await api.get("/profile/employees");
      setEmployees(data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const { data } = await api.get("/schedule");
      setSchedules(data);
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
    }
  };

  const handleOpen = (schedule = null) => {
    if (schedule) {
      setCurrentSchedule(schedule);
      setIsEditing(true);
    } else {
      setCurrentSchedule({ employee_id: "", date: "", start_time: "", end_time: "" });
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (isEditing) {
      await api.put(`/schedule/${currentSchedule.id}`, currentSchedule);
    } else {
      await api.post("/schedule/new", currentSchedule);
    }
    fetchSchedules();
    handleClose();
  };

  const handleDelete = async (id) => {
    await api.delete(`/schedule/${id}`);
    fetchSchedules();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCurrentSchedule((prev) => ({ ...prev, [name]: value }));
  };

  const renderDialog = () => (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{isEditing ? "Edit Schedule" : "Create Schedule"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isEditing ? "Edit the schedule details below." : "Please enter the details for the new schedule."}
        </DialogContentText>
        <FormControl fullWidth margin="dense">
          <InputLabel>Employee</InputLabel>
          <Select
            label="Employee"
            id="employee_id"
            name="employee_id"
            value={currentSchedule.employee_id}
            onChange={handleChange}
            fullWidth
          >
            {employees.map((employee) => (
              <MenuItem key={employee.id} value={employee.id}>
                {employee.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          id="date"
          name="date"
          label="Date"
          type="date"
          fullWidth
          variant="standard"
          InputLabelProps={{ shrink: true }}
          value={currentSchedule.date}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          id="start_time"
          name="start_time"
          label="Start Time"
          type="time"
          fullWidth
          variant="standard"
          InputLabelProps={{ shrink: true }}
          value={currentSchedule.start_time}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          id="end_time"
          name="end_time"
          label="End Time"
          type="time"
          fullWidth
          variant="standard"
          InputLabelProps={{ shrink: true }}
          value={currentSchedule.end_time}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>{isEditing ? "Update" : "Create"}</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <div>
      <Typography variant="h4" style={{ margin: "20px 0" }}>
        Employee Shifts
      </Typography>
      <Button variant="contained" style={{ margin: "0 0 20px 0" }} color="primary" onClick={() => handleOpen()}>
        Add Schedule
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((schedule, index) => (
              <TableRow key={index}>
                <TableCell>{schedule.employee_id}</TableCell>
                <TableCell>{employees.find((emp) => emp.id === schedule.employee_id)?.name || "Unknown"}</TableCell>
                <TableCell>{schedule.date}</TableCell>
                <TableCell>{schedule.start_time}</TableCell>
                <TableCell>{schedule.end_time}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(schedule)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(schedule.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {renderDialog()}
    </div>
  );
};

export default Schedules;
