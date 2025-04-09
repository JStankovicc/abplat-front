import { Card, CardContent, Typography, List, ListItem, ListItemText, Badge } from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";

const Notifications = () => {
    const notifications = [
        'Novi komentar na zadatku #123',
        'Sastanak u 14:00 sa klijentom',
        'Ažurirana dokumentacija za API'
    ];

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
                    {notifications.map((text, index) => (
                        <ListItem key={index} sx={{ py: 1 }}>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default Notifications;