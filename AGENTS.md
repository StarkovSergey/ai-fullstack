# AGENT.md — архитектурный подход проекта

Документ для агентов и разработчиков. При развитии бота и связанных модулей придерживайся описанных ниже решений, принятых в ходе работы над проектом.

## Общий принцип

Используем **трёхслойную архитектуру** (3-layered architecture) и **Separation of Concerns**.

Это **не** Clean Architecture / Hexagonal в полном виде:

- без выделенных entities;
- без портов и явных интерфейсов;
- без отдельного domain-слоя;
- без лишних абстракций «на вырост».

Достаточно трёх слоёв с понятной ответственностью и простыми объектами.

## Слои

| Слой             | Папка           | Роль                                                                                                                                                | Пример                        |
| ---------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| **Presentation** | `presentation/` | Входная точка взаимодействия с внешним миром на уровне «сервера»: polling, HTTP, CLI. Оркестрирует цикл, достаёт входные данные, вызывает use case. | `telegram-polling-server.mjs` |
| **Application**  | `application/`  | Бизнес-сценарии (use cases). Содержат логику «что сделать» с данными пользователя.                                                                  | `echo-message-use-case.mjs`   |
| **Adapters**     | `adapters/`     | Доступ к внешним системам и инфраструктуре (Telegram Bot API, БД, файлы и т.п.).                                                                    | `telegram-api-client.mjs`     |

Эталонная структура (см. `03-3-layered-architecture/`):

```text
03-3-layered-architecture/
  index.mjs                         # composition root — только сборка и старт
  presentation/
    telegram-polling-server.mjs
  application/
    echo-message-use-case.mjs
  adapters/
    telegram-api-client.mjs
```

## Именование файлов

- Имена файлов — **kebab-case**: `telegram-api-client.mjs`, `show-commands-use-case.mjs`.
- Экспортируемый объект в файле — camelCase: `telegramApiClient`, `showCommandsUseCase`.
- Имя файла = kebab-case от имени объекта (`showCommandsUseCase` → `show-commands-use-case.mjs`).

## Объекты-слои

Предпочтительный стиль — **один экспортируемый объект на файл** с методами, а не классы и не россыпь свободных функций без нужды.

### `telegramApiClient` → `telegram-api-client.mjs` (adapter)

- Знает URL и детали Telegram Bot API.
- Методы вроде `getUpdates(offset)`, `sendMessage(chatId, text)`.
- Не содержит бизнес-формулировок ответов бота.
- Токен берёт из `token.mjs` (секреты не коммитить; см. `.gitignore`).

### `echoMessageUseCase` → `echo-message-use-case.mjs` (application)

- Метод `execute({ chatId, text })` (или аналогичный входной DTO-объект).
- Решает, **что** ответить (например, echo-текст).
- Для отправки сообщения вызывает adapter.
- Не знает про `setInterval`, offset и формат сырого Update из Telegram, если это можно оставить в presentation.

### `telegramPollingServer` → `telegram-polling-server.mjs` (presentation)

- Хранит и обновляет `offset`.
- На каждом тике: `getUpdates` → обработка апдейтов → вызов use case.
- Игнорирует апдейты без текста (или иначе фильтрует вход на границе).
- `start(intervalMs)` запускает цикл; `index.mjs` только вызывает `start()`.

## Направление зависимостей

```text
presentation  →  application  →  adapters
presentation  →  adapters        # допустимо для чтения входа (getUpdates)
index.mjs     →  presentation    # composition root
```

- Application **не** должен знать про polling/`setInterval`.
- Adapter **не** должен знать про use case и формулировки ответов.
- Presentation **не** должен содержать бизнес-текст ответа — только маршрутизацию к use case.

При добавлении фич сохраняй это направление. Не тащи Telegram-детали в application и не размазывай сценарий по adapter.

## Separation of Concerns — практические правила

1. **Новый способ получения апдейтов** (webhook вместо polling) → новый объект в `presentation/`, application и adapters по возможности не ломать.
2. **Новый сценарий бота** (не echo, а другая логика) → новый use case в `application/`.
3. **Новый внешний API / хранилище** → новый client в `adapters/`.
4. **Не плодить слои** (domain, ports, repositories), пока реальной сложности нет.
5. **Один файл — одна главная ответственность**; имя файла — kebab-case от имени экспортируемого объекта.

## Telegram Bot API — договорённости проекта

- Актуальный бот в `bot/` принимает апдейты через **webhook** (Hono, `POST /telegram/webhook`).
- Webhook и `getUpdates` взаимоисключающи; при старте вызываем `setWebhook` с `WEBHOOK_URL`.
- В учебных шагах с polling: чтобы не получать старые апдейты повторно, продвигать `offset = update_id + 1`.
- Отправка ответов — через `sendMessage` в adapter.

## Секреты и конфигурация

- Токен бота — в `token.mjs` в корне репозитория.
- `WEBHOOK_URL`, `PORT`, ключи внешних API — в `.env` (читаются в composition root).
- `token.mjs`, `.env` и аналоги — в `.gitignore`.
- В коде импортировать токен / читать `process.env`, не хардкодить секреты.

## Эволюция проекта

Папки `01-…`, `02-…`, `03-…` — учебные шаги. **Актуальный целевой стиль** для нового кода — `bot/` (слои + kebab-case + Hono webhook).

При развитии:

- сначала клади изменение в правильный слой;
- `index.mjs` оставляй тонким composition root;
- усложняй архитектуру (интерфейсы, domain, DI-контейнер) только когда трёх слоёв явно не хватает.

## Краткий чеклист перед коммитом фичи

- [ ] Логика ответа / сценария — в `application/`
- [ ] Вызовы Telegram (или другого API) — в `adapters/`
- [ ] Polling / HTTP / CLI-цикл — в `presentation/`
- [ ] Нет entities/ports «на будущее» без необходимости
- [ ] Секреты не попали в git
