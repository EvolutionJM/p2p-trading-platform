# Інструкція з налаштування P2P Crypto Trading Platform

## Швидкий старт

### Варіант 1: Використання Docker (Рекомендовано)

1. **Встановіть Docker та Docker Compose**
   - Завантажте з https://www.docker.com/

2. **Клонуйте репозиторій та перейдіть в папку**
   ```bash
   cd c:\Users\Lenovo\CascadeProjects\2048
   ```

3. **Запустіть всі сервіси**
   ```bash
   docker-compose up -d
   ```

4. **Відкрийте браузер**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

### Варіант 2: Ручне встановлення

#### Backend

1. **Встановіть MongoDB**
   - Завантажте з https://www.mongodb.com/try/download/community
   - Запустіть MongoDB сервіс

2. **Налаштуйте Backend**
   ```bash
   cd server
   npm install
   ```

3. **Створіть файл .env**
   ```bash
   cp .env.example .env
   ```

4. **Відредагуйте .env файл**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/p2p-trading
   JWT_SECRET=your_super_secret_jwt_key_change_this
   JWT_REFRESH_SECRET=your_refresh_token_secret
   CLIENT_URL=http://localhost:3000
   
   # Bybit API (отримайте на https://www.bybit.com)
   BYBIT_API_KEY=your_bybit_api_key
   BYBIT_API_SECRET=your_bybit_api_secret
   BYBIT_TESTNET=false
   ```

5. **Запустіть сервер**
   ```bash
   npm run dev
   ```

#### Frontend

1. **Встановіть залежності**
   ```bash
   cd client
   npm install
   ```

2. **Створіть файл .env**
   ```bash
   cp .env.example .env
   ```

3. **Запустіть клієнт**
   ```bash
   npm start
   ```

4. **Відкрийте браузер**
   - http://localhost:3000

## Налаштування Bybit API

1. Зареєструйтесь на https://www.bybit.com
2. Перейдіть в API Management
3. Створіть новий API ключ з правами:
   - Read (для отримання ордерів)
4. Додайте ключі в `.env` файл сервера

## Налаштування KYC провайдера (Опціонально)

### Sumsub

1. Зареєструйтесь на https://sumsub.com
2. Отримайте API ключі
3. Додайте в `.env`:
   ```env
   KYC_PROVIDER=sumsub
   KYC_API_KEY=your_sumsub_api_key
   KYC_API_SECRET=your_sumsub_api_secret
   ```

## Тестування

### Backend тести
```bash
cd server
npm test
```

### Frontend тести
```bash
cd client
npm test
```

## Структура проекту

```
/
├── server/              # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/ # Контролери маршрутів
│   │   ├── models/      # Моделі MongoDB
│   │   ├── routes/      # API маршрути
│   │   ├── services/    # Бізнес логіка
│   │   ├── middleware/  # Express middleware
│   │   └── utils/       # Утиліти
│   └── package.json
│
├── client/              # Frontend (React)
│   ├── src/
│   │   ├── components/  # React компоненти
│   │   ├── pages/       # Сторінки
│   │   ├── services/    # API сервіси
│   │   ├── store/       # Zustand store
│   │   └── i18n/        # Переклади
│   └── package.json
│
└── docker-compose.yml   # Docker конфігурація
```

## Основні функції

### Реалізовано:
- ✅ Автентифікація (JWT + 2FA)
- ✅ P2P ордери (створення, перегляд, фільтрація)
- ✅ Інтеграція з Bybit API
- ✅ WebSocket для real-time оновлень
- ✅ Мультимовність (EN, UK, RU, ES, ZH)
- ✅ KYC верифікація
- ✅ Система рейтингів
- ✅ Чат між трейдерами
- ✅ Responsive дизайн

### В розробці:
- 🔄 Повна реалізація торгової логіки
- 🔄 Платіжні інтеграції
- 🔄 Email сповіщення
- 🔄 Адмін панель

## Troubleshooting

### MongoDB не підключається
```bash
# Перевірте чи запущений MongoDB
mongosh

# Або перезапустіть сервіс
# Windows:
net start MongoDB

# Linux/Mac:
sudo systemctl start mongod
```

### Помилка CORS
- Переконайтесь що `CLIENT_URL` в `.env` сервера відповідає URL клієнта

### Порт вже зайнятий
```bash
# Windows - знайти процес на порту 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

## Безпека

⚠️ **ВАЖЛИВО для продакшену:**

1. Змініть всі секретні ключі в `.env`
2. Використовуйте HTTPS
3. Налаштуйте firewall
4. Регулярно оновлюйте залежності
5. Використовуйте environment variables, не hardcode
6. Налаштуйте rate limiting
7. Додайте моніторинг та логування

## Підтримка

Для питань та підтримки:
- Email: support@p2ptrading.com
- GitHub Issues: [посилання на репозиторій]
- Telegram: @p2ptrading_support

## Ліцензія

MIT License - дивіться файл LICENSE
