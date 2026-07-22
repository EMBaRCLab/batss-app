// src/shared/batss-types.ts
//
// Shared between the renderer (BatssTest form) and main (BatssService),
// same reasoning as runtime-types.ts: one definition, not two that can
// silently drift apart.

export type BatssRunInput = {
  // 'A' = positive primary outcome -> alternative = "greater"
  // 'B' = negative primary outcome -> alternative = "less"
  primaryOutcome: 'A' | 'B'
  probability: number
  logOdds: number
  deltaEff: number
  b: number
  N: number
  m0: number
  m: number
  R: number
}

export interface BatssSummaryRow {
  Outcome: 'B Superior' | 'Inconclusive'
  H0: number
  H1: number
}

export interface BatssChartRow {
  Scenario: 'H0' | 'H1'
  Outcome: 'B Superior' | 'Inconclusive'
  Proportion: number
}

export type BatssRunResult =
  | {
      status: 'success'
      package: string
      table: BatssSummaryRow[]
      chart: BatssChartRow[]
    }
  | {
      status: 'error'
      message: string
    }

export interface BatssSavedResult {
  version: 1
  createdAt: string
  input: BatssRunInput
  result: BatssRunResult
}
