export const frankfurterApiClient = {
  baseUrl: 'https://api.frankfurter.app',

  async convert({ amount, from, to }) {
    const url = new URL(`${this.baseUrl}/latest`)
    url.searchParams.set('amount', String(amount))
    url.searchParams.set('from', from.toUpperCase())
    url.searchParams.set('to', to.toUpperCase())

    const response = await fetch(url)

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`Frankfurter error ${response.status}: ${errorBody}`)
    }

    return response.json()
  },
}
