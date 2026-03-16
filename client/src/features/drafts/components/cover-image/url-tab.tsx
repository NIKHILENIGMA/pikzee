import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const UrlTab = () => {
    return (
        <div className="flex flex-col gap-2 justify-start mb-4">
            <Label
                htmlFor="image-url"
                className="text-md font-medium text-muted-foreground pl-2">
                Image link:
            </Label>
            <div className="flex gap-2 px-2 rounded">
                <Input
                    type="text"
                    id="image-url"
                    placeholder="e.g. https://example.com/cover.jpg"
                    className="w-full"
                />
                <Button className="self-end">Set Cover</Button>
            </div>
        </div>
    )
}

export default UrlTab
