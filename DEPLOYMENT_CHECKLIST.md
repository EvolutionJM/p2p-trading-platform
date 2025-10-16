# ✅ Чеклист перед деплоєм

## 📋 Підготовка коду

### Backend:
- [ ] Всі залежності в `package.json`
- [ ] `.env` в `.gitignore`
- [ ] `.env.example` створено
- [ ] `npm start` працює локально
- [ ] Health check endpoint `/health` працює
- [ ] CORS налаштовано правильно
- [ ] Всі API endpoints працюють

### Frontend:
- [ ] `REACT_APP_API_URL` використовується замість hardcoded URL
- [ ] `npm run build` працює без помилок
- [ ] Всі залежності в `package.json`
- [ ] `.env` в `.gitignore`

---

## 🗄️ База даних

- [ ] MongoDB Atlas акаунт створено
- [ ] Безкоштовний кластер створено (M0)
- [ ] Database user створено
- [ ] IP whitelist налаштовано (0.0.0.0/0)
- [ ] Connection string скопійовано
- [ ] Пароль збережено в безпечному місці

---

## 🐙 GitHub

- [ ] Репозиторій створено
- [ ] `.gitignore` налаштовано
- [ ] Код закомічено
- [ ] Код запушено на GitHub
- [ ] Репозиторій public або Render має доступ

---

## 🚀 Render.com (Backend)

- [ ] Акаунт створено
- [ ] Web Service створено
- [ ] Репозиторій підключено
- [ ] Root Directory: `server`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Environment variables додано:
  - [ ] NODE_ENV=production
  - [ ] PORT=5000
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
  - [ ] JWT_EXPIRE
  - [ ] FRONTEND_URL
  - [ ] BYBIT_API_KEY (якщо потрібно)
  - [ ] BYBIT_API_SECRET (якщо потрібно)
  - [ ] EMAIL_* (якщо потрібно)
- [ ] Деплой успішний
- [ ] Health check працює
- [ ] Backend URL скопійовано

---

## ▲ Vercel.com (Frontend)

- [ ] Акаунт створено
- [ ] Проект імпортовано з GitHub
- [ ] Framework: Create React App
- [ ] Root Directory: `client`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `build`
- [ ] Environment variables додано:
  - [ ] REACT_APP_API_URL
- [ ] Деплой успішний
- [ ] Сайт відкривається
- [ ] Frontend URL скопійовано

---

## 🔗 Фінальні налаштування

- [ ] FRONTEND_URL оновлено на Render
- [ ] CORS працює (перевірити в браузері)
- [ ] Реєстрація працює
- [ ] Логін працює
- [ ] API запити працюють
- [ ] WebSocket працює (якщо використовується)

---

## 🧪 Тестування

- [ ] Відкрити сайт в браузері
- [ ] Зареєструвати нового користувача
- [ ] Увійти в систему
- [ ] Перевірити основні функції:
  - [ ] Marketplace
  - [ ] Wallet
  - [ ] Profile
  - [ ] KYC
  - [ ] Payment Methods
  - [ ] Spot Trading
- [ ] Перевірити на мобільному
- [ ] Перевірити в різних браузерах

---

## 📱 Після деплою

- [ ] Зберегти всі URLs:
  - Frontend: ________________
  - Backend: ________________
  - MongoDB: ________________
- [ ] Зберегти всі паролі в безпечному місці
- [ ] Налаштувати custom domain (опціонально)
- [ ] Налаштувати analytics (опціонально)
- [ ] Налаштувати monitoring (опціонально)

---

## 🔒 Безпека

- [ ] JWT_SECRET - складний і унікальний
- [ ] Паролі не в коді
- [ ] .env не в git
- [ ] HTTPS працює (автоматично на Render/Vercel)
- [ ] CORS налаштовано правильно
- [ ] Rate limiting працює
- [ ] Input validation працює

---

## 📊 Моніторинг

- [ ] Перевіряти логи на Render регулярно
- [ ] Перевіряти використання ресурсів
- [ ] Налаштувати alerts (опціонально)
- [ ] Backup бази даних (MongoDB Atlas автоматично)

---

## 🆘 Що робити якщо щось не працює?

### Backend не запускається:
1. Перевір логи на Render (вкладка Logs)
2. Перевір environment variables
3. Перевір MongoDB connection string
4. Спробуй локально: `npm start`

### Frontend не підключається:
1. Перевір REACT_APP_API_URL
2. Перевір CORS на backend
3. Відкрий Developer Console (F12) → Network
4. Подивись які помилки

### База даних не підключається:
1. Перевір connection string
2. Перевір пароль
3. Перевір IP whitelist (0.0.0.0/0)
4. Перевір чи створено database user

---

## 🎉 Успіх!

Якщо всі чекбокси відмічені - твій сайт онлайн! 🚀

**URLs:**
- 🌐 Сайт: https://___________________
- 🔧 API: https://___________________
- 📊 Render Dashboard: https://dashboard.render.com
- ▲ Vercel Dashboard: https://vercel.com/dashboard
- 🗄️ MongoDB: https://cloud.mongodb.com
