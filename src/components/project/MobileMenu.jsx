// src/components/project/MobileMenu.jsx
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

const MobileMenu = ({ open, onClose, sections, activeSection, onChangeSection, colors }) => {
    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: 240,
                    bgcolor: colors.primary[500],
                    color: colors.grey[100]
                }
            }}
        >
            <List>
                {sections.map((section) => (
                    <ListItem
                        button
                        key={section.id}
                        selected={activeSection === section.id}
                        onClick={() => {
                            onChangeSection(section.id);
                            onClose();
                        }}
                        sx={{
                            '&.Mui-selected': {
                                bgcolor: colors.primary[600],
                                '&:hover': { bgcolor: colors.primary[600] }
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: colors.grey[100] }}>
                            {section.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={section.label}
                            primaryTypographyProps={{ variant: 'body1' }}
                        />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default MobileMenu;