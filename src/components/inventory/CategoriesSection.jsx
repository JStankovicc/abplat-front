import { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    IconButton,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Collapse,
    useTheme
} from "@mui/material";
import { tokens } from "../../theme";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Category as CategoryIcon
} from "@mui/icons-material";

const CategoriesSection = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [categories, setCategories] = useState([
        {
            id: 1,
            name: "Elektronika",
            subcategories: [
                { id: 11, name: "Laptopovi" },
                { id: 12, name: "Mobilni telefoni" },
                { id: 13, name: "Periferije" }
            ]
        },
        {
            id: 2,
            name: "Odeća",
            subcategories: [
                { id: 21, name: "Muška" },
                { id: 22, name: "Ženska" },
                { id: 23, name: "Dečija" }
            ]
        },
        {
            id: 3,
            name: "Namirnice",
            subcategories: [
                { id: 31, name: "Suva hrana" },
                { id: 32, name: "Pića" },
                { id: 33, name: "Sveže namirnice" }
            ]
        }
    ]);

    const [expandedCategories, setExpandedCategories] = useState({});
    const [newCategory, setNewCategory] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);

    const handleToggleCategory = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            setCategories(prev => [...prev, {
                id: Date.now(),
                name: newCategory.trim(),
                subcategories: []
            }]);
            setNewCategory("");
        }
    };

    const handleEditCategory = (categoryId, newName) => {
        setCategories(prev => prev.map(cat => 
            cat.id === categoryId ? { ...cat, name: newName } : cat
        ));
        setEditingCategory(null);
    };

    const handleDeleteCategory = (categoryId) => {
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    };

    return (
        <Box>
            {/* Dodavanje nove kategorije */}
            <Paper sx={{ p: 2, mb: 2, backgroundColor: colors.primary[600] }}>
                <Typography variant="h6" sx={{ mb: 2, color: colors.grey[100] }}>
                    Dodaj novu kategoriju
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                        size="small"
                        placeholder="Naziv kategorije"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddCategory}
                    >
                        Dodaj
                    </Button>
                </Box>
            </Paper>

            {/* Lista kategorija */}
            <Paper sx={{ backgroundColor: colors.primary[600] }}>
                <List>
                    {categories.map((category) => (
                        <Box key={category.id}>
                            <ListItem
                                sx={{
                                    borderBottom: `1px solid ${colors.primary[500]}`,
                                    "&:last-child": {
                                        borderBottom: "none"
                                    }
                                }}
                            >
                                <ListItemIcon>
                                    <CategoryIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        editingCategory === category.id ? (
                                            <TextField
                                                size="small"
                                                value={category.name}
                                                onChange={(e) => handleEditCategory(category.id, e.target.value)}
                                                onBlur={() => setEditingCategory(null)}
                                                autoFocus
                                            />
                                        ) : (
                                            category.name
                                        )
                                    }
                                />
                                <Box>
                                    <IconButton
                                        size="small"
                                        onClick={() => setEditingCategory(category.id)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDeleteCategory(category.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleToggleCategory(category.id)}
                                    >
                                        {expandedCategories[category.id] ? (
                                            <ExpandLessIcon />
                                        ) : (
                                            <ExpandMoreIcon />
                                        )}
                                    </IconButton>
                                </Box>
                            </ListItem>
                            <Collapse in={expandedCategories[category.id]}>
                                <List component="div" disablePadding>
                                    {category.subcategories.map((subcategory) => (
                                        <ListItem
                                            key={subcategory.id}
                                            sx={{ pl: 4 }}
                                        >
                                            <ListItemText primary={subcategory.name} />
                                            <Box>
                                                <IconButton size="small">
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton size="small">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </Box>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default CategoriesSection; 