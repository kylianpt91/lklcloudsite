import type { HistoryEntry, DiscordWebhookConfig } from './types'

const actionLabels: Record<string, string> = {
  create: 'Création',
  update: 'Modification',
  delete: 'Suppression',
}

const actionColors: Record<string, number> = {
  create: 0x22c55e,
  update: 0x3b82f6,
  delete: 0xef4444,
}

export async function sendDiscordNotification(
  config: DiscordWebhookConfig,
  entry: Omit<HistoryEntry, 'id'>,
): Promise<void> {
  if (!config.enabled || !config.url) return
  if (!config.events.includes(entry.action)) return

  try {
    await fetch(config.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: `${actionLabels[entry.action] ?? entry.action} — ${entry.entityType}`,
          description: entry.entityName,
          color: actionColors[entry.action] ?? 0x6b7280,
          footer: { text: `Par ${entry.userName ?? 'Système'} — LKL Cloud Admin` },
          timestamp: entry.timestamp,
        }],
      }),
    })
  } catch (err) {
    console.error('[Discord] Failed to send webhook:', err)
  }
}
