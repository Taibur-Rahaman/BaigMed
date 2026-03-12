# BaigDentPro

Professional dental clinic management – prescription panel, patient records, and treatment planning (React + Vite).

## Setup

```bash
npm install
npm run dev
```

Open the URL from Vite (e.g. `http://localhost:5173`).

## Features

- **Login** – Choose Prescription or Records panel (demo credentials)
- **Prescription** – Patient details, O/E, Ix, drug list, save & print
- **Records** – Patient list (table with View/Edit/Delete), appointments, inventory
- **Patient profile** – Tooth selection (permanent/deciduous), medical history, treatment plans
- **Tooth chart** – Select teeth by quadrant; Full Mouth / Multi Teeth

## Deploy on Vercel

1. Push this repo to GitHub: [Taibur-Rahaman/BaigDentPro](https://github.com/Taibur-Rahaman/BaigDentPro)
2. In [Vercel](https://vercel.com), **Add New Project** → Import **Taibur-Rahaman/BaigDentPro**
3. Leave build settings as default (Vite is auto-detected)
4. Deploy

The repo includes `vercel.json` for SPA routing.

## License

MIT
