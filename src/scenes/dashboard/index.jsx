import { useState, useEffect } from "react";
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
import ConstructionIcon from "@mui/icons-material/Construction";
import chatService from "../../services/chatService";
import Shimmer from "../../components/Shimmer";

// API konstante
const API_BASE_URL = "http://3.73.118.83:8080/api/v1/project";
const COMPANY_API_BASE_URL = "http://3.73.118.83:8080/api/v1/company";

// Helper funkcija za auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
};

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

    // Dohvati sve projekte korisnika
    const fetchProjects = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/allByCompany`, {
                headers: getAuthHeaders()
            });
            setProjects(response.data);
            
            // Dohvati taskove za svaki projekat
            const tasksPromises = response.data.map(async (project) => {
                try {
                    const tasksResponse = await axios.get(`${API_BASE_URL}/tasks/my`, {
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
                    
                    setLastMessage({
                        conversationId: formattedConversation.conversationId,
                        sender: formattedConversation.name,
                        content: formattedConversation.lastMessage || "Nema poruka",
                        timestamp: formattedConversation.lastMessageTime ? 
                            formattedConversation.lastMessageTime.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' }) : 
                            '',
                        unread: formattedConversation.unreadCount > 0,
                        unreadCount: formattedConversation.unreadCount
                    });
                    
                    console.log('💾 Dashboard: Set last message:', {
                        sender: formattedConversation.name,
                        content: formattedConversation.lastMessage,
                        timestamp: formattedConversation.lastMessageTime
                    });
                } catch (formatError) {
                    console.error('❌ Dashboard: Failed to format conversation:', formatError);
                    // Fallback - koristi raw podatke
                    setLastMessage({
                        conversationId: mostRecentConversation.conversationId,
                        sender: mostRecentConversation.name || 'Nepoznat korisnik',
                        content: mostRecentConversation.lastMessagePreview || "Nema poruka",
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
        navigate('/chat');
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
                alignItems="center"
                justifyContent="center"
            >
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(12, 1fr)"
                    gridTemplateRows="repeat(5, 1fr)"
                    gap="15px"
                    height="100%"
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
            alignItems="center"
            justifyContent="center"
        >
            {/* GRID LAYOUT */}
            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridTemplateRows="repeat(5, 1fr)"
                gap="15px"
                height="100%"
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
                        opacity: 0.7,
                        cursor: 'not-allowed',
                        background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
                        border: `2px dashed ${colors.grey[500]}`,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                            transform: 'skewX(-15deg)',
                            animation: 'shimmer 3s infinite',
                        },
                        '@keyframes shimmer': {
                            '0%': { transform: 'translateX(-100%) skewX(-15deg)' },
                            '100%': { transform: 'translateX(200%) skewX(-15deg)' }
                        }
                    }}
                >
                    <Box display="flex" alignItems="center" mb="10px">
                        <Box
                            sx={{
                                backgroundColor: colors.grey[400],
                                borderRadius: '50%',
                                p: 1,
                                mr: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                animation: 'pulse 2s infinite',
                                '@keyframes pulse': {
                                    '0%': { opacity: 0.6 },
                                    '50%': { opacity: 1 },
                                    '100%': { opacity: 0.6 }
                                }
                            }}
                        >
                            <ConstructionIcon sx={{ color: colors.grey[100], fontSize: '1.2rem' }} />
                        </Box>
                        <Typography variant="h6" fontWeight="600" color={colors.grey[400]}>
                            Obaveštenja
                        </Typography>
                        <Chip 
                            label="U RAZVOJU" 
                            size="small" 
                            color="warning" 
                            sx={{ 
                                ml: 2, 
                                fontSize: '0.7rem', 
                                height: '20px',
                                animation: 'blink 1.5s infinite',
                                '@keyframes blink': {
                                    '0%': { opacity: 1 },
                                    '50%': { opacity: 0.5 },
                                    '100%': { opacity: 1 }
                                }
                            }} 
                        />
                    </Box>
                    
                    <Box textAlign="center" py={2} display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                        <ConstructionIcon sx={{ fontSize: '4rem', color: colors.grey[400], mb: 2 }} />
                        <Typography color={colors.grey[400]} variant="h6" sx={{ fontStyle: 'italic', mb: 1 }}>
                            🚧 Funkcionalnost je trenutno u razvoju
                        </Typography>
                        <Typography color={colors.grey[500]} variant="body1" sx={{ fontStyle: 'italic', textAlign: 'center', maxWidth: '80%' }}>
                            Ova sekcija će biti dostupna uskoro i omogućiće vam praćenje svih važnih obaveštenja, ažuriranja projekata i sistema komunikacije sa timom.
                        </Typography>
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
                            Poslednja poruka
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
                            <Box mt={2} display="flex" alignItems="center" justifyContent="space-between">
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
                                Nema poruka
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