import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Radio,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

/**
 * Payment methods section.
 */
const PaymentMethodsSection = ({
  paymentMethods,
  addingPayment,
  newPayment,
  onAddPayment,
  onCancelAdd,
  onStartAdd,
  onRemovePayment,
  onSetDefaultPayment,
  onPaymentChange,
  colors,
  isMobile,
}) => (
  <Box
    p="20px"
    borderRadius="4px"
    sx={{ backgroundColor: colors.primary[400], minHeight: "40vh" }}
  >
    <Typography variant="h3" sx={{ mb: "20px", fontSize: isMobile ? "20px" : "24px" }}>
      Načini Plaćanja
    </Typography>
    <List dense>
      {paymentMethods.map((method) => (
        <ListItem
          key={method.id}
          secondaryAction={
            <IconButton
              edge="end"
              onClick={() => onRemovePayment(method.id)}
              sx={{ color: colors.redAccent[500] }}
            >
              <DeleteIcon />
            </IconButton>
          }
          sx={{
            border: `1px solid ${colors.grey[700]}`,
            mb: 1,
            borderRadius: "4px",
          }}
        >
          <Radio
            checked={method.isDefault}
            onChange={() => onSetDefaultPayment(method.id)}
            color="secondary"
          />
          <ListItemText primary={method.details} sx={{ color: colors.grey[100] }} />
        </ListItem>
      ))}
    </List>
    {addingPayment ? (
      <Box sx={{ mt: 2 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel style={{ color: colors.grey[100] }}>Tip plaćanja</InputLabel>
          <Select
            name="type"
            value={newPayment.type}
            onChange={onPaymentChange}
            sx={{ color: colors.grey[100] }}
          >
            <MenuItem value="bank">Bankovni račun</MenuItem>
            <MenuItem value="card">Kreditna kartica</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label={newPayment.type === "bank" ? "Broj računa" : "Broj kartice"}
          name="details"
          value={newPayment.details}
          onChange={onPaymentChange}
          sx={{ mb: 2 }}
          InputProps={{ style: { color: colors.grey[100] } }}
          InputLabelProps={{ style: { color: colors.grey[100] } }}
        />
        <Button variant="contained" onClick={onAddPayment} sx={{ mr: 2 }} color="secondary">
          Dodaj
        </Button>
        <Button variant="outlined" onClick={onCancelAdd} color="secondary">
          Otkaži
        </Button>
      </Box>
    ) : (
      <Button
        fullWidth
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={onStartAdd}
        color="secondary"
      >
        Dodaj novi način plaćanja
      </Button>
    )}
  </Box>
);

export default PaymentMethodsSection;
