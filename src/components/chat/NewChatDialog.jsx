import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  Avatar,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

/**
 * Dialog for selecting a contact to start a new chat.
 */
const NewChatDialog = ({
  open,
  onClose,
  searchTerm,
  onSearchChange,
  filteredContacts,
  onContactSelect,
  colors,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    sx={{
      "& .MuiDialog-paper": {
        width: "500px",
        maxWidth: "80vw",
        borderRadius: "12px",
      },
    }}
  >
    <DialogTitle
      sx={{
        bgcolor: colors.primary[700],
        borderBottom: `1px solid ${colors.grey[700]}`,
      }}
    >
      Izaberi kontakt
    </DialogTitle>
    <DialogContent sx={{ bgcolor: colors.primary[700], p: 0 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Pretraži kontakte..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ p: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: colors.grey[500] }} />
            </InputAdornment>
          ),
        }}
      />
      <List sx={{ maxHeight: "60vh", overflow: "auto" }}>
        {filteredContacts.map((contact) => (
          <ListItem
            button
            key={contact.id}
            onClick={() => onContactSelect(contact)}
            sx={{
              "&:hover": {
                bgcolor: colors.primary[600],
              },
            }}
          >
            <Avatar src={contact.avatar} sx={{ mr: 2 }} />
            <ListItemText
              primary={contact?.displayName || "Unknown User"}
              primaryTypographyProps={{ color: "white" }}
            />
          </ListItem>
        ))}
      </List>
    </DialogContent>
  </Dialog>
);

export default NewChatDialog;
