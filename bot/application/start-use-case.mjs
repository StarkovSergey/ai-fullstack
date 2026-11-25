import { showCommandsUseCase } from './show-commands-use-case.mjs'

export const startUseCase = {
  async execute({ chatId }) {
    await showCommandsUseCase.execute({
      chatId,
      preface: 'Привет! Я бот для курса и погоды 👋',
    })
  },
}
