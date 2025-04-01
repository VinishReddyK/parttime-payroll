const express = require("express");
const cors = require("cors");
const { initDatabase } = require("./database/start");
const signupAPIs = require("./routes/user/signup");
const loginAPIs = require("./routes/user/login");
const verify = require("./routes/authentication/verification");
const addUserAPI = require("./routes/user/addUser");
const profileAPI = require("./routes/user/profile");
const scheduleAPIs = require("./routes/employee/schedule");
const swapAPIs = require("./routes/employee/swap");
const leaveAPIs = require("./routes/employee/leave");
const overtimeAPIs = require("./routes/employee/overtime");
const timesheetAPIs = require("./routes/employee/timesheet");
const taxtypesAPIs = require("./routes/payroll/taxtypes");
const taxAPIs = require("./routes/payroll/tax");
const payslipsAPIs = require("./routes/payroll/payslips");
const employeesAPIs = require("./routes/employee");

const app = express();
const port = 3101;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initDatabase();

const apiRouter = express.Router();
app.use("/api", apiRouter);

apiRouter.use("/signup", signupAPIs);
apiRouter.use("/login", loginAPIs);

apiRouter.use(verify);

apiRouter.use("/adduser", addUserAPI);
apiRouter.use("/profile", profileAPI);
apiRouter.use("/schedule", scheduleAPIs);
apiRouter.use("/swap", swapAPIs);
apiRouter.use("/leave", leaveAPIs);
apiRouter.use("/overtime", overtimeAPIs);
apiRouter.use("/timesheet", timesheetAPIs);
apiRouter.use("/taxtypes", taxtypesAPIs);
apiRouter.use("/tax", taxAPIs);
apiRouter.use("/payslips", payslipsAPIs);
apiRouter.use("/employees", employeesAPIs);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
