import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Button from "@mui/material/Button";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import BarChartIcon from "@mui/icons-material/BarChart";

const drawerWidth = 240;

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    handleNavigation("/login");
  };

  const menuItems = [
    { name: "profile", text: "Profile", icon: <AccountCircleIcon />, path: "/" },
    { name: "manage-profiles", text: "Manage Profiles", icon: <SupervisorAccountIcon />, path: "/manage", roles: ["admin", "manager"] },
    { name: "timesheet", text: "Timesheet", icon: <SupervisorAccountIcon />, path: "/timesheet", roles: ["ptemployee"] },
    { name: "schedules", text: "Schedules", icon: <ScheduleIcon />, path: "/schedules", roles: ["manager", "ptemployee"] },
    { name: "swap-shifts", text: "Swap Shifts", icon: <SwapHorizIcon />, path: "/swap", roles: ["manager", "ptemployee"] },
    { name: "leaves", text: "Leaves", icon: <CalendarTodayIcon />, path: "/leave", roles: ["manager", "ptemployee"] },
    { name: "overtime", text: "Overtime", icon: <MoreTimeIcon />, path: "/overtime", roles: ["manager", "ptemployee"] },
    { name: "payroll", text: "Payroll System configuration", icon: <AccountBalanceIcon />, path: "/tax", roles: ["admin"] },
    { name: "payslip-generate", text: "Payslip Generate", icon: <ReceiptLongIcon />, path: "/generate-payslips", roles: ["admin"] },
    {
      text: role === "admin" ? "Reports" : "Pay Slips",
      icon: role === "admin" ? <BarChartIcon /> : <ReceiptLongIcon />,
      path: "/reports",
      roles: ["admin", "ptemployee"],
    },
  ].filter((item) => !item.roles || item.roles.includes(role));

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ zIndex: 1300, width: "30px", height: "100%" }} />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List style={{ height: "100%" }}>
          {menuItems.map((item, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1, padding: 1 }}>
              <Button
                variant="contained"
                name={item.name}
                color={location.pathname === item.path ? "primary" : "secondary"}
                startIcon={item.icon}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  justifyContent: "flex-start",
                  width: "100%",
                  backgroundColor: location.pathname === item.path ? undefined : "#ffffff",
                  color: location.pathname === item.path ? undefined : "rgba(0, 0, 0, 0.87)",
                  "&:hover": {
                    backgroundColor: location.pathname === item.path ? undefined : "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                {item.text}
              </Button>
            </Box>
          ))}
          <ListItem disablePadding>
            <Button
              variant="contained"
              color="error"
              startIcon={<ExitToAppIcon />}
              onClick={handleLogout}
              sx={{
                margin: 1,
                width: "calc(100% - 8px)",
              }}
            >
              Logout
            </Button>
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
