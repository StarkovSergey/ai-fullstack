import { telegramApiClient } from '../adapters/telegram-api-client.mjs'

export const showCommandsUseCase = {
  getCommandsText() {
    return [
      'Доступные команды:',
      '/start — приветствие',
      '/convert <amount> <FROM> <TO> — конвертация валюты',
      '  пример: /convert 100 USD EUR',
      '/weather <city> — текущая погода',
      '  пример: /weather Moscow',
      '/joke [category] — случайная шутка',
      '  пример: /joke programming',
      '/dog — случайное фото собаки',
    ].join('\n')
  },

  async execute({ chatId, preface }) {
    const text = preface
      ? `${preface}\n\n${this.getCommandsText()}`
      : this.getCommandsText()

    await telegramApiClient.sendMessage(chatId, text)
  },
}
