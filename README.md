# ABPlat Frontend

Web aplikacija za upravljanje kompanijom — platforma koja integriše Dashboard, Prodaju, Projekte, Imovinu, Inventar, Vozni park, Chat, Kalendar i druge module.

## Tehnologije

- React 18
- Material UI (MUI) 6
- React Router 6
- FullCalendar, Recharts, Axios
- CRACO (Webpack override)

## Preduslovi

- Node.js 18+ (preporučeno LTS)
- npm 9+

## Pokretanje projekta

### 1. Instalacija zavisnosti

```bash
npm install
```

## 1.1 Mozda treba
```bash
npm install --legacy-peer-deps
```

### 2. Pokretanje u development režimu

```bash
npm start
```

Aplikacija će biti dostupna na **http://localhost:5000**.

### 3. Build za produkciju

```bash
npm run build
```

Izlaz se nalazi u folderu `build/`.

### 4. Testovi

```bash
npm test
```

## Konfiguracija

- **API backend:** `src/config/apiConfig.js` — podešava se `baseURL` za različita okruženja (development, production, itd.)
- **Port:** 5000 (definisano u `package.json`)

## Dokumentacija

Detaljna dokumentacija projekta nalazi se u **[documentation.md](./documentation.md)** — struktura, rute, moduli, konvencije i arhitektura.

## Vizija projekta

Vizija i planirani moduli opisani su u **[Idea.md](./Idea.md)**.
