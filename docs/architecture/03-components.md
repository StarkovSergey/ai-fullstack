# Компоненты (Bot App)

Трёхслойная структура: `presentation` → `application` → `adapters`.

```mermaid
flowchart TB
  telegram["Telegram Bot API"]
  weather["WeatherAPI.com"]
  frankfurter["Frankfurter API"]
  jokeapi["JokeAPI"]
  dogceo["Dog CEO API"]

  subgraph app["Bot App — bot/"]
    index["index.mjs<br/>composition root"]

    subgraph presentation["presentation/"]
      httpApp["http-app.mjs"]
      webhookRouter["telegram-webhook-router.mjs"]
      messageRouter["telegram-message-router.mjs"]
    end

    subgraph application["application/"]
      startUC["start-use-case"]
      showCommandsUC["show-commands-use-case"]
      convertUC["convert-currency-use-case"]
      weatherUC["get-weather-use-case"]
      jokeUC["show-joke-use-case"]
      dogUC["show-dog-use-case"]
    end

    subgraph adapters["adapters/"]
      tgClient["telegram-api-client"]
      weatherClient["weather-api-client"]
      frankfurterClient["frankfurter-api-client"]
      jokeClient["joke-api-client"]
      dogClient["dog-api-client"]
    end
  end

  index -->|"serve + setWebhook"| httpApp
  index --> tgClient
  httpApp -->|"/telegram"| webhookRouter
  webhookRouter -->|"handleUpdate"| messageRouter

  messageRouter --> startUC
  messageRouter --> showCommandsUC
  messageRouter --> convertUC
  messageRouter --> weatherUC
  messageRouter --> jokeUC
  messageRouter --> dogUC

  startUC --> showCommandsUC
  showCommandsUC --> tgClient
  convertUC --> tgClient
  convertUC --> frankfurterClient
  weatherUC --> tgClient
  weatherUC --> weatherClient
  jokeUC --> tgClient
  jokeUC --> jokeClient
  dogUC --> tgClient
  dogUC --> dogClient

  tgClient --> telegram
  weatherClient --> weather
  frankfurterClient --> frankfurter
  jokeClient --> jokeapi
  dogClient --> dogceo
```

## Команды → use case

| Команда | Use case |
| ------- | -------- |
| `/start` | `startUseCase` (+ список команд) |
| `/convert` | `convertCurrencyUseCase` |
| `/weather` | `getWeatherUseCase` |
| `/joke` | `showJokeUseCase` |
| `/dog` | `showDogUseCase` |
| иное | `showCommandsUseCase` |
