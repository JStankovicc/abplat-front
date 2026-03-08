import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Chip,
} from "@mui/material";
import { toast } from "react-toastify";

/**
 * Dialog for managing project team members.
 */
const TeamManagementDialog = ({
  open,
  onClose,
  project,
  onProjectChange,
  availableWorkers,
  onAddMember,
  onSave,
  colors,
}) => {
  if (!project) return null;

  const fieldSx = {
    "& .MuiInputLabel-root": { color: colors.grey[100] },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: colors.grey[700] },
      "&:hover fieldset": { borderColor: colors.grey[600] },
      "&.Mui-focused fieldset": { borderColor: colors.blueAccent[500] },
      color: colors.grey[100],
    },
  };

  const selectSx = {
    "& .MuiSelect-select": { color: colors.grey[100] },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[700] },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[600] },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.blueAccent[500] },
  };

  const handleWorkerSelect = async (e) => {
    const selectedWorkerId = e.target.value;
    if (!selectedWorkerId) return;

    const worker = availableWorkers.find((w) => w.id.toString() === selectedWorkerId);
    if (!worker) return;

    const alreadyInTeam = project.team.some((m) => m.id === worker.id);
    if (alreadyInTeam) {
      toast.warning("Ovaj radnik je već u timu!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    await onAddMember(worker, project);
    e.target.value = "";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: colors.primary[400],
          color: colors.grey[100],
          minWidth: "500px",
        },
      }}
    >
      <DialogTitle>Upravljanje Timom - {project.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: colors.grey[100] }}>
            Trenutni Tim
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {project.team.map((member) => (
              <Chip
                key={member.id}
                label={member.name}
                onDelete={() => {
                  const updatedTeam = project.team.filter((m) => m.id !== member.id);
                  onProjectChange({ ...project, team: updatedTeam });
                }}
                sx={{
                  backgroundColor: colors.primary[500],
                  color: colors.grey[100],
                  "& .MuiChip-deleteIcon": {
                    color: colors.grey[100],
                    "&:hover": { color: colors.redAccent[500] },
                  },
                }}
              />
            ))}
          </Box>

          <Typography variant="h6" sx={{ mb: 2, color: colors.grey[100] }}>
            Dodaj Člana Tima
          </Typography>
          {availableWorkers.length === 0 ? (
            <Typography variant="body2" sx={{ color: colors.grey[300], fontStyle: "italic" }}>
              Nema dostupnih radnika za dodavanje.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                select
                fullWidth
                value=""
                onChange={handleWorkerSelect}
                SelectProps={{ native: true, sx: selectSx }}
                sx={fieldSx}
              >
                <option value="">Izaberi člana</option>
                {availableWorkers.map((worker) => (
                  <option key={worker.id} value={worker.id}>
                    {worker.displayName}
                  </option>
                ))}
              </TextField>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: colors.grey[100] }}>
          Zatvori
        </Button>
        <Button
          onClick={onSave}
          sx={{
            backgroundColor: colors.blueAccent[500],
            color: colors.grey[100],
            "&:hover": { backgroundColor: colors.blueAccent[600] },
          }}
        >
          Sačuvaj Promene
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamManagementDialog;
