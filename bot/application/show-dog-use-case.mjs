import { telegramApiClient } from '../adapters/telegram-api-client.mjs'
import { dogApiClient } from '../adapters/dog-api-client.mjs'

export const showDogUseCase = {
  async execute({ chatId }) {
    try {
      const data = await dogApiClient.getRandomImage()

      if (data.status !== 'success' || !data.message) {
        await telegramApiClient.sendMessage(
          chatId,
          'Собачку сейчас не удалось получить. Попробуй ещё раз чуть позже.',
        )
        return
      }

      await telegramApiClient.sendPhoto(chatId, data.message, 'Вот собака 🐶')
    } catch {
      await telegramApiClient.sendMessage(
        chatId,
        'Не удалось связаться с сервисом собак. Попробуй ещё раз чуть позже.',
      )
    }
  },
}
