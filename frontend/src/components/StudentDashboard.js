import React, { useContext, useEffect, useState } from "react";
import { Paper, Typography, TextField, Button, Stack, MenuItem } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import { ToastContext } from "../context/ToastContext";

export default function StudentDashboard() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({ name: "", email: "", course: "", enrollment_date: "" });
  const [loading, setLoading] = useState(true);
  const { showToast } = useContext(ToastContext);

  const fetchMyProfile = async () => {
    setLoading(true);
    try {
      const data = await api.get("/students");
      const mine = Array.isArray(data) ? data[0] : null;
      if (mine) setProfile({
        name: mine.name,
        email: mine.email,
        course: mine.course,
        enrollment_date: mine.enrollment_date?.slice(0, 10) || "",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // find my record first
      const list = await api.get("/students");
      const mine = Array.isArray(list) ? list[0] : null;
      if (mine) {
        await api.put(`/students/${mine._id}`, profile);
      } else {
        await api.post(`/students`, profile);
      }
      await fetchMyProfile();
      showToast("Profile saved", "success");
    } catch (e) {
      showToast("Save failed", "error");
    }
  };

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const courses = ["MERN Bootcamp", "React", "Node", "Fullstack"];

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom>
        {loading ? "Loading..." : `Welcome, ${user?.name || "Student"}`}
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Name"
          name="name"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })} fullWidth />

        <TextField
          label="Email"
          name="email"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })} type="email"
          fullWidth />

        {/* <TextField
          label="Course"
          name="course"
          value={profile.course}
          onChange={(e) => setProfile({ ...profile, course: e.target.value })} fullWidth /> */}

        <TextField
          select
          fullWidth
          label="Course"
          name="course"
          value={profile.course}
          onChange={(e) => setProfile({ ...profile, course: e.target.value })}
          margin="normal"
          required
        // error={!!errors.course}
        // helperText={errors.course}
        >
          {courses.map((course) => (
            <MenuItem key={course} value={course} >
              {course}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Enrollment Date"
          name="enrollment_date"
          type="date"
          value={profile.enrollment_date}
          onChange={(e) => setProfile({ ...profile, enrollment_date: e.target.value })} InputLabelProps={{ shrink: true }} fullWidth />

        <Button
          variant="contained"
          onClick={handleSave}>
          Save
        </Button>
      </Stack>
    </Paper>
  );
}


