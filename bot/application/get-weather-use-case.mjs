export const getWeatherUseCase = {
  telegramApiClient: null,
  weatherApiClient: null,

  init({ telegramApiClient, weatherApiClient }) {
    this.telegramApiClient = telegramApiClient
    this.weatherApiClient = weatherApiClient
  },

  async execute({ chatId, args }) {
    const city = args.join(' ').trim()

    if (!city) {
      await this.telegramApiClient.sendMessage(
        chatId,
        'Формат: /weather <city>\nПример: /weather Moscow',
      )
      return
    }

    try {
      const data = await this.weatherApiClient.getCurrent(city)
      const { location, current } = data

      const place = [location.name, location.country].filter(Boolean).join(', ')
      const text = [
        `Погода: ${place}`,
        `Температура: ${current.temp_c}°C`,
        `Ощущается как: ${current.feelslike_c}°C`,
        `Описание: ${current.condition?.text ?? '—'}`,
        `Влажность: ${current.humidity}%`,
      ].join('\n')

      await this.telegramApiClient.sendMessage(chatId, text)
    } catch {
      await this.telegramApiClient.sendMessage(
        chatId,
        `Не нашёл погоду для «${city}». Проверь название города.`,
      )
    }
  },
}
