import { useEffect, useState } from "react";
import api from "../../services/axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const Reports = () => {
  const [payslips, setPayslips] = useState([]);
  const userId = localStorage.getItem("employee_id");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const getPayslips = async () => {
      try {
        let result;
        if (role !== "ptemployee") {
          result = await api.get("/payslips");
        } else {
          result = await api.get(`/payslips/${userId}`);
        }
        if (result && result.data) {
          setPayslips(result.data);
        }
      } catch (error) {
        console.error("Error fetching payslips:", error);
      }
    };

    getPayslips();
  }, [role, userId]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Employee ID</TableCell>
            <TableCell align="right">Month</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payslips.map((row) => (
            <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.employee_id}</TableCell>
              <TableCell align="right">{row.month}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
              <TableCell align="right">{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Reports;
