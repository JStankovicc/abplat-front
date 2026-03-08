import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";

/**
 * User tasks table section.
 */
const UserTasksSection = ({
  tasks,
  theme,
  colors,
  sectionStyle,
  scrollableContent,
  isMobile,
}) => (
  <Box sx={sectionStyle}>
    <Typography variant="h5" mb="15px">
      Taskovi (
      {tasks.filter((t) => t.status !== "Završen").length}/{tasks.length})
    </Typography>
    <Box sx={scrollableContent}>
      <TableContainer
        component={Paper}
        sx={{
          bgcolor: "transparent",
          transition: "all 0.3s ease",
          "& .MuiTable-root": { backgroundColor: "inherit" },
        }}
      >
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: colors.primary[600],
                "& .MuiTableCell-root": {
                  color: theme.palette.mode === "dark" ? colors.grey[100] : colors.primary[800],
                },
              }}
            >
              <TableCell>Naziv</TableCell>
              <TableCell align="right">Prioritet</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Rok</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow
                key={task.id}
                sx={{
                  backgroundColor: "inherit",
                  color: "inherit",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? colors.primary[400] : colors.primary[500],
                    color: theme.palette.mode === "dark" ? colors.grey[300] : colors.primary[900],
                  },
                }}
              >
                <TableCell>{task.title}</TableCell>
                <TableCell align="right">
                  <Chip
                    label={task.difficulty}
                    size="small"
                    sx={{
                      backgroundColor:
                        task.difficulty === "high"
                          ? colors.redAccent[600]
                          : task.difficulty === "medium"
                          ? colors.blueAccent[600]
                          : colors.greenAccent[600],
                      color: "white",
                      transition: "all 0.3s ease",
                    }}
                  />
                </TableCell>
                <TableCell align="right">{task.status}</TableCell>
                <TableCell align="right">{task.dueDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  </Box>
);

export default UserTasksSection;
