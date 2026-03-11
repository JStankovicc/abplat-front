import { useEffect, useState } from "react";
import { Alert, Box, Button, Chip, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import wmsService from "../../services/wmsService";

const statusColor = (status) => {
  if (["shipped", "done"].includes(status)) return "success";
  if (["created", "reserved"].includes(status)) return "warning";
  if (["packing", "picking", "in_progress"].includes(status)) return "info";
  return "default";
};

const OrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [message, setMessage] = useState("");
  const [isFallback, setIsFallback] = useState(false);

  const loadOrders = async () => {
    const response = await wmsService.listSalesOrders();
    setOrders(response.data.items || []);
    setIsFallback(Boolean(response.isFallback));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const reserve = async (order) => {
    try {
      await wmsService.reserveSalesOrderInventory(order.id);
      setMessage(`Order ${order.orderNumber} je rezervisan i picking task je kreiran.`);
      loadOrders();
    } catch {
      setMessage(`Order ${order.orderNumber} rezervisan lokalno (fallback).`);
      setOrders((prev) => prev.map((item) => (item.id === order.id ? { ...item, status: "reserved" } : item)));
    }
  };

  const confirmPick = async (order) => {
    const lines = (order.lines || []).map((line) => ({ lineId: line.id, pickedQty: line.requestedQty }));
    try {
      await wmsService.confirmPicking(order.id, { lines });
      setMessage(`Picking potvrđen za ${order.orderNumber}.`);
      loadOrders();
    } catch {
      setMessage(`Picking potvrđen lokalno za ${order.orderNumber}.`);
      setOrders((prev) => prev.map((item) => (item.id === order.id ? { ...item, status: "picking_done" } : item)));
    }
  };

  const confirmPack = async (order) => {
    const lines = (order.lines || []).map((line) => ({ lineId: line.id, qty: line.requestedQty }));
    try {
      await wmsService.confirmPacking(order.id, { packages: [{ packageNo: `${order.orderNumber}-1`, lines }] });
      setMessage(`Packing potvrđen za ${order.orderNumber}.`);
      loadOrders();
    } catch {
      setMessage(`Packing potvrđen lokalno za ${order.orderNumber}.`);
      setOrders((prev) => prev.map((item) => (item.id === order.id ? { ...item, status: "packing_done" } : item)));
    }
  };

  const ship = async (order) => {
    try {
      await wmsService.shipSalesOrder(order.id, {
        carrier: "DHL",
        trackingNo: `${order.orderNumber}-TRK`,
        shippedAt: new Date().toISOString(),
      });
      setMessage(`Order ${order.orderNumber} je označen kao shipped.`);
      loadOrders();
    } catch {
      setMessage(`Order ${order.orderNumber} je shipped lokalno (fallback).`);
      setOrders((prev) => prev.map((item) => (item.id === order.id ? { ...item, status: "shipped" } : item)));
    }
  };

  return (
    <Box>
      {isFallback && <Alert severity="info" sx={{ mb: 2 }}>Sales orders su u fallback režimu dok backend endpointi ne budu aktivni.</Alert>}
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} md={selectedOrder ? 8 : 12}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Order</TableCell>
                  <TableCell>Kupac</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Kreirano</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} hover sx={{ cursor: "pointer" }} onClick={() => setSelectedOrder(order)}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>{order.customerName || "-"}</TableCell>
                    <TableCell><Chip label={order.status || "created"} color={statusColor(order.status)} size="small" /></TableCell>
                    <TableCell>{order.createdAt ? new Date(order.createdAt).toLocaleDateString("sr-RS") : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {selectedOrder && (
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Fulfillment tok
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {selectedOrder.orderNumber} · {selectedOrder.customerName || "N/A"}
              </Typography>
              <Button fullWidth variant="contained" sx={{ mb: 1 }} onClick={() => reserve(selectedOrder)}>
                1) Reserve inventory
              </Button>
              <Button fullWidth variant="contained" sx={{ mb: 1 }} onClick={() => confirmPick(selectedOrder)}>
                2) Confirm picking
              </Button>
              <Button fullWidth variant="contained" sx={{ mb: 1 }} onClick={() => confirmPack(selectedOrder)}>
                3) Confirm packing
              </Button>
              <Button fullWidth variant="contained" color="success" onClick={() => ship(selectedOrder)}>
                4) Ship order
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default OrdersSection;