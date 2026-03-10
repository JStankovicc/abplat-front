import React from "react";
import { Box, Typography, Alert, useTheme } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import {
  DashboardShimmer,
  NotificationsCard,
  MiniInboxCard,
  ProjectCard,
  DashboardGreeting,
  UpcomingEventsCard,
  SalesQuickCard,
  InventoryQuickCard,
  AssetsApprovalCard,
  FleetQuickCard,
} from "../../components/dashboard";
import { useDashboardData } from "../../hooks/useDashboardData";
import { useUserPermissions } from "../../hooks/useUserPermissions";

/* ─── helpers ──────────────────────────────────────────────── */

const getStatusColor = (statusId) => {
  switch (statusId) {
    case 1: return "warning";
    case 2: return "primary";
    case 3: return "success";
    default: return "secondary";
  }
};

const getStatusName = (statusId) => {
  switch (statusId) {
    case 1: return "Čekanje";
    case 2: return "U toku";
    case 3: return "Završeno";
    default: return "Nepoznat";
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

/* ─── Section header ────────────────────────────────────────── */

const SectionHeader = ({ title, count, linkLabel, onLinkClick, colors }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="space-between"
    mb={{ xs: 1.2, md: 1.5 }}
    mt={{ xs: 0.5, md: 1 }}
  >
    <Box display="flex" alignItems="center" gap={1}>
      <Typography
        fontWeight="700"
        color={colors.grey[100]}
        sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
      >
        {title}
      </Typography>
      {count != null && (
        <Box
          sx={{
            bgcolor: colors.primary[400],
            borderRadius: "999px",
            px: 1,
            py: 0.2,
            border: `1px solid ${colors.primary[300]}50`,
            minWidth: "24px",
            textAlign: "center",
          }}
        >
          <Typography variant="caption" color={colors.grey[300]} fontWeight="700" sx={{ fontSize: "0.68rem" }}>
            {count}
          </Typography>
        </Box>
      )}
    </Box>
    {onLinkClick && (
      <Box
        display="flex"
        alignItems="center"
        gap={0.5}
        onClick={onLinkClick}
        sx={{
          cursor: "pointer",
          opacity: 0.8,
          transition: "opacity 0.2s",
          "&:hover": { opacity: 1 },
        }}
      >
        <Typography
          variant="caption"
          color={colors.greenAccent[400]}
          fontWeight="600"
          sx={{ fontSize: "0.72rem" }}
        >
          {linkLabel || "Vidi sve"}
        </Typography>
        <ArrowForwardIcon sx={{ fontSize: "0.75rem", color: colors.greenAccent[400] }} />
      </Box>
    )}
  </Box>
);

/* ─── Empty project state ───────────────────────────────────── */

const NoProjectsEmptyState = ({ colors, onNavigate }) => (
  <Box
    sx={{
      backgroundColor: colors.primary[400],
      borderRadius: "12px",
      p: "20px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: { xs: "column", sm: "row" },
      gap: 2,
      background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
      border: `1px dashed ${colors.primary[300]}60`,
    }}
  >
    <Box>
      <Typography variant="body1" color={colors.grey[200]} fontWeight="600" mb={0.3}>
        Nemate dodeljenih projekata
      </Typography>
      <Typography variant="body2" color={colors.grey[400]} sx={{ fontSize: "0.78rem" }}>
        Kontaktirajte menadžera da vas doda na projekat
      </Typography>
    </Box>
    <Box
      onClick={onNavigate}
      sx={{
        cursor: "pointer",
        color: colors.greenAccent[400],
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        fontWeight: 600,
        fontSize: "0.78rem",
        "&:hover": { opacity: 0.8 },
        flexShrink: 0,
      }}
    >
      <Typography variant="caption" color={colors.greenAccent[400]} fontWeight="600">
        Upravljanje projektima
      </Typography>
      <ArrowForwardIcon sx={{ fontSize: "0.8rem" }} />
    </Box>
  </Box>
);

/* ─── Main Dashboard ────────────────────────────────────────── */

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
    displayName,
  } = useDashboardData();

  const { hasProject, hasProjectManagement, hasSales, hasInventory, hasAssets, hasVehicle } = useUserPermissions();

  /* ── Loading state ── */
  if (loading) {
    return (
      <Box
        sx={{
          maxHeight: "calc(100vh - 74px)",
          overflowY: "auto",
          p: { xs: 1.5, sm: 2, md: "20px" },
          pb: 4,
          "&::-webkit-scrollbar": { width: "5px" },
          "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: colors.grey[700],
            borderRadius: "3px",
          },
        }}
      >
        <DashboardShimmer colors={colors} />
      </Box>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <Box sx={{ p: { xs: 1.5, sm: 2, md: "20px" } }}>
        <Alert severity="error" sx={{ borderRadius: "10px" }}>
          {error}
        </Alert>
      </Box>
    );
  }

  /* ── Responsive grid columns ── */
  const threeColGrid = {
    xs: "1fr",
    sm: "repeat(2, 1fr)",
    md: "repeat(3, 1fr)",
  };

  return (
    <Box
      sx={{
        maxHeight: "calc(100vh - 74px)",
        overflowY: "auto",
        p: { xs: 1.5, sm: 2, md: "20px" },
        pb: 5,
        "&::-webkit-scrollbar": { width: "5px" },
        "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
        "&::-webkit-scrollbar-thumb": {
          bgcolor: colors.grey[700],
          borderRadius: "3px",
          "&:hover": { bgcolor: colors.grey[600] },
        },
      }}
    >
      {/* ── Greeting ── */}
      <DashboardGreeting displayName={displayName} colors={colors} />

      {/* ── Core row: Inbox · Obaveštenja · Nadolazeći događaji ── */}
      <Box
        display="grid"
        gridTemplateColumns={threeColGrid}
        gap={{ xs: 1.5, md: 2 }}
        mb={{ xs: 2.5, md: 3 }}
        sx={{
          "& > *": {
            /* ensure equal height on desktop */
            minHeight: { md: 240 },
          },
        }}
      >
        <MiniInboxCard
          colors={colors}
          lastMessage={lastMessage}
          onInboxClick={() => navigate("/messages")}
        />
        <NotificationsCard colors={colors} />
        <UpcomingEventsCard colors={colors} />
      </Box>

      {/* ── Projects (PROJECT ili PROJECT_MANAGEMENT) ── */}
      {hasProject && (
        <>
          <SectionHeader
            title="Moji projekti"
            count={projects.length || null}
            onLinkClick={hasProjectManagement && projects.length > 0 ? () => navigate("/project-management") : undefined}
            linkLabel={hasProjectManagement ? "Upravljanje projektima" : undefined}
            colors={colors}
          />
          {projects.length > 0 ? (
            <Box
              display="grid"
              gridTemplateColumns={threeColGrid}
              gap={{ xs: 1.5, md: 2 }}
              mb={{ xs: 2.5, md: 3 }}
            >
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  tasks={projectTasks[project.id] || []}
                  colors={colors}
                  onProjectClick={(id) => navigate(`/project/${id}`)}
                  getStatusColor={getStatusColor}
                  getStatusName={getStatusName}
                  formatDate={formatDate}
                />
              ))}
            </Box>
          ) : (
            <Box mb={{ xs: 2.5, md: 3 }}>
              <NoProjectsEmptyState
                colors={colors}
                onNavigate={() => navigate("/project-management")}
              />
            </Box>
          )}
        </>
      )}

      {/* ── Sales (SALES_MANAGEMENT ili SALES) ── */}
      {hasSales && (
        <>
          <SectionHeader
            title="Prodaja"
            onLinkClick={() => navigate("/sales")}
            linkLabel="Otvori prodaju"
            colors={colors}
          />
          <Box
            display="grid"
            gridTemplateColumns={threeColGrid}
            gap={{ xs: 1.5, md: 2 }}
            mb={{ xs: 2.5, md: 3 }}
          >
            <SalesQuickCard colors={colors} type="revenue" />
            <SalesQuickCard colors={colors} type="leads" />
            <SalesQuickCard colors={colors} type="goal" />
          </Box>
        </>
      )}

      {/* ── Inventar (INVENTORY_MANAGEMENT) ── */}
      {hasInventory && (
        <>
          <SectionHeader
            title="Inventar"
            onLinkClick={() => navigate("/inventory")}
            linkLabel="Otvori inventar"
            colors={colors}
          />
          <Box
            display="grid"
            gridTemplateColumns={threeColGrid}
            gap={{ xs: 1.5, md: 2 }}
            mb={{ xs: 2.5, md: 3 }}
          >
            <InventoryQuickCard colors={colors} type="requests" />
            <InventoryQuickCard colors={colors} type="returns" />
            <InventoryQuickCard colors={colors} type="stock" />
          </Box>
        </>
      )}

      {/* ── Imovina (ASSET_MANAGEMENT) ── */}
      {hasAssets && (
        <>
          <SectionHeader
            title="Imovina"
            onLinkClick={() => navigate("/assets")}
            linkLabel="Otvori imovinu"
            colors={colors}
          />
          <Box
            display="grid"
            gridTemplateColumns={threeColGrid}
            gap={{ xs: 1.5, md: 2 }}
            mb={{ xs: 2.5, md: 3 }}
          >
            <AssetsApprovalCard colors={colors} type="approval" />
            <AssetsApprovalCard colors={colors} type="overview" />
            <AssetsApprovalCard colors={colors} type="transfer" />
          </Box>
        </>
      )}

      {/* ── Vozni park (VEHICLE_MANAGEMENT) ── */}
      {hasVehicle && (
        <>
          <SectionHeader
            title="Vozni park"
            onLinkClick={() => navigate("/fleet")}
            linkLabel="Otvori vožni park"
            colors={colors}
          />
          <Box
            display="grid"
            gridTemplateColumns={threeColGrid}
            gap={{ xs: 1.5, md: 2 }}
            mb={{ xs: 2.5, md: 3 }}
          >
            <FleetQuickCard colors={colors} type="vehicles" />
            <FleetQuickCard colors={colors} type="drivers" />
            <FleetQuickCard colors={colors} type="maintenance" />
          </Box>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
