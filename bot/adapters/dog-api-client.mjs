export const dogApiClient = {
  baseUrl: 'https://dog.ceo/api',

  async getRandomImage() {
    const response = await fetch(`${this.baseUrl}/breeds/image/random`)

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`Dog API error ${response.status}: ${errorBody}`)
    }

    return response.json()
  },
}
