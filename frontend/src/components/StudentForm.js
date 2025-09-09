// src/components/StudentForm.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import api from "../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContext } from "../context/ToastContext";

const courses = ["MERN Bootcamp", "React", "Node", "Fullstack"];

const StudentForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    enrollment_date: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { showToast } = React.useContext(ToastContext);

  const validate = () => {
    let newErrors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.course) newErrors.course = "Course is required";
    if (!formData.enrollment_date) newErrors.enrollment_date = "Enrollment date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {

      if (id) {
        await api.put(`/students/${id}`, formData);
        showToast("Student updated", "success");
      } else {
        await api.post("/students", formData);
        showToast("Student created", "success");
      }
      setFormData({ name: "", email: "", course: "", enrollment_date: "" });
      if (onSuccess) onSuccess();
      navigate("/students");

    } catch (err) {
      if (err.response?.status === 409) {
        setErrors({ email: "Email must be unique" });
      } else {
        showToast("Error saving student", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.get(`/students/getbyid/${id}`);
        const iso = data[0].enrollment_date;
        const dateOnly = iso ? new Date(iso).toISOString().slice(0, 10) : "";
        setFormData({
          name: data[0].name,
          email: data[0].email,
          course: data[0].course,
          enrollment_date: dateOnly,
        });
      } catch (err) {
        console.error("Error fetching student:", err);
      }
    };

    fetchData();
  }, [id]);


  return (
    <Paper sx={{ p: 4, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Add New Student
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {/* Row 1: Name + Email */}
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
          error={!!errors.email}
          helperText={errors.email}
        />

        {/* Row 2: Course + Enrollment Date */}
        <TextField
          select
          fullWidth
          label="Course"
          name="course"
          value={formData.course}
          onChange={handleChange}
          margin="normal"
          required
          error={!!errors.course}
          helperText={errors.course}
        >
          {courses.map((course) => (
            <MenuItem key={course} value={course} >
              {course}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Enrollment Date"
          name="enrollment_date"
          type="date"
          value={formData.enrollment_date}
          onChange={handleChange}
          margin="normal"
          required
          error={!!errors.enrollment_date}
          helperText={errors.enrollment_date}
          InputLabelProps={{ shrink: true }}
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? "Saving..." : (id ? "Update Student" : "Save Student")}
        </Button>
      </Box>
    </Paper>
  );
};

export default StudentForm;
