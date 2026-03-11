import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
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
  code: "",
  name: "",
  address: "",
  managerUserId: "",
};

const MagaciniSection = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [info, setInfo] = useState("");
  const [isFallback, setIsFallback] = useState(false);

  const loadWarehouses = async () => {
    const res = await wmsService.listWarehouses();
    setWarehouses(res.data?.items || []);
    setIsFallback(Boolean(res.isFallback));
  };

  useEffect(() => {
    loadWarehouses();
  }, []);

  const handleCreate = async () => {
    if (!form.code?.trim() || !form.name?.trim()) {
      setInfo("Unesi kod i naziv magacina.");
      return;
    }
    try {
      await wmsService.createWarehouse({
        code: form.code,
        name: form.name,
        address: form.address,
        managerUserId: form.managerUserId || undefined,
      });
      setInfo("Magacin je sačuvan.");
      setForm(initialForm);
      loadWarehouses();
    } catch {
      setInfo("Backend nije dostupan za kreiranje magacina.");
    }
  };

  return (
    <Box>
      {isFallback && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Prikazani su fallback podaci dok backend nije dostupan.
        </Alert>
      )}
      {info && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setInfo("")}>
          {info}
        </Alert>
      )}

      <Typography variant="h6" sx={{ mb: 2 }}>
        Magacini (samo skladišta za inventar)
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            size="small"
            label="Kod"
            value={form.code}
            onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            size="small"
            label="Naziv"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            label="Adresa"
            value={form.address}
            onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            size="small"
            label="ID menadžera"
            value={form.managerUserId}
            onChange={(e) =>
              setForm((p) => ({ ...p, managerUserId: e.target.value }))
            }
          />
        </Grid>
        <Grid item xs={12} md={1}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Dodaj magacin
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Kod</TableCell>
              <TableCell>Naziv</TableCell>
              <TableCell>Adresa</TableCell>
              <TableCell>Menadžer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {warehouses.map((wh) => (
              <TableRow key={wh.id}>
                <TableCell>{wh.code}</TableCell>
                <TableCell>{wh.name}</TableCell>
                <TableCell>{wh.address || "-"}</TableCell>
                <TableCell>{wh.managerName || wh.managerUserId || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MagaciniSection;
