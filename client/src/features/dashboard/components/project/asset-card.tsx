import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

interface ProjectCardProps {
    title: string
    duration: string
    thumb: string
}

interface ImageProps {
    src: string
    alt: string
    className?: string
    fill?: boolean
    sizes?: string
}

const Image = ({ src, alt, className, fill, sizes }: ImageProps) => {
    return (
        <img
            src={src}
            alt={alt}
            className={className}
            style={{
                objectFit: fill ? 'cover' : 'contain',
                width: sizes ? sizes : '100%',
                height: sizes ? sizes : '100%'
            }}
        />
    )
}

export function AssetCard({ title, duration, thumb }: ProjectCardProps) {
    return (
        <Card className="group relative overflow-hidden rounded-lg border-border bg-muted/20">
            <div className="absolute left-2 top-2 z-10">
                <Checkbox aria-label={`Select ${title}`} />
            </div>

            <div className="relative aspect-[16/12] w-full">
                {/* Using placeholder.svg per guidelines */}
                <Image
                    src={thumb || '/placeholder.svg'}
                    alt={title}
                    fill
                    sizes="(min-width: 1280px) 20vw, 33vw"
                    className="object-cover"
                />
                <span className="absolute bottom-2 right-2 rounded-md bg-background/70 px-2 py-0.5 text-[10px] font-medium">{duration}</span>
            </div>

            <div className="truncate px-3 pb-3 pt-2 text-xs">{title}</div>
        </Card>
    )
}
