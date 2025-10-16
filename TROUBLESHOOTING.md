# 🔧 Вирішення проблем (Troubleshooting)

## 🐛 Типові помилки та рішення

---

### ❌ Помилка: "Application failed to respond"

**Причина:** Backend не запустився на Render

**Рішення:**
1. Відкрий Render Dashboard → твій сервіс → Logs
2. Подивись останні помилки
3. Найчастіші причини:
   - Неправильний MONGODB_URI
   - Відсутні environment variables
   - Помилка в коді

**Перевірка:**
```bash
# Локально спробуй:
cd server
npm install
npm start
```

---

### ❌ Помилка: "MongooseServerSelectionError"

**Причина:** Не може підключитись до MongoDB

**Рішення:**
1. Перевір MONGODB_URI в Render environment variables
2. Формат має бути:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dbname
   ```
3. Перевір:
   - Правильний пароль (без спецсимволів або закодований)
   - IP whitelist: 0.0.0.0/0 в MongoDB Atlas
   - Database user створено

**Як закодувати пароль:**
Якщо пароль містить спецсимволи (@, #, $, тощо):
```
Оригінал: MyP@ss#123
Закодований: MyP%40ss%23123
```
Використай: https://www.urlencoder.org/

---

### ❌ Помилка: "CORS policy: No 'Access-Control-Allow-Origin'"

**Причина:** CORS не налаштовано

**Рішення:**
1. На Render додай/оновіть:
   ```
   FRONTEND_URL=https://твій-сайт.vercel.app
   ```
2. Перевір в `server/src/server.js`:
   ```javascript
   const allowedOrigins = [
     process.env.FRONTEND_URL,
     'http://localhost:3000'
   ];
   ```
3. Збережи і дочекайся redeploy

---

### ❌ Помилка: "Failed to fetch" або "Network Error"

**Причина:** Frontend не може підключитись до Backend

**Рішення:**
1. Перевір REACT_APP_API_URL на Vercel:
   - Settings → Environment Variables
   - Має бути: `https://твій-backend.onrender.com`
2. Redeploy frontend після зміни
3. Перевір чи backend працює:
   ```
   https://твій-backend.onrender.com/health
   ```

---

### ❌ Помилка: "JWT malformed" або "Invalid token"

**Причина:** JWT_SECRET різний на різних деплоях

**Рішення:**
1. Використовуй один і той самий JWT_SECRET
2. Після зміни JWT_SECRET - всі користувачі мають перелогінитись
3. Очисти localStorage в браузері:
   ```javascript
   localStorage.clear()
   ```

---

### ❌ Сайт дуже повільний (15-30 секунд)

**Причина:** Render безкоштовний план "засинає"

**Рішення:**
1. Це нормально для безкоштовного плану
2. Перший запит "будить" сервер
3. Наступні запити швидкі
4. Варіанти:
   - Апгрейд на Render Starter ($7/міс)
   - Використай Railway.app
   - Використай VPS

**Workaround:**
Створи cron job який "пінгує" сервер кожні 10 хвилин:
- https://cron-job.org
- URL: `https://твій-backend.onrender.com/health`
- Інтервал: кожні 10 хвилин

---

### ❌ Помилка: "Module not found"

**Причина:** Залежності не встановлені

**Рішення:**
1. Перевір package.json - всі залежності є?
2. На Render перевір Build Logs
3. Спробуй локально:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm start
   ```
4. Якщо працює локально - закоміть package-lock.json:
   ```bash
   git add package-lock.json
   git commit -m "Add package-lock"
   git push
   ```

---

### ❌ Помилка: "Port already in use"

**Причина:** Порт зайнятий (тільки локально)

**Рішення:**
```bash
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

---

### ❌ Frontend білий екран

**Причина:** Помилка в React коді

**Рішення:**
1. Відкрий Developer Console (F12)
2. Подивись помилки в Console
3. Перевір Network tab - чи завантажуються файли
4. Спробуй локально:
   ```bash
   cd client
   npm start
   ```
5. Перевір чи правильний REACT_APP_API_URL

---

### ❌ WebSocket не працює

**Причина:** WebSocket не підтримується або CORS

**Рішення:**
1. Render безкоштовний план підтримує WebSocket
2. Перевір CORS для WebSocket:
   ```javascript
   const io = socketIO(server, {
     cors: {
       origin: process.env.FRONTEND_URL,
       methods: ['GET', 'POST']
     }
   });
   ```
3. Використовуй wss:// (не ws://) для production

---

### ❌ Файли не завантажуються (uploads)

**Причина:** Render не зберігає файли між деплоями

**Рішення:**
1. Використовуй зовнішнє сховище:
   - AWS S3
   - Cloudinary
   - DigitalOcean Spaces
2. Або використовуй VPS

---

### ❌ Email не відправляються

**Причина:** SMTP налаштування

**Рішення для Gmail:**
1. Увімкни 2FA на Google акаунті
2. Створи App Password:
   - https://myaccount.google.com/apppasswords
   - Обери "Mail" → Generate
3. Використовуй цей пароль в EMAIL_PASSWORD
4. Додай в Render:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=твій-email@gmail.com
   EMAIL_PASSWORD=згенерований-app-password
   ```

---

## 🔍 Як дебажити

### 1. Перевір логи Backend (Render):
```
Render Dashboard → твій сервіс → Logs
```

### 2. Перевір логи Frontend (Vercel):
```
Vercel Dashboard → твій проект → Deployments → View Function Logs
```

### 3. Перевір браузер:
```
F12 → Console (помилки JavaScript)
F12 → Network (помилки API)
```

### 4. Тестуй API напряму:
```bash
# Health check
curl https://твій-backend.onrender.com/health

# Login
curl -X POST https://твій-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

---

## 📞 Де шукати допомогу

1. **Render Docs:** https://render.com/docs
2. **Vercel Docs:** https://vercel.com/docs
3. **MongoDB Docs:** https://docs.mongodb.com
4. **Stack Overflow:** https://stackoverflow.com
5. **GitHub Issues:** створи issue в своєму репозиторії

---

## ✅ Чеклист діагностики

Коли щось не працює, перевір по порядку:

- [ ] Backend запущений? (перевір Render Dashboard)
- [ ] MongoDB підключена? (перевір логи)
- [ ] Environment variables правильні? (перевір Render/Vercel)
- [ ] CORS налаштовано? (перевір FRONTEND_URL)
- [ ] Frontend збілдився? (перевір Vercel Deployments)
- [ ] API URL правильний? (перевір REACT_APP_API_URL)
- [ ] Браузер показує помилки? (F12 → Console)
- [ ] API відповідає? (curl або Postman)

---

## 🆘 Останній варіант

Якщо нічого не допомагає:

1. **Redeploy все з нуля:**
   ```bash
   # Видали сервіси на Render/Vercel
   # Створи знову
   ```

2. **Перевір локально:**
   ```bash
   # Backend
   cd server
   npm install
   npm start
   
   # Frontend (в іншому терміналі)
   cd client
   npm install
   npm start
   ```
   
3. **Якщо локально працює** - проблема в деплої
4. **Якщо локально не працює** - проблема в коді

---

## 💡 Корисні команди

```bash
# Перевірити версію Node
node --version

# Очистити npm cache
npm cache clean --force

# Перевстановити залежності
rm -rf node_modules package-lock.json
npm install

# Перевірити порти
netstat -ano | findstr :5000

# Git - скасувати останній commit
git reset --soft HEAD~1

# Git - подивитись статус
git status

# Git - подивитись логи
git log --oneline
```

---

## 🎯 Профілактика проблем

1. **Завжди тестуй локально** перед деплоєм
2. **Використовуй .env.example** для документації
3. **Коміть package-lock.json**
4. **Не коміть .env**
5. **Використовуй однакові версії Node** локально і на сервері
6. **Перевіряй логи** регулярно
7. **Роби backup** бази даних

---

Якщо проблема не вирішилась - опиши детально що не працює і які помилки бачиш! 🚀
