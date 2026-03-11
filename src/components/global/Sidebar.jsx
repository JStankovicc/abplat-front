import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import { API_BASE_URL } from "../../config/apiConfig";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import SidebarItem from "./SidebarItem";
import SidebarProfile from "./SidebarProfile";
import { useMobileSidebar } from "../../context/MobileSidebarContext";
import { useUserPermissions } from "../../hooks/useUserPermissions";

const Sidebar = ({ userProfile, companyInfo }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");
    const isMobile = useMediaQuery("(max-width:600px)");
    const { open: isMobileSidebarOpen, setOpen: setIsMobileSidebarOpen } = useMobileSidebar();
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();
    const {
        isAdmin,
        hasSalesManagement,
        hasSales,
        hasProjectManagement,
        hasProject,
        hasInventory,
        hasAssets,
        hasVehicle,
    } = useUserPermissions();

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                console.error("Nema JWT tokena");
                return;
            }

            const response = await axios.get(
                `${API_BASE_URL}/project/list`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setProjects(response.data);
        } catch (error) {
            console.error("Greška pri učitavanju projekata:", error);
        }
    };

    const handleProjectClick = (projectId) => {
        navigate(`/project/${projectId}`);
        if (isMobile) {
            setIsMobileSidebarOpen(false);
        }
    };

    const byteArrayToBase64 = (byteArray) => {
        if (!byteArray) return null;
        
        try {
            if (typeof byteArray === 'string') {
                return byteArray;
            }
            
            if (Array.isArray(byteArray)) {
                const binary = String.fromCharCode.apply(null, byteArray);
                return btoa(binary);
            }
            
            if (byteArray.constructor === Uint8Array || byteArray.buffer) {
                const binary = String.fromCharCode.apply(null, new Uint8Array(byteArray));
                return btoa(binary);
            }
            
            return null;
        } catch (error) {
            console.error('Error converting byte array to base64:', error, byteArray);
            return null;
        }
    };

    const getProfileImageUrl = () => {
        if (userProfile?.profilePic) {
            const base64String = byteArrayToBase64(userProfile.profilePic);
            return `data:image/jpeg;base64,${base64String}`;
        }
        return process.env.PUBLIC_URL + "/assets/default_profile_picture.png";
    };

    const getABPlatLogoUrl = () => {
        return theme.palette.mode === "dark"
            ? "../../assets/ABPlatLogoInline.png"
            : "../../assets/ABPlatLogoInlineDark.png";
    };

    useEffect(() => {
        if (!isMobile) {
            setIsMobileSidebarOpen(false);
        }
    }, [isMobile]);

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <>
            {isMobile && isMobileSidebarOpen && (
                <Box
                    onClick={() => setIsMobileSidebarOpen(false)}
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        zIndex: 9997,
                    }}
                />
            )}
            <Box
                sx={{
                    "& .pro-sidebar-inner": {
                        background: `${colors.primary[400]} !important`,
                    },
                    "& .pro-sidebar-layout": {
                        "&::-webkit-scrollbar": { width: "5px" },
                        "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
                        "&::-webkit-scrollbar-thumb": {
                            bgcolor: colors.grey[700],
                            borderRadius: "3px",
                            "&:hover": { bgcolor: colors.grey[600] },
                        },
                    },
                    "& .pro-icon-wrapper": { backgroundColor: "transparent !important" },
                    "& .pro-inner-item": {
                        padding: "5px 35px 5px 20px !important",
                        ...(isCollapsed && !isMobile && {
                            justifyContent: "center !important",
                            paddingLeft: "18px !important",
                            paddingRight: "8px !important",
                        }),
                    },
                    "& .pro-inner-item:hover": { color: "#868dfb !important" },
                    "& .pro-menu-item.active": { color: "#6870fa !important" },
                    position: "relative",
                    height: "100vh",
                    ...(isMobile && {
                        position: "fixed",
                        left: isMobileSidebarOpen ? 0 : "-270px",
                        transition: "left 0.3s ease-in-out",
                        zIndex: 9998,
                        width: "270px",
                        height: "100vh",
                        top: 0,
                    }),
                }}
            >
                <ProSidebar collapsed={!isMobile && isCollapsed}>
                    <Menu iconShape="square">
                        {!isMobile && (
                            <MenuItem
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                                style={{ margin: "10px 0 20px 0", color: colors.grey[100] }}
                            >
                                {!isCollapsed && (
                                    <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                                        <img
                                            src={getABPlatLogoUrl()}
                                            alt="ABPlat Logo"
                                            style={{ height: "25px", cursor: "pointer" }}
                                        />
                                        <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                            <MenuOutlinedIcon />
                                        </IconButton>
                                    </Box>
                                )}
                            </MenuItem>
                        )}

                        {(isMobile || !isCollapsed) && (
                            <Box mb="25px">
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <img
                                        alt="profile-user"
                                        width="100px"
                                        height="100px"
                                        src={getProfileImageUrl()}
                                        style={{
                                            cursor: "pointer",
                                            borderRadius: "50%",
                                            objectFit: "cover"
                                        }}
                                    />
                                </Box>
                                <Box textAlign="center">
                                    <Typography
                                        variant="h3"
                                        color={colors.grey[100]}
                                        fontWeight="bold"
                                        sx={{ m: "10px 0 0 0", fontSize: isMobile ? "1.5rem" : "1.75rem" }}
                                    >
                                        {userProfile?.displayName || "Loading..."}
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        color={colors.greenAccent[500]}
                                        sx={{ fontSize: isMobile ? "0.9rem" : "1.1rem" }}
                                    >
                                        {companyInfo?.companyName || "Loading..."}
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        <Box
                            sx={{
                                ...(isCollapsed && !isMobile
                                    ? { px: "6px", "& > div": { px: "4px", minWidth: 0 } }
                                    : { paddingLeft: "10px", paddingRight: "10px" }),
                            }}
                        >
                            <Box
                                sx={{
                                    mt: 0,
                                    mb: 1,
                                    px: 1.5,
                                    py: 1,
                                    borderRadius: 1,
                                    bgcolor: `${colors.primary[500]}80`,
                                    borderLeft: `3px solid ${colors.blueAccent[500]}`,
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: "block",
                                        color: colors.grey[400],
                                        fontWeight: 700,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        mb: 1,
                                        pl: 0.5,
                                        ...(isCollapsed && !isMobile && { display: "none" }),
                                    }}
                                >
                                    Pregled
                                </Typography>
                                <SidebarItem
                                    title="Dashboard"
                                    to="/"
                                    icon={<HomeOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                    onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                                    isCollapsed={isCollapsed}
                                    isMobile={isMobile}
                                />
                                <SidebarItem
                                    title="Inbox"
                                    to="/messages"
                                    icon={<EmailOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                    onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                                    isCollapsed={isCollapsed}
                                    isMobile={isMobile}
                                />
                                <SidebarItem
                                    title="Kalendar"
                                    to="/calendar"
                                    icon={<CalendarTodayOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                    onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                                    isCollapsed={isCollapsed}
                                    isMobile={isMobile}
                                />
                            </Box>

                            {isAdmin && (
                                <Box
                                    sx={{
                                        mt: 2,
                                        mb: 1,
                                        px: 1.5,
                                        py: 1,
                                        borderRadius: 1,
                                        bgcolor: `${colors.primary[500]}80`,
                                        borderLeft: `3px solid ${colors.greenAccent[500]}`,
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: "block",
                                            color: colors.grey[400],
                                            fontWeight: 700,
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            mb: 1,
                                            pl: 0.5,
                                            ...(isCollapsed && !isMobile && { display: "none" }),
                                        }}
                                    >
                                        Admin
                                    </Typography>
                                    <SidebarItem
                                        title="Upravljanje korisnicima"
                                        to="/team"
                                        icon={<PeopleOutlinedIcon />}
                                        selected={selected}
                                        setSelected={setSelected}
                                        onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                                        isCollapsed={isCollapsed}
                                        isMobile={isMobile}
                                    />
                                    <SidebarItem
                                        title="Podešavanja kompanije"
                                        to="/companySettings"
                                        icon={<SettingsOutlinedIcon />}
                                        selected={selected}
                                        setSelected={setSelected}
                                        onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                                        isCollapsed={isCollapsed}
                                        isMobile={isMobile}
                                    />
                                    <SidebarItem
                                        title="Pregled kompanije"
                                        to="/team"
                                        icon={<ReceiptOutlinedIcon />}
                                        selected={selected}
                                        setSelected={setSelected}
                                        onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                                        isCollapsed={isCollapsed}
                                        isMobile={isMobile}
                                    />
                                    <SidebarItem
                                        title="Lokacije"
                                        to="/locations"
                                        icon={<WarehouseOutlinedIcon />}
                                        selected={selected}
                                        setSelected={setSelected}
                                        onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                                        isCollapsed={isCollapsed}
                                        isMobile={isMobile}
                                    />
                                </Box>
                            )}

                            {(hasSalesManagement || hasSales) && (
                                <Box
                                    sx={{
                                        mt: 2,
                                        mb: 1,
                                        px: 1.5,
                                        py: 1,
                                        borderRadius: 1,
                                        bgcolor: `${colors.primary[500]}80`,
                                        borderLeft: `3px solid ${colors.redAccent[500]}`,
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: "block",
                                            color: colors.grey[400],
                                            fontWeight: 700,
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            mb: 1,
                                            pl: 0.5,
                                            ...(isCollapsed && !isMobile && { display: "none" }),
                                        }}
                                    >
                                        Prodaja
                                    </Typography>
                                    {hasSalesManagement && (
                                        <SidebarItem
                                            title="Upravljanje prodajom"
                                            to="/sales-management"
                                            icon={<StorefrontOutlinedIcon />}
                                            selected={selected}
                                            setSelected={setSelected}
                                            onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                                            isCollapsed={isCollapsed}
                                            isMobile={isMobile}
                                        />
                                    )}
                                    {hasSales && (
                                        <SidebarItem
                                            title="Prodaja"
                                            to="/sales"
                                            icon={<TrendingUpOutlinedIcon />}
                                            selected={selected}
                                            setSelected={setSelected}
                                            onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                                            isCollapsed={isCollapsed}
                                            isMobile={isMobile}
                                        />
                                    )}
                                </Box>
                            )}

                            {(hasProjectManagement || hasProject) && (
                                <Box
                                    sx={{
                                        mt: 2,
                                        mb: 1,
                                        px: 1.5,
                                        py: 1,
                                        borderRadius: 1,
                                        bgcolor: `${colors.primary[500]}80`,
                                        borderLeft: `3px solid #e6b800`,
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: "block",
                                            color: colors.grey[400],
                                            fontWeight: 700,
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            mb: 1,
                                            pl: 0.5,
                                            ...(isCollapsed && !isMobile && { display: "none" }),
                                        }}
                                    >
                                        Projekti
                                    </Typography>
                                    {hasProjectManagement && (
                                        <SidebarItem
                                            title="Upravljanje projektima"
                                            to="/project-management"
                                            icon={<PersonOutlinedIcon />}
                                            selected={selected}
                                            setSelected={setSelected}
                                            onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                                            isCollapsed={isCollapsed}
                                            isMobile={isMobile}
                                        />
                                    )}
                                    {hasProject && projects.map((project) => (
                                        <SidebarItem
                                            key={project.id}
                                            title={project.name}
                                            icon={<FolderOutlinedIcon />}
                                            selected={selected}
                                            setSelected={setSelected}
                                            onClick={() => handleProjectClick(project.id)}
                                            isCollapsed={isCollapsed}
                                            isMobile={isMobile}
                                        />
                                    ))}
                                </Box>
                            )}

                            {(hasInventory || hasAssets || hasVehicle) && (
                                <Box
                                    sx={{
                                        mt: 2,
                                        mb: 1,
                                        px: 1.5,
                                        py: 1,
                                        borderRadius: 1,
                                        bgcolor: `${colors.primary[500]}80`,
                                        borderLeft: `3px solid #ed6c02`,
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: "block",
                                            color: colors.grey[400],
                                            fontWeight: 700,
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            mb: 1,
                                            pl: 0.5,
                                            ...(isCollapsed && !isMobile && { display: "none" }),
                                        }}
                                    >
                                        Imovina
                                    </Typography>
                                    {hasInventory && (
                                        <SidebarItem
                                            title="Inventar"
                                            to="/inventory"
                                            icon={<StorefrontOutlinedIcon />}
                                            selected={selected}
                                            setSelected={setSelected}
                                            onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                                            isCollapsed={isCollapsed}
                                            isMobile={isMobile}
                                        />
                                    )}
                                    {hasAssets && (
                                        <SidebarItem
                                            title="Imovina"
                                            to="/assets"
                                            icon={<DashboardOutlinedIcon />}
                                            selected={selected}
                                            setSelected={setSelected}
                                            onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                                            isCollapsed={isCollapsed}
                                            isMobile={isMobile}
                                        />
                                    )}
                                    {hasVehicle && (
                                        <SidebarItem
                                            title="Vozila"
                                            to="/fleet"
                                            icon={<DirectionsCarIcon />}
                                            selected={selected}
                                            setSelected={setSelected}
                                            onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                                            isCollapsed={isCollapsed}
                                            isMobile={isMobile}
                                        />
                                    )}
                                </Box>
                            )}

                            <Box
                                sx={{
                                    mt: 2,
                                    mb: 1,
                                    px: 1.5,
                                    py: 1,
                                    borderRadius: 1,
                                    bgcolor: `${colors.primary[500]}80`,
                                    borderLeft: `3px solid ${colors.grey[600]}`,
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: "block",
                                        color: colors.grey[400],
                                        fontWeight: 700,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        mb: 1,
                                        pl: 0.5,
                                        ...(isCollapsed && !isMobile && { display: "none" }),
                                    }}
                                >
                                    Nalog
                                </Typography>
                                <SidebarItem
                                    title="Podešavanja"
                                    to="/companySettings"
                                    icon={<SettingsOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                    onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                                    isCollapsed={isCollapsed}
                                    isMobile={isMobile}
                                />
                                <SidebarItem
                                    title="Logout"
                                    icon={<LogoutOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                    onClick={() => {
                                        handleLogout();
                                        isMobile && setIsMobileSidebarOpen(false);
                                    }}
                                    isCollapsed={isCollapsed}
                                    isMobile={isMobile}
                                />
                            </Box>
                        </Box>
                    </Menu>
                </ProSidebar>
            </Box>
        </>
    );
};

export default Sidebar;
