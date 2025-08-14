import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { WS_BASE_URL } from '../config/apiConfig';

class WebSocketService {
    constructor() {
        this.client = null;
        this.isConnected = false;
        this.messageHandlers = [];
        this.connectionHandlers = [];
        this.errorHandlers = [];
        this.currentUserId = null;
        this.disabled = false; // Flag za potpuno onemogućavanje
        this.failedAttempts = 0;
        this.maxFailedAttempts = 1; // Samo jedan pokušaj
    }

    connect(userId) {
        if (this.isConnected) {
            return Promise.resolve();
        }

        if (this.disabled) {
            console.warn('WebSocket je onemogućen, pokušavam ponovo...');
            this.disabled = false; // Reset disabled status
        }

        if (!userId) {
            return Promise.reject(new Error('UserId je potreban za WebSocket konekciju'));
        }

        this.currentUserId = userId;
        const token = localStorage.getItem('token');

        if (!token) {
            return Promise.reject(new Error('Token je potreban za WebSocket konekciju'));
        }

        return new Promise((resolve, reject) => {
            // Pokušaj prvo čisti WebSocket, pa onda SockJS fallback
            const wsUrl = WS_BASE_URL.replace('/ws-chat', '/ws-chat');
            
            this.client = new Client({
                webSocketFactory: () => {
                    // Pokušaj čisti WebSocket
                    try {
                        return new WebSocket(wsUrl.replace('http://', 'ws://'));
                    } catch (error) {
                        console.warn('WebSocket failed, falling back to SockJS:', error);
                        // Fallback na SockJS
                        return new SockJS(WS_BASE_URL.replace('/ws-chat', '/ws-chat-sockjs'), null, {
                            transports: ['websocket', 'xhr-streaming', 'xhr-polling']
                        });
                    }
                },
                connectHeaders: {
                    'Authorization': `Bearer ${token}`,
                    'user-id': userId.toString()
                },
                reconnectDelay: 0, // Onemogući automatski reconnect
                maxWebSocketChainRetries: 0, // Nema retry-ja
                debug: (str) => {
                    // Umanji debug spam
                    if (!str.includes('scheduling reconnection')) {
                        console.log('STOMP Debug:', str);
                    }
                },
                onConnect: (frame) => {
                    console.log('✅ WebSocket uspešno povezan:', frame);
                    this.isConnected = true;
                    this.failedAttempts = 0; // Reset failed attempts na uspešnu konekciju
                    this.disabled = false; // Reset disabled status
                    
                    // Pretplati se na personalne poruke (tvoj sistem)
                    console.log('🔔 Subscribing to /user/queue/messages');
                    this.client.subscribe('/user/queue/messages', (message) => {
                        console.log('📨 Received message:', message.body);
                        const messageData = JSON.parse(message.body);
                        this.notifyMessageHandlers(messageData);
                    });

                    // Pretplati se na ACK poruke (tvoj sistem)
                    console.log('🔔 Subscribing to /user/queue/ack');
                    this.client.subscribe('/user/queue/ack', (message) => {
                        const ackData = JSON.parse(message.body);
                        console.log('✅ Message ACK received:', ackData);
                        // Možeš dodati handler za ACK poruke
                    });

                    this.notifyConnectionHandlers(true);
                    resolve();
                },
                onStompError: (frame) => {
                    console.error('STOMP greška:', frame);
                    this.isConnected = false;
                    this.failedAttempts++;
                    this.notifyErrorHandlers(frame);
                    this.notifyConnectionHandlers(false);
                    reject(new Error(`STOMP greška: ${frame.headers?.message || 'Nepoznata greška'}`));
                },
                onWebSocketError: (error) => {
                    console.error('WebSocket greška:', error);
                    this.isConnected = false;
                    this.failedAttempts++;
                    this.notifyErrorHandlers(error);
                    this.notifyConnectionHandlers(false);
                    reject(error);
                },
                onWebSocketClose: (event) => {
                    console.warn('WebSocket zatvoren:', event);
                    this.isConnected = false;
                    this.failedAttempts++;
                    this.notifyConnectionHandlers(false);
                    
                    // Ako je CORS problem (code 1006), odmah onemogući WebSocket
                    if (event.code === 1006) {
                        console.warn('Detektovan CORS problem - onemogućavam WebSocket');
                        this.disabled = true;
                    }
                },
                onDisconnect: () => {
                    console.log('WebSocket diskonektovan');
                    this.isConnected = false;
                    this.notifyConnectionHandlers(false);
                }
            });

            // Timeout za konekciju - ako se ne konektuje u 3 sekunde, prekini
            const connectionTimeout = setTimeout(() => {
                if (!this.isConnected) {
                    console.warn('WebSocket konekcija timeout - prekidam pokušaj');
                    this.failedAttempts++;
                    this.client?.deactivate();
                    reject(new Error('WebSocket konekcija timeout'));
                }
            }, 3000);

            // Očisti timeout kad se konektuje
            const originalResolve = resolve;
            resolve = () => {
                clearTimeout(connectionTimeout);
                originalResolve();
            };

            const originalReject = reject;
            reject = (error) => {
                clearTimeout(connectionTimeout);
                originalReject(error);
            };

            this.client.activate();
        });
    }

    disconnect() {
        if (this.client && this.isConnected) {
            this.client.deactivate();
            this.isConnected = false;
            this.currentUserId = null;
        }
    }

    // Resetuj WebSocket servis (omogućava ponovni pokušaj)
    reset() {
        this.disconnect();
        this.disabled = false;
        this.failedAttempts = 0;
        console.log('WebSocket servis resetovan - mogu se pokušati nove konekcije');
    }

    sendMessage(conversationId, content) {
        if (!this.isConnected || !this.client) {
            console.error('❌ WebSocket nije povezan');
            throw new Error('WebSocket nije povezan');
        }

        console.log('📤 Sending message via WebSocket:', {
            conversationId,
            content,
            userId: this.currentUserId
        });

        // Šalje preko tvog WebSocket endpointa
        this.client.publish({
            destination: '/app/chat.send',
            body: JSON.stringify({
                conversationId: conversationId,
                content: content
            }),
            headers: {
                'user-id': this.currentUserId?.toString() || ''
            }
        });
    }

    subscribeToThread(threadId) {
        if (!this.isConnected || !this.client) {
            throw new Error('WebSocket nije povezan');
        }

        console.log(`🔔 Subscribing to conversation topic: /topic/conversation/${threadId}`);
        
        // Pretplati se na poruke za specifičnu konverzaciju
        this.client.subscribe(`/topic/conversation/${threadId}`, (message) => {
            console.log(`📨 Received message for conversation ${threadId}:`, message.body);
            const messageData = JSON.parse(message.body);
            this.notifyMessageHandlers(messageData);
        });

        // Pretplati se na typing indikatore za thread
        this.client.subscribe(`/topic/thread/${threadId}/typing`, (message) => {
            const typingData = JSON.parse(message.body);
            console.log('Typing indicator:', typingData);
            // Možeš dodati handler za typing indikatore
        });
    }

    sendTypingIndicator(threadId, isTyping = true) {
        if (!this.isConnected || !this.client) {
            return;
        }

        this.client.publish({
            destination: '/app/chat.typing',
            body: JSON.stringify({
                type: isTyping ? 'TYPING' : 'STOP_TYPING',
                sender: this.currentUserId?.toString() || '',
                threadId: threadId
            })
        });
    }

    // Handler management
    addMessageHandler(handler) {
        this.messageHandlers.push(handler);
    }

    removeMessageHandler(handler) {
        this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    }

    addConnectionHandler(handler) {
        this.connectionHandlers.push(handler);
    }

    removeConnectionHandler(handler) {
        this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
    }

    addErrorHandler(handler) {
        this.errorHandlers.push(handler);
    }

    removeErrorHandler(handler) {
        this.errorHandlers = this.errorHandlers.filter(h => h !== handler);
    }

    // Notification methods
    notifyMessageHandlers(message) {
        this.messageHandlers.forEach(handler => {
            try {
                handler(message);
            } catch (error) {
                console.error('Greška u message handler-u:', error);
            }
        });
    }

    notifyConnectionHandlers(connected) {
        this.connectionHandlers.forEach(handler => {
            try {
                handler(connected);
            } catch (error) {
                console.error('Greška u connection handler-u:', error);
            }
        });
    }

    notifyErrorHandlers(error) {
        this.errorHandlers.forEach(handler => {
            try {
                handler(error);
            } catch (error) {
                console.error('Greška u error handler-u:', error);
            }
        });
    }

    isWebSocketConnected() {
        return this.isConnected;
    }
}

export default new WebSocketService();
