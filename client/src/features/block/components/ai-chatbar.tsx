import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react'
import { Check, Send, Sparkles, WandSparkles, X } from 'lucide-react'
import { type FC, useCallback, useEffect, useRef, useState } from 'react'
import showdown from 'showdown'

import { useWorkspaceContext } from '@/features/workspace'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

import { streamAIContent } from '../api/ai-content'
import type { EventPayload, StreamEvent } from '../api/ai-content'

type PhaseState = 'input' | 'loading' | 'success' | 'error'

const AIChatbar: FC<ReactNodeViewProps> = ({ editor, deleteNode, node }) => {
    const { id: workspaceId } = useWorkspaceContext()
    const abortRef = useRef<AbortController | null>(null)
    const [prompt, setPrompt] = useState<string>('')
    const [response, setResponse] = useState<string>('')
    const textAreaChatRef = useRef<HTMLTextAreaElement | null>(null)
    const [phase, setPhase] = useState<PhaseState>('input')
    const [isMounted, setIsMounted] = useState(false)

    const converter = new showdown.Converter()
    const html = converter.makeHtml(response)
    // console.log('HTML Response:', html)

    const handleSend = async () => {
        if (!prompt.trim()) return
        if (!workspaceId) return

        abortRef.current?.abort()
        abortRef.current = new AbortController()

        setPhase('loading')
        setResponse('')

        try {
            await streamAIContent({
                workspaceId,
                prompt,
                signal: abortRef.current.signal,
                onEvent: (event: StreamEvent, data: EventPayload) => {
                    if (event === 'chunk' && data.token) {
                        setResponse((prev) => prev + data.token)
                    }

                    if (event === 'done') {
                        setPhase('success')
                    }

                    if (event === 'error') {
                        setPhase('error')
                    }
                }
            })
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                setPhase('error')
            }
        } finally {
            setPrompt('')
            abortRef.current = null
        }
    }

    const acceptResponse = () => {
        const accept = editor.commands.acceptAIText(html) // Accept the AI response
        if (accept) {
            deleteNode() // Remove the chat bubble after accepting
            setPrompt('') // Clear the prompt after accepting
        }
    }

    const rejectResponse = () => {
        abortRef.current?.abort() // Abort any ongoing stream
        abortRef.current = null
        setPhase('input')
        setPrompt('')
        setResponse('')
    }

    const handleCancelStream = () => {
        abortRef.current?.abort()
        abortRef.current = null
        setPhase(response.trim() ? 'success' : 'input')
    }

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                if (node.type.name === 'ai-chat-extension') {
                    deleteNode() // Remove the chat bubble on Escape
                }
            }
        },
        [deleteNode, node.type.name]
    )

    const handleResponseClick = () => {
        if (phase === 'success') {
            acceptResponse()
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            abortRef.current?.abort() // Clean up any ongoing stream on unmount
        }
    }, [handleKeyDown])

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (textAreaChatRef.current && phase === 'input') {
            // Delay to ensure DOM is ready and editor focus is settled
            const timer = setTimeout(() => {
                if (textAreaChatRef.current) {
                    textAreaChatRef.current.style.height = 'auto'
                    textAreaChatRef.current.style.height = `${textAreaChatRef.current.scrollHeight}px`
                    textAreaChatRef.current.focus()
                }
            }, 100) // 100ms delay

            return () => clearTimeout(timer)
        }
    }, [phase, isMounted])

    return (
        <NodeViewWrapper
            contentEditable={false}
            className="relative">
            <div className="relative w-full px-1 py-1 rounded-md ai-content">
                {response !== '' ? (
                    <div
                        className="w-full h-auto mb-2 rounded-md shadow-none"
                        onClick={handleResponseClick}>
                        <div className="p-0 text-md bg-background dark:text-[#9664f3] text-primary ">
                            <div dangerouslySetInnerHTML={{ __html: html }} />
                            {/* Add blinking cursor while streaming */}
                            {phase === 'loading' && <span className="animate-pulse">|</span>}
                        </div>
                    </div>
                ) : (
                    <p className="py-1 rounded-r-md rounded-l-md text-md text-secondary-foreground/50 bg-primary/10">Write something awesome...</p>
                )}

                <div className="flex items-center w-full mt-1 space-x-2 rounded-md min-h-20 bg-background">
                    {phase === 'loading' ? (
                        // Loading State
                        <div className="flex items-center justify-between w-full space-x-2 shadow-md rounded-md border-primary border-[0.1rem] p-5">
                            <div className="flex items-center space-x-2">
                                <Sparkles className="w-4 h-4 animate-caret-blink text-primary" />
                                <p className="flex items-end space-x-2 font-medium text-secondary-">
                                    <span>Elis is thinking</span>
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelStream}
                                className="shrink-0">
                                <X className="w-4 h-4 mr-1" />
                                Cancel
                            </Button>
                        </div>
                    ) : phase === 'success' ? (
                        // Normal State with Textarea and Button
                        <div className="flex flex-col w-full space-y-1 shadow-md rounded-md border-primary border-[0.1rem] p-1">
                            <div className="flex items-center justify-between w-full">
                                <Textarea
                                    rows={1}
                                    cols={5}
                                    ref={textAreaChatRef}
                                    id="ai-chatbar"
                                    name="ai-chatbar"
                                    value={prompt}
                                    placeholder="Ask your AI assistant..."
                                    className="border-none shadow-none resize-none focus-visible:ring-0 focus-visible:ring-transparent disabled:opacity-0"
                                    onChange={(e) => setPrompt(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault()
                                            handleSend()
                                        }
                                    }}
                                />
                                <Button
                                    variant="ghost"
                                    onClick={handleSend}
                                    disabled={!prompt}
                                    className="flex items-center justify-center bg-transparent hover:bg-primary hover:text-accent focus:bg-primary focus:text-accent disabled:opacity-50">
                                    <Send />
                                </Button>
                            </div>
                            <div className="flex items-center w-full p-1 space-x-3">
                                <Button
                                    variant={'default'}
                                    onClick={acceptResponse}>
                                    <Check /> Accept
                                </Button>
                                <Button
                                    variant={'secondary'}
                                    onClick={rejectResponse}>
                                    <X /> Reject
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center w-full shadow-md border-primary border-[0.1rem] rounded-md px-2 space-x-2">
                            <WandSparkles className="shrink-0 text-primary" />
                            <Textarea
                                ref={textAreaChatRef}
                                id="ai-chatbar"
                                name="ai-chatbar"
                                value={prompt}
                                placeholder="Ask your AI assistant..."
                                className="flex-1 border-none shadow-none resize-none focus-visible:ring-0 focus-visible:ring-transparent disabled:opacity-0"
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSend()
                                    }
                                }}
                            />
                            <Button
                                variant="ghost"
                                onClick={handleSend}
                                disabled={!prompt}
                                className="flex items-center justify-center shrink-0 bg-transparent hover:bg-primary hover:text-accent focus:bg-primary focus:text-accent disabled:opacity-50">
                                <Send />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </NodeViewWrapper>
    )
}

export default AIChatbar
