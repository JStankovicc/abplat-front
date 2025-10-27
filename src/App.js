import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import HomePage from "./scenes/public/homepage";
import PublicNavbar from "./scenes/global/PublicNavbar";
import Sidebar from "./scenes/global/Sidebar";
import Topbar from "./scenes/global/Topbar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import Calendar from "./scenes/calendar/calendar";
import ProductPage from "./scenes/public/product";
import ContactPage from "./scenes/public/contact";
import LoginPage from "./scenes/public/login";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import ChatInterface from "./scenes/chat/ChatInterface";
import UserDetails from "./scenes/user";
import CompanySettings from "./scenes/companySettings";
import ProjectView from "./scenes/project/ProjectView";
import ProjectManagement from "./scenes/project/ProjectManagement";
import SalesView from "./scenes/sales/SalesView";
import SalesManagement from "./scenes/sales/SalesManagement";  
import InventoryView from "./scenes/inventory/InventoryView";
import AssetsView from "./scenes/assets/AssetsView";
import FleetView from "./scenes/fleet/FleetView";
function App() {
    const [theme, colorMode] = useMode();
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [userProfile, setUserProfile] = useState(null);
    const [companyInfo, setCompanyInfo] = useState(null);

    // API pozivi za korisničke podatke
    const fetchUserProfile = async (token) => {
        try {
            const response = await axios.get("http://3.73.118.83:8080/api/v1/userProfile/getUserProfile", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log('User profile response:', response.data);
            setUserProfile(response.data);
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
        }
    };

    const fetchCompanyInfo = async (token) => {
        try {
            const response = await axios.get("http://3.73.118.83:8080/api/v1/company/getCompanyInfo", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log('Company info response:', response.data);
            setCompanyInfo(response.data);
        } catch (error) {
            console.error("Failed to fetch company info:", error);
        }
    };

    const handleLogin = async (jwt) => {
        try {
            setToken(jwt);
            localStorage.setItem("token", jwt);
            
            // Pozovi API-je za korisničke podatke i company podatke
            await Promise.all([
                fetchUserProfile(jwt),
                fetchCompanyInfo(jwt)
            ]);
        } catch (error) {
            console.error("Invalid token:", error);
        }
    };

    const handleLogout = () => {
        setToken(null);
        setUserProfile(null);
        setCompanyInfo(null);
        localStorage.removeItem("token");
    };

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    handleLogout();
                } else {
                    // Ako token postoji i valjan je, učitaj podatke
                    fetchUserProfile(token);
                    fetchCompanyInfo(token);
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                handleLogout();
            }
        }
    }, [token]);

    const PrivateRoute = ({ children }) => {
        return token ? children : <Navigate to="/login" replace />;
    };

    const PublicRoute = ({ children }) => {
        return token ? <Navigate to="/dashboard" replace /> : children;
    };

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="app">
                    {/* Public Navbar for unauthenticated users */}
                    {!token && <PublicNavbar />}
                    {/* Sidebar for authenticated users */}
                    {token && <Sidebar userProfile={userProfile} companyInfo={companyInfo} />}
                    <main className="content" style={{ paddingTop: token ? '0' : '64px' }}>
                        {/* Topbar for authenticated users */}
                        {token && <Topbar companyInfo={companyInfo} />}
                        <Routes>
                            {/* Public Routes */}
                            <Route
                                path="/"
                                element={
                                    <PublicRoute>
                                        <HomePage />
                                    </PublicRoute>
                                }
                            />
                            <Route
                                path="/product"
                                element={
                                    <PublicRoute>
                                        <ProductPage />
                                    </PublicRoute>
                                }
                            />
                            <Route
                                path="/contact"
                                element={
                                    <PublicRoute>
                                        <ContactPage />
                                    </PublicRoute>
                                }
                            />
                            <Route
                                path="/login"
                                element={
                                    <PublicRoute>
                                        <LoginPage onLogin={handleLogin} />
                                    </PublicRoute>
                                }
                            />
                            {/* Private Routes */}
                            <Route
                                path="/dashboard"
                                element={
                                    <PrivateRoute>
                                        <Dashboard />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/messages"
                                element={
                                <PrivateRoute>
                                    <ChatInterface />
                                </PrivateRoute>
                                }
                            />
                            <Route
                                path="/team"
                                element={
                                    <PrivateRoute>
                                        <Team />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/sales"
                                element={
                                    <PrivateRoute>
                                        <SalesView />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/sales-management"
                                element={
                                    <PrivateRoute>
                                        <SalesManagement />
                                    </PrivateRoute>
                                }
                            />

                            <Route 
                                path="/project-management" 
                                element={
                                    <PrivateRoute>
                                        <ProjectManagement />
                                    </PrivateRoute>
                            } 
                            /> 
                            <Route
                                path="/project/:projectId"
                                element={
                                    <PrivateRoute>
                                        <ProjectView />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/inventory"
                                element={
                                    <PrivateRoute>
                                        <InventoryView />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/assets"
                                element={
                                    <PrivateRoute>
                                        <AssetsView />
                                    </PrivateRoute>
                                }
                            />  
                            <Route
                                path="/fleet"
                                element={
                                    <PrivateRoute>
                                        <FleetView />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/user/:userId"
                                element={
                                    <PrivateRoute>
                                        <UserDetails />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/companySettings"
                                element={
                                    <PrivateRoute>
                                        <CompanySettings />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/contacts"
                                element={
                                    <PrivateRoute>
                                        <Contacts />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/invoices"
                                element={
                                    <PrivateRoute>
                                        <Invoices />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/form"
                                element={
                                    <PrivateRoute>
                                        <Form />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/bar"
                                element={
                                    <PrivateRoute>
                                        <Bar />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/pie"
                                element={
                                    <PrivateRoute>
                                        <Pie />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/line"
                                element={
                                    <PrivateRoute>
                                        <Line />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/faq"
                                element={
                                    <PrivateRoute>
                                        <FAQ />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/calendar"
                                element={
                                    <PrivateRoute>
                                        <Calendar />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/geography"
                                element={
                                    <PrivateRoute>
                                        <Geography />
                                    </PrivateRoute>
                                }
                            />

                            {/* Catch-all Route */}
                            <Route path="*" element={<Navigate to="/login" replace />} />
                        </Routes>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
