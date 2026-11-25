import 'dotenv/config'
import { serve } from '@hono/node-server'
import { httpApp } from './presentation/http-app.mjs'
import { telegramApiClient } from './adapters/telegram-api-client.mjs'

const PORT = Number(process.env.PORT) || 3000
const webhookUrl = process.env.WEBHOOK_URL

if (!webhookUrl) {
  throw new Error('Set WEBHOOK_URL in .env')
}

if (!process.env.WEATHER_API_KEY) {
  throw new Error('Set WEATHER_API_KEY in .env')
}

serve({ fetch: httpApp.fetch, port: PORT }, async () => {
  console.log(`Server listening on http://localhost:${PORT}`)

  const result = await telegramApiClient.setWebhook(webhookUrl)
  console.log('setWebhook:', result)
})
