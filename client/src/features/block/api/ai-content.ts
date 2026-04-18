import clientEnv from '@/shared/config/load-client-env'
import { AI_API_BASE } from '@/shared/constants'

export type StreamEvent = 'start' | 'chunk' | 'done' | 'error'

export type EventPayload = {
    token?: string
    message?: string
    ok?: boolean
}

export type StreamOptions = {
    workspaceId: string
    prompt: string
    signal?: AbortSignal
    onEvent: (event: StreamEvent, data: EventPayload) => void
}

export async function streamAIContent(options: StreamOptions): Promise<void> {
    const { workspaceId, prompt, signal, onEvent } = options

    const url = `${clientEnv.BACKEND_PROXY}${AI_API_BASE}/generate?workspaceId=${workspaceId}`

    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream'
        },
        body: JSON.stringify({ prompt }),
        signal
    })

    if (!response.ok || !response.body) {
        throw new Error('Failed to connect AI stream')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    const emitFrame = (frame: string) => {
        const lines = frame.split('\n')
        let event: StreamEvent = 'chunk'
        let dataStr = ''

        for (const line of lines) {
            if (line.startsWith('event:')) {
                event = line.slice(6).trim() as StreamEvent
            } else if (line.startsWith('data:')) {
                dataStr += line.slice(5).trim()
            }
        }

        if (!dataStr) return

        try {
            const parsed = JSON.parse(dataStr) as EventPayload
            onEvent(event, parsed)
        } catch {
            onEvent('error', { message: 'Invalid SSE payload' })
        }
    }

    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        const frames = buffer.split('\n\n')
        buffer = frames.pop() ?? ''

        for (const frame of frames) {
            if (frame.trim()) emitFrame(frame)
        }
    }

    if (buffer.trim()) {
        emitFrame(buffer)
    }
}
