import { useState, useEffect, useRef } from "react";
import chatService from "../services/chatService";

/**
 * Hook for chat data: conversations, contacts, messages, and actions.
 */
export const useChatData = () => {
  const [chats, setChats] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  const selectedChat = chats.find((chat) => chat.conversationId === selectedChatId);

  const loadChatsAndContacts = async () => {
    try {
      setLoading(true);
      const [threadsData, contactsData] = await Promise.all([
        chatService.getInbox(),
        chatService.getAllContacts(),
      ]);

      const transformedChats = await Promise.all(
        threadsData.map(async (conversation) => {
          const formatted = await chatService.formatConversationForDisplay(
            conversation,
            contactsData
          );
          try {
            const messagesData = await chatService.getMessages(
              conversation.conversationId,
              0,
              10
            );
            if (messagesData.content?.length > 0) {
              const sortedMessages = [...messagesData.content].sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA;
              });
              const lastMessage = sortedMessages[0];
              formatted.lastMessage = lastMessage.content || "";
              formatted.lastMessageTime = lastMessage.createdAt
                ? new Date(lastMessage.createdAt)
                : formatted.lastMessageTime;
            } else {
              formatted.lastMessage = formatted.lastMessage || "";
            }
          } catch {
            formatted.lastMessage = formatted.lastMessage || "";
          }
          return formatted;
        })
      );

      setChats(transformedChats);
      setContacts(contactsData);
    } catch (error) {
      console.error("Error loading chats and contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (threadId) => {
    try {
      const messagesData = await chatService.getMessages(threadId, 0, 50);
      const transformedMessages = await Promise.all(
        (messagesData.content || []).map((msg) => chatService.formatMessageForDisplay(msg))
      );
      transformedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setMessages(transformedMessages);

      if (transformedMessages.length > 0) {
        const lastMessage = transformedMessages[transformedMessages.length - 1];
        setChats((prev) =>
          prev.map((chat) => {
            if (chat.conversationId === threadId) {
              const currentLastTime = chat.lastMessageTime
                ? new Date(chat.lastMessageTime).getTime()
                : 0;
              const newLastTime = new Date(lastMessage.timestamp).getTime();
              if (newLastTime > currentLastTime) {
                return {
                  ...chat,
                  lastMessage: lastMessage.text,
                  lastMessageTime: new Date(lastMessage.timestamp),
                };
              }
            }
            return chat;
          })
        );
        const lastMsgId = transformedMessages[transformedMessages.length - 1].id;
        await chatService.markAsRead(threadId, lastMsgId);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([]);
    }
  };

  useEffect(() => {
    loadChatsAndContacts();
    const pollInterval = setInterval(loadChatsAndContacts, 2000);
    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    if (selectedChatId) {
      loadMessages(selectedChatId);
      const pollInterval = setInterval(() => loadMessages(selectedChatId), 2000);
      return () => clearInterval(pollInterval);
    } else {
      setMessages([]);
    }
  }, [selectedChatId]);

  useEffect(() => {
    if (chats.length > 0 && !selectedChatId) {
      const mostRecentChat = chats.reduce((prev, current) => {
        const prevLast = prev.lastMessageTime || new Date(0);
        const currentLast = current.lastMessageTime || new Date(0);
        return prevLast > currentLast ? prev : current;
      });
      setSelectedChatId(mostRecentChat.conversationId);
    }
  }, [chats, selectedChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim() && selectedChatId && !sendingMessage) {
      try {
        setSendingMessage(true);
        const messageText = message.trim();
        await chatService.sendMessage(selectedChatId, messageText);
        setChats((prev) =>
          prev.map((chat) =>
            chat.conversationId === selectedChatId
              ? { ...chat, lastMessage: messageText, lastMessageTime: new Date() }
              : chat
          )
        );
        await loadMessages(selectedChatId);
        await loadChatsAndContacts();
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setSendingMessage(false);
      }
    }
  };

  const handleContactSelect = async (contact) => {
    try {
      const existingChat = chats.find(
        (chat) =>
          !chat.isGroup &&
          chat.participantIds &&
          Array.from(chat.participantIds).includes(contact.id)
      );
      if (existingChat) {
        setSelectedChatId(existingChat.conversationId);
        return;
      }
      const conversationId = await chatService.createOrGetDirectConversation(contact.id);
      await loadChatsAndContacts();
      setSelectedChatId(conversationId);
    } catch (error) {
      console.error("Error creating/selecting chat:", error);
    }
  };

  const handleFormalizeMessage = () => {
    setMessage((prev) => `[Formalizovano] ${prev.trim()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return {
    chats,
    contacts,
    selectedChatId,
    setSelectedChatId,
    selectedChat,
    messages,
    message,
    setMessage,
    loading,
    messagesEndRef,
    loadChatsAndContacts,
    handleSendMessage,
    handleContactSelect,
    handleFormalizeMessage,
    handleKeyDown,
  };
};
