import { useState, useEffect } from "react";
import { Card, CardContent, Typography, List, ListItem, ListItemText, Chip, CircularProgress, Alert, Button, Box } from "@mui/material";
import { Task as TaskIcon } from "@mui/icons-material";
import axios from "axios";
import { useParams } from "react-router-dom";
import { tokens } from "../../theme";

// API konstante
const API_BASE_URL = "http://3.73.118.83:8080/api/v1/project";

// Helper funkcija za auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
};

const MyTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { projectId } = useParams();

    // API funkcije
    const fetchMyTasks = async () => {
        try {
            setLoading(true);
            setError(null);
            
            if (!projectId) {
                console.error('Nema projectId u URL-u');
                setError('Nema ID projekta');
                return;
            }
            
            const response = await axios.get(`${API_BASE_URL}/tasks/my`, {
                headers: getAuthHeaders(),
                params: {
                    projectId: projectId
                }
            });
            
            // Mapiranje ProjectTask objekata u jednostavan format
            const mappedTasks = response.data.map((task) => ({
                id: task.id,
                name: task.name,
                description: task.description,
                statusId: task.statusId,
                dateDue: task.dateDue
            }));
            
            setTasks(mappedTasks);
            
        } catch (error) {
            console.error('Failed to fetch my tasks:', error);
            setError('Greška pri učitavanju zadataka');
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    // useEffect za inicijalno učitavanje
    useEffect(() => {
        fetchMyTasks();
    }, [projectId]);

    const getStatusColor = (statusId) => {
        // Mapiranje statusId na boje (pretpostavljamo da su statusId brojevi)
        // Možda će trebati da se prilagodi na osnovu stvarnih statusId vrednosti sa backend-a
        switch(statusId) {
            case 1: // To Do / Čekanje
                return 'warning';
            case 2: // In Progress / U toku
                return 'primary';
            case 3: // Done / Završeno
                return 'success';
            default:
                return 'secondary';
        }
    };

    const getStatusName = (statusId) => {
        // Mapiranje statusId na čitljiv naziv
        switch(statusId) {
            case 1:
                return 'Čekanje';
            case 2:
                return 'U toku';
            case 3:
                return 'Završeno';
            default:
                return 'Nepoznat';
        }
    };

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        <TaskIcon sx={{ mr: 1 }} /> Moji zadaci
                    </span>
                    <Button
                        size="small"
                        onClick={() => fetchMyTasks()}
                        disabled={loading}
                        sx={{ minWidth: 'auto', p: 0.5 }}
                    >
                        {loading ? <CircularProgress size={16} /> : "↻"}
                    </Button>
                </Typography>

                {/* Error Alert */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2, fontSize: '0.8rem' }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {/* Loading indicator */}
                {loading && !error && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                        <CircularProgress size={24} />
                    </div>
                )}

                <List 
                    dense
                    sx={{
                        maxHeight: tasks.length > 2 ? '200px' : 'none',
                        overflowY: tasks.length > 2 ? 'auto' : 'visible',
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
                    {tasks.map(task => (
                        <ListItem key={task.id} sx={{ py: 1, px: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
                            <ListItemText
                                primary={task.name}
                                secondary={task.description}
                                sx={{ width: '100%' }}
                            />
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px', mt: 1 }}>
                                <Chip
                                    label={getStatusName(task.statusId)}
                                    size="small"
                                    color={getStatusColor(task.statusId)}
                                />
                                {task.dateDue && (
                                    <Chip
                                        label={new Date(task.dateDue).toLocaleDateString('sr-RS')}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontSize: '0.7rem' }}
                                    />
                                )}
                            </Box>
                        </ListItem>
                    ))}
                    {!loading && tasks.length === 0 && !error && (
                        <ListItem>
                            <ListItemText 
                                primary="Nema zadataka"
                                secondary="Trenutno nemate dodeljene zadatke"
                                sx={{ textAlign: 'center', color: 'text.secondary' }}
                            />
                        </ListItem>
                    )}
                </List>
            </CardContent>
        </Card>
    );
};

export default MyTasks;