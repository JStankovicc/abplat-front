import {
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
  Badge,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { formatTime } from "./utils";

/**
 * Chat list sidebar (used for both mobile and desktop).
 */
const ChatList = ({
  chats,
  filteredChats,
  searchTerm,
  onSearchChange,
  selectedChatId,
  onChatSelect,
  onNewChat,
  colors,
  theme,
  isMobile,
}) => (
  <Box
    sx={{
      width: isMobile ? "100%" : "300px",
      flex: isMobile ? 1 : "none",
      minHeight: 0,
      borderRight: isMobile ? "none" : `1px solid ${colors.grey[700]}`,
      bgcolor: theme.palette.mode === "dark" ? colors.primary[700] : "#f4f4f7",
      p: 2,
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Typography
      variant="h5"
      mb={2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      Prepiske
      <IconButton
        onClick={onNewChat}
        sx={{
          color: theme.palette.mode === "dark" ? colors.greenAccent[500] : "#4caf50",
        }}
      >
        <AddIcon />
      </IconButton>
    </Typography>
    <Box mb={2} flexShrink={0}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Pretraži prepiske..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
    <List sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
{filteredChats.map((chat) => (
          <ListItem
            key={chat.conversationId || chat.id}
          button
          selected={!isMobile && selectedChatId === chat.conversationId}
          onClick={() => onChatSelect(chat.conversationId)}
          sx={{
            bgcolor: isMobile && selectedChatId === chat.conversationId ? colors.primary[600] : "transparent",
            borderRadius: "8px",
            mb: 1,
          }}
        >
          <Avatar src={chat.avatar} sx={{ mr: 2 }} />
          <ListItemText
            primary={chat.name}
            secondary={
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography
                  variant="body2"
                  noWrap
                  sx={{
                    color: theme.palette.mode === "dark" ? colors.grey[300] : colors.grey[700],
                    maxWidth: isMobile ? "70%" : "60%",
                  }}
                >
                  {chat.lastMessage || (isMobile ? "Nema poruka" : "Pozdrav!")}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.mode === "dark" ? colors.grey[500] : colors.grey[600],
                    fontSize: "0.7rem",
                  }}
                >
                  {formatTime(chat.lastMessageTime)}
                </Typography>
              </Box>
            }
          />
          {chat.unreadCount > 0 && (
            <Badge badgeContent={chat.unreadCount} color="error" sx={{ ml: isMobile ? 1 : 2 }} />
          )}
        </ListItem>
      ))}
    </List>
  </Box>
);

export default ChatList;
