import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
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
import wmsService from "../../services/wmsService";

const WarehouseTasksSection = () => {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFallback, setIsFallback] = useState(false);

  const loadTasks = async () => {
    const response = await wmsService.listWarehouseTasks(statusFilter === "all" ? {} : { status: statusFilter });
    setTasks(response.data.items || []);
    setIsFallback(Boolean(response.isFallback));
  };

  useEffect(() => {
    loadTasks();
  }, [statusFilter]);

  const updateStatus = async (taskId, status) => {
    try {
      await wmsService.updateWarehouseTask(taskId, { status });
      loadTasks();
    } catch {
      setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status } : task)));
    }
  };

  return (
    <Box>
      {isFallback && <Alert severity="info" sx={{ mb: 2 }}>Task podaci su fallback dok backend ne bude spreman.</Alert>}
      <Box sx={{ mb: 2, maxWidth: 200 }}>
        <TextField
          select
          fullWidth
          size="small"
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value="all">Svi</MenuItem>
          <MenuItem value="created">created</MenuItem>
          <MenuItem value="in_progress">in_progress</MenuItem>
          <MenuItem value="done">done</MenuItem>
        </TextField>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tip</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reference</TableCell>
              <TableCell>Warehouse</TableCell>
              <TableCell align="right">Akcije</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.type}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{task.referenceType}:{task.referenceId}</TableCell>
                <TableCell>{task.warehouseName || "-"}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => updateStatus(task.id, "in_progress")}>Start</Button>
                  <Button size="small" onClick={() => updateStatus(task.id, "done")}>Done</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default WarehouseTasksSection;
