import { useRef, type FC } from 'react'

import { Button } from '@/components/ui/button'

const UploadTab: FC = () => {
    const inputRef = useRef<HTMLInputElement | null>(null)

    return (
        <div className="h-32 flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded cursor-pointer hover:bg-muted/80">
            <input
                type="file"
                className="hidden"
                ref={inputRef}
            />
            <p className="text-sm text-muted-foreground text-center">
                Drag or drop a cover image <br />
                or <br />
                <Button
                    variant="link"
                    onClick={() => inputRef.current?.click()}>
                    Click here to upload
                </Button>{' '}
                <br />
                Max file size: 5MB
            </p>
        </div>
    )
}

export default UploadTab
