import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    CssBaseline,
    List,
    ListItem,
    ListItemText,
    Divider,
    Typography,
    useTheme,
    TextField,
    Button,
    IconButton,
    Avatar,
    Badge,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AddIcon from "@mui/icons-material/Add";
import { tokens } from "../../theme";

const chats = [
    {
        id: 1,
        name: "John Doe",
        avatar: "https://via.placeholder.com/40",
        messages: [
            { text: "Hey, how are you?", sender: "sent", senderAvatar: "https://via.placeholder.com/40" },
            { text: "Let's catch up later.", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
        ],
        newMessages: true,
    },
    {
        id: 2,
        name: "Alice Smith",
        avatar: "https://via.placeholder.com/40",
        messages: [
            { text: "Can you send me the report?", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
            { text: "Thanks!", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
        ],
        newMessages: false,
    },
    {
        id: 3,
        name: "Bob Johnson",
        avatar: "https://via.placeholder.com/40",
        messages: [
            { text: "Meeting at 3 PM.", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
            { text: "See you there!", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
        ],
        newMessages: true,
    },
    {
        id: 4,
        name: "Mike Lee",
        avatar: "https://via.placeholder.com/40",
        messages: [
            { text: "What's up?", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
            { text: "Let's chat later.", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
        ],
        newMessages: false,
    },
    {
        id: 5,
        name: "Sara Brown",
        avatar: "https://via.placeholder.com/40",
        messages: [
            { text: "Did you get my email?", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
            { text: "I'll check it out.", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
            { text: "Did you get my email?", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
            { text: "I'll check it out.", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
            { text: "Did you get my email?", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
            { text: "I'll check it out.", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
            { text: "Did you get my email?", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
            { text: "I'll check it out.", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
            { text: "Did you get my email?", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
            { text: "I'll check it out.", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
            { text: "Did you get my email?", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
            { text: "I'll check it out.", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
            { text: "Did you get my email?", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
            { text: "I'll check it out.", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
            { text: "Did you get my email?", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
            { text: "I'll check it out.", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
            { text: "Did you get my email?", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
            { text: "I'll check it out.", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
            { text: "Did you get my email?", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
            { text: "I'll check it out.", sender: "received", senderAvatar: "https://via.placeholder.com/40" },
        ],
        newMessages: true,
    },
];

const ChatInterface = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState("");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const messagesEndRef = useRef(null); // Ref for auto-scrolling

    // Set the first chat as the selected chat when component mounts
    useEffect(() => {
        if (chats.length > 0) {
            setSelectedChat(chats[0]); // Set the first chat as selected
        }
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedChat?.messages]); // Auto scroll when new messages are added

    const handleSendMessage = () => {
        if (message.trim() && selectedChat) {
            setSelectedChat((prevChat) => ({
                ...prevChat,
                messages: [
                    ...prevChat.messages,
                    { text: message, sender: "sent", senderAvatar: "https://via.placeholder.com/40" },
                ],
            }));
            setMessage("");
        }
    };

    const handleNewMessage = () => {
        // You can implement logic to open a new chat window or create a new empty chat
        console.log("Create a new message");
    };

    return (
        <Box
            display="flex"
            height="calc(100vh - 72px)"
            bgcolor={colors.primary[500]}
        >
            <CssBaseline />
            {/* Chat List */}
            <Box
                width="20%"
                bgcolor={
                    theme.palette.mode === "dark" ? colors.primary[700] : "#f4f4f7"
                }
                p={2}
                borderRight={`1px solid ${
                    theme.palette.mode === "dark" ? colors.grey[700] : "#ddd"
                }`}
                sx={{
                    maxHeight: "100vh", // Ensures the chat list doesn't grow beyond the screen
                    overflowY: "auto",  // Enables scrolling
                }}
            >
                <Typography
                    variant="h5"
                    color={theme.palette.mode === "dark" ? colors.grey[100] : "#333"}
                    mb={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <span>Prepiske</span>
                    <IconButton
                        onClick={handleNewMessage}
                        sx={{
                            color: theme.palette.mode === "dark" ? colors.greenAccent[500] : "#4caf50",
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Typography>
                <List>
                    {chats.map((chat) => (
                        <React.Fragment key={chat.id}>
                            <ListItem
                                button
                                onClick={() => setSelectedChat(chat)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    backgroundColor:
                                        selectedChat?.id === chat.id
                                            ? theme.palette.mode === "dark"
                                                ? colors.primary[600]
                                                : "#e6e6f2"
                                            : "transparent",
                                    borderRadius: "8px",
                                    "&:hover": {
                                        backgroundColor:
                                            theme.palette.mode === "dark"
                                                ? colors.primary[600]
                                                : "#e0e0eb",
                                    },
                                    p: 1,
                                }}
                            >
                                <Avatar src={chat.avatar} sx={{ mr: 2 }} />
                                <ListItemText
                                    primary={
                                        <Typography
                                            fontWeight="bold"
                                            color={theme.palette.mode === "dark" ? colors.grey[100] : "#333"}
                                        >
                                            {chat.name}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography
                                            color={theme.palette.mode === "dark" ? colors.grey[300] : "#666"}
                                        >
                                            {chat.messages[chat.messages.length - 1]?.text}
                                        </Typography>
                                    }
                                />
                                {chat.newMessages && (
                                    <Badge color="error" variant="dot">
                                        <NotificationsIcon />
                                    </Badge>
                                )}
                            </ListItem>
                            <Divider
                                sx={{
                                    backgroundColor:
                                        theme.palette.mode === "dark" ? colors.grey[600] : "#ddd",
                                }}
                            />
                        </React.Fragment>
                    ))}
                </List>
            </Box>
            {/* Chat Window */}
            <Box
                flex={1}
                display="flex"
                flexDirection="column"
                p={3}
                bgcolor={theme.palette.mode === "dark" ? colors.primary[800] : "#ffffff"}
            >
                {selectedChat ? (
                    <>
                        <Typography
                            variant="h5"
                            color={theme.palette.mode === "dark" ? colors.grey[100] : "#222"}
                            mb={2}
                            display="flex"
                            alignItems="center"
                        >
                            <Avatar
                                src={selectedChat.avatar}
                                sx={{ mr: 2, width: 30, height: 30 }}
                            />
                            {selectedChat.name}
                        </Typography>
                        <Box
                            flex={1}
                            overflow="auto"
                            display="flex"
                            flexDirection="column"
                            gap={2}
                            sx={{
                                backgroundColor:
                                    theme.palette.mode === "dark" ? colors.primary[900] : "#fafafa",
                                borderRadius: "10px",
                                p: 2,
                                maxHeight: "100vh", // Limit the height of the chat window
                                overflowY: "auto", // Enable scrolling
                            }}
                        >
                            {selectedChat.messages.map((msg, index) => (
                                <Box
                                    key={index}
                                    display="flex"
                                    flexDirection={msg.sender === "sent" ? "row-reverse" : "row"}
                                    alignItems="center"
                                    gap={2}
                                >

                                        <Avatar
                                            src={msg.senderAvatar}
                                            sx={{ width: 30, height: 30 }}
                                        />

                                    <Typography
                                        variant="body1"
                                        sx={{
                                            backgroundColor:
                                                msg.sender === "sent"
                                                    ? colors.greenAccent[500]
                                                    : theme.palette.mode === "dark"
                                                        ? colors.blueAccent[500]
                                                        : "#b3c7e6", // Darker blue for light theme
                                            color: "white",
                                            padding: "8px 12px",
                                            borderRadius: "10px",
                                            maxWidth: "60%",
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                        }}
                                    >
                                        {msg.text}
                                    </Typography>
                                </Box>
                            ))}
                            <div ref={messagesEndRef} />
                        </Box>
                        {/* Message Input */}
                        <Box display="flex" alignItems="center" mt={2}>
                            <IconButton>
                                <AttachFileIcon
                                    sx={{
                                        color:
                                            theme.palette.mode === "dark"
                                                ? colors.greenAccent[500]
                                                : colors.blueAccent[500],
                                    }}
                                />
                            </IconButton>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Type a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                sx={{
                                    backgroundColor:
                                        theme.palette.mode === "dark" ? colors.primary[400] : "#f0f0f5",
                                    borderRadius: "4px",
                                    color: theme.palette.mode === "dark" ? colors.grey[100] : "#333",
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor:
                                                theme.palette.mode === "dark" ? colors.primary[500] : "#ccc",
                                        },
                                        "&:hover fieldset": {
                                            borderColor:
                                                theme.palette.mode === "dark" ? colors.primary[300] : "#aaa",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor:
                                                theme.palette.mode === "dark" ? colors.primary[200] : "#777",
                                        },
                                    },
                                }}
                            />
                            <Button
                                onClick={handleSendMessage}
                                variant="contained"
                                sx={{
                                    ml: 1,
                                    bgcolor:
                                        theme.palette.mode === "dark"
                                            ? colors.greenAccent[500]
                                            : "#4caf50",
                                    "&:hover": {
                                        bgcolor:
                                            theme.palette.mode === "dark"
                                                ? colors.greenAccent[600]
                                                : "#43a047",
                                    },
                                }}
                            >
                                <SendIcon />
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Typography variant="h6" color="textSecondary">
                        Select a chat to view messages
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default ChatInterface;
