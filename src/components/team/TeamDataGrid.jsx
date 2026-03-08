import { Box, Checkbox, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

/**
 * Team members data grid with role checkboxes.
 */
const TeamDataGrid = ({
  users,
  onRoleChange,
  colors,
  rolesList,
  isMobile,
}) => {
  const navigate = useNavigate();

  const columns = [
    {
      field: "name",
      headerName: "Ime",
      flex: 1,
      minWidth: 150,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
      hide: isMobile,
    },
    ...rolesList.map((role) => ({
      field: role,
      headerName: role.toUpperCase(),
      flex: 0.8,
      minWidth: 100,
      renderCell: ({ row }) => (
        <Checkbox
          checked={row.roles[role]}
          onChange={() => onRoleChange(row.id, role)}
          color="secondary"
          sx={{ "& .MuiSvgIcon-root": { fontSize: isMobile ? 18 : 24 } }}
        />
      ),
    })),
    {
      field: "actions",
      headerName: "Detalji",
      flex: 0.5,
      minWidth: 80,
      renderCell: (params) => (
        <IconButton
          onClick={() => navigate(`/user/${params.row.id}`)}
          color="secondary"
          size="small"
          disabled
          sx={{
            opacity: 0.5,
            cursor: "not-allowed",
            "&:hover": { backgroundColor: "transparent" },
          }}
        >
          <ArrowForwardIosIcon fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
      ),
    },
  ];

  return (
    <Box
      mt={isMobile ? "20px" : "40px"}
      height="75vh"
      sx={{
        "& .MuiDataGrid-root": { border: "none" },
        "& .MuiDataGrid-cell": {
          borderBottom: "none",
          fontSize: isMobile ? "10px" : "14px",
          padding: isMobile ? "4px" : "8px 16px",
        },
        "& .name-column--cell": {
          color: colors.greenAccent[300],
          fontSize: isMobile ? "12px" : "16px",
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: colors.blueAccent[700],
          borderBottom: "none",
          fontSize: isMobile ? "10px" : "14px",
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: colors.primary[400],
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: colors.blueAccent[700],
        },
        "& .MuiDataGrid-columnHeaderTitle": {
          fontSize: isMobile ? "12px" : "14px",
        },
      }}
    >
      <DataGrid
        rows={users}
        columns={columns}
        disableRowSelectionOnClick
        autoPageSize
        density={isMobile ? "compact" : "standard"}
        disableColumnMenu
      />
    </Box>
  );
};

export default TeamDataGrid;
