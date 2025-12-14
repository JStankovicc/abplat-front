import React, { useState, useEffect } from "react";
import { 
    Box, 
    Typography, 
    useTheme, 
    Card, 
    CardContent, 
    Avatar, 
    Chip, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemAvatar,
    Divider,
    CircularProgress,
    Alert,
    Badge,
    Paper,
    LinearProgress
} from "@mui/material";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MessageIcon from "@mui/icons-material/Message";
import TaskIcon from "@mui/icons-material/Task";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FolderIcon from "@mui/icons-material/Folder";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import chatService from "../../services/chatService";
import Shimmer from "../../components/Shimmer";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import LineChart from "../../components/LineChart";
import BarChart from "../../components/BarChart";
import PieChart from "../../components/PieChart";
import GeographyChart from "../../components/GeographyChart";
import {
    Person as PersonIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Construction as ConstructionIcon
} from "@mui/icons-material";
import { API_BASE_URL } from "../../config/apiConfig";

// Helper funkcija za auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
};

// Mock podaci za obaveštenja
const mockNotifications = [
    {
        id: 1,
        type: "task",
        title: "Nov zadatak vam je dodeljen",
        description: "Implementacija dashboard-a za projekat ABPLAT",
        time: "Pre 5 minuta",
        read: false,
        icon: "task"
    },
    {
        id: 2,
        type: "project",
        title: "Projekat ažuriran",
        description: "Kosta Marković je ažurirao projekat 'Website Redesign'",
        time: "Pre 1 sat",
        read: false,
        icon: "project"
    },
    {
        id: 3,
        type: "message",
        title: "Nova poruka od Ognjen Gašić",
        description: "Da li možemo da razgovaramo o budžetu projekta?",
        time: "Pre 2 sata",
        read: true,
        icon: "message"
    },
    {
        id: 4,
        type: "deadline",
        title: "Rok ističe uskoro",
        description: "Završetak faze 2 projekta - još 2 dana",
        time: "Pre 3 sata",
        read: true,
        icon: "deadline"
    },
    {
        id: 5,
        type: "task",
        title: "Zadatak završen",
        description: "Jovan Stanković je završio zadatak 'API integracija'",
        time: "Juče",
        read: true,
        icon: "task"
    }
];

const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    
    const [projects, setProjects] = useState([]);
    const [projectTasks, setProjectTasks] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastMessage, setLastMessage] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [notifications] = useState(mockNotifications);

    // Dohvati sve projekte korisnika
    const fetchProjects = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/project/allByCompany`, {
                headers: getAuthHeaders()
            });
            setProjects(response.data);
            
            // Dohvati taskove za svaki projekat
            const tasksPromises = response.data.map(async (project) => {
                try {
                    const tasksResponse = await axios.get(`${API_BASE_URL}/project/tasks/my`, {
                        headers: getAuthHeaders(),
                        params: { projectId: project.id }
                    });
                    return { projectId: project.id, tasks: tasksResponse.data };
                } catch (error) {
                    console.error(`Failed to fetch tasks for project ${project.id}:`, error);
                    return { projectId: project.id, tasks: [] };
                }
            });
            
            const tasksResults = await Promise.all(tasksPromises);
            const tasksMap = {};
            tasksResults.forEach(result => {
                tasksMap[result.projectId] = result.tasks;
            });
            setProjectTasks(tasksMap);
            
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            setError('Greška pri učitavanju projekata');
        } finally {
            setLoading(false);
        }
    };

    // Dohvati poslednju poruku iz chat-a
    const fetchLastMessage = async () => {
        try {
            console.log('🔍 Dashboard: Fetching last message...');
            
            // Pokušaj da dohvatiš podatke
            let conversationsData = [];
            let contactsData = [];
            
            try {
                conversationsData = await chatService.getInbox();
                console.log('📧 Dashboard: Conversations data:', conversationsData);
            } catch (inboxError) {
                console.error('❌ Dashboard: Failed to fetch inbox:', inboxError);
                conversationsData = [];
            }
            
            try {
                contactsData = await chatService.getAllContacts();
                console.log('👥 Dashboard: Contacts data:', contactsData);
            } catch (contactsError) {
                console.error('❌ Dashboard: Failed to fetch contacts:', contactsError);
                contactsData = [];
            }
            
            setConversations(conversationsData);
            setContacts(contactsData);
            
            if (conversationsData && conversationsData.length > 0) {
                console.log('✅ Dashboard: Found conversations, processing...');
                
                // Pronađi konverzaciju sa najnovijom porukom
                const mostRecentConversation = conversationsData.reduce((prev, current) => {
                    const prevTime = prev.lastMessageAt ? new Date(prev.lastMessageAt) : new Date(0);
                    const currentTime = current.lastMessageAt ? new Date(current.lastMessageAt) : new Date(0);
                    return currentTime > prevTime ? current : prev;
                });
                
                console.log('📨 Dashboard: Most recent conversation:', mostRecentConversation);
                
                // Formatiraj za prikaz
                try {
                    const formattedConversation = await chatService.formatConversationForDisplay(mostRecentConversation, contactsData);
                    
                    console.log('🎨 Dashboard: Formatted conversation:', formattedConversation);
                    
                    // Ako nema lastMessage ili je prazan, učitaj najnoviju poruku direktno
                    let lastMessageContent = formattedConversation.lastMessage;
                    let lastMessageTime = formattedConversation.lastMessageTime;
                    
                    if (!lastMessageContent || lastMessageContent.trim() === '') {
                        try {
                            console.log('📥 Dashboard: Loading last message directly from API...');
                            const messagesData = await chatService.getMessages(mostRecentConversation.conversationId, 0, 10);
                            if (messagesData.content && messagesData.content.length > 0) {
                                // Sortiraj poruke po datumu (najnovije prvo) i uzmi prvu
                                const sortedMessages = [...messagesData.content].sort((a, b) => {
                                    const dateA = new Date(a.createdAt).getTime();
                                    const dateB = new Date(b.createdAt).getTime();
                                    return dateB - dateA; // Najnovije prvo
                                });
                                const lastMessage = sortedMessages[0];
                                lastMessageContent = lastMessage.content || '';
                                lastMessageTime = lastMessage.createdAt ? new Date(lastMessage.createdAt) : lastMessageTime;
                                console.log('✅ Dashboard: Loaded last message from API:', lastMessageContent);
                            }
                        } catch (error) {
                            console.error('❌ Dashboard: Error loading last message:', error);
                        }
                    }
                    
                    setLastMessage({
                        conversationId: formattedConversation.conversationId,
                        sender: formattedConversation.name,
                        content: lastMessageContent || "Pozdrav!",
                        timestamp: lastMessageTime ? 
                            lastMessageTime.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' }) : 
                            '',
                        unread: formattedConversation.unreadCount > 0,
                        unreadCount: formattedConversation.unreadCount
                    });
                    
                    console.log('💾 Dashboard: Set last message:', {
                        sender: formattedConversation.name,
                        content: lastMessageContent,
                        timestamp: lastMessageTime
                    });
                } catch (formatError) {
                    console.error('❌ Dashboard: Failed to format conversation:', formatError);
                    // Fallback - koristi raw podatke
                    setLastMessage({
                        conversationId: mostRecentConversation.conversationId,
                        sender: mostRecentConversation.name || 'Nepoznat korisnik',
                        content: mostRecentConversation.lastMessagePreview || "Pozdrav!",
                        timestamp: mostRecentConversation.lastMessageAt ? 
                            new Date(mostRecentConversation.lastMessageAt).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' }) : 
                            '',
                        unread: (mostRecentConversation.unreadCount || 0) > 0,
                        unreadCount: mostRecentConversation.unreadCount || 0
                    });
                }
            } else {
                console.log('❌ Dashboard: No conversations found');
                setLastMessage(null);
            }
        } catch (error) {
            console.error('❌ Dashboard: Failed to fetch last message:', error);
            setLastMessage(null);
        }
    };

    useEffect(() => {
        console.log('🚀 Dashboard: Component mounted, starting data fetch...');
        fetchProjects();
        fetchLastMessage();
    }, []);

    // Debug log za lastMessage promene
    useEffect(() => {
        console.log('📊 Dashboard: lastMessage state changed:', lastMessage);
    }, [lastMessage]);

    // Debug log za conversations promene
    useEffect(() => {
        console.log('💬 Dashboard: conversations state changed:', conversations);
    }, [conversations]);

    const handleProjectClick = (projectId) => {
        navigate(`/project/${projectId}`);
    };

    const handleInboxClick = () => {
        navigate('/messages');
    };

    const getStatusColor = (statusId) => {
        switch(statusId) {
            case 1: return 'warning';
            case 2: return 'primary';
            case 3: return 'success';
            default: return 'secondary';
        }
    };

    const getStatusName = (statusId) => {
        switch(statusId) {
            case 1: return 'Čekanje';
            case 2: return 'U toku';
            case 3: return 'Završeno';
            default: return 'Nepoznat';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Danas';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Juče';
        } else {
            return date.toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit' });
        }
    };

    if (loading) {
        return (
            <Box 
                m="20px" 
                height="calc(100vh - 120px)" 
                overflow="hidden"
                display="flex"
                justifyContent="center"
            >
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(12, 1fr)"
                    gridTemplateRows="repeat(5, 1fr)"
                    gap="15px"
                    height="100%"
                    width="75%"
                    overflow="hidden"
                >
                    {/* Shimmer za obaveštenja */}
                    <Paper
                        elevation={3}
                        sx={{
                            gridColumn: "span 8",
                            gridRow: "span 3",
                            backgroundColor: colors.primary[400],
                            borderRadius: "12px",
                            p: "12px",
                        }}
                    >
                        <Box display="flex" alignItems="center" mb="10px">
                            <Shimmer width="40px" height="40px" borderRadius="50%" sx={{ mr: 2 }} />
                            <Shimmer width="150px" height="24px" />
                        </Box>
                        <Box textAlign="center" py={2}>
                            <Shimmer width="80px" height="80px" borderRadius="50%" sx={{ mx: 'auto', mb: 2 }} />
                            <Shimmer width="200px" height="20px" sx={{ mx: 'auto' }} />
                        </Box>
                    </Paper>

                    {/* Shimmer za inbox */}
                    <Paper
                        elevation={3}
                        sx={{
                            gridColumn: "span 4",
                            gridRow: "span 3",
                            backgroundColor: colors.primary[400],
                            borderRadius: "12px",
                            p: "12px",
                        }}
                    >
                        <Box display="flex" alignItems="center" mb="10px">
                            <Shimmer width="40px" height="40px" borderRadius="50%" sx={{ mr: 2 }} />
                            <Shimmer width="120px" height="20px" />
                        </Box>
                        <Box display="flex" alignItems="center" mb="12px">
                            <Shimmer width="36px" height="36px" borderRadius="50%" sx={{ mr: 2 }} />
                            <Box flex={1}>
                                <Shimmer width="100px" height="16px" sx={{ mb: 1 }} />
                                <Shimmer width="60px" height="12px" />
                            </Box>
                        </Box>
                        <Shimmer width="100%" height="40px" sx={{ mb: 2 }} />
                        <Shimmer width="80px" height="12px" />
                    </Paper>

                    {/* Shimmer za projekte */}
                    {[1, 2, 3].map((i) => (
                        <Paper
                            key={i}
                            elevation={3}
                            sx={{
                                gridColumn: "span 4",
                                gridRow: "span 1",
                                backgroundColor: colors.primary[400],
                                borderRadius: "12px",
                                p: "12px",
                            }}
                        >
                            <Box display="flex" alignItems="center" mb="8px">
                                <Shimmer width="32px" height="32px" borderRadius="50%" sx={{ mr: 1.5 }} />
                                <Box flex={1}>
                                    <Shimmer width="80px" height="14px" sx={{ mb: 0.5 }} />
                                    <Shimmer width="60px" height="10px" />
                                </Box>
                            </Box>
                            <Shimmer width="100%" height="4px" sx={{ mb: 1 }} />
                            <Box sx={{ maxHeight: '120px', overflowY: 'auto' }}>
                                {[1, 2, 3].map((i) => (
                                    <Box key={i} display="flex" alignItems="center" mb={0.5}>
                                        <Shimmer width="20px" height="20px" borderRadius="50%" sx={{ mr: 1 }} />
                                        <Box flex={1}>
                                            <Shimmer width="100px" height="12px" sx={{ mb: 0.5 }} />
                                            <Shimmer width="60px" height="10px" />
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                            <Box mt={1} textAlign="center">
                                <Shimmer width="120px" height="10px" sx={{ mx: 'auto' }} />
                            </Box>
                        </Paper>
                    ))}
                </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Box m="20px">
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box 
            m="20px" 
            height="calc(100vh - 120px)" 
            overflow="hidden"
            display="flex"
            justifyContent="center"
        >
            {/* GRID LAYOUT */}
            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridTemplateRows="repeat(5, 1fr)"
                gap="15px"
                height="100%"
                width="75%"
                overflow="hidden"
            >
                {/* OBAVEŠTENJA SEKCIJA - NAJVECI */}
                <Paper
                    elevation={3}
                    sx={{
                        gridColumn: "span 8",
                        gridRow: "span 3",
                        backgroundColor: colors.primary[400],
                        borderRadius: "12px",
                        p: "15px",
                        background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
                        overflow: 'hidden',
                        position: 'relative',
                        height: '100%'
                    }}
                >
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb="15px">
                        <Box display="flex" alignItems="center">
                            <Box
                                sx={{
                                    backgroundColor: colors.blueAccent[500],
                                    borderRadius: '50%',
                                    p: 1,
                                    mr: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <NotificationsIcon sx={{ color: colors.grey[100], fontSize: '1.2rem' }} />
                            </Box>
                            <Typography variant="h6" fontWeight="600" color={colors.grey[100]}>
                                Obaveštenja
                            </Typography>
                        </Box>
                        {notifications.filter(n => !n.read).length > 0 && (
                            <Badge 
                                badgeContent={notifications.filter(n => !n.read).length} 
                                color="error"
                            />
                        )}
                    </Box>
                    
                    <Box 
                        sx={{ 
                            height: 'calc(100% - 60px)',
                            overflowY: 'auto',
                            '&::-webkit-scrollbar': {
                                width: '6px',
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                borderRadius: '3px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                borderRadius: '3px',
                                '&:hover': {
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                },
                            },
                        }}
                    >
                        <List sx={{ p: 0 }}>
                            {notifications.map((notification, index) => (
                                <React.Fragment key={notification.id}>
                                    <ListItem 
                                        sx={{ 
                                            p: 2,
                                            borderRadius: '8px',
                                            mb: 1,
                                            backgroundColor: notification.read ? 'transparent' : `${colors.blueAccent[700]}40`,
                                            transition: 'all 0.2s ease',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: colors.primary[300],
                                                transform: 'translateX(5px)'
                                            }
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar 
                                                sx={{ 
                                                    bgcolor: notification.type === 'task' ? colors.greenAccent[500] :
                                                           notification.type === 'project' ? colors.blueAccent[500] :
                                                           notification.type === 'message' ? colors.primary[300] :
                                                           colors.redAccent[500],
                                                    width: 40,
                                                    height: 40
                                                }}
                                            >
                                                {notification.type === 'task' && <TaskIcon />}
                                                {notification.type === 'project' && <FolderIcon />}
                                                {notification.type === 'message' && <MessageIcon />}
                                                {notification.type === 'deadline' && <AccessTimeIcon />}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                                    <Typography 
                                                        variant="subtitle1" 
                                                        color={colors.grey[100]}
                                                        fontWeight={notification.read ? 400 : 600}
                                                        sx={{ fontSize: '0.95rem' }}
                                                    >
                                                        {notification.title}
                                                    </Typography>
                                                    {!notification.read && (
                                                        <Box
                                                            sx={{
                                                                width: 8,
                                                                height: 8,
                                                                borderRadius: '50%',
                                                                backgroundColor: colors.redAccent[500],
                                                                ml: 1
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography 
                                                        variant="body2" 
                                                        color={colors.grey[300]}
                                                        sx={{ 
                                                            mb: 0.5,
                                                            fontSize: '0.85rem',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical'
                                                        }}
                                                    >
                                                        {notification.description}
                                                    </Typography>
                                                    <Typography 
                                                        variant="caption" 
                                                        color={colors.grey[400]}
                                                        sx={{ fontSize: '0.75rem' }}
                                                    >
                                                        {notification.time}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < notifications.length - 1 && (
                                        <Divider sx={{ backgroundColor: colors.grey[700], opacity: 0.3 }} />
                                    )}
                                </React.Fragment>
                            ))}
                        </List>
                    </Box>
                </Paper>

                {/* MINI INBOX SEKCIJA */}
                <Paper
                    elevation={3}
                    sx={{
                        gridColumn: "span 4",
                        gridRow: "span 3",
                        backgroundColor: colors.primary[400],
                        borderRadius: "12px",
                        p: "15px",
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                            backgroundColor: colors.primary[300],
                            transform: 'translateY(-2px)',
                            boxShadow: 6
                        },
                        background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`
                    }}
                    onClick={handleInboxClick}
                >
                    <Box display="flex" alignItems="center" mb="10px">
                        <Box
                            sx={{
                                backgroundColor: colors.greenAccent[500],
                                borderRadius: '50%',
                                p: 1,
                                mr: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <MessageIcon sx={{ color: colors.grey[100], fontSize: '1.2rem' }} />
                        </Box>
                        <Typography variant="h6" fontWeight="600" color={colors.grey[100]}>
                            Poslednje poruke
                        </Typography>
                        {lastMessage?.unreadCount > 0 && (
                            <Badge 
                                badgeContent={lastMessage.unreadCount} 
                                color="error" 
                                sx={{ ml: 'auto' }}
                            />
                        )}
                    </Box>
                    
                    {lastMessage ? (
                        <Box>
                            <Box display="flex" alignItems="center" mb="8px">
                                <Avatar 
                                    sx={{ 
                                        bgcolor: colors.greenAccent[500], 
                                        width: 36, 
                                        height: 36, 
                                        mr: 2,
                                        fontSize: '0.9rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {lastMessage.sender[0]}
                                </Avatar>
                                <Box flex={1}>
                                    <Typography variant="subtitle1" color={colors.grey[100]} fontWeight="500">
                                        {lastMessage.sender}
                                    </Typography>
                                    <Box display="flex" alignItems="center">
                                        <AccessTimeIcon sx={{ fontSize: '0.8rem', mr: 0.5, color: colors.grey[300] }} />
                                        <Typography variant="caption" color={colors.grey[300]}>
                                            {lastMessage.timestamp}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Typography 
                                variant="body2" 
                                color={colors.grey[200]}
                                sx={{ 
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    lineHeight: 1.4
                                }}
                            >
                                {lastMessage.content}
                            </Typography>
                            <Box 
                                mt={2} 
                                display="flex" 
                                alignItems="center" 
                                justifyContent="space-between"
                                onClick={handleInboxClick}
                                sx={{ cursor: 'pointer' }}
                            >
                                <Typography variant="caption" color={colors.greenAccent[500]} fontWeight="500">
                                    Kliknite da otvorite inbox →
                                </Typography>
                                {lastMessage.unread && (
                                    <Chip 
                                        label="Nova" 
                                        size="small" 
                                        color="error" 
                                        sx={{ fontSize: '0.7rem', height: '20px' }}
                                    />
                                )}
                            </Box>
                        </Box>
                    ) : (
                        <Box textAlign="center" py={2}>
                            <MessageIcon sx={{ fontSize: '3rem', color: colors.grey[400], mb: 2 }} />
                            <Typography color={colors.grey[300]} variant="body1">
                                Pozdrav!
                            </Typography>
                            <Box mt={2}>
                                <Shimmer width="120px" height="12px" sx={{ mx: 'auto', mb: 1 }} />
                                <Shimmer width="80px" height="10px" sx={{ mx: 'auto', mb: 1 }} />
                                <Shimmer width="100px" height="10px" sx={{ mx: 'auto' }} />
                            </Box>
                        </Box>
                    )}
                </Paper>

                {/* PROJEKTI SEKCIJE - MALE */}
                {projects.slice(0, 3).map((project, index) => {
                    const projectTasksList = projectTasks[project.id] || [];
                    const recentTasks = projectTasksList.slice(0, 2);
                    const completedTasks = projectTasksList.filter(task => task.statusId === 3).length;
                    const totalTasks = projectTasksList.length;
                    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                    
                    return (
                        <Paper
                            key={project.id}
                            elevation={3}
                            sx={{
                                gridColumn: "span 4",
                                gridRow: "span 1",
                                backgroundColor: colors.primary[400],
                                borderRadius: "12px",
                                p: "12px",
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': { 
                                    backgroundColor: colors.primary[300],
                                    transform: 'translateY(-2px)',
                                    boxShadow: 6
                                },
                                background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`
                            }}
                            onClick={() => handleProjectClick(project.id)}
                        >
                            <Box display="flex" alignItems="center" mb="8px">
                                <Box
                                    sx={{
                                        backgroundColor: colors.greenAccent[500],
                                        borderRadius: '50%',
                                        p: 0.8,
                                        mr: 1.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <FolderIcon sx={{ color: colors.grey[100], fontSize: '1rem' }} />
                                </Box>
                                <Box flex={1}>
                                    <Typography variant="subtitle1" fontWeight="600" color={colors.grey[100]} sx={{ fontSize: '0.9rem' }}>
                                        {project.name}
                                    </Typography>
                                    <Typography variant="caption" color={colors.grey[300]} sx={{ fontSize: '0.7rem' }}>
                                        {totalTasks} zadataka
                                    </Typography>
                                </Box>
                            </Box>
                            
                            {/* Progress bar */}
                            {totalTasks > 0 && (
                                <Box mb="6px">
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={progressPercentage}
                                        sx={{
                                            height: 4,
                                            borderRadius: 2,
                                            backgroundColor: colors.grey[700],
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: colors.greenAccent[500],
                                                borderRadius: 2
                                            }
                                        }}
                                    />
                                </Box>
                            )}
                            
                            {/* Taskovi sa skrolom */}
                            <Box 
                                sx={{ 
                                    maxHeight: '120px',
                                    overflowY: 'auto',
                                    '&::-webkit-scrollbar': {
                                        width: '4px',
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        backgroundColor: 'rgba(0,0,0,0.1)',
                                        borderRadius: '2px',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                        borderRadius: '2px',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                        },
                                    },
                                }}
                            >
                                {projectTasksList.length > 0 ? (
                                    <List dense sx={{ p: 0 }}>
                                        {projectTasksList.map((task) => (
                                            <ListItem key={task.id} sx={{ p: 0, mb: 0.5 }}>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ 
                                                        bgcolor: colors.greenAccent[500], 
                                                        width: 20, 
                                                        height: 20,
                                                        fontSize: '0.6rem'
                                                    }}>
                                                        <TaskIcon sx={{ fontSize: '0.6rem' }} />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Typography 
                                                            variant="body2" 
                                                            color={colors.grey[100]}
                                                            sx={{ 
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                fontWeight: 500,
                                                                fontSize: '0.7rem'
                                                            }}
                                                        >
                                                            {task.name}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Box display="flex" alignItems="center" gap={0.5}>
                                                            <Chip
                                                                label={getStatusName(task.statusId)}
                                                                size="small"
                                                                color={getStatusColor(task.statusId)}
                                                                sx={{ fontSize: '0.6rem', height: '14px' }}
                                                            />
                                                            {task.dateDue && (
                                                                <Typography variant="caption" color={colors.grey[400]} sx={{ fontSize: '0.6rem' }}>
                                                                    {formatDate(task.dateDue)}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Box textAlign="center" py={1}>
                                        <Typography color={colors.grey[400]} variant="body2" sx={{ fontSize: '0.7rem' }}>
                                            Nema zadataka
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                            
                            {/* Dugme za otvaranje projekta */}
                            <Box mt={1} textAlign="center">
                                <Typography variant="caption" color={colors.greenAccent[500]} fontWeight="500" sx={{ fontSize: '0.7rem' }}>
                                    Kliknite da otvorite projekat →
                                </Typography>
                            </Box>
                        </Paper>
                    );
                })}
            </Box>
        </Box>
    );
};

export default Dashboard;