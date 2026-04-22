import type { CropParams, CropStrategy, FocusMode } from '../../types/image-editor'

const CROP_STRATEGIES = [
    { value: 'maintain_ratio', label: 'Maintain Ratio (default)' },
    { value: 'pad_resize', label: 'Pad Resize (no crop)' },
    { value: 'force', label: 'Force (stretch)' },
    { value: 'at_max', label: 'Max Size' },
    { value: 'at_least', label: 'Min Size' },
    { value: 'extract', label: 'Extract (pixel crop)' }
] as const

const FOCUS_MODES = [
    { value: 'center', label: 'Center' },
    { value: 'auto', label: 'Smart (Auto)' },
    { value: 'face', label: 'Face Detect' },
    { value: 'top', label: 'Top' },
    { value: 'bottom', label: 'Bottom' },
    { value: 'top_left', label: 'Top Left' },
    { value: 'top_right', label: 'Top Right' },
    { value: 'bottom_left', label: 'Bottom Left' },
    { value: 'bottom_right', label: 'Bottom Right' }
]

const COCO_OBJECTS = ['person', 'car', 'dog', 'cat', 'bicycle', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'bird', 'horse']

export function CropPanel({ crop, onChange }: { crop: CropParams; onChange: (c: Partial<CropParams>) => void }) {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-700">Crop</h3>

            <label className="flex flex-col gap-1 text-xs text-gray-600">
                Crop Strategy
                <select
                    value={crop.strategy}
                    onChange={(e) => onChange({ strategy: e.target.value as CropStrategy })}
                    className="border rounded px-2 py-1.5 text-sm">
                    {CROP_STRATEGIES.map((s) => (
                        <option
                            key={s.value}
                            value={s.value}>
                            {s.label}
                        </option>
                    ))}
                </select>
            </label>

            <label className="flex flex-col gap-1 text-xs text-gray-600">
                Focus Mode
                <select
                    value={crop.focus ?? 'center'}
                    onChange={(e) => onChange({ focus: e.target.value as FocusMode, objectFocus: undefined })}
                    className="border rounded px-2 py-1.5 text-sm">
                    {FOCUS_MODES.map((f) => (
                        <option
                            key={f.value}
                            value={f.value}>
                            {f.label}
                        </option>
                    ))}
                </select>
            </label>

            <label className="flex flex-col gap-1 text-xs text-gray-600">
                Object Focus (AI)
                <select
                    value={crop.objectFocus ?? ''}
                    onChange={(e) => onChange({ objectFocus: e.target.value || undefined })}
                    className="border rounded px-2 py-1.5 text-sm">
                    <option value="">None</option>
                    {COCO_OBJECTS.map((o) => (
                        <option
                            key={o}
                            value={o}>
                            {o}
                        </option>
                    ))}
                </select>
            </label>

            {crop.strategy === 'extract' && (
                <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col gap-1 text-xs text-gray-600">
                        X Offset
                        <input
                            type="number"
                            value={crop.x ?? ''}
                            onChange={(e) => onChange({ x: Number(e.target.value) })}
                            className="border rounded px-2 py-1.5 text-sm"
                        />
                    </label>
                    <label className="flex flex-col gap-1 text-xs text-gray-600">
                        Y Offset
                        <input
                            type="number"
                            value={crop.y ?? ''}
                            onChange={(e) => onChange({ y: Number(e.target.value) })}
                            className="border rounded px-2 py-1.5 text-sm"
                        />
                    </label>
                </div>
            )}

            <label className="flex flex-col gap-1 text-xs text-gray-600">
                Zoom (for face/object focus)
                <input
                    type="range"
                    min={0.1}
                    max={3}
                    step={0.1}
                    value={crop.zoom ?? 1}
                    onChange={(e) => onChange({ zoom: Number(e.target.value) })}
                />
                <span className="text-gray-400">{crop.zoom ?? 1}x</span>
            </label>
        </div>
    )
}
