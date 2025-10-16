# 🔐 Veriff KYC Інтеграція

## ✅ Що зроблено:

### Backend:
1. ✅ `server/services/veriffService.js` - Сервіс для роботи з Veriff API
2. ✅ `server/routes/kycRoutes.js` - API роути для KYC
3. ✅ `server/.env.veriff` - Конфігурація з твоїми ключами
4. ✅ `server/src/models/User.js` - Оновлена модель з полями для KYC

### Frontend:
1. ✅ `client/src/pages/KYCPageNew.js` - Нова KYC сторінка
2. ✅ `client/src/components/VeriffWidget.js` - Veriff віджет

---

## 🚀 Як запустити:

### 1. Backend налаштування:

```bash
cd server

# Додай в .env файл:
VERIFF_API_KEY=279f9bdb-3bae-4229-9dbe-6cfa91db3f38
VERIFF_SECRET_KEY=5f1c8485-d098-4ecf-ba85-ca93a8dab50d
VERIFF_BASE_URL=https://stationapi.veriff.com
API_URL=http://localhost:5000
```

### 2. Підключи роути в server/src/index.js:

```javascript
const kycRoutes = require('../routes/kycRoutes');

// Додай після інших роутів:
app.use('/api/kyc', kycRoutes);
```

### 3. Замінити стару KYC сторінку:

В `client/src/App.js`:

```javascript
// Замість:
import KYCPage from './pages/KYCPage';

// Використай:
import KYCPage from './pages/KYCPageNew';
```

### 4. Запусти:

```bash
# Backend
cd server
npm start

# Frontend
cd client
npm start
```

---

## 📋 Як працює:

1. **Користувач натискає "Розпочати верифікацію"**
   - Frontend → POST `/api/kyc/start`
   - Backend створює сесію Veriff
   - Повертає `sessionUrl`

2. **Veriff віджет відкривається**
   - Користувач завантажує документи
   - Робить селфі
   - Veriff перевіряє автоматично

3. **Veriff надсилає webhook**
   - POST `/api/kyc/veriff/webhook`
   - Backend оновлює статус користувача
   - `approved` / `rejected` / `pending`

4. **Користувач бачить результат**
   - GET `/api/kyc/status`
   - Показує поточний статус

---

## 🧪 Тестування:

### Sandbox режим (безкоштовно):

Твої ключі вже для sandbox! Можеш тестувати:

1. Завантаж будь-який документ
2. Зроби селфі
3. Veriff автоматично схвалить (в sandbox)

### Тестові документи:

Veriff приймає будь-які документи в sandbox режимі.

---

## 📊 Статуси KYC:

- `not_started` - Не розпочато
- `pending` - На перевірці
- `approved` - Схвалено ✅
- `rejected` - Відхилено ❌

---

## 🔧 Troubleshooting:

### Помилка "Invalid signature":
- Перевір `VERIFF_SECRET_KEY` в .env

### Webhook не приходить:
- Veriff потребує публічний URL
- Використай ngrok для локального тестування:
```bash
ngrok http 5000
# Додай URL в Veriff Dashboard
```

### Віджет не завантажується:
- Перевір що `sessionUrl` правильний
- Відкрий консоль браузера для помилок

---

## 💰 Переход на Production:

1. Зареєструй компанію на Veriff
2. Отримай production ключі
3. Замінь в `.env`:
```
VERIFF_BASE_URL=https://api.veriff.com
```
4. Готово! Код той самий.

---

## 📞 Підтримка:

- Veriff Docs: https://developers.veriff.com
- Dashboard: https://station.veriff.com

---

**Готово до використання!** 🎉
