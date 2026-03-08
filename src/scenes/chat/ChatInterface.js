import React, { useState, useMemo } from "react";
import { Box, CssBaseline, Typography, useTheme, useMediaQuery } from "@mui/material";
import { tokens } from "../../theme";
import { useChatData } from "../../hooks/useChatData";
import { NewChatDialog, ChatList, ChatWindow } from "../../components/chat";

const ChatInterface = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  const [searchContactTerm, setSearchContactTerm] = useState("");
  const [searchChatTerm, setSearchChatTerm] = useState("");

  const {
    chats,
    contacts,
    selectedChatId,
    setSelectedChatId,
    selectedChat,
    messages,
    message,
    setMessage,
    messagesEndRef,
    handleSendMessage,
    handleContactSelect,
    handleFormalizeMessage,
    handleKeyDown,
  } = useChatData();

  const handleContactSelectAndClose = (contact) => {
    setIsNewChatDialogOpen(false);
    handleContactSelect(contact);
  };

  const filteredContacts = useMemo(
    () =>
      contacts.filter((c) =>
        c?.displayName?.toLowerCase().includes(searchContactTerm.toLowerCase())
      ),
    [contacts, searchContactTerm]
  );

  const filteredChats = useMemo(
    () => chats.filter((c) => c.name?.toLowerCase().includes(searchChatTerm.toLowerCase())),
    [chats, searchChatTerm]
  );

  return (
    <Box sx={{ height: "calc(100vh - 72px)", display: "flex" }}>
      <CssBaseline />

      <NewChatDialog
        open={isNewChatDialogOpen}
        onClose={() => setIsNewChatDialogOpen(false)}
        searchTerm={searchContactTerm}
        onSearchChange={setSearchContactTerm}
        filteredContacts={filteredContacts}
        onContactSelect={handleContactSelectAndClose}
        colors={colors}
      />

      {isSmallScreen ? (
        <Box sx={{ width: "100%", position: "relative", flex: 1 }}>
          <Box
            sx={{
              width: "100%",
              height: "100vh",
              position: "absolute",
              left: selectedChatId ? "-100%" : "0",
              transition: "left 0.3s ease",
              zIndex: 1,
            }}
          >
            <ChatList
              chats={chats}
              filteredChats={filteredChats}
              searchTerm={searchChatTerm}
              onSearchChange={setSearchChatTerm}
              selectedChatId={selectedChatId}
              onChatSelect={setSelectedChatId}
              onNewChat={() => setIsNewChatDialogOpen(true)}
              colors={colors}
              theme={theme}
              isMobile
            />
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "100vh",
              position: "absolute",
              left: selectedChatId ? "0" : "100%",
              transition: "left 0.3s ease",
              bgcolor: theme.palette.mode === "dark" ? colors.primary[800] : "#fff",
              p: 2,
              display: "flex",
              flexDirection: "column",
              zIndex: 2,
            }}
          >
            <ChatWindow
              selectedChat={selectedChat}
              messages={messages}
              message={message}
              onMessageChange={setMessage}
              onSendMessage={handleSendMessage}
              onFormalizeMessage={handleFormalizeMessage}
              onKeyDown={handleKeyDown}
              onBack={() => setSelectedChatId(null)}
              messagesEndRef={messagesEndRef}
              colors={colors}
              theme={theme}
              isMobile
            />
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: "flex", width: "100%" }}>
          <ChatList
            chats={chats}
            filteredChats={filteredChats}
            searchTerm={searchChatTerm}
            onSearchChange={setSearchChatTerm}
            selectedChatId={selectedChatId}
            onChatSelect={setSelectedChatId}
            onNewChat={() => setIsNewChatDialogOpen(true)}
            colors={colors}
            theme={theme}
            isMobile={false}
          />

          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", p: 3 }}>
            {selectedChat ? (
              <ChatWindow
                selectedChat={selectedChat}
                messages={messages}
                message={message}
                onMessageChange={setMessage}
                onSendMessage={handleSendMessage}
                onFormalizeMessage={handleFormalizeMessage}
                onKeyDown={handleKeyDown}
                messagesEndRef={messagesEndRef}
                colors={colors}
                theme={theme}
                isMobile={false}
              />
            ) : (
              <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="h6" color="textSecondary">
                  Odaberite prepisku za dopisivanje
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ChatInterface;
