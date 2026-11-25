export const weatherApiClient = {
  baseUrl: 'https://api.weatherapi.com/v1',

  async getCurrent(query) {
    const url = new URL(`${this.baseUrl}/current.json`)
    url.searchParams.set('key', process.env.WEATHER_API_KEY)
    url.searchParams.set('q', query)
    url.searchParams.set('aqi', 'no')

    const response = await fetch(url)

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`WeatherAPI error ${response.status}: ${errorBody}`)
    }

    return response.json()
  },
}
