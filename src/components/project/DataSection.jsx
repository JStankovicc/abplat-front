import { useState } from 'react';
import { 
    Box, 
    Typography, 
    IconButton, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText, 
    ListItemSecondaryAction,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Breadcrumbs,
    Link,
    Menu,
    MenuItem,
    Tooltip,
    useTheme,
    Grid,
    Paper,
    Divider
} from '@mui/material';
import { tokens } from '../../theme';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';

const mockFiles = [
    { id: 1, name: 'Dokumentacija', type: 'folder', size: '-', modified: '2024-03-19', owner: 'Marko Marković' },
    { id: 2, name: 'Slike', type: 'folder', size: '-', modified: '2024-03-19', owner: 'Ana Anić' },
    { id: 3, name: 'Projektna dokumentacija.pdf', type: 'file', size: '2.5 MB', modified: '2024-03-19', owner: 'Marko Marković' },
    { id: 4, name: 'Arhitektura sistema.docx', type: 'file', size: '1.8 MB', modified: '2024-03-19', owner: 'Ana Anić' },
    { id: 5, name: 'Wireframe.png', type: 'file', size: '3.2 MB', modified: '2024-03-19', owner: 'Marko Marković' }
];

const DataSection = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentPath, setCurrentPath] = useState(['Root']);
    const [files, setFiles] = useState(mockFiles);
    const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    const handleFileClick = (file) => {
        if (file.type === 'folder') {
            setCurrentPath([...currentPath, file.name]);
            // Ovde bi trebalo da se učitaju fajlovi iz foldera
        }
    };

    const handleBack = () => {
        if (currentPath.length > 1) {
            setCurrentPath(currentPath.slice(0, -1));
            // Ovde bi trebalo da se učitaju fajlovi iz prethodnog foldera
        }
    };

    const handleCreateFolder = () => {
        if (newFolderName.trim()) {
            const newFolder = {
                id: Date.now(),
                name: newFolderName,
                type: 'folder',
                size: '-',
                modified: new Date().toISOString().split('T')[0],
                owner: 'Marko Marković' // Ovde bi trebalo da se koristi trenutni korisnik
            };
            setFiles([...files, newFolder]);
            setNewFolderName('');
            setNewFolderDialogOpen(false);
        }
    };

    const handleFileMenuOpen = (event, file) => {
        setAnchorEl(event.currentTarget);
        setSelectedFile(file);
    };

    const handleFileMenuClose = () => {
        setAnchorEl(null);
        setSelectedFile(null);
    };

    const handleDelete = () => {
        if (selectedFile) {
            setFiles(files.filter(f => f.id !== selectedFile.id));
            handleFileMenuClose();
        }
    };

    const handleDownload = () => {
        if (selectedFile && selectedFile.type === 'file') {
            // Ovde bi trebalo implementirati preuzimanje fajla
            console.log(`Downloading ${selectedFile.name}`);
            handleFileMenuClose();
        }
    };

    const handleShare = () => {
        // Ovde bi trebalo implementirati deljenje fajla
        console.log(`Sharing ${selectedFile.name}`);
        handleFileMenuClose();
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const filteredAndSortedFiles = files
        .filter(file => 
            file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            file.owner.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'name') {
                return sortOrder === 'asc' 
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else if (sortBy === 'modified') {
                return sortOrder === 'asc'
                    ? new Date(a.modified) - new Date(b.modified)
                    : new Date(b.modified) - new Date(a.modified);
            } else if (sortBy === 'owner') {
                return sortOrder === 'asc'
                    ? a.owner.localeCompare(b.owner)
                    : b.owner.localeCompare(a.owner);
            }
            return 0;
        });

    return (
        <Box sx={{ 
            p: 3,
            backgroundColor: colors.primary[400],
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            height: 'calc(100vh - 200px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" sx={{ color: colors.grey[100], fontWeight: 'bold' }}>
                    Cloud Storage
                </Typography>
                <Box>
                    <Button
                        variant="contained"
                        startIcon={<CreateNewFolderIcon />}
                        onClick={() => setNewFolderDialogOpen(true)}
                        sx={{ 
                            mr: 1,
                            backgroundColor: colors.primary[500],
                            '&:hover': { backgroundColor: colors.primary[600] }
                        }}
                    >
                        Novi Folder
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        component="label"
                        sx={{ 
                            backgroundColor: colors.primary[500],
                            '&:hover': { backgroundColor: colors.primary[600] }
                        }}
                    >
                        Upload Fajl
                        <input type="file" hidden multiple />
                    </Button>
                </Box>
            </Box>

            <Breadcrumbs 
                sx={{ 
                    mb: 2,
                    '& .MuiLink-root': { color: colors.grey[300] },
                    '& .MuiTypography-root': { color: colors.grey[100] }
                }}
            >
                {currentPath.map((path, index) => (
                    index === currentPath.length - 1 ? (
                        <Typography key={index}>{path}</Typography>
                    ) : (
                        <Link
                            key={index}
                            component="button"
                            onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
                            sx={{ 
                                cursor: 'pointer',
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                        >
                            {path}
                        </Link>
                    )
                ))}
            </Breadcrumbs>

            <Paper sx={{ 
                p: 2, 
                mb: 2,
                backgroundColor: colors.primary[500],
                borderRadius: 2
            }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Pretraži fajlove i foldere..."
                            value={searchQuery}
                            onChange={handleSearch}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ mr: 1, color: colors.grey[300] }} />
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: colors.grey[100],
                                    '& fieldset': { borderColor: colors.grey[700] },
                                    '&:hover fieldset': { borderColor: colors.grey[600] },
                                    '&.Mui-focused fieldset': { borderColor: colors.grey[100] }
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box display="flex" justifyContent="flex-end" gap={1}>
                            <Button
                                startIcon={<SortIcon />}
                                onClick={() => handleSort('name')}
                                sx={{ 
                                    color: colors.grey[100],
                                    '&:hover': { backgroundColor: colors.primary[600] }
                                }}
                            >
                                Sortiraj po imenu
                            </Button>
                            <Button
                                startIcon={<FilterListIcon />}
                                sx={{ 
                                    color: colors.grey[100],
                                    '&:hover': { backgroundColor: colors.primary[600] }
                                }}
                            >
                                Filteri
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ 
                flex: 1,
                backgroundColor: colors.primary[500],
                borderRadius: 2,
                overflow: 'auto',
                minHeight: 0
            }}>
                <List sx={{ 
                    '& .MuiListItem-root': {
                        borderBottom: `1px solid ${colors.grey[700]}`,
                        '&:last-child': { borderBottom: 'none' }
                    }
                }}>
                    {currentPath.length > 1 && (
                        <ListItem 
                            button 
                            onClick={handleBack}
                            sx={{ 
                                '&:hover': { 
                                    backgroundColor: colors.primary[600],
                                    '& .MuiListItemIcon-root': { color: colors.grey[100] }
                                }
                            }}
                        >
                            <ListItemIcon>
                                <ArrowBackIcon sx={{ color: colors.grey[300] }} />
                            </ListItemIcon>
                            <ListItemText primary=".." />
                        </ListItem>
                    )}
                    {filteredAndSortedFiles.map((file) => (
                        <ListItem
                            key={file.id}
                            button
                            onClick={() => handleFileClick(file)}
                            sx={{ 
                                '&:hover': { 
                                    backgroundColor: colors.primary[600],
                                    '& .MuiListItemIcon-root': { color: colors.grey[100] }
                                }
                            }}
                        >
                            <ListItemIcon>
                                {file.type === 'folder' ? (
                                    <FolderIcon sx={{ color: colors.grey[300] }} />
                                ) : (
                                    <InsertDriveFileIcon sx={{ color: colors.grey[300] }} />
                                )}
                            </ListItemIcon>
                            <ListItemText 
                                primary={file.name}
                                secondary={
                                    <Box component="span" sx={{ display: 'flex', gap: 2 }}>
                                        <Typography variant="body2" component="span" sx={{ color: colors.grey[300] }}>
                                            {file.size}
                                        </Typography>
                                        <Typography variant="body2" component="span" sx={{ color: colors.grey[300] }}>
                                            {file.owner}
                                        </Typography>
                                        <Typography variant="body2" component="span" sx={{ color: colors.grey[300] }}>
                                            {file.modified}
                                        </Typography>
                                    </Box>
                                }
                                sx={{
                                    '& .MuiListItemText-primary': { color: colors.grey[100] }
                                }}
                            />
                            <ListItemSecondaryAction>
                                <IconButton 
                                    edge="end" 
                                    onClick={(e) => handleFileMenuOpen(e, file)}
                                    sx={{ color: colors.grey[300] }}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleFileMenuClose}
                PaperProps={{
                    sx: {
                        backgroundColor: colors.primary[500],
                        color: colors.grey[100],
                        '& .MuiMenuItem-root': {
                            '&:hover': { backgroundColor: colors.primary[600] }
                        }
                    }
                }}
            >
                {selectedFile?.type === 'file' && (
                    <MenuItem onClick={handleDownload}>
                        <DownloadIcon sx={{ mr: 1 }} /> Preuzmi
                    </MenuItem>
                )}
                <MenuItem onClick={handleShare}>
                    <ShareIcon sx={{ mr: 1 }} /> Podeli
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: '#f44336' }}>
                    <DeleteIcon sx={{ mr: 1 }} /> Obriši
                </MenuItem>
            </Menu>

            <Dialog 
                open={newFolderDialogOpen} 
                onClose={() => setNewFolderDialogOpen(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: colors.primary[500],
                        color: colors.grey[100]
                    }
                }}
            >
                <DialogTitle>Kreiraj novi folder</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Naziv foldera"
                        fullWidth
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: colors.grey[100],
                                '& fieldset': { borderColor: colors.grey[700] },
                                '&:hover fieldset': { borderColor: colors.grey[600] },
                                '&.Mui-focused fieldset': { borderColor: colors.grey[100] }
                            },
                            '& .MuiInputLabel-root': { color: colors.grey[300] }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setNewFolderDialogOpen(false)}
                        sx={{ color: colors.grey[300] }}
                    >
                        Otkaži
                    </Button>
                    <Button 
                        onClick={handleCreateFolder}
                        sx={{ 
                            color: colors.grey[100],
                            '&:hover': { backgroundColor: colors.primary[600] }
                        }}
                    >
                        Kreiraj
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DataSection;