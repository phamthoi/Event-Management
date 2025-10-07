// src/pages/admin/AdminDashboard.tsx
import * as React from "react";
import { useGetList } from "react-admin";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useNavigate } from "react-router-dom";

interface Stat {
  label: string;
  value: string;
  icon: React.ElementType;
  change?: string;
  color: string;
}

const iconMap: Record<string, React.ElementType> = {
  totalEvents: EventIcon,
  totalMembers: PeopleIcon,
};

const colorMap: Record<string, string> = {
  totalEvents: "primary.main",
  totalMembers: "success.main",
  thisMonth: "warning.main",
  growthRate: "info.main",
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useGetList("dashboardStats", {
    pagination: { page: 1, perPage: 1 },
  });

  const stats: Stat[] = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    const statData = data[0];

    return [
      {
        label: "Total Events",
        value: statData.totalEvents?.toString() || "0",
        icon: iconMap.totalEvents,
        color: colorMap.totalEvents,
      },
      {
        label: "Active Members",
        value: statData.totalMembers?.toString() || "0",
        icon: iconMap.totalMembers,
        color: colorMap.totalMembers,
      },
    ];
  }, [data]);

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;

          return (
            <Grid
              item
              xs={12}     // mobile: full width
              sm={6}      // tablet: 2 columns
              md={3}      // desktop: 4 columns
              key={idx}
            >
              <Card
                sx={{
                  minHeight: 160,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 3,
                  cursor: "pointer",
                  opacity: isLoading ? 0.5 : 1,
                  transition: "all 0.3s",
                  background: "background.paper",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 6,
                  },
                }}
                onClick={() => navigate("/admin/stats-details")}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      sx={{ fontWeight: 500 }}
                    >
                      {stat.label}
                    </Typography>
                    <Icon sx={{ fontSize: 32, color: stat.color }} />
                  </Box>

                  <Typography
                    variant="h4"
                    sx={{ color: stat.color, fontWeight: 600 }}
                  >
                    {isLoading ? "..." : stat.value}
                  </Typography>

                  {stat.change && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: "auto" }}
                    >
                      {stat.change}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
