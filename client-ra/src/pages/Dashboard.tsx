// client/src/pages/Dashboard.tsx
import * as React from "react";
import { Grid, Card, CardContent, Typography, Box, Link } from "@mui/material";
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useNavigate } from "react-router-dom";

interface Stat {
  label: string;
  value: string;
  icon: React.ElementType;
  change: string;
  color: string;
}

const stats: Stat[] = [
  { label: "Total Events", value: "24", icon: EventIcon, change: "+12%", color: "primary.main" },
  { label: "Active Members", value: "1,234", icon: PeopleIcon, change: "+8%", color: "success.main" },
  { label: "This Month", value: "156", icon: DirectionsRunIcon, change: "+23%", color: "warning.main" },
  { label: "Growth Rate", value: "18.2%", icon: TrendingUpIcon, change: "+5%", color: "info.main" },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card
                sx={{
                  minHeight: 120,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  p: 2,
                  cursor: "pointer",
                }}
                onClick={() => navigate("/admin/me")}
              >
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ display: "flex", alignItems: "center", gap: 1, color: stat.color }}
                  >
                    <Icon fontSize="medium" /> {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.change}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Dashboard;
