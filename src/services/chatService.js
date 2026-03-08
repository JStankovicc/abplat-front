import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import { getAuthHeaders } from '../lib/api';

const INBOX_API_URL = `${API_BASE_URL}/inbox`;

class ChatService {
    async getCurrentUserIdFromApi() {
        try {
            console.log('Pozivam /me API za user ID');
            const response = await axios.get(`${INBOX_API_URL}/me`, {
                headers: getAuthHeaders()
            });
            console.log('Current user ID from API:', response.data);
            return parseInt(response.data);
        } catch (error) {
            console.error('Greška pri dohvatanju user ID:', error);
            return null;
        }
    }

    async getAllContacts() {
        try {
            console.log('Pozivam kontakte API:', `${INBOX_API_URL}/contacts/all`);
            const response = await axios.get(`${INBOX_API_URL}/contacts/all`, {
                headers: getAuthHeaders()
            });
            
            console.log('Kontakte API odgovor:', response.data);
            
            // API returns List<UserResponse>
            const contacts = response.data || [];
            // Filter out null contacts
            const validContacts = contacts.filter(contact => contact && contact.id);
            console.log('Validni kontakti:', validContacts);
            return validContacts;
        } catch (error) {
            console.error('Greška pri dohvatanju kontakata:', error);
            
            // Return empty array on 403/500 instead of throwing
            if (error.response?.status === 403 || error.response?.status === 500) {
                console.warn('Backend greška pri dohvatanju kontakata, vraćam prazan niz');
                return [];
            }
            
            throw error;
        }
    }

    // Fetches all conversations for the current user (ConversationSummaryResponse[])
    async getInbox() {
        try {
            console.log('Pozivam inbox API:', `${INBOX_API_URL}/threads`);
            const response = await axios.get(`${INBOX_API_URL}/threads`, {
                headers: getAuthHeaders()
            });
            
            console.log('Inbox API odgovor:', response.data);
            
            const conversations = response.data || [];
            console.log('Validne konverzacije:', conversations);
            return conversations;
        } catch (error) {
            console.error('Greška pri dohvatanju inbox-a:', error);
            
            // Return empty array on backend errors
            if (error.response?.status >= 400) {
                console.warn('Backend greška pri dohvatanju inbox-a, vraćam prazan niz');
                return [];
            }
            
            throw error;
        }
    }

    // Creates or retrieves a direct conversation, returns conversationId
    async createOrGetDirectConversation(otherUserId) {
        try {
            const response = await axios.post(`${INBOX_API_URL}/threads/direct`, {
                otherUserId: otherUserId
            }, {
                headers: getAuthHeaders()
            });
            return response.data; // Long (conversationId)
        } catch (error) {
            console.error('Greška pri kreiranju direktne konverzacije:', error);
            throw error;
        }
    }

    // Creates a group conversation, returns conversationId
    async createGroup(name, participantIds) {
        try {
            const response = await axios.post(`${INBOX_API_URL}/threads/group`, {
                name: name,
                participantIds: participantIds // Set<Long>
            }, {
                headers: getAuthHeaders()
            });
            return response.data; // Long (conversationId)
        } catch (error) {
            console.error('Greška pri kreiranju grupe:', error);
            throw error;
        }
    }

    // Fetches messages from a conversation with pagination (Page<MessageResponse>)
    async getMessages(conversationId, page = 0, size = 50) {
        try {
            const response = await axios.get(`${INBOX_API_URL}/threads/${conversationId}/messages`, {
                headers: getAuthHeaders(),
                params: {
                    page: page,
                    size: size
                }
            });
            return response.data; // Page<MessageResponse>
        } catch (error) {
            console.error('Greška pri dohvatanju poruka:', error);
            throw error;
        }
    }

    // Sends a message via REST API, returns MessageResponse
    async sendMessage(conversationId, content) {
        try {
            const response = await axios.post(`${INBOX_API_URL}/threads/${conversationId}/messages`, {
                conversationId: conversationId,
                content: content
            }, {
                headers: getAuthHeaders()
            });
            return response.data; // MessageResponse
        } catch (error) {
            console.error('Greška pri slanju poruke:', error);
            throw error;
        }
    }

    // Marks messages as read up to a specific message
    async markAsRead(conversationId, upToMessageId) {
        try {
            await axios.post(`${INBOX_API_URL}/threads/${conversationId}/read`, {}, {
                params: { upToMessageId: upToMessageId },
                headers: getAuthHeaders()
            });
        } catch (error) {
            console.error('Greška pri označavanju kao pročitano:', error);
            throw error;
        }
    }

    async formatConversationForDisplay(conversation, allContacts = []) {
        console.log('=== formatConversationForDisplay START ===');
        console.log('Input conversation ID:', conversation.conversationId);
        console.log('Input conversation group:', conversation.group);
        console.log('Input conversation participantIds:', conversation.participantIds);
        console.log('Input allContacts count:', allContacts.length);
        
        if (!allContacts || allContacts.length === 0) {
            console.warn('⚠️ No contacts provided, trying to fetch...');
            try {
                allContacts = await this.getAllContacts();
                console.log('Fetched contacts:', allContacts.length);
            } catch (error) {
                console.error('Failed to fetch contacts:', error);
                allContacts = [];
            }
        }
        
        const displayName = await this.getConversationDisplayName(conversation, allContacts);
        
        const result = {
            id: conversation.conversationId,
            conversationId: conversation.conversationId,
            name: displayName,
            isGroup: conversation.group,
            lastMessage: conversation.lastMessagePreview || '',
            lastMessageTime: conversation.lastMessageAt ? new Date(conversation.lastMessageAt) : null,
            unreadCount: conversation.unreadCount || 0,
            participantIds: conversation.participantIds || new Set()
        };
        
        console.log('✅ Formatted result name:', result.name);
        console.log('=== formatConversationForDisplay END ===');
        return result;
    }

    async getConversationDisplayName(conversation, allContacts = []) {
        if (conversation.group) {
            return conversation.name || 'Group Chat';
        }
        
        // For 1-1 conversations, find the other participant's name
        const currentUserId = await this.getCurrentUserId();
        console.log('=== DEBUG getConversationDisplayName ===');
        console.log('Current user ID:', currentUserId, 'type:', typeof currentUserId);
        console.log('Conversation:', conversation);
        console.log('Conversation participantIds type:', typeof conversation.participantIds);
        console.log('Conversation participantIds value:', conversation.participantIds);
        console.log('All contacts count:', allContacts.length);
        console.log('All contacts:', allContacts);
        console.log('Sample contact:', allContacts[0]);
        
        // participantIds can be array or Set
        let participantIds = [];
        if (Array.isArray(conversation.participantIds)) {
            participantIds = conversation.participantIds;
        } else if (conversation.participantIds && typeof conversation.participantIds === 'object') {
            // May be Set or plain object - convert to array
            try {
                participantIds = Array.from(conversation.participantIds);
            } catch (error) {
                console.error('Error converting participantIds to array:', error);
                // May be an object with keys
                participantIds = Object.keys(conversation.participantIds).map(key => parseInt(key));
            }
        } else if (conversation.participantIds) {
            // May be a string or number
            participantIds = [parseInt(conversation.participantIds)];
        }
            
        console.log('Processed participant IDs:', participantIds);
        
        // Ensure numeric comparison
        const currentUserIdNum = parseInt(currentUserId);
        const participantIdsNum = participantIds.map(id => parseInt(id));
        const otherParticipantId = participantIdsNum.find(id => id !== currentUserIdNum);
        console.log('Other participant ID:', otherParticipantId);
            
        if (otherParticipantId) {
            const otherUser = allContacts.find(contact => parseInt(contact.id) === otherParticipantId);
            console.log('Found other user:', otherUser);
            console.log('Other user displayName:', otherUser?.displayName);
            
            if (otherUser && otherUser.displayName) {
                console.log('✅ Returning displayName:', otherUser.displayName);
                return otherUser.displayName;
            } else {
                // Fallback - try any contact with that ID
                console.warn('Could not find displayName, searching all contacts...');
                const anyContact = allContacts.find(c => c && (c.id === otherParticipantId || parseInt(c.id) === otherParticipantId));
                console.log('Any contact found:', anyContact);
                const fallbackName = anyContact ? (anyContact.displayName || anyContact.name || `User ${otherParticipantId}`) : 'Direct Message';
                console.log('⚠️ Returning fallback name:', fallbackName);
                return fallbackName;
            }
        }
        
        console.warn('❌ No other participant found, returning fallback name');
        const finalFallback = conversation.name || 'Conversation';
        console.log('❌ Final fallback:', finalFallback);
        return finalFallback;
    }

    async formatMessageForDisplay(message) {
        const currentUserId = await this.getCurrentUserId();
        
        console.log('=== formatMessageForDisplay ===');
        console.log('Current user ID:', currentUserId, 'type:', typeof currentUserId);
        console.log('Message sender ID:', message.senderId, 'type:', typeof message.senderId);
        
        const currentUserIdNum = parseInt(currentUserId);
        const messageSenderIdNum = parseInt(message.senderId);
        const isSentByCurrentUser = messageSenderIdNum === currentUserIdNum;
        
        console.log('Is sent by current user:', isSentByCurrentUser);
        
        return {
            id: message.id,
            text: message.content,
            sender: isSentByCurrentUser ? 'sent' : 'received',
            senderId: message.senderId,
            senderAvatar: "https://via.placeholder.com/40",
            timestamp: new Date(message.createdAt),
            status: message.status
        };
    }

    async getCurrentUserId() {
        const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        if (userProfile.id) {
            console.log('Current user ID from userProfile:', userProfile.id, 'type:', typeof userProfile.id);
            return parseInt(userProfile.id);
        }
        
        const userIdFromApi = await this.getCurrentUserIdFromApi();
        if (userIdFromApi) {
            // Cache in localStorage for next time
            const updatedProfile = { ...userProfile, id: userIdFromApi };
            localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
            return userIdFromApi;
        }
        
        // API fallback: try to get ID from JWT token
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                console.log('JWT payload:', payload);
                
                const userId = payload.userId || payload.id;
                if (userId && !isNaN(parseInt(userId))) {
                    console.log('Current user ID from JWT:', userId, 'type:', typeof userId);
                    return parseInt(userId);
                }
            } catch (error) {
                console.error('Error parsing JWT token:', error);
            }
        }
        
        console.warn('Could not determine current user ID, using fallback: 1');
        return 1; // Fallback
    }
}

export default new ChatService();
