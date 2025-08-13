import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, TextField, IconButton, useTheme, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Divider, Avatar, Checkbox, FormControlLabel, List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, Paper, Chip, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { tokens } from '../../theme';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import NoteIcon from '@mui/icons-material/Note';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

// API konstante
const API_BASE_URL = "http://192.168.1.30:8080/api/v1/project";

// Helper funkcija za auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
};

const mockUsers = [
    { id: 1, firstName: "Marko", lastName: "Marković", color: "#ff5722" },
    { id: 2, firstName: "Ana", lastName: "Anić", color: "#2196f3" },
    { id: 3, firstName: "Jovan", lastName: "Jovanović", color: "#4caf50" },
    { id: 4, firstName: "Milica", lastName: "Milić", color: "#9c27b0" }
];

const KanbanBoard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newTaskInputs, setNewTaskInputs] = useState({});
    const [editingTask, setEditingTask] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [taskDetails, setTaskDetails] = useState({
        content: '',
        description: '',
        assignedUsers: [],
        dueDate: '',
        priority: 'medium',
        status: 'active',
        waitingFor: null,
        files: [],
        notes: []
    });
    const [newNote, setNewNote] = useState('');
    const [waitingForDialogOpen, setWaitingForDialogOpen] = useState(false);
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [editingColumnTitle, setEditingColumnTitle] = useState(null);

    // API funkcije
    const updateProjectTask = async (task, newStatus) => {
        try {
            const taskToUpdate = {
                id: task.originalTask.id,
                name: task.originalTask.name,
                description: task.originalTask.description,
                projectId: task.originalTask.project?.id,
                dateDue: task.originalTask.dateDue,
                priority: task.originalTask.priority,
                status: newStatus,
                userId: task.originalTask.user?.id
            };

            await axios.put(`${API_BASE_URL}/tasks/update`, taskToUpdate, {
                headers: getAuthHeaders()
            });
            
            return taskToUpdate;
        } catch (error) {
            console.error('Failed to update project task:', error);
            throw error;
        }
    };

    const fetchKanbanData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Paralelno dohvatamo task statuse i taskove
            const [statusResponse, tasksResponse] = await Promise.all([
                axios.get(`${API_BASE_URL}/taskStatus/getAll`, {
                    headers: getAuthHeaders()
                }),
                axios.get(`${API_BASE_URL}/tasks/my`, {
                    headers: getAuthHeaders()
                })
            ]);



            // Kreiramo kolone na osnovu task statusa
            const kanbanColumns = statusResponse.data.map(status => ({
                id: status.name.toLowerCase().replace(/\s+/g, '_'),
                title: status.name,
                tasks: []
            }));

            // Distribuiramo taskove po kolonama na osnovu njihovog statusa
            tasksResponse.data.forEach((task, index) => {
                const taskStatus = task.status || (kanbanColumns.length > 0 ? kanbanColumns[0].title : 'To Do');
                
                // Pronađemo odgovarajuću kolonu po nazivu statusa
                const targetColumn = kanbanColumns.find(col => 
                    col.title.toLowerCase() === taskStatus.toLowerCase() ||
                    col.id === taskStatus.toLowerCase().replace(/\s+/g, '_')
                );
                
                const taskItem = {
                    id: `task-${task.id}`,
                    content: task.name,
                    description: task.description || '',
                    assignedUsers: task.users ? task.users.map(u => u.id) : [],
                    dueDate: task.dateDue ? new Date(task.dateDue).toISOString().split('T')[0] : '',
                    priority: task.priority ? task.priority.toLowerCase() : 'medium',
                    status: 'active',
                    files: [],
                    notes: task.notes || [],
                    originalTask: task // Čuvamo originalnu referencu
                };
                
                if (targetColumn) {
                    targetColumn.tasks.push(taskItem);
                } else {
                    // Ako nema odgovarajuće kolone, dodaj u prvu dostupnu
                    if (kanbanColumns.length > 0) {

                        kanbanColumns[0].tasks.push(taskItem);
                    }
                }
            });

            setColumns(kanbanColumns);

        } catch (error) {
            console.error('Failed to fetch kanban data:', error);
            setError('Greška pri učitavanju kanban podataka');
            setColumns([]);
        } finally {
            setLoading(false);
        }
    };

    // useEffect za inicijalno učitavanje
    useEffect(() => {
        fetchKanbanData();
    }, []);

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination } = result;
        
        if (source.droppableId === destination.droppableId) {
            // Samo promena pozicije u istoj koloni
            const newColumns = [...columns];
            const sourceCol = newColumns.find(col => col.id === source.droppableId);
            const copiedTasks = [...sourceCol.tasks];
            const [removed] = copiedTasks.splice(source.index, 1);
            copiedTasks.splice(destination.index, 0, removed);
            
            sourceCol.tasks = copiedTasks;
            setColumns(newColumns);
        } else {
            // Premestanje između različitih kolona - treba da ažuriramo status
            const newColumns = [...columns];
            const sourceCol = newColumns.find(col => col.id === source.droppableId);
            const destCol = newColumns.find(col => col.id === destination.droppableId);
            const task = sourceCol.tasks[source.index];

            // Uklanjamo task iz izvorne kolone
            sourceCol.tasks.splice(source.index, 1);
            
            // Dodajemo task u odredišnu kolonu
            destCol.tasks.splice(destination.index, 0, task);

            // Ažuriraj UI odmah
            setColumns(newColumns);

            // Pošalji API poziv za ažuriranje statusa
            try {
                const newStatus = destCol.title; // Koristimo naziv kolone kao status
                await updateProjectTask(task, newStatus);
                console.log(`Task ${task.content} premešten u ${newStatus}`);
            } catch (error) {
                console.error('Greška pri ažuriranju task statusa:', error);
                setError('Greška pri ažuriranju task statusa');
                
                // Vrati na prethodnu poziciju ako je API poziv neuspešan
                const rollbackColumns = [...columns];
                const rollbackSourceCol = rollbackColumns.find(col => col.id === source.droppableId);
                const rollbackDestCol = rollbackColumns.find(col => col.id === destination.droppableId);
                
                rollbackDestCol.tasks.splice(destination.index, 1);
                rollbackSourceCol.tasks.splice(source.index, 0, task);
                
                setColumns(rollbackColumns);
            }
        }
    };

    const addTask = (columnId) => {
        const taskContent = newTaskInputs[columnId]?.trim();
        if (!taskContent) return;

        const newTask = {
            id: `task-${Date.now()}`,
            content: taskContent,
        };

        setColumns(columns.map(col =>
            col.id === columnId ? {...col, tasks: [...col.tasks, newTask]} : col
        ));
        setNewTaskInputs(prev => ({ ...prev, [columnId]: '' }));
    };

    const addColumn = () => {
        const newColumnId = `column-${Date.now()}`;
        const newColumn = {
            id: newColumnId,
            title: 'Nova kolona',
            tasks: []
        };
        setColumns([...columns, newColumn]);
    };

    const deleteColumn = (columnId) => {
        if (columns.length <= 1) return; // Sprečavamo brisanje poslednje kolone
        setColumns(columns.filter(col => col.id !== columnId));
    };

    const handleInputChange = (columnId, value) => {
        setNewTaskInputs(prev => ({ ...prev, [columnId]: value }));
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setTaskDetails({
            content: task.content,
            description: task.description || '',
            assignedUsers: task.assignedUsers || [],
            dueDate: task.dueDate || '',
            priority: task.priority || 'medium',
            status: task.status || 'active',
            waitingFor: task.waitingFor || null,
            files: task.files || [],
            notes: task.notes || []
        });
        setEditDialogOpen(true);
    };

    const handleSaveEdit = () => {
        if (!taskDetails.content.trim()) return;

        setColumns(columns.map(col => ({
            ...col,
            tasks: col.tasks.map(task =>
                task.id === editingTask.id
                    ? { ...task, ...taskDetails }
                    : task
            )
        })));

        setEditDialogOpen(false);
        setEditingTask(null);
        setTaskDetails({
            content: '',
            description: '',
            assignedUsers: [],
            dueDate: '',
            priority: 'medium',
            status: 'active',
            waitingFor: null,
            files: [],
            notes: []
        });
    };

    const handleUserSelect = (userId) => {
        const users = [...taskDetails.assignedUsers];
        const index = users.indexOf(userId);
        if (index === -1) {
            users.push(userId);
        } else {
            users.splice(index, 1);
        }
        setTaskDetails({ ...taskDetails, assignedUsers: users });
    };

    const handleDeleteTask = (columnId, taskId) => {
        setColumns(columns.map(col =>
            col.id === columnId
                ? {
                    ...col,
                    tasks: col.tasks.filter(task => task.id !== taskId)
                }
                : col
        ));
    };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        const newFiles = files.map(file => ({
            id: Date.now() + Math.random(),
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
            type: file.type.split('/')[0]
        }));
        setTaskDetails({
            ...taskDetails,
            files: [...taskDetails.files, ...newFiles]
        });
    };

    const handleDeleteFile = (fileId) => {
        setTaskDetails({
            ...taskDetails,
            files: taskDetails.files.filter(file => file.id !== fileId)
        });
    };

    const handleAddNote = () => {
        if (!newNote.trim()) return;
        const note = {
            id: Date.now(),
            content: newNote,
            createdAt: new Date().toISOString(),
            createdBy: 1 // Ovde bi trebalo da bude ID trenutnog korisnika
        };
        setTaskDetails({
            ...taskDetails,
            notes: [...taskDetails.notes, note]
        });
        setNewNote('');
    };

    const handleDeleteNote = (noteId) => {
        setTaskDetails({
            ...taskDetails,
            notes: taskDetails.notes.filter(note => note.id !== noteId)
        });
    };

    const getUnfinishedTasks = () => {
        return columns.flatMap(col => 
            col.tasks.filter(task => 
                task.id !== editingTask?.id && 
                task.status !== 'done'
            )
        );
    };

    const handleStatusChange = (newStatus) => {
        if (newStatus === 'pending') {
            setWaitingForDialogOpen(true);
        } else {
            setTaskDetails({
                ...taskDetails,
                status: newStatus,
                waitingFor: null
            });
        }
    };

    const handleWaitingForSelect = (task) => {
        setTaskDetails({
            ...taskDetails,
            status: 'pending',
            waitingFor: task
        });
        setWaitingForDialogOpen(false);
    };

    const handleColumnTitleChange = (columnId, newTitle) => {
        setColumns(columns.map(col =>
            col.id === columnId ? { ...col, title: newTitle } : col
        ));
        setEditingColumnTitle(null);
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Button
                    variant="outlined"
                    onClick={() => fetchKanbanData()}
                    disabled={loading}
                    sx={{
                        borderColor: colors.greenAccent[500],
                        color: colors.greenAccent[500],
                        "&:hover": {
                            borderColor: colors.greenAccent[600],
                            backgroundColor: colors.greenAccent[500] + '20'
                        }
                    }}
                >
                    {loading ? <CircularProgress size={20} /> : "Osveži"}
                </Button>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addColumn}
                    sx={{
                        backgroundColor: colors.greenAccent[500],
                        '&:hover': {
                            backgroundColor: colors.greenAccent[600],
                        }
                    }}
                >
                    Dodaj kolonu
                </Button>
            </Box>

            {/* Loading indicator */}
            {loading && (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            )}

            <DragDropContext onDragEnd={onDragEnd}>
                <Box 
                    display="flex" 
                    gap={2}
                    sx={{
                        overflowX: 'auto',
                        pb: 2,
                        flex: 1,
                        maxWidth: 'calc(100vw - 340px)',
                        '&::-webkit-scrollbar': {
                            height: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: colors.primary[500],
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: colors.primary[300],
                            borderRadius: '4px',
                            '&:hover': {
                                backgroundColor: colors.primary[200],
                            },
                        },
                    }}
                >
                    {columns.map((column) => (
                        <Box
                            key={column.id}
                            sx={{
                                minWidth: '300px',
                                maxWidth: '300px',
                                flex: '0 0 300px',
                                backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[800],
                                borderRadius: 2,
                                p: 2,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Box display="flex" alignItems="center" mb={2}>
                                {editingColumnTitle === column.id ? (
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={column.title}
                                        onChange={(e) => setTaskDetails({...taskDetails, content: e.target.value})}
                                        onBlur={() => setEditingColumnTitle(null)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleColumnTitleChange(column.id, e.target.value);
                                            }
                                        }}
                                        autoFocus
                                        sx={{
                                            "& .MuiInputBase-input": { 
                                                color: colors.grey[100],
                                                fontSize: '1.1rem',
                                                fontWeight: 'bold'
                                            },
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": { borderColor: colors.grey[700] },
                                                "&:hover fieldset": { borderColor: colors.grey[600] }
                                            }
                                        }}
                                    />
                                ) : (
                                    <Typography 
                                        variant="h6" 
                                        color={colors.grey[100]}
                                        sx={{ 
                                            fontWeight: 'bold', 
                                            flex: 1,
                                            cursor: 'pointer',
                                            '&:hover': {
                                                color: colors.greenAccent[500]
                                            }
                                        }}
                                        onClick={() => setEditingColumnTitle(column.id)}
                                    >
                                        {column.title}
                                    </Typography>
                                )}
                                {columns.length > 1 && (
                                    <IconButton
                                        size="small"
                                        onClick={() => deleteColumn(column.id)}
                                        sx={{ color: colors.grey[100] }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </Box>

                            <Droppable droppableId={column.id}>
                                {(provided, snapshot) => (
                                    <Box
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        sx={{
                                            flex: 1,
                                            minHeight: 0,
                                            backgroundColor: snapshot.isDraggingOver ? colors.primary[400] : 'transparent',
                                            transition: 'all 0.2s ease',
                                            p: 1,
                                            borderRadius: 1,
                                            border: snapshot.isDraggingOver ? `2px dashed ${colors.greenAccent[500]}` : 'none',
                                            overflowY: 'auto',
                                            '&::-webkit-scrollbar': {
                                                width: '8px',
                                            },
                                            '&::-webkit-scrollbar-track': {
                                                backgroundColor: colors.primary[500],
                                                borderRadius: '4px',
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                backgroundColor: colors.primary[300],
                                                borderRadius: '4px',
                                                '&:hover': {
                                                    backgroundColor: colors.primary[200],
                                                },
                                            },
                                        }}
                                    >
                                        {column.tasks.map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <Box
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        sx={{
                                                            backgroundColor: snapshot.isDragging ? colors.greenAccent[500] : colors.primary[400],
                                                            p: 2,
                                                            mb: 1,
                                                            borderRadius: 1,
                                                            boxShadow: snapshot.isDragging ? 3 : 1,
                                                            color: colors.grey[100],
                                                            cursor: 'grab',
                                                            transform: snapshot.isDragging ? 'rotate(2deg)' : 'none',
                                                            transition: 'all 0.3s ease',
                                                            '&:active': {
                                                                cursor: 'grabbing'
                                                            },
                                                            '&:hover': { 
                                                                boxShadow: 3,
                                                                backgroundColor: theme.palette.mode === 'dark' ? colors.primary[800] : colors.primary[300],
                                                                color: theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[100]
                                                            }
                                                        }}
                                                    >
                                                        <Box display="flex" alignItems="center" justifyContent="space-between">
                                                            <Typography>{task.content}</Typography>
                                                            <Box>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleEditTask(task)}
                                                                    sx={{ color: colors.grey[100], mr: 1 }}
                                                                >
                                                                    <EditIcon />
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleDeleteTask(column.id, task.id)}
                                                                    sx={{ color: colors.grey[100] }}
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>

                            <Box mt={2}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Dodaj novi task"
                                    value={newTaskInputs[column.id] || ''}
                                    onChange={(e) => handleInputChange(column.id, e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            addTask(column.id);
                                        }
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: colors.primary[300],
                                            },
                                            '&:hover fieldset': {
                                                borderColor: colors.primary[200],
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: colors.greenAccent[500],
                                            },
                                            color: colors.grey[100],
                                        },
                                        '& .MuiOutlinedInput-input::placeholder': {
                                            color: colors.grey[300],
                                        },
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton 
                                                onClick={() => addTask(column.id)}
                                                sx={{ 
                                                    color: colors.greenAccent[500],
                                                    '&:hover': {
                                                        backgroundColor: colors.greenAccent[500],
                                                        color: colors.grey[100]
                                                    }
                                                }}
                                            >
                                                <AddIcon sx={{ fontSize: 30, fontWeight: 'bold' }} />
                                            </IconButton>
                                        )
                                    }}
                                />
                            </Box>
                        </Box>
                    ))}
                </Box>
            </DragDropContext>

            <Dialog 
                open={editDialogOpen} 
                onClose={() => setEditDialogOpen(false)}
                fullWidth
                maxWidth={false}
                PaperProps={{
                    sx: {
                        backgroundColor: colors.primary[500],
                        color: colors.grey[100],
                        width: 'calc(100vw - 250px)',
                        maxWidth: 'calc(100vw - 250px)'
                    }
                }}
            >
                <DialogTitle sx={{
                    backgroundColor: colors.primary[400],
                    color: colors.grey[100],
                    borderBottom: `1px solid ${colors.grey[700]}`
                }}>
                    Uredi Task
                </DialogTitle>
                <DialogContent sx={{
                    backgroundColor: colors.primary[400],
                    padding: "10px",
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    <Grid container spacing={3} sx={{ mt: 0.02 }}>
                        {/* Leva strana - osnovne informacije */}
                        <Grid item xs={12} md={8}>
                            <Box display="flex" flexDirection="column" gap={2}>
                                <TextField
                                    fullWidth
                                    label="Naziv taska"
                                    value={taskDetails.content}
                                    onChange={(e) => setTaskDetails({...taskDetails, content: e.target.value})}
                                    required
                                    sx={{
                                        "& .MuiInputBase-input": { color: colors.grey[100] },
                                        "& .MuiInputLabel-root": { color: colors.grey[100] }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Opis taska"
                                    multiline
                                    rows={3}
                                    value={taskDetails.description}
                                    onChange={(e) => setTaskDetails({...taskDetails, description: e.target.value})}
                                    sx={{
                                        "& .MuiInputBase-input": { color: colors.grey[100] },
                                        "& .MuiInputLabel-root": { color: colors.grey[100] }
                                    }}
                                />

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Rok završetka"
                                            type="date"
                                            value={taskDetails.dueDate}
                                            onChange={(e) => setTaskDetails({...taskDetails, dueDate: e.target.value})}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{
                                                "& .MuiInputBase-input": { color: colors.grey[100] },
                                                "& .MuiInputLabel-root": { color: colors.grey[100] }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Prioritet"
                                            value={taskDetails.priority}
                                            onChange={(e) => setTaskDetails({...taskDetails, priority: e.target.value})}
                                            SelectProps={{
                                                native: true,
                                                sx: {
                                                    color: colors.grey[100],
                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: colors.grey[700],
                                                    },
                                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: colors.grey[600],
                                                    },
                                                }
                                            }}
                                        >
                                            <option value="low">Nizak</option>
                                            <option value="medium">Srednji</option>
                                            <option value="high">Visok</option>
                                        </TextField>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ borderColor: colors.grey[700], my: 1 }} />

                                <Typography variant="h6" sx={{ color: colors.grey[100] }}>
                                    Status:
                                </Typography>
                                <Box display="flex" gap={1}>
                                    <Chip
                                        icon={<CheckCircleIcon />}
                                        label="Aktivan"
                                        onClick={() => handleStatusChange('active')}
                                        color={taskDetails.status === 'active' ? 'success' : 'default'}
                                        sx={{ color: colors.grey[100] }}
                                    />
                                    <Chip
                                        icon={<PendingIcon />}
                                        label={taskDetails.waitingFor ? `Čeka: ${taskDetails.waitingFor.content}` : "Na čekanju"}
                                        onClick={() => handleStatusChange('pending')}
                                        color={taskDetails.status === 'pending' ? 'warning' : 'default'}
                                        sx={{ 
                                            color: colors.grey[100],
                                            maxWidth: '300px',
                                            '& .MuiChip-label': {
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }
                                        }}
                                    />
                                    <Chip
                                        icon={<BlockIcon />}
                                        label="Blokiran"
                                        onClick={() => handleStatusChange('blocked')}
                                        color={taskDetails.status === 'blocked' ? 'error' : 'default'}
                                        sx={{ color: colors.grey[100] }}
                                    />
                                    <Chip
                                        icon={<CheckCircleIcon />}
                                        label="Završen"
                                        onClick={() => handleStatusChange('done')}
                                        color={taskDetails.status === 'done' ? 'success' : 'default'}
                                        sx={{ color: colors.grey[100] }}
                                    />
                                </Box>

                                <Divider sx={{ borderColor: colors.grey[700], my: 1 }} />

                                <Typography variant="h6" sx={{ color: colors.grey[100] }}>
                                    Dodeli korisnike:
                                </Typography>

                                <Box>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Pretraži korisnike..."
                                        value={userSearchQuery}
                                        onChange={(e) => setUserSearchQuery(e.target.value)}
                                        sx={{
                                            mb: 2,
                                            "& .MuiInputBase-input": { color: colors.grey[100] },
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": { borderColor: colors.grey[700] },
                                                "&:hover fieldset": { borderColor: colors.grey[600] }
                                            }
                                        }}
                                    />
                                    <Box 
                                        display="flex" 
                                        flexWrap="wrap" 
                                        gap={1}
                                        sx={{ 
                                            maxHeight: '200px', 
                                            overflowY: 'auto',
                                            pr: 1,
                                            '&::-webkit-scrollbar': {
                                                width: '8px',
                                            },
                                            '&::-webkit-scrollbar-track': {
                                                backgroundColor: colors.primary[500],
                                                borderRadius: '4px',
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                backgroundColor: colors.primary[300],
                                                borderRadius: '4px',
                                                '&:hover': {
                                                    backgroundColor: colors.primary[200],
                                                },
                                            },
                                        }}
                                    >
                                        {mockUsers
                                            .filter(user => 
                                                `${user.firstName} ${user.lastName}`
                                                    .toLowerCase()
                                                    .includes(userSearchQuery.toLowerCase())
                                            )
                                            .map(user => (
                                                <FormControlLabel
                                                    key={user.id}
                                                    control={
                                                        <Checkbox
                                                            checked={taskDetails.assignedUsers.includes(user.id)}
                                                            onChange={() => handleUserSelect(user.id)}
                                                            sx={{
                                                                color: colors.grey[100],
                                                                '&.Mui-checked': {
                                                                    color: user.color,
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <Avatar sx={{
                                                                bgcolor: user.color,
                                                                width: 24,
                                                                height: 24
                                                            }}>
                                                                {user.firstName[0]}{user.lastName[0]}
                                                            </Avatar>
                                                            <Typography sx={{ color: colors.grey[100] }}>
                                                                {user.firstName} {user.lastName}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            ))
                                        }
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Desna strana - fajlovi i napomene */}
                        <Grid item xs={12} md={4}>
                            <Box display="flex" flexDirection="column" gap={3}>
                                {/* Fajlovi */}
                                <Box>
                                    <Typography variant="h6" sx={{ color: colors.grey[100], mb: 2 }}>
                                        Fajlovi:
                                    </Typography>
                                    <Paper sx={{ 
                                        backgroundColor: colors.primary[400],
                                        p: 2,
                                        height: '300px',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <List sx={{ flex: 1, overflow: 'auto' }}>
                                            {taskDetails.files.map((file) => (
                                                <ListItem 
                                                    key={file.id}
                                                    sx={{
                                                        backgroundColor: colors.primary[400],
                                                        mb: 1,
                                                        borderRadius: 1,
                                                        color: colors.grey[100],
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            backgroundColor: theme.palette.mode === 'dark' ? colors.primary[800] : colors.primary[300],
                                                            color: theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[100]
                                                        }
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <AttachFileIcon sx={{ color: colors.grey[100] }} />
                                                    </ListItemIcon>
                                                    <ListItemText 
                                                        primary={file.name}
                                                        secondary={file.size}
                                                        sx={{ color: colors.grey[100] }}
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <IconButton 
                                                            edge="end" 
                                                            onClick={() => handleDeleteFile(file.id)}
                                                            sx={{ color: colors.grey[100] }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            ))}
                                        </List>
                                        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${colors.grey[700]}` }}>
                                            <Button
                                                component="label"
                                                fullWidth
                                                variant="outlined"
                                                startIcon={<CloudUploadIcon />}
                                                sx={{ 
                                                    color: colors.greenAccent[500],
                                                    borderColor: colors.greenAccent[500],
                                                    '&:hover': {
                                                        borderColor: colors.greenAccent[600],
                                                        backgroundColor: 'rgba(0, 255, 0, 0.1)'
                                                    }
                                                }}
                                            >
                                                Dodaj fajl
                                                <input
                                                    type="file"
                                                    hidden
                                                    multiple
                                                    onChange={handleFileUpload}
                                                />
                                            </Button>
                                        </Box>
                                    </Paper>
                                </Box>

                                {/* Napomene */}
                                <Box>
                                    <Typography variant="h6" sx={{ color: colors.grey[100], mb: 2 }}>
                                        Napomene:
                                    </Typography>
                                    <Paper sx={{ 
                                        backgroundColor: colors.primary[400],
                                        p: 2,
                                        height: '300px',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <List sx={{ flex: 1, overflow: 'auto' }}>
                                            {taskDetails.notes.map((note) => (
                                                <ListItem 
                                                    key={note.id}
                                                    sx={{
                                                        backgroundColor: colors.primary[400],
                                                        mb: 1,
                                                        borderRadius: 1,
                                                        color: colors.grey[100],
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            backgroundColor: theme.palette.mode === 'dark' ? colors.primary[800] : colors.primary[300],
                                                            color: theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[100]
                                                        }
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <NoteIcon sx={{ color: colors.grey[100] }} />
                                                    </ListItemIcon>
                                                    <ListItemText 
                                                        primary={note.content}
                                                        secondary={`${new Date(note.createdAt).toLocaleString()} - ${mockUsers.find(u => u.id === note.createdBy)?.firstName}`}
                                                        sx={{ color: colors.grey[100] }}
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <IconButton 
                                                            edge="end" 
                                                            onClick={() => handleDeleteNote(note.id)}
                                                            sx={{ color: colors.grey[100] }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            ))}
                                        </List>
                                        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${colors.grey[700]}` }}>
                                            <Box display="flex" gap={1}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    placeholder="Dodaj novu napomenu"
                                                    value={newNote}
                                                    onChange={(e) => setNewNote(e.target.value)}
                                                    sx={{
                                                        "& .MuiInputBase-input": { color: colors.grey[100] },
                                                        "& .MuiOutlinedInput-root": {
                                                            "& fieldset": { borderColor: colors.grey[700] },
                                                            "&:hover fieldset": { borderColor: colors.grey[600] }
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    onClick={handleAddNote}
                                                    startIcon={<AddIcon />}
                                                    sx={{ color: colors.greenAccent[500] }}
                                                >
                                                    Dodaj
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{
                    backgroundColor: colors.primary[400],
                    borderTop: `1px solid ${colors.grey[700]}`,
                    padding: "10px 20px"
                }}>
                    <Button 
                        onClick={() => setEditDialogOpen(false)}
                        sx={{ color: colors.grey[100] }}
                    >
                        Otkaži
                    </Button>
                    <Button 
                        onClick={handleSaveEdit}
                        sx={{ 
                            color: colors.greenAccent[500],
                            '&:hover': {
                                color: colors.greenAccent[600],
                            }
                        }}
                    >
                        Sačuvaj
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog za izbor taska koji se čeka */}
            <Dialog
                open={waitingForDialogOpen}
                onClose={() => setWaitingForDialogOpen(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: colors.primary[500],
                        color: colors.grey[100],
                        minWidth: '400px'
                    }
                }}
            >
                <DialogTitle sx={{
                    backgroundColor: colors.primary[400],
                    color: colors.grey[100],
                    borderBottom: `1px solid ${colors.grey[700]}`
                }}>
                    Izaberi task koji se čeka
                </DialogTitle>
                <DialogContent sx={{
                    backgroundColor: colors.primary[400],
                    padding: "20px",
                }}>
                    <List>
                        {getUnfinishedTasks().map(task => (
                            <ListItem 
                                key={task.id}
                                button
                                onClick={() => handleWaitingForSelect(task)}
                                sx={{
                                    backgroundColor: colors.primary[500],
                                    mb: 1,
                                    borderRadius: 1,
                                    '&:hover': {
                                        backgroundColor: colors.primary[300]
                                    }
                                }}
                            >
                                <ListItemText 
                                    primary={task.content}
                                    secondary={task.description}
                                    sx={{ color: colors.grey[100] }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions sx={{
                    backgroundColor: colors.primary[400],
                    borderTop: `1px solid ${colors.grey[700]}`,
                    padding: "10px"
                }}>
                    <Button 
                        onClick={() => setWaitingForDialogOpen(false)}
                        sx={{ color: colors.grey[100] }}
                    >
                        Otkaži
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default KanbanBoard;