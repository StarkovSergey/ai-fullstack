import { TELEGRAM_TOKEN, WEBHOOK_SECRET } from '../../token.mjs'

export const telegramApiClient = {
  baseUrl: `https://api.telegram.org/bot${TELEGRAM_TOKEN}`,

  async sendMessage(chatId, text) {
    await fetch(this.baseUrl + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    })
  },

  async sendPhoto(chatId, photo, caption) {
    await fetch(this.baseUrl + '/sendPhoto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        photo,
        ...(caption ? { caption } : {}),
      }),
    })
  },

  async setWebhook(webhookUrl) {
    const response = await fetch(this.baseUrl + '/setWebhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: webhookUrl,
        secret_token: WEBHOOK_SECRET,
      }),
    })

    return response.json()
  },
}
