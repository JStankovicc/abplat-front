import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, TextField, IconButton, useTheme, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Divider, Avatar, Checkbox, FormControlLabel, List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, Paper, Chip, CircularProgress, Alert, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { tokens } from '../../theme';
import { API_BASE_URL } from '../../config/apiConfig';
import { getAuthHeaders } from '../../lib/api';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import NoteIcon from '@mui/icons-material/Note';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

const PROJECT_API_BASE_URL = `${API_BASE_URL}/project`;
const COMPANY_API_BASE_URL = `${API_BASE_URL}/company`;

const KanbanBoard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { projectId } = useParams();
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
        statusId: 1, // Initial statusId (1 = To Do)
        waitingFor: null,
        files: [],
        notes: []
    });
    const [newNote, setNewNote] = useState('');
    const [waitingForDialogOpen, setWaitingForDialogOpen] = useState(false);
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [editingColumnTitle, setEditingColumnTitle] = useState(null);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [taskUsers, setTaskUsers] = useState([]);

    const fetchAllProjectUsers = async () => {
        try {
            const response = await axios.get(`${PROJECT_API_BASE_URL}/getAllProjectUsers`, {
                headers: getAuthHeaders(),
                params: {
                    projectId: projectId
                }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch all project users:', error);
            return [];
        }
    };

    const fetchTaskUsers = async (taskId) => {
        try {
            const response = await axios.get(`${COMPANY_API_BASE_URL}/getAllCompanyProjectWorkersOnTask`, {
                headers: getAuthHeaders(),
                params: {
                    projectId: projectId,
                    taskId: taskId
                }
            });
            setTaskUsers(response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch task users:', error);
            setTaskUsers([]);
            return [];
        }
    };

    const fetchAvailableUsers = async (taskId) => {
        try {
            const allProjectUsers = await fetchAllProjectUsers();
            const usersOnTask = await fetchTaskUsers(taskId);
            
            const availableUsers = allProjectUsers.filter(projectUser => 
                !usersOnTask.some(taskUser => taskUser.id === projectUser.id)
            );
            
            setAvailableUsers(availableUsers);
        } catch (error) {
            console.error('Failed to fetch available users:', error);
            setAvailableUsers([]);
        }
    };

    const addUserToProjectTask = async (userId, taskId) => {
        try {
            await axios.post(`${PROJECT_API_BASE_URL}/addUserToProjectTask`, null, {
                headers: getAuthHeaders(),
                params: {
                    userId: userId,
                    projectId: projectId,
                    taskId: taskId
                }
            });
        } catch (error) {
            console.error('Failed to add user to task:', error);
            throw error;
        }
    };

    const updateProjectTask = async (task, newStatusId, taskDetails = null) => {
        try {
            const taskToUpdate = {
                id: task.originalTask.id,
                name: taskDetails ? taskDetails.content : task.originalTask.name,
                description: taskDetails ? taskDetails.description : task.originalTask.description,
                dateDue: taskDetails ? (taskDetails.dueDate ? new Date(taskDetails.dueDate).toISOString() : null) : task.originalTask.dateDue,
                priority: taskDetails ? taskDetails.priority.toUpperCase() : (task.originalTask.priority || 'MEDIUM'),
                statusId: newStatusId
            };

            console.log('Sending task update:', taskToUpdate);

            await axios.put(`${PROJECT_API_BASE_URL}/tasks/update`, taskToUpdate, {
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

            if (!projectId) {
                console.error('Nema projectId u URL-u');
                setError('Nema ID projekta');
                return;
            }

            const [statusResponse, tasksResponse] = await Promise.all([
                axios.get(`${PROJECT_API_BASE_URL}/taskStatus/getAll`, {
                    headers: getAuthHeaders(),
                    params: {
                        projectId: projectId
                    }
                }),
                axios.get(`${PROJECT_API_BASE_URL}/tasks/my`, {
                    headers: getAuthHeaders(),
                    params: {
                        projectId: projectId
                    }
                })
            ]);



            const kanbanColumns = statusResponse.data.map(status => ({
                id: status.name.toLowerCase().replace(/\s+/g, '_'),
                title: status.name,
                statusId: status.id,
                tasks: []
            }));

            tasksResponse.data.forEach((task, index) => {
                const targetColumn = kanbanColumns.find(col => 
                    col.statusId === task.statusId
                );
                
                const taskItem = {
                    id: `task-${task.id}`,
                    content: task.name,
                    description: task.description || '',
                    assignedUsers: task.users ? task.users.map(u => u.id) : [],
                    dueDate: task.dateDue ? new Date(task.dateDue).toISOString().split('T')[0] : '',
                    priority: task.priority ? task.priority.toLowerCase() : 'medium',
                    statusId: task.statusId,
                    files: [],
                    notes: task.notes || [],
                    originalTask: task // original task reference
                };
                
                if (targetColumn) {
                    targetColumn.tasks.push(taskItem);
                }
                // No fallback - tasks are only added to their matching column
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

    useEffect(() => {
        fetchKanbanData();
    }, [projectId]);

    // Sync assignedUsers when task users are loaded
    useEffect(() => {
        if (taskUsers.length > 0 && editingTask) {
            setTaskDetails(prev => ({
                ...prev,
                assignedUsers: taskUsers.map(user => user.id)
            }));
        }
    }, [taskUsers, editingTask]);

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination } = result;
        
        if (source.droppableId === destination.droppableId) {
            const newColumns = [...columns];
            const sourceCol = newColumns.find(col => col.id === source.droppableId);
            const copiedTasks = [...sourceCol.tasks];
            const [removed] = copiedTasks.splice(source.index, 1);
            copiedTasks.splice(destination.index, 0, removed);
            
            sourceCol.tasks = copiedTasks;
            setColumns(newColumns);
        } else {
            // Moving between columns requires a status update
            const newColumns = [...columns];
            const sourceCol = newColumns.find(col => col.id === source.droppableId);
            const destCol = newColumns.find(col => col.id === destination.droppableId);
            const task = sourceCol.tasks[source.index];

            sourceCol.tasks.splice(source.index, 1);
            destCol.tasks.splice(destination.index, 0, task);

            setColumns(newColumns);

            try {
                const newStatusId = destCol.statusId;
                await updateProjectTask(task, newStatusId);
                console.log(`Task ${task.content} premešten u statusId ${newStatusId}`);
            } catch (error) {
                console.error('Greška pri ažuriranju task statusa:', error);
                setError('Greška pri ažuriranju task statusa');
                
                // Revert to original position on API failure
                const rollbackColumns = [...columns];
                const rollbackSourceCol = rollbackColumns.find(col => col.id === source.droppableId);
                const rollbackDestCol = rollbackColumns.find(col => col.id === destination.droppableId);
                
                rollbackDestCol.tasks.splice(destination.index, 1);
                rollbackSourceCol.tasks.splice(source.index, 0, task);
                
                setColumns(rollbackColumns);
            }
        }
    };

    const addTask = async (columnId) => {
        const taskContent = newTaskInputs[columnId]?.trim();
        if (!taskContent) {
            console.log('Task content je prazan ili undefined');
            return;
        }

        try {
            const column = columns.find(col => col.id === columnId);
            if (!column) {
                console.log('Kolumna nije pronađena za columnId:', columnId);
                return;
            }

            console.log('Kreiranje task-a:', {
                taskContent,
                projectId,
                statusId: column.statusId,
                url: `${PROJECT_API_BASE_URL}/addTask`,
                body: {
                    projectTaskName: taskContent,
                    projectId: projectId,
                    statusID: column.statusId
                }
            });

            const response = await axios.post(`${PROJECT_API_BASE_URL}/addTask`, {
                projectTaskName: taskContent,
                projectId: projectId,
                statusID: column.statusId
            }, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200) {
                // Reload to fetch the newly created task
                window.location.reload();
            }
        } catch (error) {
            console.error('Greška pri kreiranju task-a:', error);
            setError('Greška pri kreiranju task-a');
        }
    };

    const addColumn = async () => {
        const newColumnName = prompt('Unesite naziv novog statusa:');
        if (!newColumnName || !newColumnName.trim()) return;
        
        try {
            const response = await axios.post(`${PROJECT_API_BASE_URL}/addTaskStatus`, {
                name: newColumnName.trim(),
                projectId: projectId
            }, {
                headers: getAuthHeaders()
            });
            
            await fetchKanbanData();
            
            console.log(`Task status ${newColumnName} uspešno dodat`);
        } catch (error) {
            console.error('Greška pri dodavanju task statusa:', error);
            setError('Greška pri dodavanju task statusa');
        }
    };

    const deleteColumn = async (columnId) => {
        if (columns.length <= 1) return; // Prevent deleting the last column
        
        const columnToDelete = columns.find(col => col.id === columnId);
        if (!columnToDelete) return;
        
        try {
            await axios.delete(`${PROJECT_API_BASE_URL}/deleteTaskStatus`, {
                headers: getAuthHeaders(),
                params: {
                    id: columnToDelete.statusId
                }
            });
            
            setColumns(columns.filter(col => col.id !== columnId));
            
            console.log(`Task status ${columnToDelete.title} uspešno obrisan`);
        } catch (error) {
            console.error('Greška pri brisanju task statusa:', error);
            setError('Greška pri brisanju task statusa');
        }
    };

    const handleInputChange = (columnId, value) => {
        setNewTaskInputs(prev => ({ ...prev, [columnId]: value }));
    };

    const handleEditTask = async (task) => {
        setEditingTask(task);
        
        await Promise.all([
            fetchAvailableUsers(task.originalTask.id),
            fetchTaskUsers(task.originalTask.id)
        ]);
        
        setTaskDetails({
            content: task.content,
            description: task.description || '',
            assignedUsers: [], // Start empty - users are populated after loading
            dueDate: task.dueDate || '',
            priority: task.priority || 'medium',
            statusId: task.statusId || 1, // Use statusId, not status string
            waitingFor: task.waitingFor || null,
            files: task.files || [],
            notes: task.notes || []
        });
        
        setEditDialogOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!taskDetails.content.trim()) return;

        try {
            setColumns(columns.map(col => ({
                ...col,
                tasks: col.tasks.map(task =>
                    task.id === editingTask.id
                        ? { ...task, ...taskDetails }
                        : task
                )
            })));

            await updateProjectTask(editingTask, taskDetails.statusId, taskDetails);
            
            const currentTaskUsers = taskUsers.map(user => user.id);
            const selectedUsers = taskDetails.assignedUsers.filter(userId => !currentTaskUsers.includes(userId));
            
            for (const userId of selectedUsers) {
                await addUserToProjectTask(userId, editingTask.originalTask.id);
            }
            
            console.log('Task uspešno ažuriran:', taskDetails.content);

            setEditDialogOpen(false);
            setEditingTask(null);
            setTaskDetails({
                content: '',
                description: '',
                assignedUsers: [],
                dueDate: '',
                priority: 'medium',
                statusId: 1, // Reset to initial statusId
                waitingFor: null,
                files: [],
                notes: []
            });
        } catch (error) {
            console.error('Greška pri ažuriranju taska:', error);
            setError('Greška pri ažuriranju taska');
            
            // Revert state on API failure
            fetchKanbanData();
        }
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

    const handleDeleteTask = async (columnId, taskId) => {
        const column = columns.find(col => col.id === columnId);
        if (!column) return;
        
        const task = column.tasks.find(t => t.id === taskId);
        if (!task || !task.originalTask) {
            console.error('Task nije pronađen ili nema originalTask referencu');
            return;
        }

        const realTaskId = task.originalTask.id;

        try {
            await axios.delete(`${PROJECT_API_BASE_URL}/tasks/delete`, {
                headers: getAuthHeaders(),
                params: {
                    id: realTaskId
                }
            });

            setColumns(columns.map(col =>
                col.id === columnId
                    ? {
                        ...col,
                        tasks: col.tasks.filter(task => task.id !== taskId)
                    }
                    : col
            ));

            console.log(`Task ${task.content} uspešno obrisan`);
        } catch (error) {
            console.error('Greška pri brisanju taska:', error);
            setError('Greška pri brisanju taska');
        }
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
            createdBy: 1 // TODO: replace with actual current user ID
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
                task.statusId !== 3 // 3 = Done
            )
        );
    };

    const handleStatusChange = (newStatusId) => {
        if (newStatusId === 2) { // 2 = In Progress
            setWaitingForDialogOpen(true);
        } else {
            setTaskDetails({
                ...taskDetails,
                statusId: newStatusId,
                waitingFor: null
            });
        }
    };

    const handleWaitingForSelect = (task) => {
        setTaskDetails({
            ...taskDetails,
            statusId: 2, // 2 = In Progress
            waitingFor: task
        });
        setWaitingForDialogOpen(false);
    };

    const handleColumnTitleChange = async (columnId, newTitle) => {
        if (!newTitle || !newTitle.trim()) {
            setEditingColumnTitle(null);
            return;
        }
        
        const column = columns.find(col => col.id === columnId);
        if (!column) return;
        
        try {
            await axios.post(`${PROJECT_API_BASE_URL}/updateTaskStatus`, {
                id: column.statusId,
                name: newTitle.trim(),
                projectId: projectId
            }, {
                headers: getAuthHeaders()
            });
            
            setColumns(columns.map(col =>
                col.id === columnId ? { ...col, title: newTitle.trim() } : col
            ));
            
            console.log(`Task status ${column.title} ažuriran na ${newTitle}`);
        } catch (error) {
            console.error('Greška pri ažuriranju task statusa:', error);
            setError('Greška pri ažuriranju task statusa');
        } finally {
            setEditingColumnTitle(null);
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

    const getStatusColor = (statusId) => {
        switch(statusId) {
            case 1: return 'warning';
            case 2: return 'primary';
            case 3: return 'success';
            default: return 'secondary';
        }
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'row' : 'row',
                    gap: isMobile ? 1 : 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: isMobile ? 1.5 : 2,
                    flexWrap: 'wrap',
                }}
            >
                <Button
                    variant="outlined"
                    size={isMobile ? 'medium' : 'medium'}
                    onClick={() => fetchKanbanData()}
                    disabled={loading}
                    sx={{
                        borderColor: colors.greenAccent[500],
                        color: colors.greenAccent[500],
                        minHeight: isMobile ? 44 : undefined,
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
                    size={isMobile ? 'medium' : 'medium'}
                    startIcon={<AddIcon />}
                    onClick={addColumn}
                    sx={{
                        backgroundColor: colors.greenAccent[500],
                        minHeight: isMobile ? 44 : undefined,
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
                    gap={isMobile ? 1.5 : 2}
                    sx={{
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        pb: isMobile ? 2 : 2,
                        flex: 1,
                        minHeight: 0,
                        maxWidth: isMobile ? '100%' : 'calc(100vw - 340px)',
                        WebkitOverflowScrolling: 'touch',
                        '&::-webkit-scrollbar': {
                            height: isMobile ? 6 : 8,
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: colors.primary[500],
                            borderRadius: 4,
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: colors.primary[300],
                            borderRadius: 4,
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
                                minWidth: isMobile ? 280 : 300,
                                maxWidth: isMobile ? 280 : 300,
                                flex: isMobile ? '0 0 280px' : '0 0 300px',
                                backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[800],
                                borderRadius: 2,
                                p: isMobile ? 1.5 : 2,
                                boxShadow: isMobile ? '0 2px 8px rgba(0,0,0,0.18)' : '0 2px 4px rgba(0,0,0,0.2)',
                                display: 'flex',
                                flexDirection: 'column',
                                border: isMobile ? `1px solid ${colors.grey[700]}` : 'none',
                            }}
                        >
                            <Box display="flex" alignItems="center" mb={isMobile ? 1.5 : 2}>
                                {editingColumnTitle === column.id ? (
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={column.title}
                                        onChange={(e) => {
                                            // Update column title in state
                                            setColumns(columns.map(col =>
                                                col.id === column.id ? { ...col, title: e.target.value } : col
                                            ));
                                        }}
                                        onBlur={() => {
                                            handleColumnTitleChange(column.id, column.title);
                                        }}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleColumnTitleChange(column.id, column.title);
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
                                        sx={{
                                            color: colors.grey[300],
                                            minWidth: 40,
                                            minHeight: 40,
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
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
                                                            p: isMobile ? 1.5 : 2,
                                                            mb: 1,
                                                            borderRadius: 1.5,
                                                            boxShadow: snapshot.isDragging ? 3 : '0 1px 3px rgba(0,0,0,0.12)',
                                                            color: colors.grey[100],
                                                            cursor: 'grab',
                                                            transform: snapshot.isDragging ? 'rotate(2deg)' : 'none',
                                                            transition: 'all 0.2s ease',
                                                            minHeight: isMobile ? 56 : undefined,
                                                            '&:active': {
                                                                cursor: 'grabbing'
                                                            },
                                                            '&:hover': { 
                                                                boxShadow: 2,
                                                                backgroundColor: theme.palette.mode === 'dark' ? colors.primary[600] : colors.primary[300],
                                                                color: theme.palette.mode === 'dark' ? colors.grey[200] : colors.grey[100]
                                                            }
                                                        }}
                                                    >
                                                        <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
                                                            <Typography
                                                                sx={{
                                                                    flex: 1,
                                                                    minWidth: 0,
                                                                    fontSize: isMobile ? '0.9375rem' : undefined,
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                {task.content}
                                                            </Typography>
                                                            <Box display="flex" alignItems="center" flexShrink={0}>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => { e.stopPropagation(); handleEditTask(task); }}
                                                                    sx={{
                                                                        color: colors.grey[300],
                                                                        minWidth: 40,
                                                                        minHeight: 40,
                                                                    }}
                                                                >
                                                                    <EditIcon sx={{ fontSize: isMobile ? 20 : undefined }} />
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => { e.stopPropagation(); handleDeleteTask(column.id, task.id); }}
                                                                    sx={{
                                                                        color: colors.grey[300],
                                                                        minWidth: 40,
                                                                        minHeight: 40,
                                                                    }}
                                                                >
                                                                    <DeleteIcon sx={{ fontSize: isMobile ? 20 : undefined }} />
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

                            <Box mt={isMobile ? 1.5 : 2}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size={isMobile ? 'medium' : 'medium'}
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
                                        '& .MuiOutlinedInput-input': {
                                            fontSize: isMobile ? '16px' : undefined,
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
                                                    minWidth: 44,
                                                    minHeight: 44,
                                                    '&:hover': {
                                                        backgroundColor: colors.greenAccent[500],
                                                        color: colors.grey[100]
                                                    }
                                                }}
                                            >
                                                <AddIcon sx={{ fontSize: isMobile ? 24 : 30 }} />
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
                fullScreen={isMobile}
                maxWidth={isMobile ? false : false}
                PaperProps={{
                    sx: {
                        backgroundColor: colors.primary[500],
                        color: colors.grey[100],
                        ...(isMobile ? { borderRadius: 0 } : {
                            width: 'calc(100vw - 250px)',
                            maxWidth: 'calc(100vw - 250px)',
                        })
                    }
                }}
            >
                <DialogTitle sx={{
                    backgroundColor: colors.primary[400],
                    color: colors.grey[100],
                    borderBottom: `1px solid ${colors.grey[700]}`,
                    fontWeight: 600,
                    fontSize: isMobile ? '1.25rem' : undefined,
                    py: isMobile ? 2 : undefined,
                }}>
                    Uredi task
                </DialogTitle>
                <DialogContent sx={{
                    backgroundColor: colors.primary[400],
                    padding: isMobile ? 2.5 : 2,
                    pt: isMobile ? 3 : 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2.5,
                }}>
                    <Grid container spacing={3} sx={{ mt: 0.02 }}>
                        {/* Left panel - basic info */}
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

                                <Typography variant="h6" sx={{ color: colors.grey[400], opacity: 0.6 }}>
                                    Status: (zamrznuto)
                                </Typography>
                                <Box display="flex" gap={1} sx={{ opacity: 0.6 }}>
                                    <Chip
                                        icon={<PendingIcon />}
                                        label="Čekanje"
                                        color="default"
                                        sx={{ 
                                            color: colors.grey[400],
                                            cursor: 'not-allowed',
                                            opacity: 0.6
                                        }}
                                    />
                                    <Chip
                                        icon={<CheckCircleIcon />}
                                        label="U toku"
                                        color="primary"
                                        sx={{ 
                                            color: colors.grey[400],
                                            cursor: 'not-allowed',
                                            opacity: 0.6
                                        }}
                                    />
                                    <Chip
                                        icon={<CheckCircleIcon />}
                                        label="Završeno"
                                        color="default"
                                        sx={{ 
                                            color: colors.grey[400],
                                            cursor: 'not-allowed',
                                            opacity: 0.6
                                        }}
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
                                        {/* Current users on task */}
                                        {taskUsers
                                            .filter(user => 
                                                user.displayName
                                                    .toLowerCase()
                                                    .includes(userSearchQuery.toLowerCase())
                                            )
                                            .map(user => (
                                                <FormControlLabel
                                                    key={user.id}
                                                    control={
                                                        <Checkbox
                                                            checked={true}
                                                            disabled={true}
                                                            sx={{
                                                                color: colors.grey[100],
                                                                '&.Mui-checked': {
                                                                    color: colors.greenAccent[500],
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <Avatar sx={{
                                                                bgcolor: colors.greenAccent[500],
                                                                width: 24,
                                                                height: 24
                                                            }}>
                                                                {user.displayName[0]}
                                                            </Avatar>
                                                            <Typography sx={{ color: colors.grey[100] }}>
                                                                {user.displayName}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            ))
                                        }
                                        
                                        {/* Available users to add */}
                                        {availableUsers
                                            .filter(user => 
                                                user.displayName
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
                                                                    color: colors.blueAccent[500],
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <Avatar sx={{
                                                                bgcolor: colors.blueAccent[500],
                                                                width: 24,
                                                                height: 24
                                                            }}>
                                                                {user.displayName[0]}
                                                            </Avatar>
                                                            <Typography sx={{ color: colors.grey[100] }}>
                                                                {user.displayName}
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

                        {/* Right panel - files and notes */}
                        <Grid item xs={12} md={4}>
                            <Box display="flex" flexDirection="column" gap={3}>
                                {/* Files */}
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
                                                disabled={true}
                                                sx={{ 
                                                    color: colors.grey[400],
                                                    borderColor: colors.grey[600],
                                                    opacity: 0.6,
                                                    cursor: 'not-allowed'
                                                }}
                                            >
                                                Dodaj fajl (nedostupno)
                                                <input
                                                    type="file"
                                                    hidden
                                                    multiple
                                                    disabled
                                                />
                                            </Button>
                                        </Box>
                                    </Paper>
                                </Box>

                                {/* Notes */}
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
                                                        secondary={new Date(note.createdAt).toLocaleString()}
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
                    padding: isMobile ? 2 : "10px 20px",
                    gap: 1,
                }}>
                    <Button 
                        onClick={() => setEditDialogOpen(false)}
                        sx={{ color: colors.grey[300] }}
                    >
                        Otkaži
                    </Button>
                    <Button 
                        variant="contained"
                        onClick={handleSaveEdit}
                        sx={{ 
                            backgroundColor: colors.greenAccent[500],
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: colors.greenAccent[600],
                            }
                        }}
                    >
                        Sačuvaj
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Waiting-for task selection dialog */}
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