import { ChevronRightIcon, Folder } from 'lucide-react'
import { Fragment, type FC } from 'react'

interface AssetBreadcrumbProps {
    breadcrumb: {
        id: string
        name: string
    }[]
    navigateToFolder: (folderId: string | null) => void
}

const AssetBreadcrumb: FC<AssetBreadcrumbProps> = ({ breadcrumb, navigateToFolder }) => {
    return (
        <header className=" border-b border-secondary px-6 py-4">
            <h3 className="pb-4">Assets</h3>
            <nav className="flex items-center space-x-2 text-sm text-foreground/85 mb-2">
                <button
                    onClick={() => navigateToFolder(null)}
                    className="text-black dark:text-white font-medium transition-colors">
                    <Folder />
                </button>

                {breadcrumb.map((crumb) => (
                    <Fragment key={crumb.id}>
                        <ChevronRightIcon className="w-4 h-4 text-foreground/85" />
                        <button
                            onClick={() => navigateToFolder(crumb.id)}
                            className="hover:text-primary font-medium transition-colors">
                            {crumb.name}
                        </button>
                    </Fragment>
                ))}
            </nav>
        </header>
    )
}

export default AssetBreadcrumb
