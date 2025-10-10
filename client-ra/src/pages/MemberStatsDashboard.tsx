// src/pages/member/MemberStatsDashboard.tsx
import * as React from "react";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useGetList } from "react-admin";

interface Stat {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

const iconMap: Record<string, React.ElementType> = {
  totalRegistrations: CheckCircleIcon,
  ready: AccessTimeIcon,
  ongoing: PlayArrowIcon,
  completed: DoneAllIcon,
};

const colorMap: Record<string, string> = {
  totalRegistrations: "#16a34a", // green
  ready: "#d97706",              // orange
  ongoing: "#2563eb",            // blue
  completed: "#059669",          // teal
};

const MemberStatsDashboard: React.FC = () => {
  const { data, isLoading } = useGetList("member-stats", {
    pagination: { page: 1, perPage: 1 },
  });

  const stats: Stat[] = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    const statData = data[0];

    return [
      {
        label: "Registrations",
        value: statData.totalRegistrations?.toString() || "0",
        icon: iconMap.totalRegistrations,
        color: colorMap.totalRegistrations,
      },
      {
        label: "Ready",
        value: statData.ready?.toString() || "0",
        icon: iconMap.ready,
        color: colorMap.ready,
      },
      {
        label: "Ongoing",
        value: statData.ongoing?.toString() || "0",
        icon: iconMap.ongoing,
        color: colorMap.ongoing,
      },
      {
        label: "Completed",
        value: statData.completed?.toString() || "0",
        icon: iconMap.completed,
        color: colorMap.completed,
      },
    ];
  }, [data]);

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card
                sx={{
                  minHeight: 140,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  p: 3,
                  cursor: "default",
                  transition: "all 0.3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
                }}
              >
                <CardContent
                  sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    {stat.label}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Icon sx={{ fontSize: 30, color: stat.color }} />
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {isLoading ? "..." : stat.value}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default MemberStatsDashboard;
