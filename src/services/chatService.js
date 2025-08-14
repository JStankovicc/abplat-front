import axios from 'axios';

const API_BASE_URL = "http://192.168.1.30:8080/api/v1/inbox";

// Helper funkcija za auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
};

class ChatService {
    // Dohvata sve kontakte u firmi
    async getAllContacts() {
        try {
            console.log('Pozivam kontakte API:', `${API_BASE_URL}/contacts/all`);
            const response = await axios.get(`${API_BASE_URL}/contacts/all`, {
                headers: getAuthHeaders()
            });
            
            console.log('Kontakte API odgovor:', response.data);
            
            // Filter out null/undefined contacts from backend
            const validContacts = response.data?.filter(contact => contact && contact.id) || [];
            console.log('Validni kontakti:', validContacts);
            return validContacts;
        } catch (error) {
            console.error('Greška pri dohvatanju kontakata:', error);
            
            // Ako je 403 ili 500, vrati prazan niz umesto da baca grešku
            if (error.response?.status === 403 || error.response?.status === 500) {
                console.warn('Backend greška pri dohvatanju kontakata, vraćam prazan niz');
                return [];
            }
            
            throw error;
        }
    }

    // Dohvata inbox - sve konverzacije korisnika
    async getInbox() {
        try {
            console.log('Pozivam inbox API:', `${API_BASE_URL}/threads`);
            const response = await axios.get(`${API_BASE_URL}/threads`, {
                headers: getAuthHeaders()
            });
            
            console.log('Inbox API odgovor:', response.data);
            
            // Filter out null/undefined conversations
            const validConversations = response.data?.filter(conv => conv && conv.conversationId) || [];
            console.log('Validne konverzacije:', validConversations);
            return validConversations;
        } catch (error) {
            console.error('Greška pri dohvatanju inbox-a:', error);
            
            // Ako je backend greška, vrati prazan niz
            if (error.response?.status >= 400) {
                console.warn('Backend greška pri dohvatanju inbox-a, vraćam prazan niz');
                return [];
            }
            
            throw error;
        }
    }

    // Kreira ili dohvata direktnu konverzaciju
    async createOrGetDirectConversation(otherUserId) {
        try {
            const response = await axios.post(`${API_BASE_URL}/threads/direct`, {
                otherUserId: otherUserId
            }, {
                headers: getAuthHeaders()
            });
            return response.data; // Long - ID konverzacije
        } catch (error) {
            console.error('Greška pri kreiranju direktne konverzacije:', error);
            throw error;
        }
    }

    // Kreira grupu
    async createGroup(name, participantIds) {
        try {
            const response = await axios.post(`${API_BASE_URL}/threads/group`, {
                name: name,
                participantIds: participantIds
            }, {
                headers: getAuthHeaders()
            });
            return response.data; // Long - ID konverzacije
        } catch (error) {
            console.error('Greška pri kreiranju grupe:', error);
            throw error;
        }
    }

    // Dohvata poruke iz thread-a sa paginacijom
    async getMessages(conversationId, page = 0, size = 50) {
        try {
            const response = await axios.get(`${API_BASE_URL}/threads/${conversationId}/messages`, {
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

    // Šalje poruku preko REST API-ja
    async sendMessage(conversationId, content) {
        try {
            const response = await axios.post(`${API_BASE_URL}/threads/${conversationId}/messages`, {
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

    // Označava poruke kao pročitane
    async markAsRead(conversationId, upToMessageId) {
        try {
            await axios.post(`${API_BASE_URL}/threads/${conversationId}/read`, null, {
                headers: getAuthHeaders(),
                params: {
                    upToMessageId: upToMessageId
                }
            });
        } catch (error) {
            console.error('Greška pri označavanju kao pročitano:', error);
            throw error;
        }
    }
}

export default new ChatService();
