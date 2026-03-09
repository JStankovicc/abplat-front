import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

/**
 * Shared mobile menu for sections (inventory, sales, project, fleet, assets).
 * @param {Object} props
 * @param {boolean} props.open - Whether menu is open
 * @param {function} props.onClose - Close callback
 * @param {Array} props.sections - Array of sections { id, label, icon }
 * @param {string} props.activeSection - Active section ID
 * @param {function} props.onChangeSection - Section change callback
 * @param {Object} props.colors - tokens object for colors
 * @param {string} [props.anchor="right"] - Drawer position (left/right)
 * @param {boolean} [props.showCloseButton=false] - Show close button
 */
const MobileMenu = ({
  open,
  onClose,
  sections,
  activeSection,
  onChangeSection,
  colors,
  anchor = "right",
  showCloseButton = false,
}) => {
  const handleSectionClick = (sectionId) => {
    onChangeSection(sectionId);
    onClose();
  };

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: colors.primary[600] || colors.primary[500] || colors.primary[400],
          color: colors.grey[100],
          width: anchor === "left" ? 240 : "min(280px, 85vw)",
          maxWidth: "100%",
        },
      }}
    >
      {showCloseButton && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <IconButton onClick={onClose} sx={{ color: colors.grey[100] }}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      <List>
        {sections.map((section) => (
          <ListItem
            key={section.id}
            button
            onClick={() => handleSectionClick(section.id)}
            selected={activeSection === section.id}
            sx={{
              "&.Mui-selected": {
                backgroundColor: colors.primary[500] || colors.primary[600],
                "&:hover": {
                  backgroundColor: colors.primary[500] || colors.primary[600],
                },
              },
              "&:hover": {
                backgroundColor: colors.primary[500],
              },
            }}
          >
            <ListItemIcon sx={{ color: colors.grey[100] }}>
              {section.icon}
            </ListItemIcon>
            <ListItemText
              primary={section.label}
              primaryTypographyProps={{ variant: "body1" }}
              sx={{ color: colors.grey[100] }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default MobileMenu;
