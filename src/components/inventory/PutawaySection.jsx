import { useState } from "react";
import { Alert, Box, Button, Grid, TextField } from "@mui/material";
import wmsService from "../../services/wmsService";

const PutawaySection = () => {
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    warehouseId: "wh-1",
    fromLocationId: "loc-receiving-1",
    productId: "",
    qty: 1,
    toLocationId: "",
  });

  const handleSubmit = async () => {
    try {
      await wmsService.createPutaway({
        warehouseId: form.warehouseId,
        fromLocationId: form.fromLocationId,
        moves: [
          {
            productId: form.productId,
            qty: Number(form.qty),
            toLocationId: form.toLocationId,
          },
        ],
      });
      setMessage("Putaway je evidentiran.");
    } catch {
      setMessage("Putaway endpoint još nije dostupan, ali UI i payload su spremni.");
    }
  };

  return (
    <Box>
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12} md={2}>
          <TextField fullWidth label="Warehouse ID" value={form.warehouseId} onChange={(e) => setForm((p) => ({ ...p, warehouseId: e.target.value }))} />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField fullWidth label="From location" value={form.fromLocationId} onChange={(e) => setForm((p) => ({ ...p, fromLocationId: e.target.value }))} />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField fullWidth label="Product ID" value={form.productId} onChange={(e) => setForm((p) => ({ ...p, productId: e.target.value }))} />
        </Grid>
        <Grid item xs={12} md={1}>
          <TextField fullWidth type="number" label="Qty" value={form.qty} onChange={(e) => setForm((p) => ({ ...p, qty: e.target.value }))} />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField fullWidth label="To location" value={form.toLocationId} onChange={(e) => setForm((p) => ({ ...p, toLocationId: e.target.value }))} />
        </Grid>
        <Grid item xs={12} md={1}>
          <Button fullWidth variant="contained" onClick={handleSubmit}>Potvrdi</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PutawaySection;
