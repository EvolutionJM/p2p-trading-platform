# ✅ Veriff KYC - Фінальні кроки

## 🎯 Що вже зроблено автоматично:

### Backend:
- ✅ `server/services/veriffService.js` - створено
- ✅ `server/routes/kycRoutes.js` - створено
- ✅ `server/src/models/User.js` - оновлено
- ✅ `server/src/server.js` - роути підключені

### Frontend:
- ✅ `client/src/pages/KYCPageNew.js` - створено
- ✅ `client/src/components/VeriffWidget.js` - створено
- ✅ `client/src/App.js` - оновлено на нову KYC сторінку

---

## 📝 Що треба зробити ВРУЧНУ:

### 1. Додай Veriff ключі в `.env` файл:

Відкрий `server/.env` і додай в кінець файлу:

```env
# Veriff KYC
VERIFF_API_KEY=279f9bdb-3bae-4229-9dbe-6cfa91db3f38
VERIFF_SECRET_KEY=5f1c8485-d098-4ecf-ba85-ca93a8dab50d
VERIFF_BASE_URL=https://stationapi.veriff.com
```

### 2. Перезапусти сервери:

```bash
# Backend
cd server
npm start

# Frontend (в іншому терміналі)
cd client
npm start
```

---

## 🧪 Як протестувати:

1. **Зайди на сайт** → http://localhost:3000
2. **Залогінься** (або зареєструйся)
3. **Перейди на KYC** → http://localhost:3000/kyc
4. **Натисни "Розпочати верифікацію"**
5. **Veriff віджет має відкритись**
6. **Завантаж документи** (в sandbox будь-які)
7. **Зроби селфі**
8. **Дочекайся результату**

---

## 📊 Перевірка статусу:

### В базі даних:
```javascript
// User модель тепер має:
{
  kycStatus: 'not_started' | 'pending' | 'approved' | 'rejected',
  verificationId: 'veriff-session-id',
  verifiedAt: Date
}
```

### Через API:
```bash
GET /api/kyc/status
Authorization: Bearer YOUR_TOKEN
```

---

## 🔧 Troubleshooting:

### Помилка "Cannot find module veriffService":
- Перевір що файл `server/services/veriffService.js` існує
- Перезапусти backend

### Помилка "Cannot find module KYCPageNew":
- Перевір що файл `client/src/pages/KYCPageNew.js` існує
- Перезапусти frontend

### Veriff віджет не завантажується:
- Відкрий консоль браузера (F12)
- Перевір чи є помилки
- Перевір що `sessionUrl` отримується з backend

### Webhook не працює:
- Для локального тестування Veriff не може надіслати webhook
- Використай ngrok або просто перевіряй статус вручну через API

---

## 🚀 Готово!

Все налаштовано! Тепер:
1. Додай ключі в `.env`
2. Перезапусти сервери
3. Тестуй KYC!

**Veriff інтегровано успішно!** 🎉
