import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { API_BASE_URL } from "../../config/apiConfig";
import { getAuthHeaders } from "../../lib/api";
import { convertProfilePicToBase64 } from "../../components/project-management";
import { useProjectManagement } from "../../hooks/useProjectManagement";
import {
  ProjectTable,
  NewProjectDialog,
  EditProjectDialog,
  DeleteProjectDialog,
  TeamManagementDialog,
} from "../../components/project-management";

const ProjectManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const {
    projects,
    setProjects,
    loading,
    availableWorkers,
    fetchProjects,
    fetchAvailableWorkers,
  } = useProjectManagement();

  const [openNewProject, setOpenNewProject] = useState(false);
  const [openEditProject, setOpenEditProject] = useState(false);
  const [openDeleteProject, setOpenDeleteProject] = useState(false);
  const [openTeamManagement, setOpenTeamManagement] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    team: [],
  });

  const handleCreateProject = async () => {
    try {
      if (!newProject.name?.trim()) {
        toast.error("Naziv projekta je obavezan!", {
          position: "bottom-right",
          autoClose: 3000,
        });
        return;
      }

      const projectData = {
        name: newProject.name,
        description: newProject.description,
        startDate: newProject.startDate ? new Date(newProject.startDate) : null,
      };

      await axios.post(`${API_BASE_URL}/project/add`, projectData, {
        headers: getAuthHeaders(),
      });

      toast.success("Projekat je uspešno kreiran!", {
        position: "bottom-right",
        autoClose: 3000,
      });

      await fetchProjects();
      setOpenNewProject(false);
      setNewProject({
        name: "",
        description: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        team: [],
      });
    } catch (error) {
      console.error("Greška pri kreiranju projekta:", error);
      toast.error(
        error.response?.data?.message ||
          "Došlo je do greške pri kreiranju projekta. Molimo pokušajte ponovo.",
        { position: "bottom-right", autoClose: 5000 }
      );
    }
  };

  const handleEditProject = () => {
    setProjects((prev) =>
      prev.map((p) => (p.id === selectedProject.id ? selectedProject : p))
    );
    setOpenEditProject(false);
  };

  const handleDeleteProject = () => {
    setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id));
    setOpenDeleteProject(false);
  };

  const handleAddTeamMember = async (worker, project) => {
    try {
      await axios.post(
        `${API_BASE_URL}/project/addUserToProject`,
        null,
        {
          headers: getAuthHeaders(),
          params: { userId: worker.id, projectId: project.id },
        }
      );

      const base64Pic = convertProfilePicToBase64(worker.profilePic);
      const newMember = {
        id: worker.id,
        name: worker.displayName,
        avatar: base64Pic
          ? `data:image/jpeg;base64,${base64Pic}`
          : process.env.PUBLIC_URL + "/assets/default_profile_picture.png",
      };

      setSelectedProject({
        ...project,
        team: [...project.team, newMember],
      });

      toast.success("Korisnik je uspešno dodat na projekat!", {
        position: "bottom-right",
        autoClose: 3000,
      });

      await fetchAvailableWorkers(project.id);
    } catch (error) {
      console.error("Greška pri dodavanju korisnika na projekat:", error);
      toast.error(
        error.response?.data?.message ||
          "Došlo je do greške pri dodavanju korisnika na projekat.",
        { position: "bottom-right", autoClose: 5000 }
      );
    }
  };

  const handleSaveTeamAndClose = () => {
    handleEditProject();
    setOpenTeamManagement(false);
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      m={{ xs: 0, sm: 2, md: "20px" }}
      px={{ xs: 2, sm: 0 }}
      sx={{
        pb: 2,
        overflow: "hidden",
        paddingBottom: isMobile ? 10 : 2,
        paddingLeft: isMobile ? "max(16px, env(safe-area-inset-left))" : undefined,
        paddingRight: isMobile ? "max(16px, env(safe-area-inset-right))" : undefined,
      }}
    >
      <ProjectTable
        projects={projects}
        loading={loading}
        colors={colors}
        onNewProject={() => setOpenNewProject(true)}
        onNavigateToProject={(id) => navigate(`/project/${id}`)}
        anchorEl={anchorEl}
        selectedProject={selectedProject}
        onMenuClick={(e, p) => {
          setAnchorEl(e.currentTarget);
          setSelectedProject(p);
        }}
        onMenuClose={() => {
          setAnchorEl(null);
          setSelectedProject(null);
        }}
        onEditProject={(p) => {
          setSelectedProject(p);
          setOpenEditProject(true);
        }}
        onTeamManagement={(p) => {
          setSelectedProject(p);
          setOpenTeamManagement(true);
          fetchAvailableWorkers(p.id);
        }}
        onDeleteProject={(p) => {
          setSelectedProject(p);
          setOpenDeleteProject(true);
        }}
      />

      <NewProjectDialog
        open={openNewProject}
        onClose={() => setOpenNewProject(false)}
        project={newProject}
        onChange={setNewProject}
        onSubmit={handleCreateProject}
        colors={colors}
      />

      <DeleteProjectDialog
        open={openDeleteProject}
        onClose={() => setOpenDeleteProject(false)}
        project={selectedProject}
        onConfirm={handleDeleteProject}
        colors={colors}
      />

      <EditProjectDialog
        open={openEditProject}
        onClose={() => setOpenEditProject(false)}
        project={selectedProject}
        onChange={setSelectedProject}
        onSubmit={handleEditProject}
        colors={colors}
      />

      <TeamManagementDialog
        open={openTeamManagement}
        onClose={() => setOpenTeamManagement(false)}
        project={selectedProject}
        onProjectChange={setSelectedProject}
        availableWorkers={availableWorkers}
        onAddMember={handleAddTeamMember}
        onSave={handleSaveTeamAndClose}
        colors={colors}
      />

      <ToastContainer />
    </Box>
  );
};

export default ProjectManagement;
