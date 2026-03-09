import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DeleteIcon from "@mui/icons-material/Delete";
import AssistantIcon from "@mui/icons-material/Assistant";
import {
  DeleteUserDialog,
  UserReportDialog,
  UserInfoSection,
  UserProfileSection,
  UserPermissionsSection,
  UserCommentsSection,
  UserTasksSection,
  UserStatsSection,
} from "../../components/user";

const UserDetails = () => {
  const { userId } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = mockDataTeam.find((u) => u.id === Number(userId));

  const [notes, setNotes] = useState([
    { id: 1, content: "Inicijalni komentar sistema", author: "Admin", date: "2023-10-25" },
  ]);
  const [newNote, setNewNote] = useState("");
  const [tasks] = useState([
    {
      id: 1,
      title: "Implementacija autentifikacije",
      difficulty: "high",
      status: "Aktivan",
      dueDate: "2023-11-15",
    },
    {
      id: 2,
      title: "Optimizacija baze",
      difficulty: "low",
      status: "U toku",
      dueDate: "2023-11-10",
    },
    {
      id: 3,
      title: "Responsive dizajn",
      difficulty: "medium",
      status: "Završen",
      dueDate: "2023-10-30",
    },
  ]);

  const difficultyData = [
    { id: "high", label: "Visok prioritet", value: tasks.filter((t) => t.difficulty === "high").length },
    {
      id: "medium",
      label: "Srednji prioritet",
      value: tasks.filter((t) => t.difficulty === "medium").length,
    },
    { id: "low", label: "Nizak prioritet", value: tasks.filter((t) => t.difficulty === "low").length },
  ];
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter((t) => t.status !== "Završen").length;
  const averageCompletionTime = "2.3 dana";

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([
        ...notes,
        {
          id: Date.now(),
          content: newNote,
          author: "Korisnik",
          date: new Date().toISOString().split("T")[0],
        },
      ]);
      setNewNote("");
    }
  };

  const handleDeleteUser = () => {
    setDeleteDialogOpen(false);
    navigate("/team");
  };

  const handleGenerateReport = () => {
    setLoading(true);
    setReportOpen(true);
    setTimeout(() => {
      setReportData({
        username: "Jovan Stankovic",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lobortis risus ex, a efficitur arcu ultrices sit amet. Nullam interdum euismod quam non sollicitudin. Sed posuere ipsum ac urna condimentum pellentesque. Fusce tellus ante, malesuada sed erat et, rutrum hendrerit sapien. Nulla pellentesque mattis sodales. Donec sit amet nibh leo. In vel ex neque. Praesent ac dolor felis. Vivamus eleifend gravida accumsan. Aenean ut est rutrum, pharetra nisl ut, sodales nulla. Aenean tincidunt sed nulla a faucibus. Praesent tempus eleifend volutpat. In molestie urna non interdum porttitor. Aenean tellus nisl, volutpat et fringilla ut, euismod sed nunc.",
      });
      setLoading(false);
    }, 1000);
  };

  const handleCloseReport = () => {
    setReportOpen(false);
    setReportData(null);
    setLoading(false);
  };

  const sectionStyleTopRow = {
    p: { xs: "12px", md: "20px" },
    borderRadius: "8px",
    bgcolor: colors.primary[400],
    height: { xs: "auto", md: "200px" },
    minHeight: { xs: 160, md: "200px" },
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  const sectionStyleBottomRow = {
    p: { xs: "12px", md: "20px" },
    borderRadius: "8px",
    bgcolor: colors.primary[400],
    height: { xs: "auto", md: "400px" },
    minHeight: { xs: 280, md: "400px" },
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  const scrollableContent = {
    flex: 1,
    overflowY: "auto",
    pr: "10px",
    "&::-webkit-scrollbar": { width: "8px" },
    "&::-webkit-scrollbar-track": { background: colors.primary[600] },
    "&::-webkit-scrollbar-thumb": { background: colors.blueAccent[700], borderRadius: "4px" },
  };

  if (!user) return null;

  return (
    <Box m={{ xs: 1.5, sm: 2, md: "20px" }} sx={{ pb: 2, overflow: "hidden" }}>
      <DeleteUserDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        userName={user?.name}
        onConfirm={handleDeleteUser}
      />

      <UserReportDialog
        open={reportOpen}
        onClose={handleCloseReport}
        reportData={reportData}
        loading={loading}
        userName={user.username}
      />

      <Box
        mb="20px"
        display="flex"
        gap={2}
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="space-between"
      >
        <Button
          startIcon={<ArrowBackIosIcon />}
          onClick={() => navigate(-1)}
          variant="contained"
          color="secondary"
          size={isMobile ? "small" : "medium"}
        >
          Nazad
        </Button>
        <Box display="flex" gap={2} flexDirection={isMobile ? "column" : "row"}>
          <Button
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
            variant="contained"
            color="error"
            size={isMobile ? "small" : "medium"}
          >
            Obriši korisnika
          </Button>
          <Button
            startIcon={<AssistantIcon />}
            onClick={handleGenerateReport}
            variant="contained"
            color="secondary"
            size={isMobile ? "small" : "medium"}
          >
            Napravi izveštaj
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} mt={5}>
        <Grid item xs={12} md={6} lg={4}>
          <UserInfoSection
            user={user}
            colors={colors}
            sectionStyle={sectionStyleTopRow}
            scrollableContent={scrollableContent}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <UserProfileSection
            user={user}
            colors={colors}
            sectionStyle={sectionStyleTopRow}
            scrollableContent={scrollableContent}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <UserPermissionsSection
            user={user}
            colors={colors}
            sectionStyle={sectionStyleTopRow}
            scrollableContent={scrollableContent}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <UserCommentsSection
            notes={notes}
            newNote={newNote}
            onNewNoteChange={setNewNote}
            onAddNote={handleAddNote}
            theme={theme}
            colors={colors}
            sectionStyle={sectionStyleBottomRow}
            scrollableContent={scrollableContent}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <UserTasksSection
            tasks={tasks}
            theme={theme}
            colors={colors}
            sectionStyle={sectionStyleBottomRow}
            scrollableContent={scrollableContent}
            isMobile={isMobile}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <UserStatsSection
            difficultyData={difficultyData}
            totalTasks={totalTasks}
            activeTasks={activeTasks}
            averageCompletionTime={averageCompletionTime}
            colors={colors}
            sectionStyle={sectionStyleBottomRow}
            scrollableContent={scrollableContent}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDetails;
