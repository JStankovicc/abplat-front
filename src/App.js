import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
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

function App() {
    const [theme, colorMode] = useMode();
    const [token, setToken] = useState(localStorage.getItem("token"));

    const handleLogin = (jwt) => {
        try {
            setToken(jwt);
            localStorage.setItem("token", jwt);
        } catch (error) {
            console.error("Invalid token:", error);
        }
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem("token");
    };

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    handleLogout();
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
                    {token && <Sidebar />}
                    <main className="content" style={{ paddingTop: token ? '0' : '64px' }}>
                        {/* Topbar for authenticated users */}
                        {token && <Topbar />}
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
                                path="/user/:userId"
                                element={
                                    <PrivateRoute>
                                        <UserDetails />
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
