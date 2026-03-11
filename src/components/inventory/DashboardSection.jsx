import { useEffect, useState } from "react";
import { Alert, Box, Card, CardContent, Grid, Typography } from "@mui/material";
import wmsService from "../../services/wmsService";

const MetricCard = ({ title, value, subtitle }) => (
  <Card>
    <CardContent>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
      <Typography variant="h4" sx={{ my: 1 }}>{value}</Typography>
      <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
    </CardContent>
  </Card>
);

const DashboardSection = () => {
  const [data, setData] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    const load = async () => {
      const response = await wmsService.getDashboard();
      setData(response.data);
      setIsFallback(Boolean(response.isFallback));
    };
    load();
  }, []);

  if (!data) return null;

  return (
    <Box sx={{ p: 1 }}>
      {isFallback && <Alert severity="info" sx={{ mb: 2 }}>Dashboard koristi fallback podatke.</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <MetricCard title="Ukupno SKU" value={data.inventory?.totalSkus ?? 0} subtitle="Aktivni artikli" />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard title="Ukupno jedinica" value={data.inventory?.totalUnits ?? 0} subtitle="Na lageru" />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard title="Niske zalihe" value={data.inventory?.lowStockSkus ?? 0} subtitle="SKU ispod praga" />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard title="Aktivni taskovi" value={data.tasks?.active ?? 0} subtitle="Receiving/Putaway/Picking/Packing" />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard title="Orders u obradi" value={data.orders?.inProcessing ?? 0} subtitle="Ukupno u procesu" />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard title="Čeka picking" value={data.orders?.awaitingPick ?? 0} subtitle="Rezervisane porudžbine" />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard title="Čeka shipping" value={data.orders?.awaitingShip ?? 0} subtitle="Spremno za slanje" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardSection;