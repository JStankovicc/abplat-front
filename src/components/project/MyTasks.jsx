import { useState, useEffect } from "react";
import { Card, CardContent, Typography, List, ListItem, ListItemText, Chip, CircularProgress, Alert, Button } from "@mui/material";
import { Task as TaskIcon } from "@mui/icons-material";
import axios from "axios";
import { tokens } from "../../theme";

// API konstante
const API_BASE_URL = "http://localhost:8080/api/v1/project";

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

    // API funkcije
    const fetchMyTasks = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.get(`${API_BASE_URL}/tasks/my`, {
                headers: getAuthHeaders()
            });
            
            // Transformišemo ProjectTask objekte u format koji komponenta očekuje
            const transformedTasks = response.data.map((task) => ({
                id: task.id,
                title: task.name,
                description: task.description,
                status: task.status,
                priority: task.priority ? task.priority.toLowerCase() : 'medium',
                dateDue: task.dateDue,
                user: task.user
            }));
            
            setTasks(transformedTasks);
            
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
    }, []);

    const getStatusColor = (status) => {
        // Mapiranje različitih statusa na boje
        const statusLower = status?.toLowerCase() || '';
        if (statusLower.includes('u toku') || statusLower.includes('progress') || statusLower.includes('doing')) {
            return 'primary';
        }
        if (statusLower.includes('završeno') || statusLower.includes('completed') || statusLower.includes('done')) {
            return 'success';
        }
        if (statusLower.includes('čekanje') || statusLower.includes('waiting') || statusLower.includes('todo')) {
            return 'warning';
        }
        return 'secondary';
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'info';
            default: return 'default';
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

                <List dense>
                    {tasks.map(task => (
                        <ListItem key={task.id} sx={{ py: 1, px: 0 }}>
                            <ListItemText
                                primary={task.title}
                                secondary={
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                                        <Chip
                                            label={task.status}
                                            size="small"
                                            color={getStatusColor(task.status)}
                                        />
                                        {task.priority && (
                                            <Chip
                                                label={task.priority}
                                                size="small"
                                                color={getPriorityColor(task.priority)}
                                                variant="outlined"
                                            />
                                        )}
                                        {task.dateDue && (
                                            <Chip
                                                label={new Date(task.dateDue).toLocaleDateString('sr-RS')}
                                                size="small"
                                                variant="outlined"
                                                sx={{ fontSize: '0.7rem' }}
                                            />
                                        )}
                                    </div>
                                }
                            />
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