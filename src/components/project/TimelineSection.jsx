import { Box, Typography, Divider, Stack, Paper, Avatar, Chip } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { tokens } from '../../theme';
import { useTheme } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import PendingIcon from '@mui/icons-material/Pending';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import NoteIcon from '@mui/icons-material/Note';

const mockTimelineEvents = [
    {
        id: 1,
        date: '2024-03-19T10:00:00',
        type: 'create',
        taskName: 'Implementacija login stranice',
        user: { id: 1, name: 'Marko Marković', color: '#ff5722' },
        description: 'Task je kreiran'
    },
    {
        id: 2,
        date: '2024-03-19T11:30:00',
        type: 'status_change',
        taskName: 'Implementacija login stranice',
        user: { id: 1, name: 'Marko Marković', color: '#ff5722' },
        oldStatus: 'active',
        newStatus: 'in_progress',
        description: 'Status promenjen u "U toku"'
    },
    {
        id: 3,
        date: '2024-03-19T13:15:00',
        type: 'assign',
        taskName: 'Implementacija login stranice',
        user: { id: 2, name: 'Ana Anić', color: '#2196f3' },
        assignedTo: { id: 2, name: 'Ana Anić', color: '#2196f3' },
        description: 'Task dodeljen korisniku Ana Anić'
    },
    {
        id: 4,
        date: '2024-03-19T14:45:00',
        type: 'file_add',
        taskName: 'Implementacija login stranice',
        user: { id: 2, name: 'Ana Anić', color: '#2196f3' },
        fileName: 'login-design.pdf',
        description: 'Dodat fajl "login-design.pdf"'
    },
    {
        id: 5,
        date: '2024-03-19T16:20:00',
        type: 'note_add',
        taskName: 'Implementacija login stranice',
        user: { id: 2, name: 'Ana Anić', color: '#2196f3' },
        noteContent: 'Dodata validacija email adrese',
        description: 'Dodata napomena: "Dodata validacija email adrese"'
    },
    {
        id: 6,
        date: '2024-03-19T17:00:00',
        type: 'status_change',
        taskName: 'Implementacija login stranice',
        user: { id: 2, name: 'Ana Anić', color: '#2196f3' },
        oldStatus: 'in_progress',
        newStatus: 'done',
        description: 'Status promenjen u "Završeno"'
    }
];

const getEventIcon = (type) => {
    switch (type) {
        case 'create':
            return <EditIcon />;
        case 'status_change':
            return <CheckCircleIcon />;
        case 'assign':
            return <PersonIcon />;
        case 'file_add':
            return <AttachFileIcon />;
        case 'note_add':
            return <NoteIcon />;
        default:
            return <FiberManualRecordIcon />;
    }
};

const getStatusColor = (status) => {
    switch (status) {
        case 'active':
            return '#4caf50';
        case 'in_progress':
            return '#2196f3';
        case 'done':
            return '#4caf50';
        case 'blocked':
            return '#f44336';
        case 'pending':
            return '#ff9800';
        default:
            return '#757575';
    }
};

const TimelineSection = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box sx={{ 
            width: '100%',
            p: 3,
            backgroundColor: colors.primary[400],
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
            <Typography variant="h5" sx={{ 
                color: colors.grey[100],
                mb: 3,
                fontWeight: 'bold'
            }}>
                Istorija aktivnosti
            </Typography>
            {mockTimelineEvents.map((event, index) => (
                <Stack
                    key={event.id}
                    direction="row"
                    spacing={2}
                    sx={{
                        position: 'relative',
                        pb: 4,
                        '&:last-child': { pb: 0 },
                        minHeight: '120px'
                    }}
                >
                    {/* Timeline dot and connector */}
                    <Box sx={{
                        width: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                    }}>
                        <Avatar sx={{
                            bgcolor: colors.primary[500],
                            width: 32,
                            height: 32,
                            border: `2px solid ${colors.grey[700]}`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            '& svg': {
                                color: theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]
                            },
                            position: 'relative',
                            zIndex: 2
                        }}>
                            {getEventIcon(event.type)}
                        </Avatar>
                        {index !== mockTimelineEvents.length - 1 && (
                            <Divider
                                orientation="vertical"
                                flexItem
                                sx={{
                                    borderLeftWidth: 2,
                                    borderColor: colors.grey[700],
                                    position: 'absolute',
                                    top: '16px',
                                    bottom: '-32px',
                                    left: '10px',
                                    zIndex: 1
                                }}
                            />
                        )}
                    </Box>

                    {/* Event content */}
                    <Paper sx={{ 
                        flexGrow: 1,
                        p: 2,
                        backgroundColor: colors.primary[500],
                        borderRadius: 2,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="h6" sx={{ color: colors.grey[100] }}>
                                {event.taskName}
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.grey[300] }}>
                                {new Date(event.date).toLocaleString()}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Avatar sx={{ 
                                width: 24, 
                                height: 24,
                                bgcolor: event.user.color
                            }}>
                                {event.user.name[0]}
                            </Avatar>
                            <Typography variant="body2" sx={{ color: colors.grey[100] }}>
                                {event.user.name}
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: colors.grey[300] }}>
                            {event.description}
                        </Typography>
                        {event.type === 'status_change' && (
                            <Box display="flex" gap={1} mt={1}>
                                <Chip 
                                    label={event.oldStatus.replace('_', ' ')} 
                                    size="small"
                                    sx={{ 
                                        backgroundColor: getStatusColor(event.oldStatus),
                                        color: colors.grey[100]
                                    }}
                                />
                                <Typography sx={{ color: colors.grey[300] }}>→</Typography>
                                <Chip 
                                    label={event.newStatus.replace('_', ' ')} 
                                    size="small"
                                    sx={{ 
                                        backgroundColor: getStatusColor(event.newStatus),
                                        color: colors.grey[100]
                                    }}
                                />
                            </Box>
                        )}
                    </Paper>
                </Stack>
            ))}
        </Box>
    );
};

export default TimelineSection;