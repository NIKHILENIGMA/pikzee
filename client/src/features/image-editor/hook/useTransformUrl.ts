import { useMemo, useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import { buildTransformUrl } from '../util/imagekit-url-builder'
import type { TransformState, ResizeParams, CropParams, TextOverlayParams, AITransformParams } from '../types/image-editor'

const DEFAULT_STATE: TransformState = {
    imageUrl: '',
    resize: {},
    crop: { strategy: 'maintain_ratio' },
    textOverlay: null,
    ai: { type: 'none' }
}

export function useTransformUrl(initialImageUrl: string) {
    const [state, setState] = useState<TransformState>({
        ...DEFAULT_STATE,
        imageUrl: initialImageUrl
    })

    // Sync state.imageUrl when initialImageUrl prop changes
    useEffect(() => {
        setState((s) => ({ ...s, imageUrl: initialImageUrl }))
    }, [initialImageUrl])

    // Generate the raw URL whenever state changes
    const rawUrl = useMemo(() => buildTransformUrl(state), [state])

    // Use the use-debounce hook for the final URL
    const [debouncedUrl, { isPending }] = useDebounce(rawUrl, 300)

    const updateResize = (resize: Partial<ResizeParams>) => setState((s) => ({ ...s, resize: { ...s.resize, ...resize } }))

    const updateCrop = (crop: Partial<CropParams>) => setState((s) => ({ ...s, crop: { ...s.crop, ...crop } }))

    const updateTextOverlay = (text: Partial<TextOverlayParams> | null) =>
        setState((s) => ({
            ...s,
            textOverlay: text === null ? null : { ...DEFAULT_TEXT, ...s.textOverlay, ...text }
        }))

    const updateAI = (ai: Partial<AITransformParams>) => setState((s) => ({ ...s, ai: { ...s.ai, ...ai } }))

    const reset = () => setState({ ...DEFAULT_STATE, imageUrl: initialImageUrl })

    return {
        state,
        transformedUrl: debouncedUrl || rawUrl, // Fallback to rawUrl for initial load
        isPending,
        updateResize,
        updateCrop,
        updateTextOverlay,
        updateAI,
        reset
    }
}

const DEFAULT_TEXT: TextOverlayParams = {
    text: 'Hello',
    fontSize: 36,
    fontFamily: 'Montserrat',
    color: 'FFFFFF',
    backgroundColor: '000000',
    padding: '10',
    innerAlign: 'center'
}
