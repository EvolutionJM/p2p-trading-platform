# 📸 Візуальний гайд по деплою

## 🎯 Мета: Виставити сайт в інтернет за 15 хвилин

---

## Крок 1️⃣: MongoDB Atlas (5 хв)

### 1.1 Реєстрація
```
https://www.mongodb.com/cloud/atlas/register
↓
Sign Up (безкоштовно)
↓
Підтверди email
```

### 1.2 Створення кластера
```
Create a Deployment
↓
M0 (FREE) ← обери цей!
↓
Provider: AWS
Region: Frankfurt (ближче до України)
↓
Create
```

### 1.3 Налаштування доступу
```
Security → Database Access
↓
Add New Database User
↓
Username: admin
Password: [створи складний]
↓
Add User
```

```
Security → Network Access
↓
Add IP Address
↓
0.0.0.0/0 (Allow access from anywhere)
↓
Confirm
```

### 1.4 Connection String
```
Database → Connect
↓
Connect your application
↓
Driver: Node.js
Version: 5.5 or later
↓
Copy connection string:
mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/
↓
Заміни PASSWORD на свій пароль
Додай /p2p-trading в кінці
```

**Результат:**
```
mongodb+srv://admin:MyPassword123@cluster0.xxxxx.mongodb.net/p2p-trading
```

✅ MongoDB готова!

---

## Крок 2️⃣: GitHub (2 хв)

### 2.1 Створення репозиторію
```
https://github.com/new
↓
Repository name: p2p-trading-platform
Public ✓
НЕ додавай README, .gitignore
↓
Create repository
```

### 2.2 Завантаження коду
```
Відкрий термінал в папці проекту:
```

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/p2p-trading-platform.git
git push -u origin main
```

**Що бачиш:**
```
Counting objects: 100% done
Writing objects: 100% done
✓ Код на GitHub!
```

✅ GitHub готовий!

---

## Крок 3️⃣: Render.com - Backend (5 хв)

### 3.1 Реєстрація
```
https://render.com/register
↓
Continue with GitHub ← обери цей!
↓
Authorize Render
```

### 3.2 Створення Web Service
```
Dashboard
↓
New + (синя кнопка)
↓
Web Service
↓
Connect repository → p2p-trading-platform
↓
Connect
```

### 3.3 Налаштування
```
Name: p2p-trading-backend
Region: Frankfurt
Branch: main
Root Directory: server          ← ВАЖЛИВО!
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free             ← ВАЖЛИВО!
```

### 3.4 Environment Variables
```
Прокрути вниз → Advanced
↓
Add Environment Variable (для кожної змінної):
```

**Додай ці змінні:**
```
NODE_ENV = production
PORT = 5000
MONGODB_URI = [твій connection string з кроку 1]
JWT_SECRET = [будь-який складний рядок, мінімум 32 символи]
JWT_EXPIRE = 7d
FRONTEND_URL = https://temporary.com (оновимо пізніше)
```

**Приклад JWT_SECRET:**
```
my-super-secret-jwt-key-2024-production-p2p-trading-platform
```

### 3.5 Деплой
```
Create Web Service (зелена кнопка внизу)
↓
Чекай 5-10 хвилин...
↓
Статус: Live ✓
```

### 3.6 Перевірка
```
Скопіюй URL (вгорі):
https://p2p-trading-backend.onrender.com
↓
Відкрий в браузері:
https://p2p-trading-backend.onrender.com/health
↓
Має показати:
{"status":"ok","timestamp":"...","uptime":123}
```

✅ Backend онлайн!

---

## Крок 4️⃣: Vercel - Frontend (3 хв)

### 4.1 Реєстрація
```
https://vercel.com/signup
↓
Continue with GitHub ← обери цей!
↓
Authorize Vercel
```

### 4.2 Імпорт проекту
```
Add New...
↓
Project
↓
Import Git Repository
↓
Знайди: p2p-trading-platform
↓
Import
```

### 4.3 Налаштування
```
Framework Preset: Create React App (автоматично)
Root Directory: client          ← ВАЖЛИВО! Натисни Edit
Build Command: npm run build    (автоматично)
Output Directory: build         (автоматично)
```

### 4.4 Environment Variables
```
Environment Variables (розгорни)
↓
Add (для кожної змінної)
```

**Додай:**
```
Name: REACT_APP_API_URL
Value: https://p2p-trading-backend.onrender.com
(твій URL з кроку 3)
```

### 4.5 Деплой
```
Deploy (синя кнопка)
↓
Чекай 2-5 хвилин...
↓
Congratulations! 🎉
```

### 4.6 Отримай URL
```
Visit (зелена кнопка)
↓
Скопіюй URL:
https://p2p-trading-platform-xxx.vercel.app
```

✅ Frontend онлайн!

---

## Крок 5️⃣: Фінальні налаштування (1 хв)

### 5.1 Оновити CORS
```
Повернись на Render.com
↓
Dashboard → p2p-trading-backend
↓
Environment
↓
Знайди FRONTEND_URL
↓
Edit
↓
Заміни на: https://p2p-trading-platform-xxx.vercel.app
(твій URL з Vercel)
↓
Save Changes
↓
Сервіс автоматично перезапуститься (1-2 хв)
```

### 5.2 Перевірка
```
Відкрий свій сайт:
https://p2p-trading-platform-xxx.vercel.app
↓
Спробуй зареєструватись
↓
Якщо працює - ВСЕ ГОТОВО! 🎉
```

✅ Сайт повністю працює!

---

## 🎉 Результат

### Твої URLs:
```
🌐 Сайт (Frontend):
https://p2p-trading-platform-xxx.vercel.app

🔧 API (Backend):
https://p2p-trading-backend.onrender.com

🗄️ База даних:
MongoDB Atlas (в хмарі)
```

### Що працює:
- ✅ Реєстрація / Логін
- ✅ Email верифікація
- ✅ KYC
- ✅ Платіжні методи
- ✅ Wallet
- ✅ Marketplace
- ✅ Spot Trading
- ✅ Всі функції!

---

## 🔄 Як оновлювати код

```bash
# Зроби зміни в коді
# Потім:

git add .
git commit -m "Опис змін"
git push

# Render і Vercel автоматично передеплоять!
# Чекай 2-5 хвилин
```

---

## ⚠️ Важливі нотатки

### Перший запит повільний (15-30 сек)
```
Це нормально для безкоштовного плану Render.
Сервер "засинає" після 15 хв неактивності.
Перший запит його "будить".
```

### Збережи ці дані:
```
✓ MongoDB connection string
✓ JWT_SECRET
✓ GitHub repository URL
✓ Render backend URL
✓ Vercel frontend URL
```

### Не коміть:
```
✗ .env файли
✗ node_modules
✗ Паролі
✗ API ключі
```

---

## 🆘 Щось не працює?

### Backend не запускається:
```
Render → твій сервіс → Logs
Подивись помилки
Найчастіше: неправильний MONGODB_URI
```

### Frontend не підключається:
```
F12 → Console
Подивись помилки
Найчастіше: неправильний REACT_APP_API_URL
```

### Детальніше:
```
Читай TROUBLESHOOTING.md
```

---

## 🎓 Наступні кроки

### 1. Custom Domain (опціонально)
```
Vercel → Settings → Domains
Додай свій домен (example.com)
```

### 2. Analytics (опціонально)
```
Google Analytics
Vercel Analytics
```

### 3. Monitoring (опціонально)
```
UptimeRobot (безкоштовно)
Пінгує сайт кожні 5 хвилин
```

---

## 💰 Вартість

```
MongoDB Atlas (M0):    $0/міс
Render (Free):         $0/міс
Vercel (Hobby):        $0/міс
─────────────────────────────
ЗАГАЛОМ:              $0/міс 🎉
```

---

## ✅ Чеклист

- [ ] MongoDB створено
- [ ] GitHub репозиторій створено
- [ ] Код на GitHub
- [ ] Backend на Render
- [ ] Frontend на Vercel
- [ ] CORS оновлено
- [ ] Сайт працює
- [ ] Реєстрація працює

**Якщо всі галочки - ТИ МОЛОДЕЦЬ!** 🚀

---

**Час: 15 хвилин**  
**Вартість: $0**  
**Результат: Робочий сайт в інтернеті!** 🎉
