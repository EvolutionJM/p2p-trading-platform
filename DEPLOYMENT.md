# 🚀 Інструкція по деплою проекту

## Варіант 1: Render.com (Безкоштовно)

### Крок 1: Створити акаунт на Render.com
1. Перейди на https://render.com
2. Зареєструйся через GitHub

### Крок 2: Підключити MongoDB Atlas (Безкоштовно)
1. Перейди на https://www.mongodb.com/cloud/atlas
2. Створи безкоштовний кластер (M0)
3. Створи користувача бази даних
4. Додай IP адресу: `0.0.0.0/0` (дозволити всі)
5. Скопіюй Connection String: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

### Крок 3: Завантажити код на GitHub
```bash
# В корені проекту (2048)
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Крок 4: Деплой Backend на Render
1. На Render.com натисни "New +" → "Web Service"
2. Підключи свій GitHub репозиторій
3. Налаштування:
   - **Name**: `p2p-trading-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

4. Environment Variables (додай в Render):
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/p2p-trading
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-url.vercel.app

# Bybit API (якщо використовуєш)
BYBIT_API_KEY=your-bybit-api-key
BYBIT_API_SECRET=your-bybit-secret

# Email (якщо використовуєш)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Veriff (якщо використовуєш)
VERIFF_API_KEY=your-veriff-key
VERIFF_SECRET_KEY=your-veriff-secret
```

5. Натисни "Create Web Service"
6. Дочекайся завершення деплою (5-10 хвилин)
7. Скопіюй URL: `https://p2p-trading-backend.onrender.com`

### Крок 5: Деплой Frontend на Vercel
1. Перейди на https://vercel.com
2. Зареєструйся через GitHub
3. Натисни "Add New..." → "Project"
4. Імпортуй свій GitHub репозиторій
5. Налаштування:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

6. Environment Variables:
```
REACT_APP_API_URL=https://p2p-trading-backend.onrender.com
```

7. Натисни "Deploy"
8. Дочекайся завершення (2-5 хвилин)
9. Твій сайт буде доступний: `https://your-project.vercel.app`

### Крок 6: Оновити CORS на Backend
Після деплою frontend, додай його URL в CORS на Render:
```
FRONTEND_URL=https://your-project.vercel.app
```

---

## Варіант 2: Railway.app (Простіше)

### Крок 1: Створити акаунт
1. Перейди на https://railway.app
2. Зареєструйся через GitHub

### Крок 2: Деплой Backend
1. Натисни "New Project"
2. "Deploy from GitHub repo"
3. Обери свій репозиторій
4. Railway автоматично визначить Node.js
5. Додай змінні середовища (як вище)
6. Деплой відбудеться автоматично

### Крок 3: Деплой Frontend
1. "New Project" → "Deploy from GitHub repo"
2. Обери той самий репозиторій
3. Вкажи Root Directory: `client`
4. Додай змінну: `REACT_APP_API_URL`

---

## Варіант 3: VPS (DigitalOcean, Hetzner)

### Для досвідчених користувачів:

1. **Створи VPS** (Ubuntu 22.04)
2. **Встанови Node.js, Nginx, MongoDB**
3. **Налаштуй Nginx як reverse proxy**
4. **Використай PM2** для запуску Node.js
5. **Налаштуй SSL** через Let's Encrypt

---

## 🔧 Корисні команди

### Перевірити чи працює backend:
```bash
curl https://your-backend-url.onrender.com/health
```

### Подивитись логи на Render:
1. Відкрий свій сервіс на Render
2. Перейди в таб "Logs"

### Оновити код:
```bash
git add .
git commit -m "Update"
git push
```
Render і Vercel автоматично передеплоять проект.

---

## ⚠️ Важливо!

1. **Ніколи не комітьте .env файл!** (він в .gitignore)
2. **Змініть JWT_SECRET** на щось унікальне
3. **Додайте свій домен** (опціонально) в Vercel/Render
4. **Налаштуйте MongoDB Atlas** правильно (whitelist IP)
5. **Перевірте CORS** - додайте URL frontend в backend

---

## 📱 Після деплою:

✅ Backend: `https://your-backend.onrender.com`
✅ Frontend: `https://your-project.vercel.app`
✅ MongoDB: `mongodb+srv://...`

**Готово! Твій сайт в інтернеті!** 🎉
