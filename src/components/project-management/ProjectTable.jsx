import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import { formatDate } from "./utils";

/**
 * Project management table with actions menu.
 */
const ProjectTable = ({
  projects,
  loading,
  colors,
  onNewProject,
  onNavigateToProject,
  anchorEl,
  selectedProject,
  onMenuClick,
  onMenuClose,
  onEditProject,
  onTeamManagement,
  onDeleteProject,
}) => (
  <>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h2" color={colors.grey[100]} fontWeight="bold" sx={{ mb: "5px" }}>
        UPRAVLJANJE PROJEKTIMA
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onNewProject}
        sx={{
          backgroundColor: colors.blueAccent[500],
          color: colors.grey[100],
          "&:hover": { backgroundColor: colors.blueAccent[600] },
        }}
      >
        Novi Projekat
      </Button>
    </Box>

    <TableContainer component={Paper} sx={{ mt: 3, backgroundColor: colors.primary[400] }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: colors.grey[100] }}>Naziv Projekta</TableCell>
            <TableCell sx={{ color: colors.grey[100] }}>Status</TableCell>
            <TableCell sx={{ color: colors.grey[100] }}>Tim</TableCell>
            <TableCell sx={{ color: colors.grey[100] }}>Trajanje Projekta</TableCell>
            <TableCell sx={{ color: colors.grey[100] }}>Akcije</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                <CircularProgress sx={{ color: colors.blueAccent[500] }} />
                <Typography variant="h6" sx={{ mt: 2, color: colors.grey[100] }}>
                  Učitavanje projekata...
                </Typography>
              </TableCell>
            </TableRow>
          ) : projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                <Typography variant="h6" sx={{ color: colors.grey[300] }}>
                  Nemate kreiranih projekata.
                </Typography>
                <Typography variant="body2" sx={{ color: colors.grey[400], mt: 1 }}>
                  Kliknite na "Novi Projekat" da kreirate svoj prvi projekat.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <TableRow key={project.id} hover>
                <TableCell
                  sx={{ color: colors.grey[100], cursor: "pointer" }}
                  onClick={() => onNavigateToProject(project.id)}
                >
                  {project.name}
                </TableCell>
                <TableCell>
                  <Chip
                    label={project.status}
                    color={project.status === "Aktivan" ? "success" : "warning"}
                    sx={{ color: colors.grey[100] }}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: "left" }}>
                  <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1, flexWrap: "wrap" }}>
                    {project.team.slice(0, 3).map((member) => (
                      <Tooltip key={member.id} title={member.name}>
                        <Avatar
                          src={member.avatar}
                          sx={{
                            backgroundColor: colors.primary[500],
                            border: `2px solid ${colors.primary[600]}`,
                            width: 40,
                            height: 40,
                            "& img": {
                              backgroundColor: colors.primary[500],
                              objectFit: "cover",
                            },
                          }}
                        />
                      </Tooltip>
                    ))}
                    {project.team.length > 3 && (
                      <Tooltip title={`+${project.team.length - 3} više`}>
                        <Avatar
                          sx={{
                            backgroundColor: colors.blueAccent[500],
                            border: `2px solid ${colors.primary[600]}`,
                            width: 40,
                            height: 40,
                            color: colors.grey[100],
                            fontSize: "0.875rem",
                            fontWeight: "bold",
                          }}
                        >
                          +{project.team.length - 3}
                        </Avatar>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                <TableCell sx={{ color: colors.grey[100] }}>
                  {formatDate(project.startDate)} - {formatDate(project.endDate)}
                </TableCell>
                <TableCell>
                  <IconButton onClick={(e) => onMenuClick(e, project)}>
                    <MoreVertIcon sx={{ color: colors.grey[100] }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>

    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onMenuClose}
      PaperProps={{
        sx: {
          backgroundColor: colors.primary[400],
          color: colors.grey[100],
        },
      }}
    >
      <MenuItem
        onClick={() => {
          onMenuClose();
          onEditProject(selectedProject);
        }}
      >
        <ListItemIcon>
          <EditIcon sx={{ color: colors.grey[100] }} />
        </ListItemIcon>
        <ListItemText>Izmeni Projekat</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          onMenuClose();
          onTeamManagement(selectedProject);
        }}
      >
        <ListItemIcon>
          <PeopleIcon sx={{ color: colors.grey[100] }} />
        </ListItemIcon>
        <ListItemText>Upravljaj Timom</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          onMenuClose();
          onDeleteProject(selectedProject);
        }}
      >
        <ListItemIcon>
          <DeleteIcon sx={{ color: colors.grey[100] }} />
        </ListItemIcon>
        <ListItemText>Obriši Projekat</ListItemText>
      </MenuItem>
    </Menu>
  </>
);

export default ProjectTable;
