import { type FC } from 'react'
import { FilePlus, FolderPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAssetGridContext } from './asset-grid-context'

const AssetActions: FC = () => {
    const { handleCreateFolder, handleUploadFile } = useAssetGridContext()

    return (
        <div className="flex items-center gap-2 mb-6">
            <Button variant="outline" size="sm" onClick={handleUploadFile} className="gap-2">
                <FilePlus className="w-4 h-4" />
                Add File
            </Button>
            <Button variant="outline" size="sm" onClick={handleCreateFolder} className="gap-2">
                <FolderPlus className="w-4 h-4" />
                Create Folder
            </Button>
        </div>
    )
}

export default AssetActions
