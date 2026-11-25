import { Hono } from 'hono'
import { WEBHOOK_SECRET } from '../../token.mjs'
import { telegramMessageRouter } from './telegram-message-router.mjs'

export const telegramWebhookRouter = new Hono()

telegramWebhookRouter.post('/webhook', async (c) => {
  const secret = c.req.header('X-Telegram-Bot-Api-Secret-Token')

  if (secret !== WEBHOOK_SECRET) {
    return c.text('Unauthorized', 401)
  }

  const update = await c.req.json()
  await telegramMessageRouter.handleUpdate(update)

  return c.json({})
})
