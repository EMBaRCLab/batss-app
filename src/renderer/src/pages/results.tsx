import { JSX } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from '@/components/ui/empty'

import { useBatss } from '@/stores/batss'
import { Button } from '@/components/ui/button'
import { BatssChart } from '@/components/results/bar-chart'
import { SummaryTable } from '@/components/results/summary-table'

export default function Results(): JSX.Element {
  const input = useBatss((state) => state.input)
  const result = useBatss((state) => state.result)
  const loadResults = useBatss((s) => s.loadResults)

  if (!result) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No Results</EmptyTitle>
            <EmptyDescription>
              Run a BATSS simulation or load a saved result to view results.
            </EmptyDescription>
          </EmptyHeader>

          <EmptyContent>
            <Button onClick={loadResults}>Load Result</Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  if (result.status === 'error') {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Simulation Error</CardTitle>
          </CardHeader>
          <CardContent>{result.message}</CardContent>
        </Card>
      </div>
    )
  }

  const version = result.package ? `BATSS v${result.package}` : 'BATSS'

  return (
    <div className="h-full min-h-0 overflow-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Results</h1>
            <p className="text-muted-foreground">Posterior summaries, diagnostics, and plots.</p>
          </div>

          <Badge variant="secondary">{version}</Badge>
        </div>

        {input && (
          <Card>
            <CardHeader>
              <CardTitle>Simulation Design</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Parameter label="Primary Outcome" value={input.primaryOutcome} />
                <Parameter label="Probability" value={input.probability} />
                <Parameter label="Log Odds" value={input.logOdds} />
                <Parameter label="Delta Eff" value={input.deltaEff} />
                <Parameter label="Decision Rule (b)" value={input.b} />
                <Parameter label="N" value={input.N} />
                <Parameter label="m0" value={input.m0} />
                <Parameter label="m" value={input.m} />
                <Parameter label="R" value={input.R} />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>

          <CardContent>
            <SummaryTable rows={result.table} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chart Data</CardTitle>
          </CardHeader>

          <CardContent>
            <BatssChart data={result.chart} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Parameter({ label, value }: { label: string; value: string | number }): JSX.Element {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}
