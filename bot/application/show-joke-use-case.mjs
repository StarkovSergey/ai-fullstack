import { telegramApiClient } from '../adapters/telegram-api-client.mjs'
import { jokeApiClient } from '../adapters/joke-api-client.mjs'

const CATEGORIES = [
  'Any',
  'Misc',
  'Programming',
  'Dark',
  'Pun',
  'Spooky',
  'Christmas',
]

const CATEGORY_ALIASES = {
  miscellaneous: 'Misc',
  coding: 'Programming',
  development: 'Programming',
  halloween: 'Spooky',
}

export const showJokeUseCase = {
  resolveCategory(raw) {
    if (!raw) {
      return 'Any'
    }

    const key = raw.toLowerCase()
    const alias = CATEGORY_ALIASES[key]
    if (alias) {
      return alias
    }

    return CATEGORIES.find((category) => category.toLowerCase() === key) ?? null
  },

  formatJoke(data) {
    if (data.type === 'single') {
      return data.joke
    }

    if (data.type === 'twopart') {
      return `${data.setup}\n\n${data.delivery}`
    }

    return null
  },

  async execute({ chatId, args = [] }) {
    const category = this.resolveCategory(args[0])

    if (!category) {
      await telegramApiClient.sendMessage(
        chatId,
        [
          'Неизвестная категория шутки.',
          `Доступные: ${CATEGORIES.join(', ')}`,
          'Пример: /joke programming',
        ].join('\n'),
      )
      return
    }

    try {
      const data = await jokeApiClient.getRandomJoke(category)

      if (data.error) {
        await telegramApiClient.sendMessage(
          chatId,
          'Шутку сейчас не удалось получить. Попробуй ещё раз чуть позже.',
        )
        return
      }

      const text = this.formatJoke(data)

      if (!text) {
        await telegramApiClient.sendMessage(
          chatId,
          'Шутку сейчас не удалось получить. Попробуй ещё раз чуть позже.',
        )
        return
      }

      await telegramApiClient.sendMessage(chatId, text)
    } catch {
      await telegramApiClient.sendMessage(
        chatId,
        'Не удалось связаться с сервисом шуток. Попробуй ещё раз чуть позже.',
      )
    }
  },
}
