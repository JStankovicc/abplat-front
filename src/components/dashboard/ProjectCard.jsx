import { Box, Typography, LinearProgress } from "@mui/material";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AssignmentLateOutlinedIcon from "@mui/icons-material/AssignmentLateOutlined";

const ProjectCard = ({
  project,
  tasks,
  colors,
  onProjectClick,
  getStatusColor,
  getStatusName,
  formatDate,
}) => {
  const completedTasks = tasks.filter((t) => t.statusId === 3).length;
  const inProgressTasks = tasks.filter((t) => t.statusId === 2).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const statusColorMap = {
    warning: "#f5a623",
    primary: colors.blueAccent[400],
    success: colors.greenAccent[400],
    secondary: colors.grey[400],
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.primary[400],
        borderRadius: "12px",
        p: "14px",
        cursor: "pointer",
        transition: "all 0.25s ease",
        "&:hover": {
          backgroundColor: colors.primary[300],
          transform: "translateY(-3px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        },
        background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
      onClick={() => onProjectClick(project.id)}
    >
      {/* Project title row */}
      <Box display="flex" alignItems="flex-start" gap={1.2}>
        <Box
          sx={{
            backgroundColor: `${colors.greenAccent[700]}50`,
            borderRadius: "8px",
            p: 0.7,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${colors.greenAccent[600]}40`,
            flexShrink: 0,
            mt: 0.2,
          }}
        >
          <FolderOpenOutlinedIcon sx={{ color: colors.greenAccent[400], fontSize: "1rem" }} />
        </Box>
        <Box flex={1} minWidth={0}>
          <Typography
            fontWeight="700"
            color={colors.grey[100]}
            sx={{
              fontSize: "0.88rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              lineHeight: 1.3,
            }}
          >
            {project.name}
          </Typography>
          <Typography variant="caption" color={colors.grey[400]} sx={{ fontSize: "0.7rem" }}>
            {totalTasks} {totalTasks === 1 ? "zadatak" : "zadataka"}
          </Typography>
        </Box>
      </Box>

      {/* Progress bar */}
      {totalTasks > 0 && (
        <Box>
          <Box display="flex" justifyContent="space-between" mb={0.4}>
            <Typography variant="caption" color={colors.grey[400]} sx={{ fontSize: "0.65rem" }}>
              Napredak
            </Typography>
            <Typography
              variant="caption"
              color={colors.greenAccent[400]}
              fontWeight="700"
              sx={{ fontSize: "0.65rem" }}
            >
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 5,
              borderRadius: 3,
              backgroundColor: colors.primary[600],
              "& .MuiLinearProgress-bar": {
                backgroundColor:
                  progress === 100 ? colors.greenAccent[500] : colors.blueAccent[400],
                borderRadius: 3,
              },
            }}
          />
          <Box display="flex" gap={1.5} mt={0.6}>
            <Box display="flex" alignItems="center" gap={0.4}>
              <CheckCircleOutlineIcon sx={{ fontSize: "0.7rem", color: colors.greenAccent[500] }} />
              <Typography variant="caption" color={colors.grey[400]} sx={{ fontSize: "0.65rem" }}>
                {completedTasks} završ.
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.4}>
              <RadioButtonUncheckedIcon sx={{ fontSize: "0.7rem", color: colors.blueAccent[400] }} />
              <Typography variant="caption" color={colors.grey[400]} sx={{ fontSize: "0.65rem" }}>
                {inProgressTasks} u toku
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Task list */}
      <Box
        sx={{
          maxHeight: "100px",
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: "3px" },
          "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
          "&::-webkit-scrollbar-thumb": { bgcolor: colors.grey[700], borderRadius: "2px" },
        }}
      >
        {tasks.length > 0 ? (
          tasks.slice(0, 4).map((task) => {
            const sc = getStatusColor(task.statusId);
            const dotColor = statusColorMap[sc] || colors.grey[400];
            return (
              <Box
                key={task.id}
                display="flex"
                alignItems="center"
                gap={1}
                mb={0.6}
                sx={{
                  p: "5px 7px",
                  borderRadius: "6px",
                  bgcolor: `${colors.primary[600]}50`,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: dotColor,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="body2"
                  color={colors.grey[200]}
                  sx={{
                    fontSize: "0.72rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                    fontWeight: task.statusId === 2 ? 600 : 400,
                  }}
                >
                  {task.name}
                </Typography>
                {task.dateDue && (
                  <Typography
                    variant="caption"
                    color={colors.grey[500]}
                    sx={{ fontSize: "0.62rem", flexShrink: 0 }}
                  >
                    {formatDate(task.dateDue)}
                  </Typography>
                )}
              </Box>
            );
          })
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            py={1}
            gap={0.5}
          >
            <AssignmentLateOutlinedIcon sx={{ fontSize: "0.9rem", color: colors.grey[500] }} />
            <Typography color={colors.grey[500]} variant="caption" sx={{ fontSize: "0.72rem" }}>
              Nema dodeljenih zadataka
            </Typography>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box pt={0.8} borderTop={`1px solid ${colors.primary[600]}60`} mt={0.2}>
        <Typography
          variant="caption"
          color={colors.greenAccent[400]}
          fontWeight="600"
          sx={{ fontSize: "0.7rem" }}
        >
          Otvori projekat →
        </Typography>
      </Box>
    </Box>
  );
};

export default ProjectCard;
