import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme
} from "@mui/material";
import { tokens } from "../../theme";

const MobileMenu = ({ open, onClose, sections, activeSection, onChangeSection, colors }) => {
    const handleSectionClick = (sectionId) => {
        onChangeSection(sectionId);
        onClose();
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    backgroundColor: colors.primary[400],
                    color: colors.grey[100],
                    width: "250px"
                }
            }}
        >
            <List>
                {sections.map((section) => (
                    <ListItem
                        button
                        key={section.id}
                        onClick={() => handleSectionClick(section.id)}
                        selected={activeSection === section.id}
                        sx={{
                            "&.Mui-selected": {
                                backgroundColor: colors.primary[500],
                                "&:hover": {
                                    backgroundColor: colors.primary[600]
                                }
                            },
                            "&:hover": {
                                backgroundColor: colors.primary[500]
                            }
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