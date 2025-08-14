import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
    CircularProgress,
    Alert,
    Snackbar,
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
import { 
    getCurrentUser, 
    formatConversationSummary, 
    formatMessage, 
    formatContact, 
    sortConversationsByLastMessage,
    formatTime 
} from "../../utils/chatUtils";


const ChatInterface = () => {
    // State
    const [conversations, setConversations] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [messages, setMessages] = useState({});
    const [message, setMessage] = useState("");
    const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
    const [searchContactTerm, setSearchContactTerm] = useState("");
    const [searchChatTerm, setSearchChatTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [error, setError] = useState("");
    const [wsConnected, setWsConnected] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [messagesLoading, setMessagesLoading] = useState({});
    const [loadingMoreMessages, setLoadingMoreMessages] = useState({});
    const [hasMoreMessages, setHasMoreMessages] = useState({});
    const [messagesPage, setMessagesPage] = useState({});
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const messagesEndRef = useRef(null);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
    
    const selectedConversation = conversations.find(conv => conv.id === selectedConversationId);
    const selectedMessages = useMemo(() => messages[selectedConversationId] || [], [messages, selectedConversationId]);

    // WebSocket message handler
    const handleWebSocketMessage = useCallback((messageResponse) => {
        const formattedMessage = formatMessage(messageResponse, currentUser?.id);
        const conversationId = messageResponse.conversationId;
        
        setMessages(prev => ({
            ...prev,
            [conversationId]: [...(prev[conversationId] || []), formattedMessage]
        }));
        
        // Update conversation last message
        setConversations(prev => prev.map(conv => 
            conv.id === conversationId 
                ? { 
                    ...conv, 
                    lastMessagePreview: messageResponse.content,
                    lastMessageAt: new Date(messageResponse.createdAt),
                    newMessages: conv.id !== selectedConversationId
                }
                : conv
        ));
    }, [currentUser?.id, selectedConversationId]);

    // Inicijalno učitavanje podataka
    useEffect(() => {
        const initializeChat = async () => {
            try {
                setLoading(true);
                const user = getCurrentUser();
                if (!user || !user.id) {
                    setError("Nema validnog korisnika ili korisnik nema ID");
                    console.error('getCurrentUser vratila:', user);
                    return;
                }
                setCurrentUser(user);

                // Učitaj kontakte i konverzacije paralelno
                const [contactsResponse, conversationsResponse] = await Promise.all([
                    chatService.getAllContacts(),
                    chatService.getInbox()
                ]);

                const formattedContacts = (contactsResponse || []).map(formatContact);
                setContacts(formattedContacts);
                
                if (formattedContacts.length === 0) {
                    console.warn('Nema dostupnih kontakata - možda je potrebno da se backend popravi');
                }

                console.log('Raw konverzacije response:', conversationsResponse);
                
                const formattedConversations = (conversationsResponse || []).map(conv => 
                    formatConversationSummary(conv, contactsResponse || [], user.id)
                );
                console.log('Formatirane konverzacije:', formattedConversations);
                
                const sortedConversations = sortConversationsByLastMessage(formattedConversations);
                console.log('Sortirane konverzacije:', sortedConversations);
                
                setConversations(sortedConversations);

                // Odaberi poslednju konverzaciju
                if (sortedConversations.length > 0) {
                    setSelectedConversationId(sortedConversations[0].id);
                    console.log('Odabrana konverzacija:', sortedConversations[0].id);
                } else {
                    console.warn('Nema konverzacija za prikaz');
                }

                // Konektuj WebSocket
                try {
                    await websocketService.connect(user.id);
                    websocketService.addMessageHandler(handleWebSocketMessage);
                    websocketService.addConnectionHandler(setWsConnected);
                } catch (wsError) {
                    console.error('WebSocket konekcija neuspešna:', wsError);
                    setWsConnected(false);
                    // Nastavi bez WebSocket-a - aplikacija može raditi sa REST API
                    console.info('Chat radi u REST-only modu - poruke se šalju preko HTTP');
                    
                    // Prikaži poruku korisniku o WebSocket problemu
                    if (wsError.message.includes('CORS') || wsError.message.includes('onemogućen')) {
                        setError("WebSocket nije dostupan zbog CORS problema. Chat radi preko HTTP-a.");
                    }
                }
                
            } catch (error) {
                console.error('Greška pri inicijalizaciji chat-a:', error);
                setError("Greška pri učitavanju chat-a");
        } finally {
                setLoading(false);
            }
        };

        initializeChat();

        // Cleanup
        return () => {
            websocketService.removeMessageHandler(handleWebSocketMessage);
            websocketService.removeConnectionHandler(setWsConnected);
            websocketService.disconnect();
        };
    }, [handleWebSocketMessage]);

    // Učitaj poruke kad se promeni konverzacija
    useEffect(() => {
        const loadMessages = async () => {
            if (!selectedConversationId || messages[selectedConversationId]) {
                return; // Već učitane poruke
            }

            try {
                setMessagesLoading(prev => ({ ...prev, [selectedConversationId]: true }));
                const messagesResponse = await chatService.getMessages(selectedConversationId, 0, 50);
                
                const formattedMessages = messagesResponse.content.map(msg => 
                    formatMessage(msg, currentUser?.id)
                ).reverse(); // Backend vraća u obrnutom redosledu
            
            setMessages(prev => ({
                ...prev,
                    [selectedConversationId]: formattedMessages
                }));

                // Set pagination info
                setMessagesPage(prev => ({ ...prev, [selectedConversationId]: 0 }));
                setHasMoreMessages(prev => ({ 
                    ...prev, 
                    [selectedConversationId]: !messagesResponse.last 
                }));

                // Označi kao pročitano
                if (formattedMessages.length > 0) {
                    const lastMessage = messagesResponse.content[0]; // Poslednja poruka
                    await chatService.markAsRead(selectedConversationId, lastMessage.id);
                    
                    // Update unread count
                setConversations(prev => prev.map(conv => 
                        conv.id === selectedConversationId 
                            ? { ...conv, newMessages: false, unreadCount: 0 }
                        : conv
                ));
            }
                
            } catch (error) {
                console.error('Greška pri učitavanju poruka:', error);
        } finally {
                setMessagesLoading(prev => ({ ...prev, [selectedConversationId]: false }));
            }
        };

        loadMessages();
    }, [selectedConversationId, currentUser?.id, messages]);

    // Funkcija za učitavanje starijih poruka
    const loadMoreMessages = async () => {
        if (!selectedConversationId || loadingMoreMessages[selectedConversationId] || !hasMoreMessages[selectedConversationId]) {
            return;
        }

        try {
            setLoadingMoreMessages(prev => ({ ...prev, [selectedConversationId]: true }));
            const currentPage = messagesPage[selectedConversationId] || 0;
            const nextPage = currentPage + 1;
            
            const messagesResponse = await chatService.getMessages(selectedConversationId, nextPage, 50);
            
            const formattedMessages = messagesResponse.content.map(msg => 
                formatMessage(msg, currentUser?.id)
            ).reverse();
            
            // Dodaj starije poruke na početak
        setMessages(prev => ({
            ...prev,
                [selectedConversationId]: [...formattedMessages, ...(prev[selectedConversationId] || [])]
            }));

            setMessagesPage(prev => ({ ...prev, [selectedConversationId]: nextPage }));
            setHasMoreMessages(prev => ({ 
                ...prev, 
                [selectedConversationId]: !messagesResponse.last 
            }));
            
        } catch (error) {
            console.error('Greška pri učitavanju starijih poruka:', error);
        } finally {
            setLoadingMoreMessages(prev => ({ ...prev, [selectedConversationId]: false }));
        }
    };

    // Scroll do kraja kad se dodaju nove poruke
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedMessages]);

    const handleSendMessage = async () => {
        if (!message.trim() || !selectedConversationId || sendingMessage) {
            return;
        }

        const messageToSend = message;
        
        try {
            setSendingMessage(true);
            
            // Optimistic update - dodaj poruku odmah u UI
            const optimisticMessage = {
                id: `temp-${Date.now()}`,
                text: messageToSend,
                sender: "sent",
                senderId: currentUser?.id,
                senderAvatar: "https://via.placeholder.com/40",
                timestamp: new Date()
            };
            
            setMessages(prev => ({
                ...prev,
                [selectedConversationId]: [...(prev[selectedConversationId] || []), optimisticMessage]
            }));
            
            setMessage("");
            
            // Pošalji preko WebSocket-a
            if (wsConnected) {
                websocketService.sendMessage(selectedConversationId, messageToSend);
            } else {
                // Fallback na REST API
                await chatService.sendMessage(selectedConversationId, messageToSend);
            }
            
        } catch (error) {
            console.error('Greška pri slanju poruke:', error);
            setError("Greška pri slanju poruke");
            // Ukloni optimistic update u slučaju greške
            setMessages(prev => ({
                ...prev,
                [selectedConversationId]: (prev[selectedConversationId] || []).filter(msg => 
                    !msg.id.toString().startsWith('temp-')
                )
            }));
            setMessage(messageToSend); // Vrati poruku u input
        } finally {
            setSendingMessage(false);
        }
    };

    const handleContactSelect = async (contact) => {
        try {
            setIsNewChatDialogOpen(false);

            // Proveravamo da li već postoji konverzacija sa ovim kontaktom
            const existingConversation = conversations.find(conv => 
                !conv.group && conv.participantIds?.includes(contact.id)
            );

            if (existingConversation) {
                setSelectedConversationId(existingConversation.id);
            } else {
                // Kreiraj novu direktnu konverzaciju
                const conversationId = await chatService.createOrGetDirectConversation(contact.id);
                
                // Dodaj novu konverzaciju u listu
                const newConversation = {
                    id: conversationId,
                    name: contact.name,
                    avatar: contact.avatar,
                    messages: [],
                    newMessages: false,
                    unreadCount: 0,
                    lastMessagePreview: "",
                    lastMessageAt: null,
                    group: false,
                    participantIds: [currentUser?.id, contact.id]
                };
                
                setConversations(prev => [newConversation, ...prev]);
                setSelectedConversationId(conversationId);
            }
        } catch (error) {
            console.error('Greška pri kreiranju konverzacije:', error);
            setError("Greška pri kreiranju konverzacije");
        }
    };

    const handleFormalizeMessage = () => {
        const formalizedMessage = `[Formalizovano] ${message.trim()}`;
        setMessage(formalizedMessage);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const filteredContacts = contacts.filter(contact =>
        contact && contact.name && 
        contact.name.toLowerCase().includes(searchContactTerm.toLowerCase()) &&
        contact.id !== currentUser?.id // Ne prikazuj sebe u kontaktima
    );

    const filteredConversations = conversations.filter(conv =>
        conv && conv.name && 
        conv.name.toLowerCase().includes(searchChatTerm.toLowerCase())
    );

    // Loading state
    if (loading) {
        return (
            <Box sx={{ 
                height: "calc(100vh - 72px)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
            }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ height: "calc(100vh - 72px)", display: "flex" }}>
            <CssBaseline />
            
            {/* Error Snackbar */}
            <Snackbar
                open={!!error} 
                autoHideDuration={error.includes('WebSocket') ? null : 6000} 
                onClose={() => setError("")}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setError("")} 
                    severity={error.includes('WebSocket') ? "warning" : "error"}
                    action={error.includes('WebSocket') ? (
                        <Button 
                            color="inherit" 
                            size="small" 
                            onClick={() => {
                                websocketService.reset();
                                setError("");
                                // Pokušaj ponovo da se konektuješ
                                if (currentUser?.id) {
                                    websocketService.connect(currentUser.id)
                                        .then(() => {
                                            websocketService.addMessageHandler(handleWebSocketMessage);
                                            websocketService.addConnectionHandler(setWsConnected);
                                        })
                                        .catch(() => {
                                            // Ignorišemo grešku - već smo prikazali poruku
                                        });
                                }
                            }}
                        >
                            Pokušaj ponovo
                        </Button>
                    ) : null}
                >
                    {error}
                </Alert>
            </Snackbar>

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
                        {filteredContacts.length === 0 ? (
                            <ListItem>
                                <ListItemText
                                    primary="Nema dostupnih kontakata"
                                    secondary="Backend greška - kontaktirajte administratora"
                                    primaryTypographyProps={{ color: 'white' }}
                                    secondaryTypographyProps={{ color: colors.grey[400] }}
                                />
                            </ListItem>
                        ) : (
                            filteredContacts.map((contact) => (
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
                            ))
                        )}
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
                            left: selectedConversationId ? "-100%" : "0",
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
                            {filteredConversations.map((conv) => {
                                    return (
                                    <React.Fragment key={conv.id}>
                                            <ListItem
                                                button
                                            onClick={() => setSelectedConversationId(conv.id)}
                                                sx={{
                                                bgcolor: selectedConversationId === conv.id ? colors.primary[600] : "transparent",
                                                    borderRadius: "8px",
                                                    mb: 1
                                                }}
                                            >
                                            <Avatar src={conv.avatar} sx={{ mr: 2 }} />
                                                <ListItemText
                                                primary={conv.name}
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
                                                            {conv.lastMessagePreview || "Nema poruka"}
                                                            </Typography>
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    color: theme.palette.mode === 'dark' ? colors.grey[500] : colors.grey[600],
                                                                    fontSize: '0.7rem'
                                                                }}
                                                            >
                                                            {formatTime(conv.lastMessageAt)}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            {conv.newMessages && <Badge color="error" variant="dot" />}
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
                            left: selectedConversationId ? "0" : "100%",
                            transition: "left 0.3s ease",
                            bgcolor: theme.palette.mode === "dark" ? colors.primary[800] : "#fff",
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            zIndex: 2
                        }}
                    >
                        {selectedConversation && (
                            <>
                                <Box display="flex" alignItems="center" mb={2} paddingTop="50px">
                                    <IconButton onClick={() => setSelectedConversationId(null)} sx={{ mr: 1 }}>
                                        <ArrowBackIcon />
                                    </IconButton>
                                    <Avatar src={selectedConversation.avatar} sx={{ mr: 2 }} />
                                    <Typography variant="h6">{selectedConversation.name}</Typography>
                                    {!wsConnected && (
                                        <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                                            Offline
                                    </Typography>
                                    )}
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
                                    {hasMoreMessages[selectedConversationId] && (
                                                <Box display="flex" justifyContent="center" mb={2}>
                                                    <Button 
                                                variant="outlined"
                                                        size="small"
                                                onClick={loadMoreMessages}
                                                disabled={loadingMoreMessages[selectedConversationId]}
                                                sx={{ 
                                                    borderRadius: '16px',
                                                    textTransform: 'none'
                                                }}
                                            >
                                                {loadingMoreMessages[selectedConversationId] ? (
                                                    <CircularProgress size={16} />
                                                ) : (
                                                    'Učitaj starije poruke'
                                                )}
                                                    </Button>
                                                </Box>
                                            )}
                                    {messagesLoading[selectedConversationId] && (
                                        <Box display="flex" justifyContent="center" mt={2}>
                                            <CircularProgress size={24} />
                                        </Box>
                                    )}
                                    {selectedMessages.length === 0 && !messagesLoading[selectedConversationId] && (
                                        <Typography variant="body2" color="textSecondary" textAlign="center" mt={2}>
                                            Počnite razgovor sa {selectedConversation.name}
                                        </Typography>
                                    )}
                                    {selectedMessages.map((msg, index) => (
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
                                        onKeyPress={handleKeyPress}
                                        size="small"
                                        multiline
                                        maxRows={4}
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
                                        disabled={sendingMessage || !message.trim()}
                                        sx={{
                                            bgcolor: colors.greenAccent[500],
                                            "&:hover": { bgcolor: colors.greenAccent[600] },
                                            minWidth: 'auto'
                                        }}
                                    >
                                        {sendingMessage ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
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
                            {filteredConversations.map((conv) => {
                                    return (
                                        <ListItem
                                        key={conv.id}
                                            button
                                        selected={selectedConversationId === conv.id}
                                        onClick={() => setSelectedConversationId(conv.id)}
                                            sx={{ borderRadius: "8px", mb: 1 }}
                                        >
                                        <Avatar src={conv.avatar} sx={{ mr: 2 }} />
                                            <ListItemText
                                            primary={conv.name}
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
                                                        {conv.lastMessagePreview || "Nema poruka"}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: theme.palette.mode === 'dark' ? colors.grey[500] : colors.grey[600],
                                                                fontSize: '0.7rem'
                                                            }}
                                                        >
                                                        {formatTime(conv.lastMessageAt)}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        {conv.newMessages && <Badge color="error" variant="dot" sx={{ ml: 2 }} />}
                                        </ListItem>
                                    );
                            })}
                        </List>
                    </Box>

                    {/* Desktop Chat Window */}
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", p: 3 }}>
                        {selectedConversation ? (
                            <>
                                <Box display="flex" alignItems="center" mb={3}>
                                    <Avatar src={selectedConversation.avatar} sx={{ width: 40, height: 40, mr: 2 }} />
                                    <Typography variant="h5">{selectedConversation.name}</Typography>
                                    {!wsConnected && (
                                        <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                                            Offline - poruke se šalju preko REST API-ja
                                    </Typography>
                                    )}
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
                                    {hasMoreMessages[selectedConversationId] && (
                                                <Box display="flex" justifyContent="center" mb={2}>
                                                    <Button 
                                                variant="outlined"
                                                        size="small"
                                                onClick={loadMoreMessages}
                                                disabled={loadingMoreMessages[selectedConversationId]}
                                                sx={{ 
                                                    borderRadius: '16px',
                                                    textTransform: 'none'
                                                }}
                                            >
                                                {loadingMoreMessages[selectedConversationId] ? (
                                                    <CircularProgress size={16} />
                                                ) : (
                                                    'Učitaj starije poruke'
                                                )}
                                                    </Button>
                                                </Box>
                                            )}
                                    {messagesLoading[selectedConversationId] && (
                                        <Box display="flex" justifyContent="center" mt={2}>
                                            <CircularProgress size={24} />
                                        </Box>
                                    )}
                                    {selectedMessages.length === 0 && !messagesLoading[selectedConversationId] && (
                                        <Typography variant="body2" color="textSecondary" textAlign="center" mt={2}>
                                            Počnite razgovor sa {selectedConversation.name}
                                        </Typography>
                                    )}
                                    {selectedMessages.map((msg, index) => (
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
                                        onKeyPress={handleKeyPress}
                                        size="medium"
                                        multiline
                                        maxRows={4}
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
                                        disabled={sendingMessage || !message.trim()}
                                        sx={{
                                            bgcolor: colors.greenAccent[500],
                                            "&:hover": { bgcolor: colors.greenAccent[600] },
                                            px: 4,
                                            py: 1.5
                                        }}
                                    >
                                        {sendingMessage ? (
                                            <CircularProgress size={20} color="inherit" />
                                        ) : (
                                            <>
                                                <SendIcon sx={{ mr: 1 }} /> Pošalji
                                            </>
                                        )}
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2 }}>
                                <Typography variant="h6" color="textSecondary">
                                    {conversations.length === 0 ? "Nema dostupnih konverzacija" : "Odaberite prepisku za dopisivanje"}
                                </Typography>
                                {conversations.length === 0 && (
                                    <Typography variant="body2" color="textSecondary" textAlign="center">
                                        Možda postoji problem sa backend servisom.<br/>
                                        Kontaktirajte administratora za pomoć.
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default ChatInterface;