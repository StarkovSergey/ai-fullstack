import 'dotenv/config'

import { token } from '../token.mjs'

import { telegramApiClient } from './adapters/telegram-api-client.mjs'
import { weatherApiClient } from './adapters/weather-api-client.mjs'
import { frankfurterApiClient } from './adapters/frankfurter-api-client.mjs'

import { showCommandsUseCase } from './application/show-commands-use-case.mjs'
import { startUseCase } from './application/start-use-case.mjs'
import { convertCurrencyUseCase } from './application/convert-currency-use-case.mjs'
import { getWeatherUseCase } from './application/get-weather-use-case.mjs'

import { telegramMessageRouter } from './presentation/telegram-message-router.mjs'
import { telegramWebhookServer } from './presentation/telegram-webhook-server.mjs'

const port = Number(process.env.PORT) || 3000
const webhookUrl = process.env.WEBHOOK_URL
const weatherApiKey = process.env.WEATHER_API_KEY

if (!token || token === 'YOUR_TELEGRAM_BOT_TOKEN') {
  throw new Error('Set a real bot token in token.mjs')
}

if (!webhookUrl) {
  throw new Error('Set WEBHOOK_URL in .env')
}

if (!weatherApiKey) {
  throw new Error('Set WEATHER_API_KEY in .env')
}

telegramApiClient.init({ token })
weatherApiClient.init({ apiKey: weatherApiKey })

showCommandsUseCase.init({ telegramApiClient })
startUseCase.init({ showCommandsUseCase })
convertCurrencyUseCase.init({ telegramApiClient, frankfurterApiClient })
getWeatherUseCase.init({ telegramApiClient, weatherApiClient })

telegramMessageRouter.init({
  startUseCase,
  showCommandsUseCase,
  convertCurrencyUseCase,
  getWeatherUseCase,
})

telegramWebhookServer.init({
  telegramApiClient,
  telegramMessageRouter,
  webhookUrl,
  port,
})

await telegramWebhookServer.start()
