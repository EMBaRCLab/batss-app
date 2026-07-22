import { app } from 'electron'
import path from 'path'

export function getRLibraryPath(): string {
  return path.join(app.getPath('userData'), 'R-library')
}

export function getWorkspacePath(): string {
  return path.join(app.getPath('documents'), 'Albatross')
}

export function getSettingsPath(): string {
  return path.join(app.getPath('userData'), 'settings.json')
}
