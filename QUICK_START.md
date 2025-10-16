# ⚡ Швидкий старт - Деплой за 15 хвилин

## 🎯 Що потрібно:
1. Акаунт GitHub
2. Акаунт Render.com (безкоштовно)
3. Акаунт Vercel.com (безкоштовно)
4. Акаунт MongoDB Atlas (безкоштовно)

---

## 📝 Крок 1: MongoDB Atlas (5 хвилин)

1. Перейди на https://www.mongodb.com/cloud/atlas/register
2. Створи акаунт
3. Створи безкоштовний кластер (M0 Sandbox)
4. **Database Access** → Add New Database User:
   - Username: `admin`
   - Password: `створи складний пароль`
   - Збережи пароль!
5. **Network Access** → Add IP Address:
   - Додай `0.0.0.0/0` (дозволити всі)
6. **Database** → Connect → Connect your application:
   - Скопіюй Connection String:
   ```
   mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/p2p-trading
   ```
   - Заміни `PASSWORD` на свій пароль
   - Заміни `p2p-trading` на назву бази

✅ MongoDB готова!

---

## 📝 Крок 2: GitHub (2 хвилини)

1. Створи новий репозиторій на https://github.com/new
   - Назва: `p2p-trading-platform`
   - Public або Private
   - НЕ додавай README, .gitignore

2. У терміналі (в папці проекту):
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/p2p-trading-platform.git
git push -u origin main
```

✅ Код на GitHub!

---

## 📝 Крок 3: Render.com - Backend (5 хвилин)

1. Перейди на https://render.com/register
2. Зареєструйся через GitHub
3. **Dashboard** → **New +** → **Web Service**
4. **Connect repository** → обери свій репозиторій
5. Налаштування:
   ```
   Name: p2p-trading-backend
   Region: Frankfurt (ближче до України)
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

6. **Environment Variables** → додай:
   ```
   NODE_ENV = production
   PORT = 5000
   MONGODB_URI = твій_connection_string_з_кроку_1
   JWT_SECRET = будь-який-складний-рядок-мінімум-32-символи
   JWT_EXPIRE = 7d
   FRONTEND_URL = https://твій-сайт.vercel.app (додаси пізніше)
   ```

7. **Create Web Service**
8. Дочекайся деплою (5-10 хвилин)
9. Скопіюй URL: `https://p2p-trading-backend.onrender.com`

✅ Backend онлайн!

---

## 📝 Крок 4: Vercel.com - Frontend (3 хвилини)

1. Перейди на https://vercel.com/signup
2. Зареєструйся через GitHub
3. **Add New...** → **Project**
4. **Import Git Repository** → обери свій репозиторій
5. Налаштування:
   ```
   Framework Preset: Create React App
   Root Directory: client
   Build Command: npm run build
   Output Directory: build
   ```

6. **Environment Variables** → додай:
   ```
   REACT_APP_API_URL = https://p2p-trading-backend.onrender.com
   ```

7. **Deploy**
8. Дочекайся деплою (2-5 хвилин)
9. Твій сайт: `https://твій-проект.vercel.app`

✅ Frontend онлайн!

---

## 📝 Крок 5: Оновити CORS (1 хвилина)

1. Повернись на Render.com
2. Відкрий свій backend сервіс
3. **Environment** → додай/оновіть:
   ```
   FRONTEND_URL = https://твій-проект.vercel.app
   ```
4. Збережи → сервіс перезапуститься

✅ CORS налаштовано!

---

## 🎉 Готово!

Твій сайт працює:
- 🌐 Frontend: https://твій-проект.vercel.app
- 🔧 Backend: https://p2p-trading-backend.onrender.com
- 🗄️ Database: MongoDB Atlas

---

## 🔧 Перевірка

1. Відкрий https://твій-проект.vercel.app
2. Спробуй зареєструватись
3. Якщо працює - все ОК! 🎉

---

## ⚠️ Важливо!

### Перший запит може бути повільним (15-30 сек)
Render безкоштовний план "засинає" після 15 хвилин неактивності.
Перший запит "будить" сервер.

### Оновлення коду:
```bash
git add .
git commit -m "Update"
git push
```
Render і Vercel автоматично передеплоять!

---

## 🆘 Проблеми?

### Backend не запускається:
1. Перевір логи на Render (вкладка Logs)
2. Перевір чи правильний MONGODB_URI
3. Перевір чи всі змінні середовища додані

### Frontend не підключається до Backend:
1. Перевір REACT_APP_API_URL на Vercel
2. Перевір FRONTEND_URL на Render
3. Перевір CORS налаштування

### MongoDB помилка:
1. Перевір чи правильний пароль в connection string
2. Перевір чи додано IP 0.0.0.0/0 в Network Access
3. Перевір чи створено користувача бази даних

---

## 💰 Вартість:

- MongoDB Atlas: **БЕЗКОШТОВНО** (500MB)
- Render.com: **БЕЗКОШТОВНО** (750 годин/міс)
- Vercel.com: **БЕЗКОШТОВНО** (необмежено)

**Загалом: $0/міс** 🎉

---

## 📈 Апгрейд (коли потрібно):

Коли сайт виросте:
- Render Starter: $7/міс (не засинає, швидше)
- MongoDB M10: $10/міс (більше місця)
- Vercel Pro: $20/міс (більше функцій)

Або VPS (DigitalOcean/Hetzner): $4-6/міс
