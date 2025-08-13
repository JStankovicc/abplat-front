import { Card, CardContent, Typography, List, ListItem, ListItemText, Badge } from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";

const Notifications = () => {
    const notifications = []; // Ispraznjeno

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Badge badgeContent={notifications.length} color="error" sx={{ mr: 1 }}>
                        <NotificationsIcon />
                    </Badge>
                    Obaveštenja
                </Typography>
                <List dense>
                    {notifications.length === 0 ? (
                        <ListItem sx={{ py: 1 }}>
                            <ListItemText 
                                primary="Nema obaveštenja"
                                secondary="Trenutno nemate nova obaveštenja"
                                sx={{ textAlign: 'center', color: 'text.secondary' }}
                            />
                        </ListItem>
                    ) : (
                        notifications.map((text, index) => (
                            <ListItem key={index} sx={{ py: 1 }}>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))
                    )}
                </List>
            </CardContent>
        </Card>
    );
};

export default Notifications;