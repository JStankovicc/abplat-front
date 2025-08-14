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
import chatService from "../../services/chatService";
import websocketService from "../../services/websocketService";


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
    const [chats, setChats] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [selectedThread, setSelectedThread] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
    const [searchContactTerm, setSearchContactTerm] = useState("");
    const [searchChatTerm, setSearchChatTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [sendingMessage, setSendingMessage] = useState(false);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const messagesEndRef = useRef(null);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

    const selectedChat = chats.find(chat => chat.conversationId === selectedChatId);

    // Load initial data
    useEffect(() => {
        loadChatsAndContacts();
        // Onemogućujem WebSocket za sada
        // initializeWebSocket();
        
        // Pokreni polling na svake 2 sekunde
        const pollInterval = setInterval(() => {
            loadChatsAndContacts();
        }, 2000);

        return () => clearInterval(pollInterval);
    }, []);

    // Load messages when chat is selected i pokreni polling za poruke
    useEffect(() => {
        console.log('Selected chat ID changed:', selectedChatId);
        let messagesPollInterval;
        
        if (selectedChatId) {
            console.log('Loading messages for chat ID:', selectedChatId);
            loadMessages(selectedChatId);
            
            // Pokreni polling za poruke na svake 2 sekunde
            messagesPollInterval = setInterval(() => {
                loadMessages(selectedChatId);
            }, 2000);
        } else {
            console.log('No chat selected, clearing messages');
            setMessages([]);
        }

        return () => {
            if (messagesPollInterval) {
                clearInterval(messagesPollInterval);
            }
        };
    }, [selectedChatId]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const loadChatsAndContacts = async () => {
        try {
            setLoading(true);
            
            // Load threads and contacts in parallel
            const [threadsData, contactsData] = await Promise.all([
                chatService.getInbox(),
                chatService.getAllContacts()
            ]);

            console.log('Loaded threads:', threadsData);
            console.log('Loaded contacts:', contactsData);

            // Transform conversations to chat format using your DTO
            const transformedChats = await Promise.all(
                threadsData.map(conversation => 
                    chatService.formatConversationForDisplay(conversation, contactsData)
                )
            );

            setChats(transformedChats);
            setContacts(contactsData);

        } catch (error) {
            console.error('Error loading chats and contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async (threadId) => {
        try {
            const messagesData = await chatService.getMessages(threadId, 0, 50);
            console.log('Loaded messages for thread:', threadId, messagesData);
            
            // Transform messages using your DTO
            const transformedMessages = await Promise.all(
                (messagesData.content || []).map(message => 
                    chatService.formatMessageForDisplay(message)
                )
            );
            transformedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Sort chronologically (oldest first)

            setMessages(transformedMessages);

            // Mark messages as read (need last message ID)
            if (transformedMessages.length > 0) {
                const lastMessageId = transformedMessages[transformedMessages.length - 1].id;
                await chatService.markAsRead(threadId, lastMessageId);
            }

        } catch (error) {
            console.error('Error loading messages:', error);
            setMessages([]);
        }
    };

    const initializeWebSocket = async () => {
        try {
            const userId = getCurrentUserId();
            if (!websocketService.isWebSocketConnected()) {
                await websocketService.connect(userId);
            }

            // Add message handler
            websocketService.addMessageHandler(handleWebSocketMessage);

        } catch (error) {
            console.error('Error initializing WebSocket:', error);
        }
    };

    const handleWebSocketMessage = (messageData) => {
        console.log('Received WebSocket message:', messageData);
        
        // messageData je MessageResponse iz tvog sistema
        // If message is for current conversation, add it to messages
        if (messageData.conversationId === selectedChatId) {
            const newMessage = chatService.formatMessageForDisplay(messageData);
            setMessages(prev => [...prev, newMessage]);
        }

        // Update chat list with new message
        setChats(prev => prev.map(chat => {
            if (chat.conversationId === messageData.conversationId) {
                return {
                    ...chat,
                    lastMessage: messageData.content,
                    lastMessageTime: new Date(messageData.createdAt),
                    unreadCount: chat.conversationId === selectedChatId ? 0 : (chat.unreadCount || 0) + 1
                };
            }
            return chat;
        }));
    };

    const getCurrentUserId = () => {
        // Pokušaj da dobiješ iz localStorage
        const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        if (userProfile.id) {
            return userProfile.id;
        }
        
        // Pokušaj da dobiješ iz JWT tokena
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                console.log('JWT payload:', payload);
                return payload.sub || payload.userId || payload.id || 1;
            } catch (error) {
                console.error('Error parsing JWT token:', error);
            }
        }
        
        return 1; // Fallback
    };

    // Ova funkcija je sada u chatService.js

    useEffect(() => {
        // Select first chat if none selected and no chat is currently selected
        if (chats.length > 0 && !selectedChatId) {
            const mostRecentChat = chats.reduce((prev, current) => {
                const prevLastMessage = prev.lastMessageTime || new Date(0);
                const currentLastMessage = current.lastMessageTime || new Date(0);
                return prevLastMessage > currentLastMessage ? prev : current;
            });
            setSelectedChatId(mostRecentChat.conversationId);
        }
    }, [chats, selectedChatId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (message.trim() && selectedChatId && !sendingMessage) {
            try {
                setSendingMessage(true);
                
                // Šalje preko REST API-ja
                await chatService.sendMessage(selectedChatId, message.trim());
                
                // Odmah učitaj poruke da vidiš novu poruku
                await loadMessages(selectedChatId);

            setMessage("");
                
            } catch (error) {
                console.error('Error sending message:', error);
                // You could show a toast notification here
            } finally {
                setSendingMessage(false);
            }
        }
    };

    const handleContactSelect = async (contact) => {
        try {
        setIsNewChatDialogOpen(false);

            // Check if direct conversation already exists
            const existingChat = chats.find(chat => 
                !chat.isGroup && 
                chat.participantIds && Array.from(chat.participantIds).includes(contact.id)
            );
            
        if (existingChat) {
                setSelectedChatId(existingChat.conversationId);
                return;
            }

            // Create new direct conversation - tvoj API vraća conversationId
            const conversationId = await chatService.createOrGetDirectConversation(contact.id);
            console.log('Created/found conversation ID:', conversationId);

            // Refresh inbox to get the new conversation with proper data
            await loadChatsAndContacts();
            
            // Select the new conversation
            setSelectedChatId(conversationId);

        } catch (error) {
            console.error('Error creating/selecting chat:', error);
        }
    };

    const handleFormalizeMessage = () => {
        const formalizedMessage = `[Formalizovano] ${message.trim()}`;
        setMessage(formalizedMessage);
    };

    const formatTime = (date) => {
        return date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '';
    };

    // Helper funkcija za grupiranje poruka po pošaljaocu
    const groupMessagesBySender = (messages) => {
        const grouped = [];
        let currentGroup = null;

        messages.forEach((message, index) => {
            const shouldStartNewGroup = !currentGroup || 
                currentGroup.senderId !== message.senderId ||
                (message.timestamp - currentGroup.lastTimestamp) > 5 * 60 * 1000; // 5 minuta

            if (shouldStartNewGroup) {
                currentGroup = {
                    senderId: message.senderId,
                    sender: message.sender,
                    senderAvatar: message.senderAvatar,
                    messages: [message],
                    firstTimestamp: message.timestamp,
                    lastTimestamp: message.timestamp
                };
                grouped.push(currentGroup);
            } else {
                currentGroup.messages.push(message);
                currentGroup.lastTimestamp = message.timestamp;
            }
        });

        return grouped;
    };

    const filteredContacts = contacts.filter(contact =>
        contact?.displayName?.toLowerCase().includes(searchContactTerm.toLowerCase())
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
                                    primary={contact?.displayName || 'Unknown User'}
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
                                // lastMessage is now part of chat object
                                return (
                                    <React.Fragment key={chat.id}>
                                        <ListItem
                                            button
                                            onClick={() => {
                                                console.log('Chat clicked:', chat);
                                                console.log('Setting selected chat ID to:', chat.conversationId);
                                                setSelectedChatId(chat.conversationId);
                                            }}
                                            sx={{
                                                bgcolor: selectedChatId === chat.conversationId ? colors.primary[600] : "transparent",
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
                                                            {chat.lastMessage || "Nema poruka"}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: theme.palette.mode === 'dark' ? colors.grey[500] : colors.grey[600],
                                                                fontSize: '0.7rem'
                                                            }}
                                                        >
                                                            {formatTime(chat.lastMessageTime)}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                            {chat.unreadCount > 0 && (
                                                <Badge badgeContent={chat.unreadCount} color="error" sx={{ ml: 1 }} />
                                            )}
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
                                    {messages.length === 0 && (
                                        <Typography variant="body2" color="textSecondary" textAlign="center" mt={2}>
                                            Nijedna poruka još uvek...
                                        </Typography>
                                    )}
                                    {groupMessagesBySender(messages).map((group, groupIndex) => (
                                        <Box key={groupIndex} mb={2}>
                                            {/* Avatar i ime pošaljaoca za grupu */}
                                            {group.sender === "received" && (
                                                <Box display="flex" alignItems="center" mb={1} ml={1}>
                                                    <Avatar src={group.senderAvatar} sx={{ width: 24, height: 24, mr: 1 }} />
                                                    <Typography variant="caption" color="textSecondary">
                                                        {formatTime(group.firstTimestamp)}
                                                    </Typography>
                                                </Box>
                                            )}
                                            
                                            {/* Poruke u grupi */}
                                            {group.messages.map((msg, msgIndex) => (
                                                <Box
                                                    key={msgIndex}
                                            display="flex"
                                            justifyContent={msg.sender === "sent" ? "flex-end" : "flex-start"}
                                                    mb={0.5}
                                        >
                                            <Box sx={{ position: 'relative', maxWidth: '80%' }}>
                                                <Box
                                                    sx={{
                                                        bgcolor: msg.sender === "sent" ? colors.greenAccent[500] : colors.blueAccent[500],
                                                        color: "white",
                                                        p: 1.5,
                                                                borderRadius: msgIndex === 0 ? "12px" : 
                                                                    msgIndex === group.messages.length - 1 ? "12px" : "8px",
                                                        position: 'relative'
                                                    }}
                                                >
                                                    {msg.text}
                                                            {/* Prikaži vreme samo na poslednjoj poruci u grupi */}
                                                            {msgIndex === group.messages.length - 1 && (
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
                                                            )}
                                                </Box>
                                            </Box>
                                                </Box>
                                            ))}
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
                                // lastMessage is now part of chat object
                                return (
                                    <ListItem
                                        key={chat.id}
                                        button
                                        selected={selectedChatId === chat.conversationId}
                                        onClick={() => {
                                            console.log('Desktop chat clicked:', chat);
                                            console.log('Setting selected chat ID to:', chat.conversationId);
                                            setSelectedChatId(chat.conversationId);
                                        }}
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
                                                        {chat.lastMessage || "Nema poruka"}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: theme.palette.mode === 'dark' ? colors.grey[500] : colors.grey[600],
                                                            fontSize: '0.7rem'
                                                        }}
                                                    >
                                                        {formatTime(chat.lastMessageTime)}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        {chat.unreadCount > 0 && (
                                            <Badge badgeContent={chat.unreadCount} color="error" sx={{ ml: 2 }} />
                                        )}
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
                                    {messages.length === 0 && (
                                        <Typography variant="body2" color="textSecondary" textAlign="center" mt={2}>
                                            Počnite razgovor sa {selectedChat?.name}
                                        </Typography>
                                    )}
                                    {groupMessagesBySender(messages).map((group, groupIndex) => (
                                        <Box key={groupIndex} mb={3}>
                                            {/* Avatar i ime pošaljaoca za grupu */}
                                            {group.sender === "received" && (
                                                <Box display="flex" alignItems="center" mb={1} ml={1}>
                                                    <Avatar src={group.senderAvatar} sx={{ width: 28, height: 28, mr: 1 }} />
                                                    <Typography variant="caption" color="textSecondary">
                                                        {formatTime(group.firstTimestamp)}
                                                    </Typography>
                                                </Box>
                                            )}
                                            
                                            {/* Poruke u grupi */}
                                            {group.messages.map((msg, msgIndex) => (
                                                <Box
                                                    key={msgIndex}
                                            display="flex"
                                            justifyContent={msg.sender === "sent" ? "flex-end" : "flex-start"}
                                                    mb={0.5}
                                        >
                                            <Box sx={{ position: 'relative', maxWidth: '60%' }}>
                                                <Box
                                                    sx={{
                                                        bgcolor: msg.sender === "sent" ? colors.greenAccent[500] : colors.blueAccent[500],
                                                        color: "white",
                                                        p: 2,
                                                                borderRadius: msgIndex === 0 ? "12px" : 
                                                                    msgIndex === group.messages.length - 1 ? "12px" : "10px",
                                                        position: 'relative'
                                                    }}
                                                >
                                                    {msg.text}
                                                            {/* Prikaži vreme samo na poslednjoj poruci u grupi */}
                                                            {msgIndex === group.messages.length - 1 && (
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
                                                            )}
                                                </Box>
                                            </Box>
                                                </Box>
                                            ))}
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