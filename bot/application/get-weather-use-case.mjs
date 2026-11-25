import { telegramApiClient } from '../adapters/telegram-api-client.mjs'
import { weatherApiClient } from '../adapters/weather-api-client.mjs'

export const getWeatherUseCase = {
  async execute({ chatId, args }) {
    const city = args.join(' ').trim()

    if (!city) {
      await telegramApiClient.sendMessage(
        chatId,
        'Формат: /weather <city>\nПример: /weather Moscow',
      )
      return
    }

    try {
      const data = await weatherApiClient.getCurrent(city)
      const { location, current } = data

      const place = [location.name, location.country].filter(Boolean).join(', ')
      const text = [
        `Погода: ${place}`,
        `Температура: ${current.temp_c}°C`,
        `Ощущается как: ${current.feelslike_c}°C`,
        `Описание: ${current.condition?.text ?? '—'}`,
        `Влажность: ${current.humidity}%`,
      ].join('\n')

      await telegramApiClient.sendMessage(chatId, text)
    } catch {
      await telegramApiClient.sendMessage(
        chatId,
        `Не нашёл погоду для «${city}». Проверь название города.`,
      )
    }
  },
}
