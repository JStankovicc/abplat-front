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
    Dialog,
    DialogTitle,
    DialogContent,
    InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import { tokens } from "../../theme";


const initialChats = [
    {
        id: 1,
        name: "Ana Marković",
        avatar: "https://via.placeholder.com/40",
        messages: [
            {
                text: "Kad će biti spremni ti dokumenti?",
                sender: "sent",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2024-02-05T19:35:28")
            },
            {
                text: "Do kraja nedelje najkasnije",
                sender: "received",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2024-02-05T19:36:11")
            }
        ],
        newMessages: true,
    },
    {
        id: 2,
        name: "Marko Petrović",
        avatar: "https://via.placeholder.com/40",
        messages: [
            {
                text: "Jesi li proverio finansijski izveštaj?",
                sender: "sent",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date("2024-02-05T18:47:03")
            }
        ],
        newMessages: false,
    },
    {
        id: 3,
        name: "Jovana Ilić",
        avatar: "https://via.placeholder.com/40",
        messages: [],
        newMessages: false,
    }
];

const contacts = [
    { id: 1, name: "Ana Marković", avatar: "https://via.placeholder.com/40" },
    { id: 2, name: "Marko Petrović", avatar: "https://via.placeholder.com/40" },
    { id: 3, name: "Jovana Ilić", avatar: "https://via.placeholder.com/40" },
    { id: 4, name: "Nikola Stojanović", avatar: "https://via.placeholder.com/40" },
    { id: 5, name: "Milica Đorđević", avatar: "https://via.placeholder.com/40" },
    { id: 6, name: "Stefan Popović", avatar: "https://via.placeholder.com/40" },
    { id: 7, name: "Kristina Nikolić", avatar: "https://via.placeholder.com/40" },
    { id: 8, name: "Luka Pavlović", avatar: "https://via.placeholder.com/40" },
    { id: 9, name: "Maja Todorović", avatar: "https://via.placeholder.com/40" },
    { id: 10, name: "Ivan Milošević", avatar: "https://via.placeholder.com/40" },
];

const ChatInterface = () => {
    const [chats, setChats] = useState(initialChats);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [message, setMessage] = useState("");
    const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
    const [searchContactTerm, setSearchContactTerm] = useState("");
    const [searchChatTerm, setSearchChatTerm] = useState("");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const messagesEndRef = useRef(null);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

    const selectedChat = chats.find(chat => chat.id === selectedChatId);

    useEffect(() => {
        // Select last chat
        if (chats.length > 0) {
            const mostRecentChat = chats.reduce((prev, current) => {
                const prevLastMessage = prev.messages[prev.messages.length - 1]?.timestamp || 0;
                const currentLastMessage = current.messages[current.messages.length - 1]?.timestamp || 0;
                return prevLastMessage > currentLastMessage ? prev : current;
            });
            setSelectedChatId(mostRecentChat.id);
        }
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedChat?.messages]);

    const handleSendMessage = () => {
        if (message.trim() && selectedChatId) {
            const newMessage = {
                text: message,
                sender: "sent",
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date()
            };

            setChats(prevChats =>
                prevChats.map(chat =>
                    chat.id === selectedChatId
                        ? { ...chat, messages: [...chat.messages, newMessage] }
                        : chat
                )
            );
            setMessage("");
        }
    };

    const handleContactSelect = (contact) => {
        setIsNewChatDialogOpen(false);

        const existingChat = chats.find(chat => chat.id === contact.id);
        if (existingChat) {
            setSelectedChatId(existingChat.id);
        } else {
            const newChat = {
                ...contact,
                messages: [],
                newMessages: false,
            };
            setChats(prev => [...prev, newChat]);
            setSelectedChatId(newChat.id);
        }
    };

    const handleFormalizeMessage = () => {
        const formalizedMessage = `[Formalizovano] ${message.trim()}`;
        setMessage(formalizedMessage);
    };

    const formatTime = (date) => {
        return date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '';
    };

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchContactTerm.toLowerCase())
    );

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchChatTerm.toLowerCase())
    );

    return (
        <Box sx={{ height: "calc(100vh - 72px)", display: "flex" }}>
            <CssBaseline />

            {/* New Chat Dialog */}
            <Dialog
                open={isNewChatDialogOpen}
                onClose={() => setIsNewChatDialogOpen(false)}
                sx={{
                    '& .MuiDialog-paper': {
                        width: '500px',
                        maxWidth: '80vw',
                        borderRadius: '12px'
                    }
                }}
            >
                <DialogTitle sx={{ bgcolor: colors.primary[700], borderBottom: `1px solid ${colors.grey[700]}` }}>
                    Izaberi kontakt
                </DialogTitle>
                <DialogContent sx={{ bgcolor: colors.primary[700], p: 0 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Pretraži kontakte..."
                        value={searchContactTerm}
                        onChange={(e) => setSearchContactTerm(e.target.value)}
                        sx={{ p: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: colors.grey[500] }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <List sx={{ maxHeight: '60vh', overflow: 'auto' }}>
                        {filteredContacts.map((contact) => (
                            <ListItem
                                button
                                key={contact.id}
                                onClick={() => handleContactSelect(contact)}
                                sx={{
                                    '&:hover': {
                                        bgcolor: colors.primary[600]
                                    }
                                }}
                            >
                                <Avatar src={contact.avatar} sx={{ mr: 2 }} />
                                <ListItemText
                                    primary={contact.name}
                                    primaryTypographyProps={{ color: 'white' }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>


            {isSmallScreen ? (
                <Box sx={{ width: "100%", position: "relative", flex: 1 }}>
                    {/* Mobile Chat List */}
                    <Box
                        sx={{
                            width: "100%",
                            height: "100vh",
                            position: "absolute",
                            left: selectedChatId ? "-100%" : "0",
                            transition: "left 0.3s ease",
                            bgcolor: theme.palette.mode === "dark" ? colors.primary[700] : "#f4f4f7",
                            p: 2,
                            overflowY: "auto",
                            zIndex: 1,
                            paddingTop: "50px"
                        }}
                    >
                        <Typography variant="h5" mb={2} display="flex" justifyContent="space-between" alignItems="center">
                            Prepiske
                            <IconButton
                                onClick={() => setIsNewChatDialogOpen(true)}
                                sx={{
                                    color: theme.palette.mode === "dark" ? colors.greenAccent[500] : "#4caf50",
                                }}
                            >
                                <AddIcon />
                            </IconButton>
                        </Typography>
                        <Box mb={2}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Pretraži prepiske..."
                                value={searchChatTerm}
                                onChange={(e) => setSearchChatTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        <List>
                            {filteredChats.map((chat) => {
                                const lastMessage = chat.messages[chat.messages.length - 1];
                                return (
                                    <React.Fragment key={chat.id}>
                                        <ListItem
                                            button
                                            onClick={() => setSelectedChatId(chat.id)}
                                            sx={{
                                                bgcolor: selectedChatId === chat.id ? colors.primary[600] : "transparent",
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
                                                            {lastMessage?.text || "Nema poruka"}
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
                            left: selectedChatId ? "0" : "100%",
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
                                    <IconButton onClick={() => setSelectedChatId(null)} sx={{ mr: 1 }}>
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
                                    {selectedChat.messages.length === 0 && (
                                        <Typography variant="body2" color="textSecondary" textAlign="center" mt={2}>
                                            Nijedna poruka još uvek...
                                        </Typography>
                                    )}
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
                                        placeholder="Napiši poruku..."
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
                                        {!isSmallScreen && "Formalizuj"}
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
                        <Typography variant="h5" mb={2} display="flex" justifyContent="space-between" alignItems="center">
                            Prepiske
                            <IconButton
                                onClick={() => setIsNewChatDialogOpen(true)}
                                sx={{
                                    color: theme.palette.mode === "dark" ? colors.greenAccent[500] : "#4caf50",
                                }}
                            >
                                <AddIcon />
                            </IconButton>
                        </Typography>
                        <Box mb={2}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Pretraži prepiske..."
                                value={searchChatTerm}
                                onChange={(e) => setSearchChatTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        <List>
                            {filteredChats.map((chat) => {
                                const lastMessage = chat.messages[chat.messages.length - 1];
                                return (
                                    <ListItem
                                        key={chat.id}
                                        button
                                        selected={selectedChatId === chat.id}
                                        onClick={() => setSelectedChatId(chat.id)}
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
                                                        {lastMessage?.text || "Nema poruka"}
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
                                    {selectedChat.messages.length === 0 && (
                                        <Typography variant="body2" color="textSecondary" textAlign="center" mt={2}>
                                            Počnite razgovor sa {selectedChat.name}
                                        </Typography>
                                    )}
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
                                        placeholder="Napiši poruku..."
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
                                    Odaberite prepisku za dopisivanje
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