import { useEffect, useState } from "react";
import { Alert, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import wmsService from "../../services/wmsService";

const AuditLogSection = () => {
  const [logs, setLogs] = useState([]);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    const load = async () => {
      const response = await wmsService.listAuditLogs();
      setLogs(response.data.items || []);
      setIsFallback(Boolean(response.isFallback));
    };
    load();
  }, []);

  return (
    <Box>
      {isFallback && <Alert severity="info" sx={{ mb: 2 }}>Audit log endpoint još nije aktivan.</Alert>}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Vreme</TableCell>
              <TableCell>Korisnik</TableCell>
              <TableCell>Akcija</TableCell>
              <TableCell>Entitet</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.timestamp ? new Date(log.timestamp).toLocaleString("sr-RS") : "-"}</TableCell>
                <TableCell>{log.user?.name || log.userId || "-"}</TableCell>
                <TableCell>{log.action || "-"}</TableCell>
                <TableCell>{log.entityType || "-"} / {log.entityId || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AuditLogSection;
