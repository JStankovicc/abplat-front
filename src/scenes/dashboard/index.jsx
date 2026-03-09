import React from "react";
import { Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import {
  DashboardShimmer,
  NotificationsCard,
  MiniInboxCard,
  ProjectCard,
} from "../../components/dashboard";
import { useDashboardData } from "../../hooks/useDashboardData";

const getStatusColor = (statusId) => {
  switch (statusId) {
    case 1:
      return "warning";
    case 2:
      return "primary";
    case 3:
      return "success";
    default:
      return "secondary";
  }
};

const getStatusName = (statusId) => {
  switch (statusId) {
    case 1:
      return "Čekanje";
    case 2:
      return "U toku";
    case 3:
      return "Završeno";
    default:
      return "Nepoznat";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Danas";
  if (date.toDateString() === yesterday.toDateString()) return "Juče";
  return date.toLocaleDateString("sr-RS", { day: "2-digit", month: "2-digit" });
};

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const {
    projects,
    projectTasks,
    loading,
    error,
    lastMessage,
  } = useDashboardData();

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const handleInboxClick = () => {
    navigate("/messages");
  };

  if (loading) {
    return (
      <Box m={{ xs: 1.5, sm: 2, md: "20px" }} minHeight={200} display="flex" justifyContent="center" alignItems="center">
        <DashboardShimmer colors={colors} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={{ xs: 1.5, sm: 2, md: "20px" }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box m={{ xs: 1.5, sm: 2, md: "20px" }} pb={2}>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(12, 1fr)" }}
        gridTemplateRows={{ xs: "auto", md: "repeat(5, 1fr)" }}
        gap={{ xs: "12px", md: "15px" }}
        width={{ xs: "100%", sm: "95%", md: "75%" }}
        maxWidth={1200}
        sx={{
          "& > *": {
            gridColumn: { xs: "1 / -1", sm: "span 1", md: undefined },
            gridRow: { xs: "auto", md: undefined },
          },
        }}
      >
        <NotificationsCard colors={colors} />
        <MiniInboxCard
          colors={colors}
          lastMessage={lastMessage}
          onInboxClick={handleInboxClick}
        />
        {projects.slice(0, 3).map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            tasks={projectTasks[project.id] || []}
            colors={colors}
            onProjectClick={handleProjectClick}
            getStatusColor={getStatusColor}
            getStatusName={getStatusName}
            formatDate={formatDate}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Dashboard;
