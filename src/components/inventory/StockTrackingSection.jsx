import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import wmsService from "../../services/wmsService";

const StockTrackingSection = () => {
  const [rows, setRows] = useState([]);
  const [isFallback, setIsFallback] = useState(false);
  const [filters, setFilters] = useState({ productId: "", warehouseId: "", locationId: "" });
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [adjustment, setAdjustment] = useState({ deltaQty: 0, reason: "manual_other", note: "" });
  const [message, setMessage] = useState("");

  const loadData = async () => {
    const response = await wmsService.listInventoryBalances(filters);
    setRows(response.data.items || []);
    setIsFallback(Boolean(response.isFallback));
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        const byProduct = !filters.productId || row.productId?.includes(filters.productId) || row.productName?.toLowerCase().includes(filters.productId.toLowerCase());
        const byWarehouse = !filters.warehouseId || row.warehouseId?.includes(filters.warehouseId) || row.warehouseName?.toLowerCase().includes(filters.warehouseId.toLowerCase());
        const byLocation = !filters.locationId || row.locationId?.includes(filters.locationId) || row.locationCode?.toLowerCase().includes(filters.locationId.toLowerCase());
        return byProduct && byWarehouse && byLocation;
      }),
    [rows, filters]
  );

  const openAdjustModal = (row) => {
    setSelectedRow(row);
    setAdjustOpen(true);
  };

  const submitAdjustment = async () => {
    if (!selectedRow) return;
    try {
      await wmsService.createInventoryAdjustment({
        warehouseId: selectedRow.warehouseId,
        locationId: selectedRow.locationId,
        productId: selectedRow.productId,
        deltaQty: Number(adjustment.deltaQty),
        reason: adjustment.reason,
        note: adjustment.note,
      });
      setMessage("Korekcija zaliha je uspešno evidentirana.");
      setAdjustOpen(false);
      loadData();
    } catch {
      const delta = Number(adjustment.deltaQty) || 0;
      setRows((prev) =>
        prev.map((row) =>
          row.id === selectedRow.id
            ? {
                ...row,
                onHandQty: row.onHandQty + delta,
                availableQty: row.availableQty + delta,
              }
            : row
        )
      );
      setMessage("Korekcija je primenjena lokalno (fallback režim).");
      setAdjustOpen(false);
    }
  };

  return (
    <Box>
      {isFallback && <Alert severity="info" sx={{ mb: 2 }}>Prikazani su fallback inventory podaci dok backend endpointi nisu dostupni.</Alert>}
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            label="Filter proizvod"
            value={filters.productId}
            onChange={(e) => setFilters((prev) => ({ ...prev, productId: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            label="Filter magacin"
            value={filters.warehouseId}
            onChange={(e) => setFilters((prev) => ({ ...prev, warehouseId: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            label="Filter lokacija"
            value={filters.locationId}
            onChange={(e) => setFilters((prev) => ({ ...prev, locationId: e.target.value }))}
          />
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Proizvod</TableCell>
              <TableCell>Magacin</TableCell>
              <TableCell>Lokacija</TableCell>
              <TableCell align="right">Ukupno</TableCell>
              <TableCell align="right">Rezervisano</TableCell>
              <TableCell align="right">Dostupno</TableCell>
              <TableCell align="right">Akcije</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.productName} ({row.productSku})</TableCell>
                <TableCell>{row.warehouseName}</TableCell>
                <TableCell>{row.locationCode}</TableCell>
                <TableCell align="right">{row.onHandQty}</TableCell>
                <TableCell align="right">{row.reservedQty}</TableCell>
                <TableCell align="right">{row.availableQty}</TableCell>
                <TableCell align="right">
                  <Button size="small" startIcon={<EditIcon />} onClick={() => openAdjustModal(row)}>
                    Korekcija
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={adjustOpen} onClose={() => setAdjustOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Ručna korekcija zaliha</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Delta količina"
                value={adjustment.deltaQty}
                onChange={(e) => setAdjustment((prev) => ({ ...prev, deltaQty: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Razlog"
                value={adjustment.reason}
                onChange={(e) => setAdjustment((prev) => ({ ...prev, reason: e.target.value }))}
              >
                <MenuItem value="count_correction">count_correction</MenuItem>
                <MenuItem value="damage">damage</MenuItem>
                <MenuItem value="loss">loss</MenuItem>
                <MenuItem value="found">found</MenuItem>
                <MenuItem value="manual_other">manual_other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Napomena"
                value={adjustment.note}
                onChange={(e) => setAdjustment((prev) => ({ ...prev, note: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdjustOpen(false)}>Otkaži</Button>
          <Button variant="contained" onClick={submitAdjustment}>Sačuvaj</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StockTrackingSection;