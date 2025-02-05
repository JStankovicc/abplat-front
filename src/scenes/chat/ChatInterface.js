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
    useMediaQuery,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import { tokens } from "../../theme";

const chats = [
    {
        id: 1,
        name: "User 1",
        avatar: "https://via.placeholder.com/40",
        messages: [
            {
                text: "Mock message 287",
                sender: "sent",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T19:35:28")
            },
            {
                text: "Mock message 751",
                sender: "sent",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T19:36:11")
            },
            {
                text: "Mock message 645",
                sender: "sent",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T20:09:22")
            },
            {
                text: "Mock message 19",
                sender: "received",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T19:50:01")
            }
        ],
        newMessages: true,
    },
    {
        id: 2,
        name: "User 2",
        avatar: "https://via.placeholder.com/40",
        messages: [
            {
                text: "Mock message 767",
                sender: "sent",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T19:47:03")
            },
            {
                text: "Mock message 65",
                sender: "sent",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T20:13:33")
            },
            {
                text: "Mock message 803",
                sender: "sent",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T19:44:36")
            },
            {
                text: "Mock message 790",
                sender: "received",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T20:08:32")
            },
            {
                text: "Mock message 484",
                sender: "received",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T19:49:30")
            },
            {
                text: "Mock message 978",
                sender: "received",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T19:53:28")
            },
            {
                text: "Mock message 918",
                sender: "received",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T19:58:49")
            }
        ],
        newMessages: false,
    },
    {
        id: 3,
        name: "User 3",
        avatar: "https://via.placeholder.com/40",
        messages: [
            {
                text: "Mock message 659",
                sender: "sent",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T19:39:52")
            },
            {
                text: "Mock message 568",
                sender: "sent",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T20:18:12")
            }
        ],
        newMessages: false,
    },
    {
        id: 4,
        name: "User 4",
        avatar: "https://via.placeholder.com/40",
        messages: [
            {
                text: "Mock message 474",
                sender: "received",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T19:42:05")
            },
            {
                text: "Mock message 735",
                sender: "received",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T19:58:25")
            },
            {
                text: "Mock message 662",
                sender: "received",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T19:48:50")
            }
        ],
        newMessages: true,
    },
    {
        id: 5,
        name: "User 5",
        avatar: "https://via.placeholder.com/40",
        messages: [
            {
                text: "Mock message 128",
                sender: "sent",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T19:47:45")
            },
            {
                text: "Mock message 419",
                sender: "received",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T19:55:33")
            },
            {
                text: "Mock message 209",
                sender: "sent",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T19:51:19")
            }
        ],
        newMessages: true,
    },
    // More mock chat data can follow in the same format...
    {
        id: 15,
        name: "User 15",
        avatar: "https://via.placeholder.com/40",
        messages: [
            {
                text: "Mock message 359",
                sender: "sent",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T19:59:41")
            },
            {
                text: "Mock message 53",
                sender: "sent",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T20:18:04")
            },
            {
                text: "Mock message 678",
                sender: "received",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T20:07:57")
            },
            {
                text: "Mock message 961",
                sender: "received",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T20:05:27")
            },
            {
                text: "Mock message 855",
                sender: "received",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T19:57:50")
            },
            {
                text: "Mock message 905",
                sender: "received",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T19:38:17")
            },
            {
                text: "Mock message 597",
                sender: "received",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T19:51:59")
            },
            {
                text: "Mock message 656",
                sender: "received",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T20:14:21")
            },
            {
                text: "Mock message 306",
                sender: "received",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T20:02:45")
            },
            {
                text: "Mock message 293",
                sender: "received",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2025-02-03T19:38:21")
            }
        ],
        newMessages: true,
    }
];


function handleNewMessage() {

}

const ChatInterface = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState("");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const messagesEndRef = useRef(null);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        if (!isSmallScreen && chats.length > 0 && !selectedChat) {
            setSelectedChat(chats[0]);
        }
    }, [isSmallScreen, selectedChat]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedChat?.messages]);

    const handleSendMessage = () => {
        if (message.trim() && selectedChat) {
            const newMessage = {
                text: message,
                sender: "sent",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date()
            };

            setSelectedChat(prev => ({
                ...prev,
                messages: [...prev.messages, newMessage]
            }));
            setMessage("");
        }
    };

    const handleFormalizeMessage = () => {
        const formalizedMessage = `[Formalizovano] ${message.trim()}`;
        setMessage(formalizedMessage);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
    };

    return (
        <Box sx={{ height: "calc(100vh - 72px)", display: "flex" }}>
            <CssBaseline />

            {isSmallScreen ? (
                <Box sx={{ width: "100%", position: "relative", flex: 1 }}>
                    {/* Mobile Chat List */}
                    <Box
                        sx={{
                            width: "100%",
                            height: "100vh",
                            position: "absolute",
                            left: selectedChat ? "-100%" : "0",
                            transition: "left 0.3s ease",
                            bgcolor: theme.palette.mode === "dark" ? colors.primary[700] : "#f4f4f7",
                            p: 2,
                            overflowY: "auto",
                            zIndex: 1,
                            paddingTop: "50px"
                        }}
                    >
                        <Typography variant="h5" mb={2} display="flex" justifyContent="space-between">
                            Prepiske
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
                            {chats.map((chat) => {
                                const lastMessage = chat.messages[chat.messages.length - 1];
                                return (
                                    <React.Fragment key={chat.id}>
                                        <ListItem
                                            button
                                            onClick={() => setSelectedChat(chat)}
                                            sx={{
                                                bgcolor: selectedChat?.id === chat.id ? colors.primary[600] : "transparent",
                                                borderRadius: "8px",
                                                mb: 1
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
                                                                color: theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[700],
                                                                maxWidth: '70%'
                                                            }}
                                                        >
                                                            {lastMessage?.text}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: theme.palette.mode === 'dark' ? colors.grey[500] : colors.grey[600],
                                                                fontSize: '0.7rem'
                                                            }}
                                                        >
                                                            {formatTime(lastMessage?.timestamp)}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                            {chat.newMessages && <Badge color="error" variant="dot" />}
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                );
                            })}
                        </List>
                    </Box>

                    {/* Mobile Chat Window */}
                    <Box
                        sx={{
                            width: "100%",
                            height: "100vh",
                            position: "absolute",
                            left: selectedChat ? "0" : "100%",
                            transition: "left 0.3s ease",
                            bgcolor: theme.palette.mode === "dark" ? colors.primary[800] : "#fff",
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            zIndex: 2
                        }}
                    >
                        {selectedChat && (
                            <>
                                <Box display="flex" alignItems="center" mb={2} paddingTop="50px">
                                    <IconButton onClick={() => setSelectedChat(null)} sx={{ mr: 1 }}>
                                        <ArrowBackIcon />
                                    </IconButton>
                                    <Avatar src={selectedChat.avatar} sx={{ mr: 2 }} />
                                    <Typography variant="h6">{selectedChat.name}</Typography>
                                </Box>

                                <Box
                                    flex={1}
                                    overflow="auto"
                                    sx={{
                                        bgcolor: theme.palette.mode === "dark" ? colors.primary[700] : "#f5f5f5",
                                        borderRadius: "8px",
                                        p: 2,
                                        mb: 2
                                    }}
                                >
                                    {selectedChat.messages.map((msg, index) => (
                                        <Box
                                            key={index}
                                            display="flex"
                                            justifyContent={msg.sender === "sent" ? "flex-end" : "flex-start"}
                                            mb={2}
                                        >
                                            <Box sx={{ position: 'relative', maxWidth: '80%' }}>
                                                <Box
                                                    sx={{
                                                        bgcolor: msg.sender === "sent" ? colors.greenAccent[500] : colors.blueAccent[500],
                                                        color: "white",
                                                        p: 1.5,
                                                        borderRadius: "12px",
                                                        position: 'relative'
                                                    }}
                                                >
                                                    {msg.text}
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            position: 'absolute',
                                                            right: 8,
                                                            bottom: 4,
                                                            color: 'rgba(255,255,255,0.5)',
                                                            fontSize: '0.6rem',
                                                            lineHeight: 1
                                                        }}
                                                    >
                                                        {formatTime(msg.timestamp)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </Box>

                                <Box display="flex" gap={1} alignItems="center">
                                    <IconButton><AttachFileIcon /></IconButton>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        placeholder="Type a message..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        size="small"
                                    />
                                    <Button
                                        variant="outlined"
                                        onClick={handleFormalizeMessage}
                                        disabled={!message.trim()}
                                        startIcon={<AutoAwesomeOutlinedIcon />}
                                        sx={{
                                            whiteSpace: 'nowrap',
                                            minWidth: 'auto',
                                            px: 1.5,
                                            borderColor: colors.blueAccent[500],
                                            color: colors.blueAccent[500],
                                            '&:hover': {
                                                borderColor: colors.blueAccent[600],
                                                backgroundColor: colors.blueAccent[900] + '20'
                                            }
                                        }}
                                    >
                                        {!isSmallScreen && "Formalize"}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleSendMessage}
                                        sx={{
                                            bgcolor: colors.greenAccent[500],
                                            "&:hover": { bgcolor: colors.greenAccent[600] },
                                            minWidth: 'auto'
                                        }}
                                    >
                                        <SendIcon />
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            ) : (
                <Box sx={{ display: "flex", width: "100%" }}>
                    {/* Desktop Chat List */}
                    <Box
                        sx={{
                            width: "300px",
                            borderRight: `1px solid ${colors.grey[700]}`,
                            bgcolor: theme.palette.mode === "dark" ? colors.primary[700] : "#f4f4f7",
                            p: 2,
                            overflowY: "auto"
                        }}
                    >
                        <Typography variant="h5" mb={2} display="flex"
                                    justifyContent="space-between"
                                    alignItems="center">
                            Prepiske
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
                            {chats.map((chat) => {
                                const lastMessage = chat.messages[chat.messages.length - 1];
                                return (
                                    <ListItem
                                        key={chat.id}
                                        button
                                        selected={selectedChat?.id === chat.id}
                                        onClick={() => setSelectedChat(chat)}
                                        sx={{ borderRadius: "8px", mb: 1 }}
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
                                                            color: theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[700],
                                                            maxWidth: '60%'
                                                        }}
                                                    >
                                                        {lastMessage?.text}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: theme.palette.mode === 'dark' ? colors.grey[500] : colors.grey[600],
                                                            fontSize: '0.7rem'
                                                        }}
                                                    >
                                                        {formatTime(lastMessage?.timestamp)}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        {chat.newMessages && <Badge color="error" variant="dot" sx={{ ml: 2 }} />}
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>

                    {/* Desktop Chat Window */}
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", p: 3 }}>
                        {selectedChat ? (
                            <>
                                <Box display="flex" alignItems="center" mb={3}>
                                    <Avatar src={selectedChat.avatar} sx={{ width: 40, height: 40, mr: 2 }} />
                                    <Typography variant="h5">{selectedChat.name}</Typography>
                                </Box>

                                <Box
                                    flex={1}
                                    overflow="auto"
                                    sx={{
                                        bgcolor: theme.palette.mode === "dark" ? colors.primary[700] : "#f5f5f5",
                                        borderRadius: "8px",
                                        p: 3,
                                        mb: 2
                                    }}
                                >
                                    {selectedChat.messages.map((msg, index) => (
                                        <Box
                                            key={index}
                                            display="flex"
                                            justifyContent={msg.sender === "sent" ? "flex-end" : "flex-start"}
                                            mb={2}
                                        >
                                            <Box sx={{ position: 'relative', maxWidth: '60%' }}>
                                                <Box
                                                    sx={{
                                                        bgcolor: msg.sender === "sent" ? colors.greenAccent[500] : colors.blueAccent[500],
                                                        color: "white",
                                                        p: 2,
                                                        borderRadius: "12px",
                                                        position: 'relative'
                                                    }}
                                                >
                                                    {msg.text}
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            position: 'absolute',
                                                            right: 8,
                                                            bottom: 4,
                                                            color: 'rgba(255,255,255,0.5)',
                                                            fontSize: '0.7rem',
                                                            lineHeight: 1
                                                        }}
                                                    >
                                                        {formatTime(msg.timestamp)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </Box>

                                <Box display="flex" gap={2} alignItems="center">
                                    <IconButton>
                                        <AttachFileIcon fontSize="medium" />
                                    </IconButton>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        placeholder="Type a message..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        size="medium"
                                    />
                                    <Button
                                        variant="outlined"
                                        onClick={handleFormalizeMessage}
                                        disabled={!message.trim()}
                                        startIcon={<AutoAwesomeOutlinedIcon />}
                                        sx={{
                                            borderColor: colors.blueAccent[500],
                                            color: colors.blueAccent[500],
                                            '&:hover': {
                                                borderColor: colors.blueAccent[600],
                                                backgroundColor: colors.blueAccent[900] + '20'
                                            },
                                            px: 4,
                                            py: 1.5
                                        }}
                                    >
                                        Formalizuj
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={handleSendMessage}
                                        sx={{
                                            bgcolor: colors.greenAccent[500],
                                            "&:hover": { bgcolor: colors.greenAccent[600] },
                                            px: 4,
                                            py: 1.5
                                        }}
                                    >
                                        <SendIcon sx={{ mr: 1 }} /> Pošalji
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Typography variant="h6" color="textSecondary">
                                    Odaberi prepisku da bi se dopisivao
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default ChatInterface;