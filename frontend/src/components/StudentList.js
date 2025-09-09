// src/components/StudentList.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Grid,
  Stack,
  Card, CardContent,
} from "@mui/material";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { ToastContext } from "../context/ToastContext";

// Courses filter (optional UI); backend now uses course/enrollment_date
const courses = ["All", "MERN Bootcamp", "React", "Node", "Fullstack"];

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("All");
  const navigate = useNavigate();
  const { showToast } = React.useContext(ToastContext);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await api.get("/students");
      setStudents(data);
    } catch (err) {
      showToast("Error fetching students", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this student?")) {
      await api.delete(`/students/${id}`);
      showToast("Student deleted", "success");
      fetchStudents();
    }
  };

  const handleEdit = async (id) => {
    navigate(`/students/${id}`);
  };

  const handleAdd = async (id) => {
    navigate("/students/new");
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) => {
    return (
      s.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterCourse === "All" || s.course === filterCourse)
    );
  });

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom>
        Students List
      </Typography>

      <Card sx={{ height: "100%", width: "100%" }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Grid container spacing={2} >
            <Grid item xs={3} sx={{ width: "full" }}>
              <TextField
                fullWidth
                size="small"
                label="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Grid>

            <Grid item xs={3} sx={{ width: "full" }}>
              <TextField
                fullWidth
                size="small"
                select
                label="Filter by Course"
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
              >
                {courses.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={3} sx={{ width: "full" }}></Grid>

            <Grid
              item
              xs={3}
              sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleAdd}
                sx={{ px: 3, py: 1.2 }}
              >
                Add Student
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading ? (
        <CircularProgress />
      ) : (
        <>

          {filteredStudents && filteredStudents.length < 1 ? (
            <Typography variant="h6" gutterBottom sx={{ mt: "20px" }}>
              No Data Found
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Enrollment Date</TableCell>
                  {/* <TableCell>Created At</TableCell> */}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead >
              <TableBody>
                {filteredStudents.map((s) => (
                  <TableRow key={s._id}>
                    <TableCell>{s._id?.substring(0, 2)}..</TableCell>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.course}</TableCell>
                    <TableCell>{new Date(s.enrollment_date).toLocaleDateString()}</TableCell>
                    {/* <TableCell>
                      {new Date(s.created_at).toLocaleDateString()}
                    </TableCell> */}
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          color="primary"
                          variant="outlined"
                          size="small"
                          onClick={() => handleEdit(s._id)}
                        >
                          Edit
                        </Button>

                        <Button
                          color="error"
                          variant="outlined"
                          size="small"
                          onClick={() => handleDelete(s._id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table >
          )}
        </>
      )}
    </Paper >
  );
};

export default StudentList;
