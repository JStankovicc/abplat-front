# ABPlat Frontend — Dokumentacija projekta

## Pregled

ABPlat je web aplikacija za upravljanje kompanijom — platforma koja integriše Dashboard, Prodaju, Projekte, Imovinu, Inventar, Vozni park, Chat, Kalendar i druge module u jedan sistem.

**Tehnologije:** React 18, Material UI (MUI) 6, React Router 6, FullCalendar, Recharts, Axios, CRACO

---

## Struktura projekta

```
abplat-front/
├── public/                 # Statički fajlovi
├── src/
│   ├── components/         # UI komponente (sve komponente)
│   │   ├── assets/         # Imovina (MovingAssets, NonMovingAssets, AssetDashboard)
│   │   ├── calendar/       # EventContent, EventDialog, EventsSidebar
│   │   ├── chat/           # NewChatDialog, ChatList, ChatWindow, utils
│   │   ├── company-settings/ # BasicInfoSection, ContactInfoSection, SubscriptionSection, PaymentMethodsSection
│   │   ├── common/         # MobileMenu, Shimmer
│   │   ├── dashboard/      # DashboardShimmer, NotificationsCard, MiniInboxCard, ProjectCard
│   │   ├── fleet/          # Vozni park (VehicleList, DriverList, FuelTracking, itd.)
│   │   ├── global/         # Sidebar, SidebarItem, SidebarProfile, Topbar, PublicNavbar
│   │   ├── homepage/       # HomeHero, MainFeaturesSection, FeatureBlock
│   │   ├── inventory/      # DashboardSection, OrdersSection, StockTrackingSection, itd.
│   │   ├── project/        # KanbanBoard, DataSection, TimelineSection, itd.
│   │   ├── project-management/ # ProjectTable, NewProjectDialog, EditProjectDialog, DeleteProjectDialog, TeamManagementDialog
│   │   ├── sales/          # PipelineBoard, ContactTable, SalesAnalytics
│   │   ├── sales-management/ # UnifiedLeadsTable, TeamManagement, StrategyConfig, itd.
│   │   └── team/           # AddUserDialog, TeamDataGrid, TeamHeader
│   ├── config/             # apiConfig.js — API URL i konfiguracija
│   ├── data/               # mockData.js, mockGeoFeatures.js
│   ├── hooks/              # useChatData, useCalendarEvents, useDashboardData, useProjectManagement
│   ├── lib/                # api.js — getAuthHeaders, getAuthHeadersMinimal
│   ├── scenes/             # Stranice (kompozicija komponenti)
│   │   ├── assets/         # AssetsView
│   │   ├── calendar/       # calendar.jsx
│   │   ├── chat/           # ChatInterface
│   │   ├── companySettings/
│   │   ├── dashboard/
│   │   ├── fleet/
│   │   ├── inventory/
│   │   ├── project/        # ProjectManagement, ProjectView
│   │   ├── public/         # homepage, login, product, contact
│   │   ├── sales/
│   │   └── user/
│   ├── services/           # assetService, chatService, companyService, websocketService
│   ├── App.js
│   ├── index.js
│   └── theme.js
├── craco.config.js         # CRACO konfiguracija (path alias @, polyfills)
├── jsconfig.json           # Path alias @ za src/
├── package.json
├── Idea.md                 # Vizija projekta
├── documentation.md        # Ova dokumentacija
└── README.md
```

---

## Konvencije i arhitektura

### Podela komponenti i scenа

- **`components/`** — sve UI komponente, podeljene po domenu (chat, calendar, project-management, itd.)
- **`scenes/`** — stranice koje kompoziraju komponente; minimalna logika, uglavnom routing i state
- **`hooks/`** — custom React hookovi za logiku (useChatData, useCalendarEvents, useProjectManagement)
- **`lib/`** — zajedničke utility funkcije (getAuthHeaders)
- **`services/`** — API pozivi (chatService, companyService, assetService)

### Path alias

- `@` ukazuje na `src/` (npr. `import X from '@/components/...'`)
- Konfigurisano u `craco.config.js` i `jsconfig.json`

### Autentifikacija

- JWT token u `localStorage` pod ključem `token`
- `getAuthHeaders()` iz `lib/api.js` vraća `Authorization: Bearer <token>`
- Zaštićene rute proveravaju token; ako nema, redirect na `/login`

### Tema i stilovi

- `theme.js` — MUI tema, dark/light mode, tokens (boje)
- `tokens(theme.palette.mode)` — pristup bojama (primary, grey, greenAccent, blueAccent, redAccent)

---

## Konfiguracija

### API

- **Fajl:** `src/config/apiConfig.js`
- **Okruženja:** development, serveo, docker, production
- **Podrazumevano:** `development` — `http://localhost:8080`
- **API path:** `/api/v1`
- **WebSocket:** `/ws-chat`

Za promenu backend URL-a izmeni `baseURL` u odgovarajućem okruženju.

### Port

- Dev server: **5000** (definisano u `package.json`: `set PORT=5000 && craco start`)

---

## Rute (App.js)

| Ruta | Komponenta | Opis |
|------|------------|------|
| `/` | Dashboard | Glavna kontrolna tabla |
| `/login` | LoginPage | Prijava |
| `/messages` | ChatInterface | Chat / Inbox |
| `/calendar` | Calendar | Kalendar događaja |
| `/team` | Team | Upravljanje korisnicima |
| `/user/:userId` | UserDetails | Detalji korisnika |
| `/companySettings` | CompanySettings | Podešavanja kompanije |
| `/project-management` | ProjectManagement | Lista projekata |
| `/project/:projectId` | ProjectView | Pojedinačni projekat |
| `/sales` | SalesView | Prodaja |
| `/sales-management` | SalesManagement | Upravljanje prodajom |
| `/inventory` | InventoryView | Inventar |
| `/assets` | AssetsView | Imovina |
| `/fleet` | FleetView | Vozni park |
| `/` (public) | HomePage | Početna stranica |
| `/product` | ProductPage | Stranica proizvoda |
| `/contact` | ContactPage | Kontakt forma |

---

## Ključni moduli

### Chat (Inbox)

- **Komponente:** `components/chat/` — NewChatDialog, ChatList, ChatWindow
- **Hook:** `useChatData` — učitavanje konverzacija, poruka, slanje
- **Servis:** `chatService` — API pozivi za inbox, poruke, kontakte
- **WebSocket:** `websocketService` (trenutno isključen, koristi se polling)

### Kalendar

- **Komponente:** `components/calendar/` — EventContent, EventDialog, EventsSidebar
- **Hook:** `useCalendarEvents` — fetch, save, delete događaja
- **API:** `/calendar/events/my`, POST/PUT/DELETE za događaje

### Upravljanje projektima

- **Komponente:** `components/project-management/` — ProjectTable, dialozi
- **Hook:** `useProjectManagement` — fetch projekata, radnici
- **API:** `/project/allByCompany`, `/project/add`, `/project/addUserToProject`

### User / Team

- **User:** `components/user/` — sekcije (Info, Profile, Permissions, Comments, Tasks, Stats)
- **Team:** `components/team/` — AddUserDialog, TeamDataGrid, TeamHeader
- **Podaci:** mockDataTeam (mock) ili API

### Company Settings

- **Komponente:** `components/company-settings/` — BasicInfo, ContactInfo, Subscription, PaymentMethods
- **Forma:** companyName, country, city, email, phone, subscription, payment methods

---

## Zavisnosti

### Glavne

- **React 18** — UI
- **MUI 6** — komponente, tema
- **React Router 6** — routing
- **Axios** — HTTP
- **FullCalendar** — kalendar
- **Recharts** — grafici
- **react-pro-sidebar** — sidebar navigacija
- **react-toastify** — notifikacije
- **jwt-decode** — JWT token

### Dev

- **CRACO** — prilagođena Webpack konfiguracija (path alias, polyfills)
- **browserify-zlib, crypto-browserify, stream-http** — Node.js polyfills za kompatibilnost

---

## Refaktorisanje (završeno)

Veliki fajlovi podeljeni u manje komponente:

- **ChatInterface** (930) → chat/, useChatData
- **ProjectManagement** (883) → project-management/, useProjectManagement
- **Calendar** (725) → calendar/, useCalendarEvents
- **User** (476) → user/
- **CompanySettings** (462) → company-settings/
- **Sidebar** (384) → SidebarItem, SidebarProfile
- **Team** (304) → team/

### Kandidati za buduće refaktorisanje

- `UnifiedLeadsTable.js` (~1560 linija)
- `KanbanBoard.jsx` (~1328)
- `MovingAssets.jsx` (~947)
- Inventory sekcije (StockTrackingSection, OrdersSection, itd.)
- Fleet komponente (VehicleList, IncidentTracking, itd.)

---

## Komentari u kodu

- Svi komentari su na **engleskom**
- Komponente imaju JSDoc komentare za opis namene

---

## Build i deploy

- **Dev:** `npm start` — port 5000
- **Build:** `npm run build` — output u `build/`
- **Test:** `npm test`

Za produkciju postavi `API_BASE_URL` u `apiConfig.js` na pravi backend URL (ili koristi relativne putanje ako je frontend iza istog domena).

---
