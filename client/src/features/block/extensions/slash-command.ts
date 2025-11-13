/* eslint-disable @typescript-eslint/no-explicit-any */
// src/tiptap/extensions/SlashCommand.ts
import { Editor, Extension, type Range } from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import Suggestion, { type SuggestionOptions } from '@tiptap/suggestion'
import tippy, { type Instance } from 'tippy.js'

import { SlashMenu, type SlashItem } from '../components/slash-menu'
import { slashCommands } from '../util/command'

type SlashCommandOptions = {
    suggestion: Partial<SuggestionOptions> & {
        toggle: string[]
    }
}

export const SlashCommand = Extension.create<SlashCommandOptions>({
    name: 'slashCommand',

    addOptions() {
        return {
            suggestion: {
                char: '/',
                allowSpaces: false,
                startOfLine: false,
                toggle: []
            }
        }
    },

    addProseMirrorPlugins() {
        const editor = this.editor
        return [
            Suggestion({
                editor,
                ...this.options.suggestion,
                items: ({ query, editor }: { query: string; editor: Editor }) => {
                    const { $from } = editor.state.selection // Get the current selection
                    const parentType = $from.parent.type.name // Get the parent node type

                    // Check if the parent type is in the toggle list
                    if (this.options.suggestion.toggle?.includes(parentType)) {
                        return []
                    }
                    const commands: SlashItem[] = slashCommands()
                    return commands.filter(
                        (command) => command.label.toLowerCase().includes(query.toLowerCase()) || (command.hint ?? '').includes(query.toLowerCase())
                    )
                },
                render: () => {
                    let component: ReactRenderer | null = null
                    let popup: Instance[] = []

                    let selectedIndex = 0
                    let itemsCache: SlashItem[] = []

                    const onKeyNav = (dir: 'up' | 'down' | 'enter', editor: Editor, range: Range) => {
                        if (!itemsCache.length) return
                        if (dir === 'down') selectedIndex = (selectedIndex + 1) % itemsCache.length
                        if (dir === 'up') {
                            selectedIndex = (selectedIndex - 1 + itemsCache.length) % itemsCache.length
                        }
                        if (dir === 'enter') itemsCache[selectedIndex]?.run(editor, range)

                        // Update the component with the new props
                        component?.updateProps({
                            items: itemsCache,
                            selectedIndex,
                            onKeyNav,
                            editor, // Pass the editor instance
                            range // Pass the selection range
                        })
                    }

                    return {
                        onStart: (props) => {
                            selectedIndex = 0
                            itemsCache = props.items
                            // Create the React component
                            component = new ReactRenderer(SlashMenu, {
                                editor: props.editor,
                                // Pass the component props for react component to render
                                props: {
                                    items: itemsCache,
                                    selectedIndex,
                                    onKeyNav,
                                    editor: props.editor, // Pass the editor instance
                                    range: props.range // Pass the selection range
                                }
                            })

                            // Position the popup on the body
                            popup = tippy('body', {
                                getReferenceClientRect: props.clientRect as any,
                                appendTo: () => document.body,
                                content: component.element,
                                interactive: true,
                                trigger: 'manual',
                                placement: 'bottom-start'
                            })
                            popup[0].show()
                        },
                        onUpdate(props) {
                            itemsCache = props.items
                            component?.updateProps({
                                items: itemsCache,
                                selectedIndex,
                                onKeyNav,
                                editor: props.editor,
                                range: props.range
                            })
                            popup[0].setProps({
                                getReferenceClientRect: props.clientRect as any
                            })
                        },
                        onKeyDown(props) {
                            const e = props.event
                            // Handle here so ProseMirror doesn't eat Enter.
                            if (e.key === 'ArrowDown') {
                                e.preventDefault()
                                onKeyNav('down', editor, props.range)
                                return true
                            }
                            if (e.key === 'ArrowUp') {
                                e.preventDefault()
                                onKeyNav('up', editor, props.range)
                                return true
                            }
                            if (e.key === 'Enter' || e.code === 'NumpadEnter') {
                                e.preventDefault()
                                onKeyNav('enter', editor, props.range)
                                // popup[0].hide();
                                return true
                            }
                            if (e.key === 'Escape') {
                                popup[0].hide()
                                return true
                            }
                            return false
                        },
                        onExit() {
                            popup[0]?.destroy()
                            component?.destroy()
                            popup = []
                            component = null
                        }
                    }
                }
            })
        ]
    }
})
