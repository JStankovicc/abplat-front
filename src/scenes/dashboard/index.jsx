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
      <Box
        m="20px"
        height="calc(100vh - 120px)"
        overflow="hidden"
        display="flex"
        justifyContent="center"
      >
        <DashboardShimmer colors={colors} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m="20px">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      m="20px"
      height="calc(100vh - 120px)"
      overflow="hidden"
      display="flex"
      justifyContent="center"
    >
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridTemplateRows="repeat(5, 1fr)"
        gap="15px"
        height="100%"
        width="75%"
        overflow="hidden"
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
