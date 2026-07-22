import { JSX } from 'react'
import { Form, useForm } from '@formisch/react'
import type { SubmitHandler } from '@formisch/react'

import { Button } from '@/components/ui/button'

import type { BatssRunInput } from '@shared/batss-types'

import { StudyDesignSection } from '@/components/batss/study-design-section'
import { DecisionRuleSection } from '@/components/batss/decision-rule-section'
import { SimulationSettingsSection } from '@/components/batss/simulation-settings-section'
import { designSchema, initialDesignInput } from '@/lib/schema'
import { Play } from 'lucide-react'

type BatssFormProps = {
  onRun: (input: BatssRunInput) => Promise<void>
  isRunning: boolean
  elapsedSeconds: number
}

export function BatssForm({ onRun, isRunning, elapsedSeconds }: BatssFormProps): JSX.Element {
  const form = useForm({
    schema: designSchema,
    validate: 'blur',
    revalidate: 'input',
    initialInput: initialDesignInput
  })

  const handleSubmit: SubmitHandler<typeof designSchema> = async (output) => {
    await onRun({
      primaryOutcome: output.primaryOutcome,
      probability: output.probability,
      logOdds: output.logOdds,
      deltaEff: output.decisionRule.deltaEff,
      b: output.decisionRule.b,
      N: output.N,
      m0: output.m0,
      m: output.m,
      R: output.R
    })
  }

  return (
    <Form of={form} onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <StudyDesignSection form={form} />
          <DecisionRuleSection form={form} />
          <SimulationSettingsSection form={form} />
        </div>
      </div>
      <div className="border-t p-4">
        <Button type="submit" disabled={isRunning} className="w-full text-xl">
          <Play
            className={`mr-2 h-5 w-5 transition-transform ${
              isRunning ? 'animate-pulse scale-110' : ''
            }`}
          />
          {isRunning ? `Running… ${elapsedSeconds.toFixed(1)} s` : `Run Simulation`}
        </Button>
      </div>
    </Form>
  )
}
