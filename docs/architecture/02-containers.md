# Контейнеры

Рантайм: один локальный Node-процесс за Cloudflare Tunnel. Внешние системы — не наши контейнеры.

```mermaid
flowchart TB
  user(["Пользователь"])

  subgraph ours["Наша система"]
    tunnel["Cloudflare Tunnel<br/>cloudflared"]
    app["Bot App<br/>Node.js + Hono<br/>bot/"]
  end

  telegram["Telegram Bot API"]
  weather["WeatherAPI.com"]
  frankfurter["Frankfurter API"]
  jokeapi["JokeAPI"]
  dogceo["Dog CEO API"]

  user --> telegram
  telegram -->|"HTTPS webhook"| tunnel
  tunnel -->|"http://localhost:PORT"| app
  app -->|"HTTPS setWebhook, sendMessage, sendPhoto"| telegram
  app --> weather
  app --> frankfurter
  app --> jokeapi
  app --> dogceo
```

## Замечания

- `bot/` — один деплой/процесс (`pnpm start`), не дробим на микросервисы.
- Tunnel нужен только для локальной разработки (публичный HTTPS → localhost).
- Секреты: `token.mjs` (Telegram), `.env` (`WEBHOOK_URL`, `PORT`, `WEATHER_API_KEY`).
