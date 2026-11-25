export const weatherApiClient = {
  apiKey: null,
  baseUrl: 'https://api.weatherapi.com/v1',

  init({ apiKey }) {
    this.apiKey = apiKey
  },

  async getCurrent(query) {
    const url = new URL(`${this.baseUrl}/current.json`)
    url.searchParams.set('key', this.apiKey)
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
