# 🚨 ВАЖНО: Требуется Node.js >= 18 🚨

> ⚠️ **Для корректной работы фронтенда (wb-frontend) необходима Node.js версии 18 или выше!**
> 
> Проверьте версию командой:
> ```
> node -v
> ```
> Если версия ниже 18 — скачайте и установите актуальную с [официального сайта Node.js](https://nodejs.org/).

# 🐍 Wildberries Parsing Service

**Сбор и аналитика товаров Wildberries: парсер, Django backend, React frontend**

## 📋 Описание:

Этот проект позволяет собирать, анализировать и визуализировать данные о товарах Wildberries по любому поисковому запросу. Включает парсер, сохраняющий данные в базу, backend на Django с API и frontend на React с графиками и фильтрами.


## 🧷 Структура проекта

- **parsing.py** — парсер товаров WB, интеграция с Django ORM
- **ProjectWbParsing/** — настройки Django
- **products/** — Django-приложение, модель Product, миграции, admin
- **wb-frontend/** — фронтенд на React (create-react-app + Ant Design + recharts)

---

## 🚀 Установка и запуск

### 📌 1. Клонирование репозитория
```bash
git clone https://github.com/AndreyBychenkow/ProjectWbParsing.git
cd ProjectWbParsing
```

### 📌 2. Backend (Django)

#### ⏳ Установка зависимостей
```bash
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

#### ⏳ Миграции и запуск сервера
```bash
python manage.py migrate
python manage.py runserver
```

#### ⏳ Парсинг товаров
```bash
python parsing.py
# Введите поисковый запрос (например, кроссовки, очки, брюки)
# Введите количество страниц (или Enter для всех)
```

### 📌 3. Frontend (React)

```bash
cd wb-frontend
npm install
npm start
```

**Фронтенд будет доступен на** [http://localhost:3000](http://localhost:3000)

---

## ❓ Как это работает

1. **Парсер** (`parsing.py`) получает товары WB по вашему запросу, очищает таблицу Product и сохраняет только свежие данные (цены берутся из верхнего уровня `priceU`, `salePriceU`).
2. **Backend** предоставляет API с фильтрами по цене, рейтингу, количеству отзывов.
3. **Frontend** отображает таблицу товаров, гистограмму цен, график скидка vs рейтинг. Все фильтры и графики динамически обновляются.

---

## 🔑 Примеры команд

- Запуск парсера:
  ```bash
  python parsing.py
  ```
- Запуск Django backend:
  ```bash
  python manage.py runserver
  ```
- Запуск фронта:
  ```bash
  cd wb-frontend && npm start
  ```

---

## 🌐 API (кратко)

- `GET /api/products/` — список товаров с фильтрами (price, rating, feedback_count)
- Пример запроса:
  ```
  /api/products/?min_price=1000&max_price=5000&min_rating=4
  ```

---

## 📺 Скриншоты

**Запуск в терминале**
![terminal](https://github.com/user-attachments/assets/af02ee65-49bc-43ca-80cb-2ca87dcfbebf)

**Вывод эндпоинта /api/products/**
![endPoint](https://github.com/user-attachments/assets/27b91fba-8826-493b-984e-a2236a88aa98)

**Отображение фронтенда**
![реакт](https://github.com/user-attachments/assets/12acd0c4-8814-4b24-af71-419bd301b47a)

**Гистограмма и ползунки**
![Гистограмма](https://github.com/user-attachments/assets/5473f4da-36ca-4adf-92c5-7f886dc02d55)
