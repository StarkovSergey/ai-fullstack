import { Hono } from 'hono'
import { telegramWebhookRouter } from './telegram-webhook-router.mjs'

export const httpApp = new Hono()

httpApp.route('/telegram', telegramWebhookRouter)

httpApp.notFound((c) => c.text('Not Found', 404))
