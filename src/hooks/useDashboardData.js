import { useState, useEffect } from "react";
import axios from "axios";
import chatService from "../services/chatService";
import { API_BASE_URL } from "../config/apiConfig";
import { getAuthHeaders } from "../lib/api";
import { jwtDecode } from "jwt-decode";

/**
 * Hook for fetching dashboard data: projects, tasks, and last message.
 */
export const useDashboardData = () => {
  const [projects, setProjects] = useState([]);
  const [projectTasks, setProjectTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [displayName, setDisplayName] = useState("");

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/userProfile/getUserProfile`, {
        headers: getAuthHeaders(),
      });
      setDisplayName(response.data.displayName || response.data.firstName || "");
    } catch {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          setDisplayName(decoded.name || decoded.displayName || "");
        }
      } catch {}
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/project/allByCompany`, {
        headers: getAuthHeaders(),
      });
      setProjects(response.data);

      const tasksPromises = response.data.map(async (project) => {
        try {
          const tasksResponse = await axios.get(`${API_BASE_URL}/project/tasks/my`, {
            headers: getAuthHeaders(),
            params: { projectId: project.id },
          });
          return { projectId: project.id, tasks: tasksResponse.data };
        } catch (err) {
          console.error(`Failed to fetch tasks for project ${project.id}:`, err);
          return { projectId: project.id, tasks: [] };
        }
      });

      const tasksResults = await Promise.all(tasksPromises);
      const tasksMap = {};
      tasksResults.forEach((result) => {
        tasksMap[result.projectId] = result.tasks;
      });
      setProjectTasks(tasksMap);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Greška pri učitavanju projekata");
    } finally {
      setLoading(false);
    }
  };

  const fetchLastMessage = async () => {
    try {
      let conversationsData = [];
      let contactsData = [];

      try {
        conversationsData = await chatService.getInbox();
      } catch {
        conversationsData = [];
      }

      try {
        contactsData = await chatService.getAllContacts();
      } catch {
        contactsData = [];
      }

      setConversations(conversationsData);
      setContacts(contactsData);

      if (conversationsData?.length > 0) {
        const mostRecentConversation = conversationsData.reduce((prev, current) => {
          const prevTime = prev.lastMessageAt ? new Date(prev.lastMessageAt) : new Date(0);
          const currentTime = current.lastMessageAt ? new Date(current.lastMessageAt) : new Date(0);
          return currentTime > prevTime ? current : prev;
        });

        try {
          const formattedConversation = await chatService.formatConversationForDisplay(
            mostRecentConversation,
            contactsData
          );

          let lastMessageContent = "";
          let lastMessageTime = null;

          try {
            const messagesData = await chatService.getMessages(
              mostRecentConversation.conversationId,
              0,
              10
            );
            if (messagesData.content?.length > 0) {
              const sortedMessages = [...messagesData.content].sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA;
              });
              const lastMsg = sortedMessages[0];
              lastMessageContent = lastMsg.content || "";
              lastMessageTime = lastMsg.createdAt ? new Date(lastMsg.createdAt) : null;
            } else {
              lastMessageContent = formattedConversation.lastMessage || "";
              lastMessageTime = formattedConversation.lastMessageTime;
            }
          } catch {
            lastMessageContent = formattedConversation.lastMessage || "";
            lastMessageTime = formattedConversation.lastMessageTime;
          }

          setLastMessage({
            conversationId: formattedConversation.conversationId,
            sender: formattedConversation.name,
            content: lastMessageContent || "Nema poruka",
            timestamp: lastMessageTime
              ? lastMessageTime.toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" })
              : "",
            unread: formattedConversation.unreadCount > 0,
            unreadCount: formattedConversation.unreadCount,
          });
        } catch {
          let lastMessageContent = "";
          let lastMessageTime = null;
          try {
            const messagesData = await chatService.getMessages(
              mostRecentConversation.conversationId,
              0,
              10
            );
            if (messagesData.content?.length > 0) {
              const sortedMessages = [...messagesData.content].sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA;
              });
              const lastMsg = sortedMessages[0];
              lastMessageContent = lastMsg.content || "";
              lastMessageTime = lastMsg.createdAt ? new Date(lastMsg.createdAt) : null;
            }
          } catch {}

          setLastMessage({
            conversationId: mostRecentConversation.conversationId,
            sender: mostRecentConversation.name || "Nepoznat korisnik",
            content:
              lastMessageContent ||
              mostRecentConversation.lastMessagePreview ||
              "Nema poruka",
            timestamp: lastMessageTime
              ? lastMessageTime.toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" })
              : mostRecentConversation.lastMessageAt
              ? new Date(mostRecentConversation.lastMessageAt).toLocaleTimeString("sr-RS", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
            unread: (mostRecentConversation.unreadCount || 0) > 0,
            unreadCount: mostRecentConversation.unreadCount || 0,
          });
        }
      } else {
        setLastMessage(null);
      }
    } catch (err) {
      console.error("Failed to fetch last message:", err);
      setLastMessage(null);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchProjects();
    fetchLastMessage();
  }, []);

  return {
    projects,
    projectTasks,
    loading,
    error,
    lastMessage,
    conversations,
    contacts,
    displayName,
  };
};
