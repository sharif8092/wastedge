# 🚀 Production Deployment Guidelines - Wasteage Solution

Follow these instructions to compile, bundle, and safely deploy **Wasteage Solution** to custom host environments.

---

## 🏃 Testing Local Runs

```bash
# 1. Install dependencies
npm install

# 2. Boot dev server on http://localhost:3000
npm run dev
```

---

## 🛠️ Compiling for Production

To compile this React, Vite, and tailwind TypeScript SPA:

1. Executing the compile tool commands:
   ```bash
   npm run build
   ```
2. The compilation artifacts will populate inside the newly generated `/dist` directory. This is a fully self-contained folder that can be served via standard high-performance Nginx servers or static CDN hosts like Vercel, Netlify, or Firebase Hosting.

---

## 🐋 Deploying on Containers (Cloud Run)

A pre-configured Dockerfile structure or standard Node container runner operates perfectly:

1. Ensure the Node.js server serves the static assets from `/dist` using port `3000` bound to `0.0.0.0`.
2. Push your repository code.
3. Configure the env credentials safely behind your hosting provider's Secrets Manager panel.
