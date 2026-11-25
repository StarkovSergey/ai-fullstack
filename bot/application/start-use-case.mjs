export const startUseCase = {
  showCommandsUseCase: null,

  init({ showCommandsUseCase }) {
    this.showCommandsUseCase = showCommandsUseCase
  },

  async execute({ chatId }) {
    await this.showCommandsUseCase.execute({
      chatId,
      preface: 'Привет! Я бот для курса и погоды 👋',
    })
  },
}
