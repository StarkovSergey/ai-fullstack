import { Hono } from 'hono'
import { serve } from '@hono/node-server'

export const telegramWebhookServer = {
  telegramApiClient: null,
  telegramMessageRouter: null,
  webhookUrl: null,
  port: 3000,
  app: null,

  init({ telegramApiClient, telegramMessageRouter, webhookUrl, port }) {
    this.telegramApiClient = telegramApiClient
    this.telegramMessageRouter = telegramMessageRouter
    this.webhookUrl = webhookUrl
    this.port = port

    const app = new Hono()

    app.get('/health', (c) => c.json({ ok: true }))

    app.post('/telegram/webhook', async (c) => {
      try {
        const update = await c.req.json()
        await this.telegramMessageRouter.handleUpdate(update)
      } catch (error) {
        console.error('Failed to handle update:', error)
      }

      return c.json({ ok: true })
    })

    this.app = app
  },

  async start() {
    await this.telegramApiClient.setWebhook(this.webhookUrl)
    console.log(`Webhook set to ${this.webhookUrl}`)

    serve({
      fetch: this.app.fetch,
      port: this.port,
    })

    console.log(`Hono listening on http://localhost:${this.port}`)
  },
}
