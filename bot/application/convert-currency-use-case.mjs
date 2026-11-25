import { telegramApiClient } from '../adapters/telegram-api-client.mjs'
import { frankfurterApiClient } from '../adapters/frankfurter-api-client.mjs'

export const convertCurrencyUseCase = {
  async execute({ chatId, args }) {
    const [amountRaw, from, to] = args
    const amount = Number(amountRaw)

    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !from ||
      !to ||
      from.length !== 3 ||
      to.length !== 3
    ) {
      await telegramApiClient.sendMessage(
        chatId,
        'Формат: /convert <amount> <FROM> <TO>\nПример: /convert 100 USD EUR',
      )
      return
    }

    try {
      const data = await frankfurterApiClient.convert({ amount, from, to })
      const result = data.rates[to.toUpperCase()]

      if (result == null) {
        await telegramApiClient.sendMessage(
          chatId,
          `Не удалось сконвертировать ${from.toUpperCase()} → ${to.toUpperCase()}`,
        )
        return
      }

      const rounded = Number(result).toFixed(2)
      const dateLine = data.date ? `\n(курс на ${data.date})` : ''

      await telegramApiClient.sendMessage(
        chatId,
        `${amount} ${from.toUpperCase()} = ${rounded} ${to.toUpperCase()}${dateLine}`,
      )
    } catch {
      await telegramApiClient.sendMessage(
        chatId,
        'Не получилось сконвертировать. Проверь коды валют (USD, EUR, GBP…) и попробуй ещё раз.',
      )
    }
  },
}
