export const telegramMessageRouter = {
  startUseCase: null,
  showCommandsUseCase: null,
  convertCurrencyUseCase: null,
  getWeatherUseCase: null,

  init({
    startUseCase,
    showCommandsUseCase,
    convertCurrencyUseCase,
    getWeatherUseCase,
  }) {
    this.startUseCase = startUseCase
    this.showCommandsUseCase = showCommandsUseCase
    this.convertCurrencyUseCase = convertCurrencyUseCase
    this.getWeatherUseCase = getWeatherUseCase
  },

  async handleUpdate(update) {
    const message = update.message
    const text = message?.text
    const chatId = message?.chat?.id

    if (!text || chatId == null) {
      return
    }

    const [rawCommand, ...args] = text.trim().split(/\s+/)
    const command = rawCommand.split('@')[0].toLowerCase()

    switch (command) {
      case '/start':
        await this.startUseCase.execute({ chatId })
        break
      case '/convert':
        await this.convertCurrencyUseCase.execute({ chatId, args })
        break
      case '/weather':
        await this.getWeatherUseCase.execute({ chatId, args })
        break
      default:
        await this.showCommandsUseCase.execute({ chatId })
        break
    }
  },
}
