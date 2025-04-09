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

const Sidebar = () => {
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
                                            src={theme.palette.mode === "dark"
                                                ? "../../assets/ABPlatLogoInline.png"
                                                : "../../assets/ABPlatLogoInlineDark.png"}
                                            alt="ABPlat"
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
                                        src="../../assets/testSpiderman.png"
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
                                        Jovan Stanković
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        color={colors.greenAccent[500]}
                                        sx={{ fontSize: isMobile ? "0.9rem" : "1.1rem" }}
                                    >
                                        ABPlat Developer
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
                                title="Upravljanje timom"
                                to="/team"
                                icon={<PersonOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                                onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                            />
                            <Item
                                title="Strategije prodaje"
                                to="/team"
                                icon={<CalendarTodayOutlinedIcon />}
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
                                to="/team"
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