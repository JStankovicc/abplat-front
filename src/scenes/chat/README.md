# Chat Interface - Integracija sa Backend API-jem

## Pregled

ChatInterface je refaktorisan da koristi pravi backend API umesto mock podataka. Komponenta sada podržava:

### Ključne funkcionalnosti:

1. **Real-time komunikacija preko WebSocket-a**
   - Automatska konekcija na WebSocket server
   - Real-time primanje poruka
   - Fallback na REST API ako WebSocket nije dostupan

2. **API integracija**
   - Učitavanje kontakata iz firme
   - Dohvatanje konverzacija (inbox)
   - Kreiranje direktnih konverzacija
   - Slanje poruka
   - Mark-as-read funkcionalnost

3. **Paginacija poruka**
   - Učitavanje poruka po stranicama (50 po stranici)
   - "Učitaj starije poruke" dugme
   - Optimizovano učitavanje za bolje performanse

4. **Poboljšanja UI/UX**
   - Loading indikatori
   - Error handling sa Snackbar notifikacijama
   - Optimistic updates za brže korisničko iskustvo
   - Offline/Online status indikator

## Struktura fajlova:

### Services:
- `src/services/chatService.js` - REST API pozivi
- `src/services/websocketService.js` - WebSocket komunikacija

### Utils:
- `src/utils/chatUtils.js` - Helper funkcije za formatiranje podataka

### Komponente:
- `src/scenes/chat/ChatInterface.js` - Glavna chat komponenta

## Konfiguracija:

Backend API endpoint: `http://192.168.1.30:8080/api/v1/inbox`
WebSocket endpoint: `http://192.168.1.30:8080/ws`

## Korišćene biblioteke:

- `@stomp/stompjs` - STOMP WebSocket klijent
- `sockjs-client` - SockJS klijent za WebSocket
- `axios` - HTTP klijent za REST API pozive
- `jwt-decode` - Dekodiranje JWT tokena

## Funkcionalnosti:

### Inicijalizacija:
1. Dekodiranje JWT tokena za trenutnog korisnika
2. Paralelno učitavanje kontakata i konverzacija
3. Uspostavljanje WebSocket konekcije
4. Automatsko odabiranje poslednje konverzacije

### Slanje poruka:
1. Optimistic update - poruka se odmah prikazuje u UI
2. Slanje preko WebSocket-a (ili REST API kao fallback)
3. Real-time ažuriranje za sve učesnike

### Paginacija:
1. Početno učitavanje poslednje stranice poruka (50 poruka)
2. Dugme za učitavanje starijih poruka
3. Automatsko označavanje kao pročitano

### Error handling:
1. Snackbar notifikacije za greške
2. Graceful degradation (WebSocket -> REST API)
3. Loading states za sve asinhrone operacije

## Napomene za razvoj:

1. **JWT Token**: Mora biti valjan i sadržavati `userId` ili `id` polje
2. **WebSocket Headers**: Automatski se dodaju `Authorization` i `user-id` headers
3. **Optimistic Updates**: Privremene poruke imaju `temp-` prefiks u ID-ju
4. **Message Format**: Svi datumi se formatiraju preko `formatTime` utility funkcije

## Backend Endpoints:

- `GET /api/v1/inbox/contacts/all` - Svi kontakti u firmi
- `GET /api/v1/inbox/threads` - Inbox konverzacije
- `POST /api/v1/inbox/threads/direct` - Kreiranje direktne konverzacije
- `GET /api/v1/inbox/threads/{id}/messages` - Poruke sa paginacijom
- `POST /api/v1/inbox/threads/{id}/messages` - Slanje poruke
- `POST /api/v1/inbox/threads/{id}/read` - Mark as read

## WebSocket Endpoints:

- `/app/chat.send` - Slanje poruke
- `/user/queue/messages` - Primanje poruka
- `/user/queue/ack` - ACK potvrde
