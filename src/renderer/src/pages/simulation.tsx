import { JSX, useEffect, useState } from 'react'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

import type { BatssRunInput } from '@shared/batss-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDuration } from '@/lib/utils'
import { BatssForm } from '@/components/batss/batts-form'
import { LogPanel } from '@/components/batss/log-panel'
import { useBatss } from '@/stores/batss'
import { useNavigation } from '@/stores/navigation'

export default function Simulation(): JSX.Element {
  const navigate = useNavigation((state) => state.navigate)
  const isRunning = useBatss((s) => s.isRunning)
  const runSimulation = useBatss((s) => s.runSimulation)
  const [logs, setLogs] = useState<string[]>([])

  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    const unsubscribe = window.batss.onLog((line) => {
      setLogs((prev) => [...prev, line])
    })

    return unsubscribe
  }, [])

  const handleRun = async (input: BatssRunInput): Promise<void> => {
    setLogs([])
    setElapsedSeconds(0)

    setLogs([
      '> Starting BATSS simulation',
      `> Parameters: N=${input.N}, R=${input.R}, m0=${input.m0}, m=${input.m}`,
      `> Probability=${input.probability}, logOdds=${input.logOdds}`,
      `> Decision rule: b=${input.b}, deltaEff=${input.deltaEff}`,
      ''
    ])

    const start = performance.now()

    const timer = window.setInterval(() => {
      setElapsedSeconds((performance.now() - start) / 1000)
    }, 100)

    try {
      const response = await runSimulation(input)

      if (response.status === 'success') {
        navigate('results')
      }
    } finally {
      const elapsed = (performance.now() - start) / 1000

      clearInterval(timer)
      setElapsedSeconds(elapsed)

      setLogs((prev) => [...prev, '', `> Completed in ${formatDuration(elapsed)}`])
    }
  }

  return (
    <div className="relative h-full min-h-0">
      <ResizablePanelGroup orientation="vertical" className="h-full">
        <ResizablePanel defaultSize="50%" minSize="20%">
          <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden p-6">
            <Card className="min-h-0 flex-1 overflow-hidden flex flex-col">
              <CardHeader>
                <CardTitle>BATSS Simulation Design</CardTitle>
              </CardHeader>
              <CardContent className="min-h-0 flex-1 overflow-hidden">
                <BatssForm
                  onRun={handleRun}
                  isRunning={isRunning}
                  elapsedSeconds={elapsedSeconds}
                />
              </CardContent>
            </Card>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize="10%" defaultSize="20%">
          <div className="flex h-full min-h-0 flex-col gap-4 p-4">
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">Simulation Log</h2>
            </div>
            <div className="min-h-0 flex-1">
              <LogPanel logs={logs} isRunning={isRunning} elapsedSeconds={elapsedSeconds} />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
