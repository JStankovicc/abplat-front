import { jwtDecode } from 'jwt-decode';

// Dobija trenutnog korisnika iz JWT tokena
export const getCurrentUser = () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('Nema JWT token-a u localStorage');
            return null;
        }
        
        const decoded = jwtDecode(token);
        // console.log('Dekodirani JWT token:', decoded); // Debug
        
        const user = {
            // Backend koristi email kao ID, što nije idealno ali radimo sa tim
            id: decoded.userId || decoded.id || decoded.sub,
            email: decoded.sub || decoded.email,
            name: decoded.name || decoded.displayName
        };
        
        // console.log('Formatiran korisnik:', user); // Debug
        
        if (!user.id) {
            console.error('JWT token ne sadrži userId/id polje:', decoded);
        }
        // Napomena: Backend koristi email kao ID - to je ok za ovaj sistem
        
        return user;
    } catch (error) {
        console.error('Greška pri dekodiranju tokena:', error);
        return null;
    }
};

// Formatira konverzaciju iz backend response-a u format za frontend
export const formatConversationSummary = (conversationSummary, contacts, currentUserId) => {
    console.log('Formatiranje konverzacije:', conversationSummary);
    console.log('Dostupni kontakti za formatiranje:', contacts);
    console.log('Current user ID:', currentUserId);
    
    const { conversationId, group, name, participantIds, lastMessagePreview, lastMessageAt, unreadCount } = conversationSummary;
    
    let displayName = name;
    let avatar = "https://via.placeholder.com/40";
    
    // Za direktne konverzacije, pronađi ime druge osobe
    if (!group && participantIds) {
        const otherUserId = participantIds.find(id => id !== currentUserId);
        const otherUser = contacts.find(contact => contact.id === otherUserId);
        if (otherUser) {
            displayName = otherUser.displayName;
            avatar = otherUser.profilePic ? 
                `data:image/jpeg;base64,${otherUser.profilePic}` : 
                "https://via.placeholder.com/40";
        }
    }
    
    return {
        id: conversationId,
        name: displayName,
        avatar: avatar,
        messages: [], // Poruke će se učitati zasebno
        newMessages: unreadCount > 0,
        unreadCount: unreadCount,
        lastMessagePreview: lastMessagePreview,
        lastMessageAt: lastMessageAt ? new Date(lastMessageAt) : null,
        group: group,
        participantIds: participantIds
    };
};

// Formatira poruku iz backend response-a u format za frontend
export const formatMessage = (messageResponse, currentUserId) => {
    const { id, senderId, content, createdAt } = messageResponse;
    
    return {
        id: id,
        text: content,
        sender: senderId === currentUserId ? "sent" : "received",
        senderId: senderId,
        senderAvatar: "https://via.placeholder.com/40", // Možemo dodati kasnije
        timestamp: new Date(createdAt)
    };
};

// Formatira kontakt iz backend response-a
export const formatContact = (userResponse) => {
    const { id, displayName, profilePic } = userResponse;
    
    return {
        id: id,
        name: displayName,
        avatar: profilePic ? 
            `data:image/jpeg;base64,${profilePic}` : 
            "https://via.placeholder.com/40"
    };
};

// Sortira konverzacije po vremenu poslednje poruke
export const sortConversationsByLastMessage = (conversations) => {
    return [...conversations].sort((a, b) => {
        const aTime = a.lastMessageAt || 0;
        const bTime = b.lastMessageAt || 0;
        return new Date(bTime) - new Date(aTime);
    });
};

// Formatira vreme za prikaz
export const formatTime = (date) => {
    if (!date) return '';
    
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
        // Ako je poruka iz poslednja 24 sata, prikaži samo vreme
        return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
        // Ako je poruka iz poslednje nedelje, prikaži dan u nedelji
        return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
        // Inače prikaži datum
        return messageDate.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    }
};
