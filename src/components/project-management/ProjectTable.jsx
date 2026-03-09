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
  useTheme,
  useMediaQuery,
  Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import { formatDate } from "./utils";

/**
 * Project management table (desktop) or card list (mobile) with actions menu.
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
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isMobile) {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            px: 0.5,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: colors.grey[100],
              fontWeight: 600,
              fontSize: "1.25rem",
              letterSpacing: "-0.01em",
            }}
          >
            Projekti
            <Typography component="span" sx={{ ml: 0.75, fontSize: "0.875rem", color: colors.grey[300], fontWeight: 500 }}>
              ({projects.length})
            </Typography>
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={6}>
            <CircularProgress sx={{ color: colors.blueAccent[500] }} size={32} />
            <Typography variant="body2" sx={{ mt: 2, color: colors.grey[300] }}>
              Učitavanje...
            </Typography>
          </Box>
        ) : projects.length === 0 ? (
          <Box
            sx={{
              py: 6,
              px: 2,
              textAlign: "center",
              backgroundColor: colors.primary[400],
              borderRadius: 2,
              border: `1px solid ${colors.grey[700]}`,
            }}
          >
            <Typography variant="body1" sx={{ color: colors.grey[200], fontWeight: 500 }}>
              Nema projekata.
            </Typography>
            <Typography variant="body2" sx={{ color: colors.grey[400], mt: 1 }}>
              Dodajte prvi projekat dugmetom ispod.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, pb: 10 }}>
            {projects.map((project) => (
              <Box
                key={project.id}
                onClick={() => onNavigateToProject(project.id)}
                sx={{
                  backgroundColor: colors.primary[400],
                  borderRadius: 2,
                  p: 2,
                  borderLeft: `4px solid ${project.status === "Aktivan" ? colors.greenAccent?.[500] : colors.grey[500]}`,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                  cursor: "pointer",
                  transition: "box-shadow 0.2s ease",
                  "&:active": { transform: "scale(0.99)" },
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: colors.grey[100],
                      fontWeight: 600,
                      flex: 1,
                      fontSize: "1rem",
                    }}
                  >
                    {project.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMenuClick(e, project);
                    }}
                    sx={{
                      color: colors.grey[300],
                      minWidth: 44,
                      minHeight: 44,
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                <Box display="flex" alignItems="center" flexWrap="wrap" gap={1} mt={1}>
                  <Chip
                    label={project.status}
                    size="small"
                    sx={{
                      bgcolor: project.status === "Aktivan" ? colors.greenAccent?.[600] : colors.grey[600],
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  />
                  <Typography variant="caption" sx={{ color: colors.grey[300] }}>
                    {formatDate(project.startDate)} – {formatDate(project.endDate)}
                  </Typography>
                </Box>
                {project.team?.length > 0 && (
                  <Box display="flex" alignItems="center" gap={0.5} mt={1.5}>
                    {project.team.slice(0, 4).map((member) => (
                      <Avatar
                        key={member.id}
                        src={member.avatar}
                        sx={{
                          width: 28,
                          height: 28,
                          border: `2px solid ${colors.primary[500]}`,
                        }}
                      />
                    ))}
                    {project.team.length > 4 && (
                      <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                        +{project.team.length - 4}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}

        <Fab
          color="primary"
          aria-label="Novi projekat"
          onClick={onNewProject}
          sx={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: "max(80px, calc(env(safe-area-inset-bottom) + 28px))",
            zIndex: 1100,
            backgroundColor: colors.blueAccent[500],
            "&:hover": { backgroundColor: colors.blueAccent[600] },
            boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
          }}
        >
          <AddIcon sx={{ fontSize: 28 }} />
        </Fab>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={onMenuClose}
          PaperProps={{
            sx: {
              backgroundColor: colors.primary[400],
              color: colors.grey[100],
              minWidth: 200,
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
              <EditIcon sx={{ color: colors.grey[100] }} fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Izmeni" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              onMenuClose();
              onTeamManagement(selectedProject);
            }}
          >
            <ListItemIcon>
              <PeopleIcon sx={{ color: colors.grey[100] }} fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Tim" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              onMenuClose();
              onDeleteProject(selectedProject);
            }}
          >
            <ListItemIcon>
              <DeleteIcon sx={{ color: colors.grey[100] }} fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Obriši" />
          </MenuItem>
        </Menu>
      </>
    );
  }

  return (
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
};

export default ProjectTable;
