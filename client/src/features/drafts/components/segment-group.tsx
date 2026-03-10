import { type FC } from 'react'

type Option = {
    label: string
    value: string
    icon?: React.ReactNode
}

type SegmentGroupProps = {
    title: string
    options: Option[]
    value: string
    onChange: (v: string) => void
}

const SegmentGroup: FC<SegmentGroupProps> = ({ title, options, value, onChange }) => {
    return (
        <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{title}</p>

            <div className="flex justify-center gap-3">
                {options.map((opt) => {
                    const active = value === opt.value

                    return (
                        <button
                            key={opt.value}
                            onClick={() => onChange(opt.value)}
                            className={`flex flex-col items-center justify-center rounded-xl px-3 py-3 text-sm font-medium transition w-full
              ${active ? 'bg-primary text-white' : 'bg-secondary text-foreground hover:bg-primary/10'}`}>
                            {opt.icon && <div className="text-lg">{opt.icon}</div>}
                            {opt.label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default SegmentGroup