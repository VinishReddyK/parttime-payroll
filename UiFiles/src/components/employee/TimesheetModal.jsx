import { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

function TimesheetModal({ open, handleClose, handleSubmit, initialData }) {
  function getCurrentTimeInCDT() {
    const now = new Date();
    const cdtOffset = -5;
    const cdtDate = new Date(now.getTime() + cdtOffset * 60 * 60 * 1000);
    return cdtDate;
  }

  const [formData, setFormData] = useState({
    date: getCurrentTimeInCDT().toISOString().slice(0, 10),
    startTime: "",
    endTime: "",
  });

  const [endTimeError, setEndTimeError] = useState(""); // State for end time error

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date || getCurrentTimeInCDT().toISOString().slice(0, 10),
        startTime: initialData.actual_start_time || "",
        endTime: initialData.actual_end_time || "",
      });
    }
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If the end time is being changed, validate it
    if (name === "endTime") {
      validateEndTime(formData.startTime, value);
    }
  };

  const validateEndTime = (startTime, endTime) => {
    if (startTime && endTime) {
      const start = startTime.split(":").map(Number);
      const end = endTime.split(":").map(Number);

      const startTotalMinutes = start[0] * 60 + start[1];
      const endTotalMinutes = end[0] * 60 + end[1];

      if (endTotalMinutes <= startTotalMinutes) {
        setEndTimeError("End time must be greater than start time.");
      } else {
        setEndTimeError("");
      }
    }
  };

  const onSubmit = () => {
    // Check if there's any error before submission
    if (!endTimeError) {
      handleSubmit(formData);
      handleClose();
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {initialData ? "Edit Timesheet" : "Create Timesheet"}
        </Typography>
        <form>
          <TextField
            key={`date-${initialData?.date}`}
            margin="normal"
            required
            fullWidth
            label="Date"
            name="date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.date}
            onChange={handleChange}
          />
          <TextField
            key={`start-time-${initialData?.actual_start_time}`}
            margin="normal"
            required
            fullWidth
            label="Start Time"
            name="startTime"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={formData.startTime}
            onChange={handleChange}
          />
          <TextField
            key={`end-time-${initialData?.actual_end_time}`}
            margin="normal"
            required
            fullWidth
            label="End Time"
            name="endTime"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={formData.endTime}
            onChange={handleChange}
            error={!!endTimeError} // Set error state if there's an error
            helperText={endTimeError} // Display the error message
          />

          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleClose} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={onSubmit} disabled={!!endTimeError}>
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

export default TimesheetModal;
