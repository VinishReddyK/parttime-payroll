import { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Button from "@mui/material/Button";

const drawerWidth = 240;

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    handleNavigation("/login");
  };

  const menuItems = [{ text: "Profile", icon: <AccountCircleIcon />, path: "/" }];

  return (
    <Box sx={{ display: "flex" }}>
      <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ zIndex: 1300 }}>
        <MenuIcon />
      </IconButton>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "block", zIndex: "13001" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        <List>
          {menuItems.map((item, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1, padding: 1 }}>
              <Button
                variant="contained"
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
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", p: 3, height: "100vh" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
