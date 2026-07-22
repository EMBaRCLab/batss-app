import { create } from 'zustand'

import type { BatssRunInput, BatssRunResult, BatssSavedResult } from '@shared/batss-types'

interface BatssState {
  input: BatssRunInput | null
  result: BatssRunResult | null
  isRunning: boolean

  runSimulation: (input: BatssRunInput) => Promise<BatssRunResult>
  saveResults: () => Promise<void>
  loadResults: () => Promise<boolean>

  setInput: (input: BatssRunInput) => void
}

export const useBatss = create<BatssState>((set, get) => ({
  input: null,
  result: null,
  isRunning: false,

  setInput: (input) => set({ input }),

  runSimulation: async (input: BatssRunInput) => {
    set({
      input,
      result: null,
      isRunning: true
    })

    try {
      const response = await window.batss.runExample(input)

      set({ result: response })
      return response
    } finally {
      set({ isRunning: false })
    }
  },

  saveResults: async () => {
    const { input, result } = get()

    if (!input || !result) return

    const data: BatssSavedResult = {
      version: 1,
      createdAt: new Date().toISOString(),
      input,
      result
    }

    await window.batss.saveResult(data)
  },

  loadResults: async () => {
    const saved = await window.batss.loadResult()

    if (!saved) return false

    set({
      input: saved.input,
      result: saved.result
    })

    return true
  }
}))
