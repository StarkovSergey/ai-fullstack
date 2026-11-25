export const telegramApiClient = {
  baseUrl: null,

  init({ token }) {
    this.baseUrl = `https://api.telegram.org/bot${token}`
  },

  async setWebhook(url) {
    const response = await fetch(`${this.baseUrl}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })

    const data = await response.json()

    if (!data.ok) {
      throw new Error(
        `setWebhook failed: ${data.description ?? response.status}`,
      )
    }

    return data
  },

  async sendMessage(chatId, text) {
    const response = await fetch(`${this.baseUrl}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    })

    const data = await response.json()

    if (!data.ok) {
      throw new Error(
        `sendMessage failed: ${data.description ?? response.status}`,
      )
    }

    return data
  },
}
