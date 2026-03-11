import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
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
  Typography,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import wmsService from "../../services/wmsService";

const initialForm = {
  warehouseId: "",
  code: "",
  name: "",
  type: "storage",
  maxUnits: 100,
};

const WarehouseLocationsSection = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [info, setInfo] = useState("");
  const [isFallback, setIsFallback] = useState(false);

  const loadData = async () => {
    const [warehouseRes, locationRes] = await Promise.all([
      wmsService.listWarehouses(),
      wmsService.listWarehouseLocations(),
    ]);
    setWarehouses(warehouseRes.data.items || []);
    setLocations(locationRes.data.items || []);
    setIsFallback(Boolean(warehouseRes.isFallback || locationRes.isFallback));
    if ((warehouseRes.data.items || []).length > 0 && !form.warehouseId) {
      setForm((prev) => ({ ...prev, warehouseId: warehouseRes.data.items[0].id }));
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    if (!form.warehouseId || !form.code || !form.name) {
      setInfo("Popuni warehouse, kod i naziv.");
      return;
    }
    try {
      await wmsService.createWarehouseLocation({
        warehouseId: form.warehouseId,
        code: form.code,
        name: form.name,
        type: form.type,
        capacity: { maxUnits: Number(form.maxUnits) || 0 },
      });
      setInfo("Lokacija je uspešno kreirana.");
      setForm((prev) => ({ ...initialForm, warehouseId: prev.warehouseId }));
      loadData();
    } catch {
      setInfo("Backend nije dostupan za kreiranje, ali UI je spreman.");
    }
  };

  return (
    <Box>
      {isFallback && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Prikazani su fallback podaci dok backend endpointi nisu dostupni.
        </Alert>
      )}
      {info && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {info}
        </Alert>
      )}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <TextField
            select
            fullWidth
            label="Magacin"
            value={form.warehouseId}
            onChange={(e) => setForm((prev) => ({ ...prev, warehouseId: e.target.value }))}
          >
            {warehouses.map((warehouse) => (
              <MenuItem key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            label="Kod"
            value={form.code}
            onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Naziv lokacije"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            select
            fullWidth
            label="Tip"
            value={form.type}
            onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
          >
            <MenuItem value="receiving">receiving</MenuItem>
            <MenuItem value="storage">storage</MenuItem>
            <MenuItem value="pick">pick</MenuItem>
            <MenuItem value="packing">packing</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={1}>
          <TextField
            fullWidth
            label="Kap."
            type="number"
            value={form.maxUnits}
            onChange={(e) => setForm((prev) => ({ ...prev, maxUnits: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} md={1}>
          <Button fullWidth variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Dodaj
          </Button>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Warehouse Locations
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Magacin</TableCell>
              <TableCell>Kod</TableCell>
              <TableCell>Naziv</TableCell>
              <TableCell>Tip</TableCell>
              <TableCell align="right">Kapacitet</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell>{location.warehouseName}</TableCell>
                <TableCell>{location.code}</TableCell>
                <TableCell>{location.name}</TableCell>
                <TableCell>{location.type}</TableCell>
                <TableCell align="right">{location.capacity?.maxUnits ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default WarehouseLocationsSection;
