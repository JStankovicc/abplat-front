import { useState } from "react";
import {
    Box,
    Grid,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Chip,
    IconButton,
    useTheme,
    Button,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    Tooltip
} from "@mui/material";
import { tokens } from "../../theme";
import {
    ShoppingCart as OrderIcon,
    AssignmentReturn as ReturnIcon,
    LocalShipping as ShippingIcon,
    Warning as WarningIcon,
    CheckCircle as CompletedIcon,
    Pending as PendingIcon,
    Cancel as CancelledIcon,
    ArrowForward as ArrowForwardIcon,
    Visibility as VisibilityIcon
} from "@mui/icons-material";

const DashboardSection = () => {
    const theme = useTheme();
    const mode = theme?.palette?.mode || "dark";
    const colors = tokens(mode);

    const defaultColors = {
        orangeAccent: {
            500: "#ffa726"
        },
        blueAccent: {
            500: "#2196f3"
        },
        greenAccent: {
            500: "#4cceac"
        },
        redAccent: {
            500: "#ff6b6b"
        },
        grey: {
            500: "#9e9e9e"
        }
    };

    const safeColors = {
        orangeAccent: {
            500: colors?.orangeAccent?.[500] || defaultColors.orangeAccent[500]
        },
        blueAccent: {
            500: colors?.blueAccent?.[500] || defaultColors.blueAccent[500]
        },
        greenAccent: {
            500: colors?.greenAccent?.[500] || defaultColors.greenAccent[500]
        },
        redAccent: {
            500: colors?.redAccent?.[500] || defaultColors.redAccent[500]
        },
        grey: {
            500: colors?.grey?.[500] || defaultColors.grey[500]
        }
    };

    // Primer podataka za neobavljene stvari
    const [pendingItems, setPendingItems] = useState({
        orders: [
            {
                id: "ORD-2024-001",
                customer: "Petar Petrović",
                date: "2024-02-15",
                status: "Na čekanju",
                items: 3,
                total: "€2,345.67"
            },
            {
                id: "ORD-2024-002",
                customer: "Ana Anić",
                date: "2024-02-14",
                status: "U obradi",
                items: 2,
                total: "€1,234.56"
            }
        ],
        returns: [
            {
                id: "RET-2024-001",
                customer: "Marko Marković",
                date: "2024-02-15",
                status: "Na čekanju",
                reason: "Neispravan proizvod",
                total: "€999.99"
            }
        ],
        lowStock: [
            {
                id: 1,
                name: "Laptop Dell XPS 13",
                currentStock: 2,
                minStock: 5
            },
            {
                id: 2,
                name: "Monitor Dell 27\"",
                currentStock: 1,
                minStock: 3
            }
        ]
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "Na čekanju":
                return safeColors.orangeAccent[500];
            case "U obradi":
                return safeColors.blueAccent[500];
            case "Završeno":
                return safeColors.greenAccent[500];
            case "Otkazano":
                return safeColors.redAccent[500];
            default:
                return safeColors.grey[500];
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Na čekanju":
                return <PendingIcon />;
            case "U obradi":
                return <ShippingIcon />;
            case "Završeno":
                return <CompletedIcon />;
            case "Otkazano":
                return <CancelledIcon />;
            default:
                return null;
        }
    };

    const getInitials = (name) => {
        return name
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase();
    };

    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
                {/* Neobavljene porudžbine */}
                <Grid item xs={12} md={6}>
                    <Card 
                        sx={{ 
                            backgroundColor: colors?.primary?.[600] || "#1f2a40",
                            height: "100%",
                            transition: "transform 0.2s",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: 3
                            }
                        }}
                    >
                        <CardHeader
                            avatar={
                                <Avatar sx={{ bgcolor: safeColors.blueAccent[500] }}>
                                    <OrderIcon />
                                </Avatar>
                            }
                            title={
                                <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    Neobavljene porudžbine
                                </Typography>
                            }
                            action={
                                <Button 
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{ color: safeColors.blueAccent[500] }}
                                >
                                    Pogledaj sve
                                </Button>
                            }
                        />
                        <CardContent>
                            <List>
                                {pendingItems.orders.map((order, index) => (
                                    <Box key={order.id}>
                                        <ListItem
                                            sx={{
                                                borderRadius: 1,
                                                mb: 1,
                                                "&:hover": {
                                                    backgroundColor: colors?.primary?.[500] || "#2d3a54"
                                                }
                                            }}
                                        >
                                            <ListItemIcon>
                                                <Avatar sx={{ bgcolor: safeColors.blueAccent[500] }}>
                                                    {getInitials(order.customer)}
                                                </Avatar>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <Typography variant="subtitle2">
                                                            {order.id}
                                                        </Typography>
                                                        <Chip
                                                            icon={getStatusIcon(order.status)}
                                                            label={order.status}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: getStatusColor(order.status),
                                                                color: colors.grey[100],
                                                                fontWeight: "bold"
                                                            }}
                                                        />
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                            Kupac: {order.customer}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Datum: {order.date}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Stavke: {order.items} | Ukupno: {order.total}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                            <Tooltip title="Pregledaj detalje">
                                                <IconButton size="small">
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </ListItem>
                                        {index < pendingItems.orders.length - 1 && <Divider />}
                                    </Box>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Povrati */}
                <Grid item xs={12} md={6}>
                    <Card 
                        sx={{ 
                            backgroundColor: colors?.primary?.[600] || "#1f2a40",
                            height: "100%",
                            transition: "transform 0.2s",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: 3
                            }
                        }}
                    >
                        <CardHeader
                            avatar={
                                <Avatar sx={{ bgcolor: safeColors.orangeAccent[500] }}>
                                    <ReturnIcon />
                                </Avatar>
                            }
                            title={
                                <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    Povrati
                                </Typography>
                            }
                            action={
                                <Button 
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{ color: safeColors.orangeAccent[500] }}
                                >
                                    Pogledaj sve
                                </Button>
                            }
                        />
                        <CardContent>
                            <List>
                                {pendingItems.returns.map((returnItem, index) => (
                                    <Box key={returnItem.id}>
                                        <ListItem
                                            sx={{
                                                borderRadius: 1,
                                                mb: 1,
                                                "&:hover": {
                                                    backgroundColor: colors?.primary?.[500] || "#2d3a54"
                                                }
                                            }}
                                        >
                                            <ListItemIcon>
                                                <Avatar sx={{ bgcolor: safeColors.orangeAccent[500] }}>
                                                    {getInitials(returnItem.customer)}
                                                </Avatar>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <Typography variant="subtitle2">
                                                            {returnItem.id}
                                                        </Typography>
                                                        <Chip
                                                            icon={getStatusIcon(returnItem.status)}
                                                            label={returnItem.status}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: getStatusColor(returnItem.status),
                                                                color: colors.grey[100],
                                                                fontWeight: "bold"
                                                            }}
                                                        />
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                            Kupac: {returnItem.customer}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Datum: {returnItem.date}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Razlog: {returnItem.reason}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Ukupno: {returnItem.total}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                            <Tooltip title="Pregledaj detalje">
                                                <IconButton size="small">
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </ListItem>
                                        {index < pendingItems.returns.length - 1 && <Divider />}
                                    </Box>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Nizak nivo zaliha */}
                <Grid item xs={12}>
                    <Card 
                        sx={{ 
                            backgroundColor: colors?.primary?.[600] || "#1f2a40",
                            transition: "transform 0.2s",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: 3
                            }
                        }}
                    >
                        <CardHeader
                            avatar={
                                <Avatar sx={{ bgcolor: safeColors.redAccent[500] }}>
                                    <WarningIcon />
                                </Avatar>
                            }
                            title={
                                <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    Nizak nivo zaliha
                                </Typography>
                            }
                            action={
                                <Button 
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{ color: safeColors.redAccent[500] }}
                                >
                                    Pogledaj sve
                                </Button>
                            }
                        />
                        <CardContent>
                            <List>
                                {pendingItems.lowStock.map((item, index) => (
                                    <Box key={item.id}>
                                        <ListItem
                                            sx={{
                                                borderRadius: 1,
                                                mb: 1,
                                                "&:hover": {
                                                    backgroundColor: colors?.primary?.[500] || "#2d3a54"
                                                }
                                            }}
                                        >
                                            <ListItemIcon>
                                                <Avatar sx={{ bgcolor: safeColors.redAccent[500] }}>
                                                    <WarningIcon />
                                                </Avatar>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                                        {item.name}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography 
                                                            variant="body2" 
                                                            color="error"
                                                            sx={{ 
                                                                display: "flex", 
                                                                alignItems: "center", 
                                                                gap: 1,
                                                                mt: 0.5
                                                            }}
                                                        >
                                                            <WarningIcon fontSize="small" />
                                                            Trenutno stanje: {item.currentStock} (Minimalno: {item.minStock})
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                            <Tooltip title="Pregledaj detalje">
                                                <IconButton size="small">
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </ListItem>
                                        {index < pendingItems.lowStock.length - 1 && <Divider />}
                                    </Box>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardSection; 