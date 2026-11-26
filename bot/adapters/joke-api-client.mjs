export const jokeApiClient = {
  baseUrl: 'https://v2.jokeapi.dev',

  async getRandomJoke(category = 'Any') {
    const response = await fetch(
      `${this.baseUrl}/joke/${encodeURIComponent(category)}?safe-mode`,
    )

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`JokeAPI error ${response.status}: ${errorBody}`)
    }

    return response.json()
  },
}
