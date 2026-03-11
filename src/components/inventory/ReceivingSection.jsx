import { useEffect, useState } from "react";
import { Alert, Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import wmsService from "../../services/wmsService";

const ReceivingSection = () => {
  const [rows, setRows] = useState([]);
  const [isFallback, setIsFallback] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    warehouseId: "wh-1",
    supplierId: "",
    productId: "",
    qty: 1,
  });

  const loadData = async () => {
    const response = await wmsService.listReceivings();
    setRows(response.data.items || []);
    setIsFallback(Boolean(response.isFallback));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async () => {
    try {
      await wmsService.createReceiving({
        warehouseId: form.warehouseId,
        supplierId: form.supplierId,
        lines: [{ productId: form.productId, expectedQty: Number(form.qty) }],
      });
      setMessage("Prijem je kreiran.");
      loadData();
    } catch {
      setMessage("Backend još ne vraća receiving create, ali forma je spremna.");
    }
  };

  return (
    <Box>
      {isFallback && <Alert severity="info" sx={{ mb: 2 }}>Receiving fallback podaci.</Alert>}
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <TextField fullWidth label="Warehouse ID" value={form.warehouseId} onChange={(e) => setForm((p) => ({ ...p, warehouseId: e.target.value }))} />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField fullWidth label="Supplier ID" value={form.supplierId} onChange={(e) => setForm((p) => ({ ...p, supplierId: e.target.value }))} />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField fullWidth label="Product ID" value={form.productId} onChange={(e) => setForm((p) => ({ ...p, productId: e.target.value }))} />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField fullWidth type="number" label="Količina" value={form.qty} onChange={(e) => setForm((p) => ({ ...p, qty: e.target.value }))} />
        </Grid>
        <Grid item xs={12} md={1}>
          <Button fullWidth variant="contained" onClick={handleCreate}>Kreiraj</Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Warehouse</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reference</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.warehouseId || item.warehouseName || "-"}</TableCell>
                <TableCell>{item.status || "created"}</TableCell>
                <TableCell>{item.referenceNo || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReceivingSection;
