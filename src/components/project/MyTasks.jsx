import { Card, CardContent, Typography, List, ListItem, ListItemText, Chip } from "@mui/material";
import { Task as TaskIcon } from "@mui/icons-material";
import { tokens } from "../../theme";

const MyTasks = () => {
    const tasks = [
        { id: 1, title: 'Dizajn landing page', status: 'u toku' },
        { id: 2, title: 'Implementacija API-ja', status: 'završeno' },
        { id: 3, title: 'Testiranje sistema', status: 'čekanje' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'u toku': return 'primary';
            case 'završeno': return 'success';
            default: return 'secondary';
        }
    };

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <TaskIcon sx={{ mr: 1 }} /> Moji zadaci
                </Typography>
                <List dense>
                    {tasks.map(task => (
                        <ListItem key={task.id} sx={{ py: 1 }}>
                            <ListItemText
                                primary={task.title}
                                secondary={
                                    <Chip
                                        label={task.status}
                                        size="small"
                                        color={getStatusColor(task.status)}
                                        sx={{ mt: 0.5 }}
                                    />
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default MyTasks;