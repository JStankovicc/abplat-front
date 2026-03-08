import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  DialogContentText,
} from "@mui/material";

/**
 * Dialog displaying user report.
 */
const UserReportDialog = ({ open, onClose, reportData, loading, userName }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle sx={{ py: 2 }}>Izveštaj o {reportData?.username || userName}</DialogTitle>
    <DialogContent sx={{ py: 3, minHeight: "150px" }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <DialogContentText>{reportData?.content || "Učitavanje podataka..."}</DialogContentText>
      )}
    </DialogContent>
    <DialogActions sx={{ px: 3, py: 2 }}>
      <Button onClick={onClose} variant="contained" color="primary">
        Zatvori
      </Button>
    </DialogActions>
  </Dialog>
);

export default UserReportDialog;
