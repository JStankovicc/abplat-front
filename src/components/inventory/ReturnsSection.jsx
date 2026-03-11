import { useEffect, useState } from "react";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import wmsService from "../../services/wmsService";

const ReturnsSection = () => {
  const [returns, setReturns] = useState([]);
  const [isFallback, setIsFallback] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    salesOrderId: "",
    warehouseId: "wh-1",
    productId: "",
    qty: 1,
    reason: "customer_return",
    disposition: "restock",
    toLocationId: "",
  });

  const loadReturns = async () => {
    const response = await wmsService.listReturns();
    setReturns(response.data.items || []);
    setIsFallback(Boolean(response.isFallback));
  };

  useEffect(() => {
    loadReturns();
  }, []);

  const handleCreateReturn = async () => {
    try {
      await wmsService.createReturn({
        salesOrderId: form.salesOrderId,
        warehouseId: form.warehouseId,
        lines: [
          {
            productId: form.productId,
            qty: Number(form.qty),
            reason: form.reason,
            disposition: form.disposition,
            toLocationId: form.toLocationId || undefined,
          },
        ],
      });
      setMessage("Povrat je uspešno evidentiran.");
      setOpen(false);
      loadReturns();
    } catch {
      setMessage("Povrat je evidentiran lokalno (fallback).");
      setReturns((prev) => [
        ...prev,
        {
          id: `ret-${prev.length + 1}`,
          salesOrderId: form.salesOrderId,
          warehouseId: form.warehouseId,
          disposition: form.disposition,
          status: "created",
        },
      ]);
      setOpen(false);
    }
  };

  return (
    <Box>
      {isFallback && <Alert severity="info" sx={{ mb: 2 }}>Returns endpoint još nije aktivan, fallback podaci su prikazani.</Alert>}
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setOpen(true)}>Novi return</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Sales order</TableCell>
              <TableCell>Warehouse</TableCell>
              <TableCell>Disposition</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {returns.map((ret) => (
              <TableRow key={ret.id}>
                <TableCell>{ret.id}</TableCell>
                <TableCell>{ret.salesOrderId || "-"}</TableCell>
                <TableCell>{ret.warehouseId || "-"}</TableCell>
                <TableCell>{ret.disposition || "-"}</TableCell>
                <TableCell>{ret.status || "created"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Novi return</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Sales Order ID" value={form.salesOrderId} onChange={(e) => setForm((p) => ({ ...p, salesOrderId: e.target.value }))} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Warehouse ID" value={form.warehouseId} onChange={(e) => setForm((p) => ({ ...p, warehouseId: e.target.value }))} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Product ID" value={form.productId} onChange={(e) => setForm((p) => ({ ...p, productId: e.target.value }))} />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField fullWidth type="number" label="Qty" value={form.qty} onChange={(e) => setForm((p) => ({ ...p, qty: e.target.value }))} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth label="Razlog" value={form.reason} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Disposition"
                value={form.disposition}
                onChange={(e) => setForm((p) => ({ ...p, disposition: e.target.value }))}
              >
                <MenuItem value="restock">restock</MenuItem>
                <MenuItem value="damaged">damaged</MenuItem>
                <MenuItem value="quarantine">quarantine</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="To location" value={form.toLocationId} onChange={(e) => setForm((p) => ({ ...p, toLocationId: e.target.value }))} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Otkaži</Button>
          <Button variant="contained" onClick={handleCreateReturn}>Sačuvaj</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReturnsSection;