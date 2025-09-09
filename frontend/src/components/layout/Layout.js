// src/components/Layout.js
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import { FiMenu } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";

const drawerWidth = 220;

export default function Layout() {
  const { logout, user } = React.useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = user?.role === 'admin'
    ? [
        { text: "Students", path: "/students" },
        { text: "Dashboard", path: "/analytics" },
      ]
    : [
        { text: "My Profile", path: "/dashboard" },
      ];

  const drawer = (
    <div>
      <Toolbar sx={{ bgcolor: "primary.main" }}>
        <Typography
          variant="h6"
          noWrap
          sx={{ fontWeight: "bold", color: "white" }}
        >
          Student App
        </Typography>

      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={NavLink}
            to={item.path}
            sx={{
              "&.active": {
                backgroundColor: "primary.main",
                color: "white",
                "& .MuiListItemText-primary": {
                  fontWeight: "bold",
                  color: "white",
                },
              },
            }}
          >
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Top App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "primary.main",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <FiMenu size={22} />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            {/* Dashboard */}
          </Typography>
          <Button
            color="inherit"
            variant="outlined"
            onClick={logout}
            sx={{
              borderColor: "white",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "#f9fafc",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
