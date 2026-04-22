import type { AITransformation, AITransformParams } from '../../types/image-editor'

const AI_OPTIONS = [
    { value: 'none', label: 'None' },
    { value: 'bgremove', label: '🪄 Remove Background (fast)' },
    { value: 'removedotbg', label: '✨ Remove Background (premium)' },
    { value: 'dropshadow', label: '🌑 AI Drop Shadow' },
    { value: 'retouch', label: '💅 Retouch / Enhance' },
    { value: 'upscale', label: '🔍 Upscale (to 16MP)' },
    { value: 'genvar', label: '🎨 Generate Variation' }
] as const

export function AITransformPanel({ ai, onChange }: { ai: AITransformParams; onChange: (a: Partial<AITransformParams>) => void }) {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-700">AI Transformations</h3>
            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">⚡ AI transforms consume extension credits and may take a few seconds.</p>

            <label className="flex flex-col gap-1 text-xs text-gray-600">
                Operation
                <select
                    value={ai.type}
                    onChange={(e) => onChange({ type: e.target.value as AITransformation })}
                    className="border rounded px-2 py-1.5 text-sm">
                    {AI_OPTIONS.map((o) => (
                        <option
                            key={o.value}
                            value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            </label>

            {ai.type === 'dropshadow' && (
                <div className="space-y-3 p-3 bg-gray-50 rounded">
                    <label className="flex flex-col gap-1 text-xs text-gray-600">
                        Light Direction (Azimuth 0-360°)
                        <input
                            type="range"
                            min={0}
                            max={360}
                            value={ai.dropShadow?.azimuth ?? 215}
                            onChange={(e) => onChange({ dropShadow: { ...ai.dropShadow, azimuth: Number(e.target.value) } })}
                        />
                        <span>{ai.dropShadow?.azimuth ?? 215}°</span>
                    </label>
                    <label className="flex flex-col gap-1 text-xs text-gray-600">
                        Elevation (0-90°)
                        <input
                            type="range"
                            min={0}
                            max={90}
                            value={ai.dropShadow?.elevation ?? 45}
                            onChange={(e) => onChange({ dropShadow: { ...ai.dropShadow, elevation: Number(e.target.value) } })}
                        />
                        <span>{ai.dropShadow?.elevation ?? 45}°</span>
                    </label>
                    <label className="flex flex-col gap-1 text-xs text-gray-600">
                        Intensity (0-100)
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={ai.dropShadow?.saturation ?? 60}
                            onChange={(e) => onChange({ dropShadow: { ...ai.dropShadow, saturation: Number(e.target.value) } })}
                        />
                        <span>{ai.dropShadow?.saturation ?? 60}</span>
                    </label>
                </div>
            )}

            <label className="flex flex-col gap-1 text-xs text-gray-600">
                Change Background (prompt)
                <input
                    type="text"
                    placeholder="e.g. snowy mountain road"
                    value={ai.changeBackground?.prompt ?? ''}
                    onChange={(e) => onChange({ changeBackground: { prompt: e.target.value } })}
                    className="border rounded px-2 py-1.5 text-sm"
                />
            </label>

            <label className="flex flex-col gap-1 text-xs text-gray-600">
                Edit Image (AI prompt)
                <input
                    type="text"
                    placeholder="e.g. make the sky more dramatic"
                    value={ai.editImage?.prompt ?? ''}
                    onChange={(e) => onChange({ editImage: { prompt: e.target.value } })}
                    className="border rounded px-2 py-1.5 text-sm"
                />
            </label>
        </div>
    )
}
