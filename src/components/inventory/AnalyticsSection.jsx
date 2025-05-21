import { useState } from "react";
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    IconButton,
    useTheme,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip
} from "@mui/material";
import { tokens } from "../../theme";
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Inventory as InventoryIcon,
    LocalShipping as ShippingIcon,
    AssignmentReturn as ReturnIcon,
    Warning as WarningIcon,
    Euro as EuroIcon,
    CalendarToday as CalendarIcon,
    ArrowUpward as ArrowUpIcon,
    ArrowDownward as ArrowDownIcon
} from "@mui/icons-material";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from "recharts";

const AnalyticsSection = () => {
    const theme = useTheme();
    const mode = theme?.palette?.mode || "dark";
    const colors = tokens(mode);

    // Definišemo sve boje koje nam trebaju
    const defaultColors = {
        primary: {
            400: "#141b2d",
            500: "#1f2a40",
            600: "#2d3a54"
        },
        greenAccent: {
            500: "#4cceac"
        },
        redAccent: {
            500: "#ff6b6b"
        },
        orangeAccent: {
            500: "#ffa726"
        },
        blueAccent: {
            500: "#2196f3"
        },
        grey: {
            100: "#f5f5f5",
            500: "#9e9e9e"
        }
    };

    // Sigurno čitanje boja sa fallback vrednostima
    const safeColors = {
        primary: {
            400: colors?.primary?.[400] || defaultColors.primary[400],
            500: colors?.primary?.[500] || defaultColors.primary[500],
            600: colors?.primary?.[600] || defaultColors.primary[600]
        },
        greenAccent: {
            500: colors?.greenAccent?.[500] || defaultColors.greenAccent[500]
        },
        redAccent: {
            500: colors?.redAccent?.[500] || defaultColors.redAccent[500]
        },
        orangeAccent: {
            500: colors?.orangeAccent?.[500] || defaultColors.orangeAccent[500]
        },
        blueAccent: {
            500: colors?.blueAccent?.[500] || defaultColors.blueAccent[500]
        },
        grey: {
            100: colors?.grey?.[100] || defaultColors.grey[100],
            500: colors?.grey?.[500] || defaultColors.grey[500]
        }
    };

    const [timeRange, setTimeRange] = useState("month");

    // Podaci za dijagrame
    const inventoryTrendData = [
        { name: "Jan", value: 180000 },
        { name: "Feb", value: 200000 },
        { name: "Mar", value: 190000 },
        { name: "Apr", value: 220000 },
        { name: "Maj", value: 234567 },
        { name: "Jun", value: 250000 }
    ];

    const categoryDistributionData = [
        { name: "Laptopi", value: 35 },
        { name: "Monitori", value: 25 },
        { name: "Mobilni telefoni", value: 20 },
        { name: "Periferije", value: 15 },
        { name: "Ostalo", value: 5 }
    ];

    const orderTrendData = [
        { name: "Jan", orders: 30, returns: 5 },
        { name: "Feb", orders: 35, returns: 4 },
        { name: "Mar", orders: 40, returns: 6 },
        { name: "Apr", orders: 38, returns: 3 },
        { name: "Maj", orders: 45, returns: 5 },
        { name: "Jun", orders: 50, returns: 4 }
    ];

    const topProductsData = [
        { name: "Laptop Dell XPS 13", value: 18518 },
        { name: "Monitor Dell 27\"", value: 7499 },
        { name: "iPhone 14 Pro", value: 9999 },
        { name: "Samsung Galaxy S23", value: 8999 },
        { name: "Logitech MX Master", value: 4999 }
    ];

    // Definišemo boje za pie chart
    const COLORS = [
        safeColors.blueAccent[500],
        safeColors.greenAccent[500],
        safeColors.orangeAccent[500],
        safeColors.redAccent[500],
        safeColors.grey[500]
    ];

    const getTrendIcon = (trend) => {
        return trend === "up" ? (
            <ArrowUpIcon sx={{ color: safeColors.greenAccent[500] }} />
        ) : (
            <ArrowDownIcon sx={{ color: safeColors.redAccent[500] }} />
        );
    };

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

    // Primer podataka
    const metrics = {
        inventory: {
            value: "€234,567",
            change: "+8%",
            trend: "up",
            items: [
                { name: "Laptop Dell XPS 13", quantity: 15, value: "€18,518.40" },
                { name: "Monitor Dell 27\"", quantity: 25, value: "€7,499.75" },
                { name: "iPhone 14 Pro", quantity: 10, value: "€9,999.90" }
            ]
        },
        orders: {
            value: "45",
            change: "+12%",
            trend: "up",
            items: [
                { id: "ORD-2024-001", customer: "Petar Petrović", value: "€2,345.67", status: "U obradi" },
                { id: "ORD-2024-002", customer: "Ana Anić", value: "€1,234.56", status: "Na čekanju" }
            ]
        },
        returns: {
            value: "5",
            change: "-2%",
            trend: "down",
            items: [
                { id: "RET-2024-001", customer: "Marko Marković", value: "€999.99", reason: "Neispravan proizvod" },
                { id: "RET-2024-002", customer: "Jovana Jovanović", value: "€299.99", reason: "Pogrešan proizvod" }
            ]
        },
        lowStock: {
            value: "8",
            change: "+3",
            trend: "up",
            items: [
                { name: "Laptop Dell XPS 13", current: 2, minimum: 5 },
                { name: "Monitor Dell 27\"", current: 1, minimum: 3 },
                { name: "iPhone 14 Pro", current: 3, minimum: 5 }
            ]
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Period</InputLabel>
                    <Select
                        value={timeRange}
                        label="Period"
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <MenuItem value="week">Nedelja</MenuItem>
                        <MenuItem value="month">Mesec</MenuItem>
                        <MenuItem value="quarter">Kvartal</MenuItem>
                        <MenuItem value="year">Godina</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={3}>
                {/* Vrednost inventara */}
                <Grid item xs={12} md={6}>
                    <Card 
                        sx={{ 
                            backgroundColor: safeColors.primary[600],
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
                                    <InventoryIcon />
                                </Avatar>
                            }
                            title="Vrednost inventara"
                            subheader={`Ukupna vrednost svih proizvoda u skladištu`}
                        />
                        <CardContent>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h4" sx={{ mb: 1 }}>
                                    {metrics.inventory.value}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    {getTrendIcon(metrics.inventory.trend)}
                                    <Typography 
                                        variant="body2" 
                                        color={metrics.inventory.trend === "up" ? "success.main" : "error.main"}
                                    >
                                        {metrics.inventory.change} u odnosu na prošli period
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Top proizvodi po vrednosti
                            </Typography>
                            <List>
                                {metrics.inventory.items.map((item, index) => (
                                    <ListItem key={index} sx={{ py: 0.5 }}>
                                        <ListItemText
                                            primary={item.name}
                                            secondary={`${item.quantity} komada`}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            {item.value}
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Aktivne porudžbine */}
                <Grid item xs={12} md={6}>
                    <Card 
                        sx={{ 
                            backgroundColor: safeColors.primary[600],
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
                                <Avatar sx={{ bgcolor: safeColors.greenAccent[500] }}>
                                    <ShippingIcon />
                                </Avatar>
                            }
                            title="Aktivne porudžbine"
                            subheader={`Porudžbine koje čekaju obradu`}
                        />
                        <CardContent>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h4" sx={{ mb: 1 }}>
                                    {metrics.orders.value}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    {getTrendIcon(metrics.orders.trend)}
                                    <Typography 
                                        variant="body2" 
                                        color={metrics.orders.trend === "up" ? "success.main" : "error.main"}
                                    >
                                        {metrics.orders.change} u odnosu na prošli period
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Najnovije porudžbine
                            </Typography>
                            <List>
                                {metrics.orders.items.map((order, index) => (
                                    <ListItem key={index} sx={{ py: 0.5 }}>
                                        <ListItemText
                                            primary={order.id}
                                            secondary={order.customer}
                                        />
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Chip
                                                label={order.status}
                                                size="small"
                                                sx={{
                                                    backgroundColor: getStatusColor(order.status),
                                                    color: safeColors.grey[100]
                                                }}
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                {order.value}
                                            </Typography>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Povrati */}
                <Grid item xs={12} md={6}>
                    <Card 
                        sx={{ 
                            backgroundColor: safeColors.primary[600],
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
                            title="Povrati"
                            subheader={`Povrati koji čekaju obradu`}
                        />
                        <CardContent>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h4" sx={{ mb: 1 }}>
                                    {metrics.returns.value}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    {getTrendIcon(metrics.returns.trend)}
                                    <Typography 
                                        variant="body2" 
                                        color={metrics.returns.trend === "up" ? "success.main" : "error.main"}
                                    >
                                        {metrics.returns.change} u odnosu na prošli period
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Najnoviji povrati
                            </Typography>
                            <List>
                                {metrics.returns.items.map((returnItem, index) => (
                                    <ListItem key={index} sx={{ py: 0.5 }}>
                                        <ListItemText
                                            primary={returnItem.id}
                                            secondary={returnItem.customer}
                                        />
                                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                            <Typography variant="body2" color="text.secondary">
                                                {returnItem.value}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {returnItem.reason}
                                            </Typography>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Nizak nivo zaliha */}
                <Grid item xs={12} md={6}>
                    <Card 
                        sx={{ 
                            backgroundColor: safeColors.primary[600],
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
                                <Avatar sx={{ bgcolor: safeColors.redAccent[500] }}>
                                    <WarningIcon />
                                </Avatar>
                            }
                            title="Nizak nivo zaliha"
                            subheader={`Proizvodi koji zahtevaju dopunu`}
                        />
                        <CardContent>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h4" sx={{ mb: 1 }}>
                                    {metrics.lowStock.value}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    {getTrendIcon(metrics.lowStock.trend)}
                                    <Typography 
                                        variant="body2" 
                                        color={metrics.lowStock.trend === "up" ? "error.main" : "success.main"}
                                    >
                                        {metrics.lowStock.change} u odnosu na prošli period
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Proizvodi sa niskim nivoom zaliha
                            </Typography>
                            <List>
                                {metrics.lowStock.items.map((item, index) => (
                                    <ListItem key={index} sx={{ py: 0.5 }}>
                                        <ListItemText
                                            primary={item.name}
                                            secondary={
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <WarningIcon 
                                                        fontSize="small" 
                                                        color="error"
                                                    />
                                                    <Typography variant="body2" color="error">
                                                        Trenutno: {item.current} (Minimalno: {item.minimum})
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Trend inventara */}
                <Grid item xs={12} md={8}>
                    <Card 
                        sx={{ 
                            backgroundColor: safeColors.primary[600],
                            height: "400px",
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
                                    <TrendingUpIcon />
                                </Avatar>
                            }
                            title="Trend vrednosti inventara"
                            subheader="Promena vrednosti inventara kroz vreme"
                        />
                        <CardContent>
                            <ResponsiveContainer width="100%" height="300px">
                                <LineChart data={inventoryTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip 
                                        formatter={(value) => [`€${value.toLocaleString()}`, "Vrednost"]}
                                    />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="value" 
                                        stroke={safeColors.blueAccent[500]} 
                                        strokeWidth={2}
                                        name="Vrednost inventara"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Distribucija po kategorijama */}
                <Grid item xs={12} md={4}>
                    <Card 
                        sx={{ 
                            backgroundColor: safeColors.primary[600],
                            height: "400px",
                            transition: "transform 0.2s",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: 3
                            }
                        }}
                    >
                        <CardHeader
                            avatar={
                                <Avatar sx={{ bgcolor: safeColors.greenAccent[500] }}>
                                    <InventoryIcon />
                                </Avatar>
                            }
                            title="Distribucija po kategorijama"
                            subheader="Procentualni prikaz po kategorijama"
                        />
                        <CardContent>
                            <ResponsiveContainer width="100%" height="300px">
                                <PieChart>
                                    <Pie
                                        data={categoryDistributionData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {categoryDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value}%`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Trend porudžbina i povrata */}
                <Grid item xs={12} md={8}>
                    <Card 
                        sx={{ 
                            backgroundColor: safeColors.primary[600],
                            height: "400px",
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
                                    <ShippingIcon />
                                </Avatar>
                            }
                            title="Trend porudžbina i povrata"
                            subheader="Poređenje broja porudžbina i povrata"
                        />
                        <CardContent>
                            <ResponsiveContainer width="100%" height="300px">
                                <BarChart data={orderTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar 
                                        dataKey="orders" 
                                        fill={safeColors.greenAccent[500]} 
                                        name="Porudžbine"
                                    />
                                    <Bar 
                                        dataKey="returns" 
                                        fill={safeColors.redAccent[500]} 
                                        name="Povrati"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Top proizvodi po vrednosti */}
                <Grid item xs={12} md={4}>
                    <Card 
                        sx={{ 
                            backgroundColor: safeColors.primary[600],
                            height: "400px",
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
                                    <EuroIcon />
                                </Avatar>
                            }
                            title="Top proizvodi po vrednosti"
                            subheader="Najvredniji proizvodi u inventaru"
                        />
                        <CardContent>
                            <ResponsiveContainer width="100%" height="300px">
                                <BarChart 
                                    data={topProductsData}
                                    layout="vertical"
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis 
                                        type="category" 
                                        dataKey="name" 
                                        width={150}
                                    />
                                    <Tooltip 
                                        formatter={(value) => [`€${value.toLocaleString()}`, "Vrednost"]}
                                    />
                                    <Bar 
                                        dataKey="value" 
                                        fill={safeColors.blueAccent[500]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AnalyticsSection; 