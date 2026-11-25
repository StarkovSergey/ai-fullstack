export const showCommandsUseCase = {
  telegramApiClient: null,

  init({ telegramApiClient }) {
    this.telegramApiClient = telegramApiClient
  },

  getCommandsText() {
    return [
      'Доступные команды:',
      '/start — приветствие',
      '/convert <amount> <FROM> <TO> — конвертация валюты',
      '  пример: /convert 100 USD EUR',
      '/weather <city> — текущая погода',
      '  пример: /weather Moscow',
    ].join('\n')
  },

  async execute({ chatId, preface }) {
    const text = preface
      ? `${preface}\n\n${this.getCommandsText()}`
      : this.getCommandsText()

    await this.telegramApiClient.sendMessage(chatId, text)
  },
}
