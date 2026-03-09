import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import { groupMessagesBySender, formatTime } from "./utils";

/**
 * Chat message area and input (used for both mobile and desktop).
 */
const ChatWindow = ({
  selectedChat,
  messages,
  message,
  onMessageChange,
  onSendMessage,
  onFormalizeMessage,
  onKeyDown,
  onBack,
  messagesEndRef,
  colors,
  theme,
  isMobile,
}) => {
  if (!selectedChat) return null;

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        mb={isMobile ? 2 : 3}
      >
        {isMobile && (
          <IconButton onClick={onBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Avatar
          src={selectedChat.avatar}
          sx={{ mr: 2, ...(isMobile ? {} : { width: 40, height: 40 }) }}
        />
        <Typography variant={isMobile ? "h6" : "h5"}>{selectedChat.name}</Typography>
      </Box>

      <Box
        flex={1}
        overflow="auto"
        sx={{
          bgcolor: theme.palette.mode === "dark" ? colors.primary[700] : "#f5f5f5",
          borderRadius: "8px",
          p: isMobile ? 2 : 3,
          mb: 2,
        }}
      >
        {messages.length === 0 && (
          <Typography variant="body2" color="textSecondary" textAlign="center" mt={2}>
            {isMobile ? "Nijedna poruka još uvek..." : `Počnite razgovor sa ${selectedChat?.name}`}
          </Typography>
        )}
        {groupMessagesBySender(messages).map((group, groupIndex) => (
          <Box key={groupIndex} mb={isMobile ? 2 : 3}>
            {group.sender === "received" && (
              <Box display="flex" alignItems="center" mb={1} ml={1}>
                <Avatar
                  src={group.senderAvatar}
                  sx={{ width: isMobile ? 24 : 28, height: isMobile ? 24 : 28, mr: 1 }}
                />
                <Typography variant="caption" color="textSecondary">
                  {formatTime(group.firstTimestamp)}
                </Typography>
              </Box>
            )}
            {group.messages.map((msg, msgIndex) => (
              <Box
                key={msgIndex}
                display="flex"
                justifyContent={msg.sender === "sent" ? "flex-end" : "flex-start"}
                mb={0.5}
              >
                <Box sx={{ position: "relative", maxWidth: isMobile ? "80%" : "60%" }}>
                  <Box
                    sx={{
                      bgcolor: msg.sender === "sent" ? colors.greenAccent[500] : colors.blueAccent[500],
                      color: "white",
                      p: isMobile ? 1.5 : 2,
                      borderRadius:
                        msgIndex === 0
                          ? "12px"
                          : msgIndex === group.messages.length - 1
                          ? "12px"
                          : isMobile
                          ? "8px"
                          : "10px",
                      position: "relative",
                    }}
                  >
                    {msg.text}
                    {msgIndex === group.messages.length - 1 && (
                      <Typography
                        variant="caption"
                        sx={{
                          position: "absolute",
                          right: 8,
                          bottom: 4,
                          color: "rgba(255,255,255,0.5)",
                          fontSize: isMobile ? "0.6rem" : "0.7rem",
                          lineHeight: 1,
                        }}
                      >
                        {formatTime(msg.timestamp)}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Box display="flex" gap={isMobile ? 1 : 2} alignItems="center">
        <IconButton>
          <AttachFileIcon fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Napiši poruku..."
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={onKeyDown}
          size={isMobile ? "small" : "medium"}
        />
        <Button
          variant="outlined"
          onClick={onFormalizeMessage}
          disabled={!message.trim()}
          startIcon={<AutoAwesomeOutlinedIcon />}
          sx={{
            whiteSpace: "nowrap",
            minWidth: "auto",
            px: isMobile ? 1.5 : 4,
            py: isMobile ? 0 : 1.5,
            borderColor: colors.blueAccent[500],
            color: colors.blueAccent[500],
            "&:hover": {
              borderColor: colors.blueAccent[600],
              backgroundColor: colors.blueAccent[900] + "20",
            },
          }}
        >
          {!isMobile && "Formalizuj"}
        </Button>
        <Button
          variant="contained"
          size={isMobile ? "small" : "large"}
          onClick={onSendMessage}
          sx={{
            bgcolor: colors.greenAccent[500],
            "&:hover": { bgcolor: colors.greenAccent[600] },
            minWidth: "auto",
            px: isMobile ? 0 : 4,
            py: isMobile ? 0 : 1.5,
          }}
        >
          {isMobile ? <SendIcon /> : (
            <>
              <SendIcon sx={{ mr: 1 }} /> Pošalji
            </>
          )}
        </Button>
      </Box>
    </>
  );
};

export default ChatWindow;
