// // src/components/Analytics.js
// import React, { useEffect, useState } from "react";
// import { Box, Card, CardContent, Typography, Grid, Paper } from "@mui/material";
// import api from "../utils/api";

// const Analytics = () => {
//   const [stats, setStats] = useState({
//     total: 0,
//     averages: [],
//     recent: [],
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await api.get("/analytics");
//         setStats(data);
//       } catch (err) {
//         alert("Error fetching analytics");
//       }
//     };
//     fetchData();
//   }, []);

//   return (
//     <Paper sx={{ p: 4 }}>
//       <Typography variant="h6" gutterBottom>
//         Analytics Dashboard
//       </Typography>

//       <Card sx={{ height: "100%", width: "100%" }}>
//         <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
//           <Grid container spacing={2}>
//             {/* Total Students */}
//             <Grid item xs={12} sm={6} md={3}>
//               <Card sx={{ height: "100%" }}>
//                 <CardContent sx={{ textAlign: "center" }}>
//                   <Typography variant="h5">{stats.total}</Typography>
//                   <Typography>Total Students</Typography>
//                 </CardContent>
//               </Card>
//             </Grid>

//             {/* Average per subject */}
//             {stats?.averages.map((row) => (
//               <Grid item xs={12} sm={6} md={3} key={row.subject}>
//                 <Card sx={{ height: "100%" }}>
//                   <CardContent sx={{ textAlign: "center" }}>
//                     <Typography variant="h5">{row.avgGrade}</Typography>
//                     <Typography>Average – {row.subject}</Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </CardContent>
//       </Card>


//       <Box sx={{ mt: 6 }}>
//         <Typography variant="h6" gutterBottom>
//           Recent Additions
//         </Typography>
//         <Card sx={{ height: "100%", width: "100%" }}>
//           <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
//             <Grid container spacing={2}>
//               {stats && stats.recent.map((s) => (
//                 <Grid item xs={12} md={3} key={s.id}>
//                   <Card sx={{ height: "100%", width: "100%" }}>
//                     <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
//                       <Typography variant="h6" noWrap>{s.name}</Typography>
//                       <Typography>{s.subject} - {s.grade}</Typography>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           </CardContent>
//         </Card>
//       </Box>

//     </Paper>
//   );
// };

// export default Analytics;


// src/components/Analytics.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import api from "../utils/api";
import { ToastContext } from "../context/ToastContext";

const Analytics = () => {
  const [stats, setStats] = useState({
    total: 0,
    averages: [],
    recent: [],
  });

  const { showToast } = React.useContext(ToastContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.get("/analytics");
        setStats(data);
      } catch (err) {
        showToast(err.message || "Error fetching analytics", "error");
      }
    };
    fetchData();
  }, []);

  return (
    <Paper sx={{ p: 4, bgcolor: "#f9fafc" }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Analytics Dashboard
      </Typography>

      {/* Stats Section */}
      <Grid container spacing={3}>
        {/* Total Students */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              bgcolor: "#e3f2fd", // light blue
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {stats.total}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Total Students
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Count per course */}
        {(stats?.byCourse || []).map((row, index) => {
          const colors = ["#fce4ec", "#fff3e0", "#e8f5e9", "#ede7f6"];
          return (
            <Grid item xs={12} sm={6} md={3} key={row.course}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: colors[index % colors.length],
                  borderRadius: 3,
                  boxShadow: 3,
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h4" fontWeight="bold">
                    {row.count}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {row.course}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Recent Additions */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Recent Additions
        </Typography>
        <Grid container spacing={3}>
          {(stats?.recent || []).map((s) => (
            <Grid item xs={12} sm={6} md={3} key={s.id}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "#f5f5f5",
                  borderRadius: 3,
                  boxShadow: 2,
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-4px)",
                    transition: "all 0.3s ease-in-out",
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    noWrap
                    sx={{ mb: 1 }}
                  >
                    {s.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {s.course} – {new Date(s.enrollment_date).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default Analytics;
