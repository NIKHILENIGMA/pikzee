// apps/client/src/components/image-editor/panels/TextOverlayPanel.tsx

import type { TextOverlayParams } from '../../types/image-editor'

const IK_FONTS = ['Montserrat', 'Roboto', 'Lato', 'Open Sans', 'Ubuntu', 'Lora', 'Arvo', 'Chivo', 'Kanit', 'Crimson Text']

export function TextOverlayPanel({
    textOverlay,
    onUpdate,
    onRemove
}: {
    textOverlay: TextOverlayParams | null
    onUpdate: (t: Partial<TextOverlayParams> | null) => void
    onRemove: () => void
}) {
    const t = textOverlay

    if (!t) {
        return (
            <div className="space-y-2">
                <h3 className="font-semibold text-sm text-gray-700">Text Overlay</h3>
                <button
                    onClick={() => onUpdate({ text: 'Your Text' })}
                    className="w-full border-2 border-dashed rounded py-3 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition">
                    + Add Text Overlay
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-gray-700">Text Overlay</h3>
                <button
                    onClick={onRemove}
                    className="text-xs text-red-500 hover:underline">
                    Remove
                </button>
            </div>

            <label className="flex flex-col gap-1 text-xs text-gray-600">
                Text
                <input
                    type="text"
                    value={t.text}
                    onChange={(e) => onUpdate({ text: e.target.value })}
                    className="border rounded px-2 py-1.5 text-sm"
                />
            </label>

            <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-xs text-gray-600">
                    Font Size
                    <input
                        type="number"
                        value={t.fontSize}
                        onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
                        className="border rounded px-2 py-1.5 text-sm"
                    />
                </label>
                <label className="flex flex-col gap-1 text-xs text-gray-600">
                    Font
                    <select
                        value={t.fontFamily}
                        onChange={(e) => onUpdate({ fontFamily: e.target.value })}
                        className="border rounded px-2 py-1.5 text-sm">
                        {IK_FONTS.map((f) => (
                            <option
                                key={f}
                                value={f}>
                                {f}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-xs text-gray-600">
                    Text Color
                    <div className="flex gap-2 items-center">
                        <input
                            type="color"
                            value={`#${t.color}`}
                            onChange={(e) => onUpdate({ color: e.target.value.replace('#', '') })}
                            className="w-8 h-8 rounded cursor-pointer"
                        />
                        <span className="text-xs">{t.color}</span>
                    </div>
                </label>
                <label className="flex flex-col gap-1 text-xs text-gray-600">
                    Background
                    <div className="flex gap-2 items-center">
                        <input
                            type="color"
                            value={`#${t.backgroundColor ?? '000000'}`}
                            onChange={(e) => onUpdate({ backgroundColor: e.target.value.replace('#', '') })}
                            className="w-8 h-8 rounded cursor-pointer"
                        />
                        <span className="text-xs">{t.backgroundColor}</span>
                    </div>
                </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-xs text-gray-600">
                    X Position
                    <input
                        type="number"
                        value={t.positionX ?? ''}
                        onChange={(e) => onUpdate({ positionX: Number(e.target.value) })}
                        className="border rounded px-2 py-1.5 text-sm"
                        placeholder="px from left"
                    />
                </label>
                <label className="flex flex-col gap-1 text-xs text-gray-600">
                    Y Position
                    <input
                        type="number"
                        value={t.positionY ?? ''}
                        onChange={(e) => onUpdate({ positionY: Number(e.target.value) })}
                        className="border rounded px-2 py-1.5 text-sm"
                        placeholder="px from top"
                    />
                </label>
            </div>

            <label className="flex flex-col gap-1 text-xs text-gray-600">
                Alignment
                <div className="flex gap-2">
                    {(['left', 'center', 'right'] as const).map((align) => (
                        <button
                            key={align}
                            onClick={() => onUpdate({ innerAlign: align })}
                            className={`flex-1 py-1 rounded text-xs border ${
                                t.innerAlign === align ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300'
                            }`}>
                            {align}
                        </button>
                    ))}
                </div>
            </label>

            <label className="flex flex-col gap-1 text-xs text-gray-600">
                Padding
                <input
                    type="text"
                    value={t.padding ?? ''}
                    onChange={(e) => onUpdate({ padding: e.target.value })}
                    className="border rounded px-2 py-1.5 text-sm"
                    placeholder="e.g. 10 or 10_20_10_20"
                />
            </label>
        </div>
    )
}
