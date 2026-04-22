import type { AITransformParams, CropParams, ResizeParams, TextOverlayParams, TransformState } from "../types/image-editor"

const IK_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || '' // e.g. https://ik.imagekit.io/yourid
/**
 * Builds the resize segment for an ImageKit URL based on the provided resize parameters.
 * @param r
 */
export function buildResizeSegment(r: ResizeParams): string {
    const segments: string[] = []
    if (r.width) segments.push(`w-${r.width}`)
    if (r.height) segments.push(`h-${r.height}`)
    if (r.aspectRatio) segments.push(`ar-${r.aspectRatio}`)
    if (r.dpr) segments.push(`dpr-${r.dpr}`)
    return segments.join(',')
}

export function buildCropSegment(crop: CropParams, resize: ResizeParams): string {
    const segments: string[] = []

    // Only include the crop strategy if at least one of width or height is specified in the resize parameters
    const hasBothDimensions: boolean = !!(resize.width && resize.height)

    if (hasBothDimensions) {
        switch (crop.strategy) {
            case 'pad_resize':
                segments.push('cm-pad_resize')
                break
            case 'maintain_ratio':
                segments.push('c-maintain_ratio')
                break
            case 'force':
                segments.push('c-force')
                break
            case 'at_max':
                segments.push('c-at_max')
                break
            case 'at_least':
                segments.push('c-at_least')
                break
            case 'extract':
                segments.push('c-extract')
                if (crop.x !== undefined) segments.push(`x-${crop.x}`)
                if (crop.y !== undefined) segments.push(`y-${crop.y}`)
                break
            default:
                break
        }
    }

    // Include focus mode if specified
    if (crop.objectFocus) {
        segments.push(`fo-${crop.objectFocus}`)
    } else if (crop.focus && crop.focus !== 'center') {
        segments.push(`fo-${crop.focus}`)
    }

    if (crop.zoom) {
        segments.push(`z-${crop.zoom}`)
    }

    return segments.join(',') // Return an empty string if no crop parameters are applicable
}

export function buildTextOverlaySegment(t: TextOverlayParams): string {
    // Detect if text needs base64 encoding (has special chars)
    const needsEncoding = /[^a-zA-Z0-9@\-_]/.test(t.text)
    const textParam = needsEncoding ? `ie-${encodeURIComponent(btoa(t.text))}` : `i-${t.text}`

    const parts: string[] = ['l-text', textParam, `fs-${t.fontSize}`, `co-${t.color}`]

    if (t.fontFamily) parts.push(`ff-${t.fontFamily}`)
    if (t.backgroundColor) parts.push(`bg-${t.backgroundColor}`)
    if (t.padding) parts.push(`pa-${t.padding}`)
    if (t.typography) parts.push(`tg-${t.typography}`)
    if (t.innerAlign) parts.push(`ia-${t.innerAlign}`)
    if (t.width) parts.push(`w-${t.width}`)
    if (t.rotation) parts.push(`rt-${t.rotation}`)
    if (t.positionX !== undefined) parts.push(`lx-${t.positionX}`)
    if (t.positionY !== undefined) parts.push(`ly-${t.positionY}`)

    parts.push('l-end')
    return parts.join(',')
}

function buildAISegments(ai: AITransformParams): string[] {
    const segments: string[] = []

    switch (ai.type) {
        case 'removedotbg':
            segments.push('e-removedotbg')
            break
        case 'bgremove':
            segments.push('e-bgremove')
            break
        case 'dropshadow': {
            const ds = ai.dropShadow
            if (ds) {
                const opts = [
                    ds.azimuth !== undefined ? `az-${ds.azimuth}` : null,
                    ds.elevation !== undefined ? `el-${ds.elevation}` : null,
                    ds.saturation !== undefined ? `st-${ds.saturation}` : null
                ]
                    .filter(Boolean)
                    .join('_')
                segments.push(opts ? `e-dropshadow-${opts}` : 'e-dropshadow')
            } else {
                segments.push('e-dropshadow')
            }
            break
        }
        case 'retouch':
            segments.push('e-retouch')
            break
        case 'upscale':
            segments.push('e-upscale')
            break
        case 'genvar':
            segments.push('e-genvar')
            break
        default:
            break
    }

    // Change background (separate from type enum — can be combined)
    if (ai.changeBackground?.prompt) {
        const prompt = ai.changeBackground.prompt
        segments.push(`e-changebg-prompt-${encodeURIComponent(prompt)}`)
    }

    // Image edit
    if (ai.editImage?.prompt) {
        const prompt = ai.editImage.prompt
        segments.push(`e-edit-prompt-${encodeURIComponent(prompt)}`)
    }

    return segments
}

export function buildTransformUrl(state: TransformState): string {
    const { imageUrl, resize, crop, textOverlay, ai } = state

    if (!imageUrl) return ''

    const hasTransformations =
        (resize.width !== undefined || resize.height !== undefined || !!resize.aspectRatio) ||
        (crop.strategy !== 'maintain_ratio' && crop.strategy !== undefined) ||
        crop.zoom !== undefined ||
        textOverlay !== null ||
        ai.type !== 'none' ||
        !!ai.changeBackground?.prompt ||
        !!ai.editImage?.prompt

    // If it's a data URL (base64) and we have no transformations, return it as is
    // This allows immediate preview after selection but before/during upload
    if (imageUrl.startsWith('data:') && !hasTransformations) {
        return imageUrl
    }

    // Normalize endpoint to NOT have a trailing slash
    const endpoint = IK_ENDPOINT.endsWith('/') ? IK_ENDPOINT.slice(0, -1) : IK_ENDPOINT

    // Derive the image path and ensure it starts with a single slash
    let imagePath = imageUrl.startsWith('http') ? imageUrl.replace(IK_ENDPOINT, '') : imageUrl

    if (!imagePath.startsWith('/')) {
        imagePath = `/${imagePath}`
    }

    const segments: string[] = []

    // 1. Resize and Crop
    const resizeSeg = buildResizeSegment(resize)
    const cropSeg = buildCropSegment(crop, resize)
    const trParts = [resizeSeg, cropSeg].filter(Boolean).join(',')
    if (trParts) segments.push(trParts)

    // 2. Text Overlay
    if (textOverlay) {
        segments.push(buildTextOverlaySegment(textOverlay))
    }

    // 3. AI Transformations (Chained with ":" in ImageKit)
    const aiSegments = buildAISegments(ai)
    if (aiSegments.length > 0) {
        segments.push(...aiSegments)
    }

    // If no transformations, just return the original URL (cleaned up)
    if (segments.length === 0) return `${endpoint}${imagePath}`

    // Join all top-level transformation segments with ":"
    const trParam = segments.join(':')
    return `${endpoint}/tr:${trParam}${imagePath}`
}