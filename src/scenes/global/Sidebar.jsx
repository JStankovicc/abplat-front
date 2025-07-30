import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const Item = ({ title, to, icon, selected, setSelected, onClick }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <MenuItem
            active={selected === title}
            style={{ color: colors.grey[100] }}
            onClick={() => {
                setSelected(title);
                if (onClick) onClick();
            }}
            icon={icon}
        >
            <Typography>{title}</Typography>
            {to && <Link to={to} />}
        </MenuItem>
    );
};

const Sidebar = ({ userProfile, companyInfo }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");
    const isMobile = useMediaQuery("(max-width:600px)");
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    // Funkcija za konverziju byte array u base64 string
    const byteArrayToBase64 = (byteArray) => {
        if (!byteArray) return null;
        
        try {
            // Ako je već string, vrati ga direktno
            if (typeof byteArray === 'string') {
                return byteArray;
            }
            
            // Ako je array brojeva
            if (Array.isArray(byteArray)) {
                const binary = String.fromCharCode.apply(null, byteArray);
                return btoa(binary);
            }
            
            // Ako je Uint8Array ili slična struktura
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

    // Kreiranje URL-a za slike
    const getProfileImageUrl = () => {
        if (userProfile?.profilePic) {
            const base64String = byteArrayToBase64(userProfile.profilePic);
            return `data:image/jpeg;base64,${base64String}`;
        }
        return "../../assets/testSpiderman.png"; // fallback
    };

    // ABPlat logo uvek u sidebar-u
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

    return (
        <>
            {isMobile && (
                <IconButton
                    onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                    sx={{
                        position: 'fixed',
                        top: 10,
                        left: 10,
                        zIndex: 9999,
                        backgroundColor: colors.primary[400],
                        '&:hover': { backgroundColor: colors.primary[300] }
                    }}
                >
                    <MenuOutlinedIcon />
                </IconButton>
            )}

            <Box
                sx={{
                    "& .pro-sidebar-inner": {
                        background: `${colors.primary[400]} !important`,
                    },
                    "& .pro-icon-wrapper": { backgroundColor: "transparent !important" },
                    "& .pro-inner-item": { padding: "5px 35px 5px 20px !important" },
                    "& .pro-inner-item:hover": { color: "#868dfb !important" },
                    "& .pro-menu-item.active": { color: "#6870fa !important" },
                    position: "relative",
                    height: "100vh",
                    ...(isMobile && {
                        position: 'fixed',
                        left: isMobileSidebarOpen ? 0 : '-270px',
                        transition: 'left 0.3s ease-in-out',
                        zIndex: 9998,
                        width: '270px',
                        height: '100vh',
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

                        {/* PROFILE SEKCIJA */}
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

                        <Box paddingLeft={isCollapsed && !isMobile ? undefined : "10%"}>
                            <Item
                                title="Dashboard"
                                to="/"
                                icon={<HomeOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                                onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                            />

                            <Item
                                title="Inbox"
                                to="/messages"
                                icon={<EmailOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                                onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                            />

                            <Item
                                title="Kalendar"
                                to="/calendar"
                                icon={<CalendarTodayOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                                onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                            />

                            <Typography variant="h6" color={colors.grey[300]} sx={{ m: "15px 0 5px 20px" }}>
                                Admin
                            </Typography>
                            <Item
                                title="Upravljanje korisnicima"
                                to="/team"
                                icon={<PeopleOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                                onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                            />
                            <Item
                                title="Podesavanja kompanije"
                                to="/companySettings"
                                icon={<SettingsOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                                onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                            />
                            <Item
                                title="Pregled kompanije"
                                to="/team"
                                icon={<ReceiptOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                                onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                            />

                            <Typography variant="h6" color={colors.grey[300]} sx={{ m: "15px 0 5px 20px" }}>
                                Prodaja
                            </Typography>
                            <Item
                                title="Upravljanje prodajom"
                                to="/sales-management"
                                icon={<StorefrontOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                                onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                            />
                            <Item
                                title="Prodaja"
                                to="/sales"
                                icon={<TrendingUpOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                                onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                            />

                            {/* Project sekcija */}
                            <Typography variant="h6" color={colors.grey[300]} sx={{ m: "15px 0 5px 20px" }}>
                                Projekti
                            </Typography>
                            <Item
                                title="Upravljanje projektima"
                                to="/project-management"
                                icon={<PersonOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                                onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                            />
                            <Item
                                title="Projekat X"
                                to="/project"
                                icon={<CalendarTodayOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                                onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                            />

                            {/* Imovina sekcija */}
                            <Typography variant="h6" color={colors.grey[300]} sx={{ m: "15px 0 5px 20px" }}>
                                Imovina
                            </Typography>
                            <Item
                                title="Inventar"
                                to="/inventory"
                                icon={<StorefrontOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                                onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                            />
                            <Item
                                title="Imovina"
                                to="/assets"
                                icon={<DashboardOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                                onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                            />
                            <Item
                                title="Vozila"
                                to="/fleet"
                                icon={<DirectionsCarIcon />}
                                selected={selected}
                                setSelected={setSelected}
                                onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                            />

                            {isMobile && (
                                <Item
                                    title="Podesavanja"
                                    to="/settings"
                                    icon={<SettingsOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                    onClick={() => setIsMobileSidebarOpen(false)}
                                />
                            )}

                            <Box mt="30px">
                                <Item
                                    title="Logout"
                                    icon={<LogoutOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                    onClick={() => {
                                        handleLogout();
                                        isMobile && setIsMobileSidebarOpen(false);
                                    }}
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