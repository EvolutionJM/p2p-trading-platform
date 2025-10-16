#!/bin/bash

echo "🚀 Деплой P2P Trading Platform"
echo "================================"

# Перевірка чи є git
if ! command -v git &> /dev/null; then
    echo "❌ Git не встановлено. Встановіть git спочатку."
    exit 1
fi

# Ініціалізація git якщо потрібно
if [ ! -d ".git" ]; then
    echo "📦 Ініціалізація Git..."
    git init
    git branch -M main
fi

# Додати всі файли
echo "📝 Додавання файлів..."
git add .

# Commit
echo "💾 Створення commit..."
read -p "Введіть повідомлення commit: " commit_message
git commit -m "$commit_message"

# Push
echo "🌐 Відправка на GitHub..."
read -p "Введіть URL репозиторію (https://github.com/username/repo.git): " repo_url

if [ -z "$(git remote)" ]; then
    git remote add origin $repo_url
fi

git push -u origin main

echo "✅ Код відправлено на GitHub!"
echo ""
echo "📋 Наступні кроки:"
echo "1. Перейди на https://render.com"
echo "2. Створи новий Web Service з твого GitHub репозиторію"
echo "3. Налаштуй змінні середовища (дивись DEPLOYMENT.md)"
echo "4. Перейди на https://vercel.com"
echo "5. Деплой frontend з того ж репозиторію"
echo ""
echo "📖 Детальна інструкція в файлі DEPLOYMENT.md"
