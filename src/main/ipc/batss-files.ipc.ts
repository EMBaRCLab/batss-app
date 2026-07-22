import { ipcMain, dialog } from 'electron'
import fs from 'fs/promises'
import { settingsService } from '../services/settings.service'
import path from 'path'
import { getWorkspacePath } from '../services/filesystem/app-paths'
import { OUTPUT_PATH_KEY } from '../settings.constants'

export function registerBatssFilesIPC(): void {
  ipcMain.removeHandler('batss:saveResult')
  ipcMain.removeHandler('batss:loadResult')

  ipcMain.handle('batss:saveResult', async (_, data) => {
    const now = new Date()
    const fileName = `BATSS-${now.toISOString().slice(0, 19).replace(/:/g, '-')}.batss`
    const defaultPath = path.join(
      settingsService.get(OUTPUT_PATH_KEY, getWorkspacePath()),
      fileName
    )
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath,
      filters: [
        {
          name: 'BATSS Result',
          extensions: ['batss']
        }
      ]
    })

    if (canceled || !filePath) return false

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')

    return true
  })

  ipcMain.handle('batss:loadResult', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      filters: [
        {
          name: 'BATSS Result',
          extensions: ['batss']
        }
      ],
      properties: ['openFile']
    })

    if (canceled || filePaths.length === 0) return null

    const text = await fs.readFile(filePaths[0], 'utf8')

    return JSON.parse(text)
  })
}
