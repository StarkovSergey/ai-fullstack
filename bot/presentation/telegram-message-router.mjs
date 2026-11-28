import { startUseCase } from '../application/start-use-case.mjs'
import { showCommandsUseCase } from '../application/show-commands-use-case.mjs'
import { convertCurrencyUseCase } from '../application/convert-currency-use-case.mjs'
import { getWeatherUseCase } from '../application/get-weather-use-case.mjs'
import { showJokeUseCase } from '../application/show-joke-use-case.mjs'
import { showDogUseCase } from '../application/show-dog-use-case.mjs'

export const telegramMessageRouter = {
  async handleUpdate(update) {
    const message = update.message
    const text = message?.text
    const chatId = message?.chat?.id

    if (!text || chatId == null) {
      return
    }

    // команды приходят в виде текста в формате '/command arg1 arg2 ...'
    const [rawCommand, ...args] = text.trim().split(/\s+/)
    const command = rawCommand.split('@')[0].toLowerCase() // удаляем @botname из команды (в группе часто может быть команда /start@YourBotName)

    switch (command) {
      case '/start':
        await startUseCase.execute({ chatId })
        break
      case '/convert':
        await convertCurrencyUseCase.execute({ chatId, args })
        break
      case '/weather':
        await getWeatherUseCase.execute({ chatId, args })
        break
      case '/joke':
        await showJokeUseCase.execute({ chatId, args })
        break
      case '/dog':
        await showDogUseCase.execute({ chatId })
        break
      default:
        await showCommandsUseCase.execute({ chatId })
        break
    }
  },
}
