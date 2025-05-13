import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Box
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const MobileMenu = ({ open, onClose, sections, activeSection, onChangeSection, colors }) => {
    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    backgroundColor: colors.primary[400],
                    width: 240,
                    boxSizing: 'border-box',
                },
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                <IconButton onClick={onClose} sx={{ color: colors.grey[100] }}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <List>
                {sections.map((section) => (
                    <ListItem
                        button
                        key={section.id}
                        onClick={() => {
                            onChangeSection(section.id);
                            onClose();
                        }}
                        selected={activeSection === section.id}
                        sx={{
                            color: colors.grey[100],
                            '&.Mui-selected': {
                                backgroundColor: colors.primary[300],
                                '&:hover': {
                                    backgroundColor: colors.primary[300],
                                },
                            },
                            '&:hover': {
                                backgroundColor: colors.primary[300],
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: colors.grey[100] }}>
                            {section.icon}
                        </ListItemIcon>
                        <ListItemText primary={section.label} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default MobileMenu; 