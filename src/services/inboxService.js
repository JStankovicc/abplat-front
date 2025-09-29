import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

class InboxService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Get authorization header
    getAuthHeader() {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    // Create new thread
    async createThread(threadData) {
        try {
            const response = await axios.post(`${this.baseURL}/inbox/threads`, threadData, {
                headers: this.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error creating thread:', error);
            throw error;
        }
    }

    // Create direct thread with another user
    async createDirectThread(userId, message) {
        try {
            const response = await axios.post(`${this.baseURL}/inbox/threads/direct`, {
                userId: userId,
                message: message
            }, {
                headers: this.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error creating direct thread:', error);
            throw error;
        }
    }

    // Get user's threads (inbox list)
    async getUserThreads(page = 0, size = 20) {
        try {
            const response = await axios.get(`${this.baseURL}/inbox/threads`, {
                params: { page, size },
                headers: this.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching threads:', error);
            throw error;
        }
    }

    // Send message to thread
    async sendMessage(threadId, content, type = 'TEXT', metadata = null) {
        try {
            const response = await axios.post(`${this.baseURL}/inbox/threads/${threadId}/messages`, {
                content: content,
                type: type,
                metadata: metadata
            }, {
                headers: this.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    // Get messages for a thread
    async getThreadMessages(threadId, page = 0, size = 50) {
        try {
            const response = await axios.get(`${this.baseURL}/inbox/threads/${threadId}/messages`, {
                params: { page, size },
                headers: this.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }

    // Mark thread as read
    async markThreadAsRead(threadId) {
        try {
            const response = await axios.post(`${this.baseURL}/inbox/threads/${threadId}/read`, {}, {
                headers: this.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error marking thread as read:', error);
            throw error;
        }
    }

    // Get thread participants
    async getThreadParticipants(threadId) {
        try {
            const response = await axios.get(`${this.baseURL}/inbox/threads/${threadId}/participants`, {
                headers: this.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching participants:', error);
            throw error;
        }
    }

    // Get unread message count
    async getUnreadCount() {
        try {
            const response = await axios.get(`${this.baseURL}/inbox/unread-count`, {
                headers: this.getAuthHeader()
            });
            return response.data.unreadCount;
        } catch (error) {
            console.error('Error fetching unread count:', error);
            return 0;
        }
    }

    // Get all contacts (users available for messaging)
    async getAllContacts() {
        try {
            const response = await axios.get(`${this.baseURL}/inbox/contacts/all`, {
                headers: this.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching contacts:', error);
            throw error;
        }
    }

    // Format thread for display
    formatThread(thread) {
        return {
            id: thread.threadId,
            title: this.getThreadTitle(thread),
            lastMessage: thread.lastMessageContent,
            lastMessageTime: new Date(thread.lastMessageAt),
            lastMessageSender: thread.lastMessageSenderName,
            unreadCount: thread.unreadCount || 0,
            participants: thread.participants || [],
            type: thread.type,
            isActive: thread.isActive
        };
    }

    // Get appropriate title for thread
    getThreadTitle(thread) {
        if (thread.type === 'DIRECT' && thread.participants) {
            // For direct messages, use the other participant's name
            const currentUser = this.getCurrentUserId(); // You'll need to implement this
            const otherParticipant = thread.participants.find(p => p.userId !== currentUser);
            return otherParticipant ? otherParticipant.userName : 'Direct Message';
        }
        return thread.title || 'Conversation';
    }

    // Get current user ID (implement based on your auth system)
    getCurrentUserId() {
        // This should return the current user's ID
        // Implementation depends on how you store user info
        const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        return userProfile.id || 1; // Fallback to 1 for now
    }

    // Format message for display
    formatMessage(message) {
        return {
            id: message.messageId,
            content: message.content,
            sender: {
                id: message.senderId,
                name: message.senderName
            },
            timestamp: new Date(message.createdAt),
            type: message.type,
            isRead: message.isRead,
            isDeleted: message.isDeleted,
            editedAt: message.editedAt ? new Date(message.editedAt) : null
        };
    }

    // Helper to format timestamp
    formatTimestamp(date) {
        const now = new Date();
        const messageDate = new Date(date);
        const diffInMinutes = Math.floor((now - messageDate) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        
        return messageDate.toLocaleDateString();
    }

    // Check if user is typing in thread
    isUserTyping(threadId, userId) {
        // This would typically be managed by WebSocket service
        // Return false for now, implement with WebSocket integration
        return false;
    }
}

export default new InboxService();

