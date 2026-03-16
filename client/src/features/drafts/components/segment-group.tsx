type Option<T> = {
    label: string
    value: T
    icon?: React.ReactNode
}

type SegmentGroupProps<T> = {
    title: string
    options: Option<T>[]
    value: T
    onChange: (v: T) => void
}

const SegmentGroup = <T,>({ title, options, value, onChange }: SegmentGroupProps<T>) => {
    return (
        <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{title}</p>

            <div className="flex justify-center gap-3">
                {options.map((opt) => {
                    const active = value === opt.value

                    return (
                        <button
                            key={opt.label}
                            onClick={() => onChange(opt.value)}
                            className={`flex flex-col items-center justify-center rounded-xl px-3 py-3 text-sm font-medium transition w-full cursor-pointer
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
