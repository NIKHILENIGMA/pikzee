import type { Transformation } from '../types/image-editor'

export function buildImageKitURL(baseUrl: string, transformations: Transformation[]): string {
    const tr = transformations
        .map((t) => {
            switch (t.type) {
                case 'resize':
                    return `w-${t.width},h-${t.height}`

                case 'crop':
                    return `c-${t.mode}`

                case 'effect':
                    return t.value ? `e-${t.effect}-${t.value}` : `e-${t.effect}`

                case 'background':
                    return t.action === 'remove' ? 'bg-remove' : `bg-${t.color}`

                case 'overlay_text':
                    return `l-text,i-${encodeURIComponent(t.text)}`

                case 'overlay_image':
                    return `l-image,i-${encodeURIComponent(t.url)}`

                default:
                    return ''
            }
        })
        .filter(Boolean)
        .join(',')

    return `${baseUrl}?tr=${tr}`
}
