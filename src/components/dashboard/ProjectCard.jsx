import { Box, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, Chip, LinearProgress } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import TaskIcon from "@mui/icons-material/Task";

/**
 * Single project card with tasks and progress.
 */
const ProjectCard = ({
  project,
  tasks,
  colors,
  onProjectClick,
  getStatusColor,
  getStatusName,
  formatDate,
}) => {
  const completedTasks = tasks.filter((task) => task.statusId === 3).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Box
      sx={{
        gridColumn: "span 4",
        gridRow: "span 1",
        backgroundColor: colors.primary[400],
        borderRadius: "12px",
        p: "12px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: colors.primary[300],
          transform: "translateY(-2px)",
          boxShadow: 6,
        },
        background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
      }}
      onClick={() => onProjectClick(project.id)}
    >
      <Box display="flex" alignItems="center" mb="8px">
        <Box
          sx={{
            backgroundColor: colors.greenAccent[500],
            borderRadius: "50%",
            p: 0.8,
            mr: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FolderIcon sx={{ color: colors.grey[100], fontSize: "1rem" }} />
        </Box>
        <Box flex={1}>
          <Typography
            variant="subtitle1"
            fontWeight="600"
            color={colors.grey[100]}
            sx={{ fontSize: "0.9rem" }}
          >
            {project.name}
          </Typography>
          <Typography variant="caption" color={colors.grey[300]} sx={{ fontSize: "0.7rem" }}>
            {totalTasks} zadataka
          </Typography>
        </Box>
      </Box>

      {totalTasks > 0 && (
        <Box mb="6px">
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 4,
              borderRadius: 2,
              backgroundColor: colors.grey[700],
              "& .MuiLinearProgress-bar": {
                backgroundColor: colors.greenAccent[500],
                borderRadius: 2,
              },
            }}
          />
        </Box>
      )}

      <Box
        sx={{
          maxHeight: "120px",
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "rgba(0,0,0,0.1)",
            borderRadius: "2px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.3)",
            borderRadius: "2px",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
          },
        }}
      >
        {tasks.length > 0 ? (
          <List dense sx={{ p: 0 }}>
            {tasks.map((task) => (
              <ListItem key={task.id} sx={{ p: 0, mb: 0.5 }}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: colors.greenAccent[500],
                      width: 20,
                      height: 20,
                      fontSize: "0.6rem",
                    }}
                  >
                    <TaskIcon sx={{ fontSize: "0.6rem" }} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      color={colors.grey[100]}
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontWeight: 500,
                        fontSize: "0.7rem",
                      }}
                    >
                      {task.name}
                    </Typography>
                  }
                  secondary={
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Chip
                        label={getStatusName(task.statusId)}
                        size="small"
                        color={getStatusColor(task.statusId)}
                        sx={{ fontSize: "0.6rem", height: "14px" }}
                      />
                      {task.dateDue && (
                        <Typography variant="caption" color={colors.grey[400]} sx={{ fontSize: "0.6rem" }}>
                          {formatDate(task.dateDue)}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box textAlign="center" py={1}>
            <Typography color={colors.grey[400]} variant="body2" sx={{ fontSize: "0.7rem" }}>
              Nema zadataka
            </Typography>
          </Box>
        )}
      </Box>

      <Box mt={1} textAlign="center">
        <Typography
          variant="caption"
          color={colors.greenAccent[500]}
          fontWeight="500"
          sx={{ fontSize: "0.7rem" }}
        >
          Kliknite da otvorite projekat →
        </Typography>
      </Box>
    </Box>
  );
};

export default ProjectCard;
