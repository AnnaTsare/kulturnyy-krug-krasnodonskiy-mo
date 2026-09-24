# PostgreSQL для «Культурного круга»

## Установка на Windows

Установите PostgreSQL 17 и во время установки задайте пароль пользователя `postgres`.
После установки создайте базу:

```powershell
createdb -U postgres culture_circle
psql -U postgres -d culture_circle -f db/schema.sql
```

Если команда `psql` не найдена, запускайте её из каталога вида:
`C:\Program Files\PostgreSQL\17\bin`.

## Важное ограничение

`index.html` на GitHub Pages не может безопасно подключаться к PostgreSQL напрямую.
Между сайтом и базой должен быть API-сервер с авторизацией сотрудников и проверкой входных данных.
Пароль PostgreSQL нельзя помещать в `app.js`, HTML или GitHub-репозиторий.

Следующий этап — подключить API к этой схеме, заменить `localStorage` на запросы к API и развернуть API на отдельном сервере.
