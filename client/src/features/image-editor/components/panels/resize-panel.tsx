import type { FC } from 'react'
import type { ResizeParams } from '../../types/image-editor'

interface ResizePanelProps {
    resize: ResizeParams
    onChange: (r: Partial<ResizeParams>) => void
}

const ResizePanel: FC<ResizePanelProps> = ({ resize, onChange }) => {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-700">Resize</h3>
            <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-xs text-gray-600">
                    Width (px)
                    <input
                        type="number"
                        min={1}
                        value={resize.width ?? ''}
                        onChange={(e) => onChange({ width: e.target.value ? Number(e.target.value) : undefined })}
                        className="border rounded px-2 py-1.5 text-sm"
                        placeholder="e.g. 800"
                    />
                </label>
                <label className="flex flex-col gap-1 text-xs text-gray-600">
                    Height (px)
                    <input
                        type="number"
                        min={1}
                        value={resize.height ?? ''}
                        onChange={(e) => onChange({ height: e.target.value ? Number(e.target.value) : undefined })}
                        className="border rounded px-2 py-1.5 text-sm"
                        placeholder="e.g. 600"
                    />
                </label>
            </div>
            <label className="flex flex-col gap-1 text-xs text-gray-600">
                Aspect Ratio
                <select
                    value={resize.aspectRatio ?? ''}
                    onChange={(e) => onChange({ aspectRatio: e.target.value || undefined })}
                    className="border rounded px-2 py-1.5 text-sm">
                    <option value="">None</option>
                    <option value="16-9">16:9</option>
                    <option value="4-3">4:3</option>
                    <option value="1-1">1:1 (Square)</option>
                    <option value="3-2">3:2</option>
                    <option value="9-16">9:16 (Portrait)</option>
                </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-gray-600">
                DPR
                <select
                    value={resize.dpr ?? 1}
                    onChange={(e) => onChange({ dpr: Number(e.target.value) })}
                    className="border rounded px-2 py-1.5 text-sm">
                    <option value={1}>1x</option>
                    <option value={2}>2x (Retina)</option>
                    <option value={3}>3x</option>
                </select>
            </label>
        </div>
    )
}

export default ResizePanel
