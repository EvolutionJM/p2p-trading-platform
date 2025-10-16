# ⚡ Швидкі команди

## 🚀 Локальна розробка

### Запуск проекту
```bash
# Backend (Terminal 1)
cd server
npm install
npm run dev

# Frontend (Terminal 2)
cd client
npm install
npm start
```

### Перевірка
```bash
# Backend працює на:
http://localhost:5000

# Frontend працює на:
http://localhost:3000

# Health check:
curl http://localhost:5000/health
```

---

## 📦 Git команди

### Перший раз
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

### Оновлення коду
```bash
git add .
git commit -m "Опис змін"
git push
```

### Перевірка статусу
```bash
git status
git log --oneline
```

### Скасувати зміни
```bash
# Скасувати незакомічені зміни
git checkout .

# Скасувати останній commit
git reset --soft HEAD~1
```

---

## 🗄️ MongoDB команди

### Локальна MongoDB
```bash
# Запустити MongoDB
mongod

# Підключитись
mongosh

# Показати бази даних
show dbs

# Використати базу
use p2p-trading

# Показати колекції
show collections

# Знайти всіх користувачів
db.users.find()

# Очистити колекцію
db.users.deleteMany({})
```

### MongoDB Atlas
```bash
# Підключитись через mongosh
mongosh "mongodb+srv://cluster0.xxxxx.mongodb.net/p2p-trading" --username admin

# Або через MongoDB Compass (GUI)
# Завантажити: https://www.mongodb.com/try/download/compass
```

---

## 🔧 NPM команди

### Встановлення залежностей
```bash
npm install

# Встановити конкретний пакет
npm install package-name

# Встановити dev залежність
npm install --save-dev package-name
```

### Оновлення залежностей
```bash
# Перевірити застарілі пакети
npm outdated

# Оновити всі
npm update

# Оновити конкретний пакет
npm update package-name
```

### Очистка
```bash
# Очистити cache
npm cache clean --force

# Видалити node_modules і перевстановити
rm -rf node_modules package-lock.json
npm install
```

---

## 🐛 Дебаг команди

### Перевірка портів
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000
kill -9 <PID>
```

### Перевірка Node версії
```bash
node --version
npm --version
```

### Логи
```bash
# Показати логи в реальному часі
npm run dev

# Зберегти логи в файл
npm run dev > logs.txt 2>&1
```

---

## 🌐 Деплой команди

### Render.com
```bash
# Render автоматично деплоїть при push на GitHub
git push

# Перевірити статус
curl https://твій-backend.onrender.com/health
```

### Vercel
```bash
# Встановити Vercel CLI (опціонально)
npm install -g vercel

# Деплой з CLI
cd client
vercel

# Production деплой
vercel --prod
```

### Railway
```bash
# Встановити Railway CLI
npm install -g @railway/cli

# Login
railway login

# Деплой
railway up
```

---

## 🧪 Тестування API

### cURL команди
```bash
# Health check
curl http://localhost:5000/health

# Реєстрація
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@test.com",
    "password": "password123"
  }'

# Логін
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "password123"
  }'

# Отримати профіль (з токеном)
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Postman
```
1. Завантажити Postman: https://www.postman.com/downloads/
2. Імпортувати колекцію (якщо є)
3. Тестувати API
```

---

## 📊 Моніторинг

### Перевірка статусу
```bash
# Backend
curl https://твій-backend.onrender.com/health

# Frontend
curl https://твій-сайт.vercel.app

# MongoDB
mongosh "mongodb+srv://..." --eval "db.adminCommand('ping')"
```

### Логи
```bash
# Render
# Dashboard → твій сервіс → Logs

# Vercel
# Dashboard → твій проект → Deployments → View Function Logs

# Локально
tail -f server/logs/app.log
```

---

## 🔒 Безпека

### Генерація секретів
```bash
# JWT Secret (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Або онлайн:
# https://randomkeygen.com/
```

### Перевірка .env
```bash
# Переконайся що .env не в git
git ls-files | grep .env

# Якщо показує .env - видали з git:
git rm --cached .env
git commit -m "Remove .env from git"
git push
```

---

## 🧹 Очистка

### Локальна очистка
```bash
# Видалити node_modules
rm -rf server/node_modules client/node_modules

# Видалити build файли
rm -rf client/build

# Видалити логи
rm -rf server/logs/*.log

# Видалити uploads
rm -rf server/uploads/*
```

### Git очистка
```bash
# Видалити незакомічені файли
git clean -fd

# Видалити всі зміни
git reset --hard HEAD
```

---

## 📦 Backup

### Backup MongoDB
```bash
# Локально
mongodump --db p2p-trading --out ./backup

# Відновити
mongorestore --db p2p-trading ./backup/p2p-trading

# MongoDB Atlas
# Dashboard → Cluster → Backup → Create Backup
```

### Backup коду
```bash
# Створити архів
tar -czf backup-$(date +%Y%m%d).tar.gz server client

# Або просто push на GitHub
git push
```

---

## 🚀 Production команди

### Перед деплоєм
```bash
# Перевірити чи працює локально
cd server && npm start
cd client && npm run build

# Перевірити .env
cat server/.env.example

# Перевірити .gitignore
cat .gitignore
```

### Після деплою
```bash
# Перевірити backend
curl https://твій-backend.onrender.com/health

# Перевірити frontend
curl https://твій-сайт.vercel.app

# Перевірити CORS
curl -H "Origin: https://твій-сайт.vercel.app" \
  https://твій-backend.onrender.com/health
```

---

## 🔄 Оновлення версій

### Node.js
```bash
# Перевірити поточну версію
node --version

# Оновити через nvm (рекомендовано)
nvm install 18
nvm use 18

# Або завантажити з nodejs.org
```

### Dependencies
```bash
# Перевірити застарілі
npm outdated

# Оновити patch версії
npm update

# Оновити major версії (обережно!)
npm install package@latest
```

---

## 💡 Корисні скрипти

### package.json scripts
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest",
    "lint": "eslint .",
    "format": "prettier --write .",
    "backup": "mongodump --db p2p-trading --out ./backup"
  }
}
```

### Використання
```bash
npm run dev
npm run test
npm run lint
npm run format
npm run backup
```

---

## 🎯 Швидкі фікси

### "Port already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "CORS error"
```bash
# Перевір FRONTEND_URL в .env
echo $FRONTEND_URL

# Або в Render Environment Variables
```

### "MongoDB connection error"
```bash
# Перевір connection string
echo $MONGODB_URI

# Перевір чи MongoDB працює
mongosh "твій-connection-string" --eval "db.adminCommand('ping')"
```

---

## 📝 Шпаргалка

### Щоденна розробка
```bash
# 1. Запустити проект
cd server && npm run dev
cd client && npm start

# 2. Зробити зміни

# 3. Закомітити
git add .
git commit -m "Feature: опис"
git push

# 4. Перевірити деплой
curl https://твій-backend.onrender.com/health
```

### Швидкий деплой
```bash
git add . && git commit -m "Update" && git push
```

### Швидка перевірка
```bash
curl https://твій-backend.onrender.com/health && \
curl https://твій-сайт.vercel.app
```

---

**Збережи цей файл - він стане в пригоді!** 📌
