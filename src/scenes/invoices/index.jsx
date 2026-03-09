import { useState } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataInvoices } from "../../data/mockData";
import Header from "../../components/Header";
import MobileDataCards from "../../components/common/MobileDataCards";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          ${params.row.cost}
        </Typography>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
    },
  ];

  return (
    <Box m={{ xs: 1.5, sm: 2, md: "20px" }} sx={{ pb: 2, overflow: "hidden" }}>
      <Header title="INVOICES" subtitle="List of Invoice Balances" />
      {isMobile ? (
        <Box m="20px 0 0" sx={{ overflow: "auto" }}>
          <MobileDataCards
            rows={mockDataInvoices}
            primaryFields={[
              { key: "name", label: "Ime" },
              { key: "cost", label: "Iznos" },
            ]}
            detailFields={[
              { key: "id", label: "ID" },
              { key: "name", label: "Ime" },
              { key: "phone", label: "Telefon" },
              { key: "email", label: "Email" },
              { key: "cost", label: "Iznos" },
              { key: "date", label: "Datum" },
            ]}
            renderCell={{
              cost: (row) => `$${row.cost}`,
            }}
            colors={colors}
          />
        </Box>
      ) : (
        <Box
          m={{ xs: "20px 0 0", md: "40px 0 0 0" }}
          height="75vh"
          sx={{
            minHeight: 300,
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: "none" },
            "& .name-column--cell": { color: colors.greenAccent[300] },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
          }}
        >
          <DataGrid checkboxSelection rows={mockDataInvoices} columns={columns} />
        </Box>
      )}
    </Box>
  );
};

export default Invoices;
