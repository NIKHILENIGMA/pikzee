import { ChevronRightIcon, Folder } from 'lucide-react'
import { Fragment, type FC } from 'react'
import { useNavigate } from 'react-router'

interface AssetBreadcrumbProps {
    breadcrumb: {
        id: string
        name: string
    }[]
    navigateToFolder: (folderId: string | null) => void
}

const AssetBreadcrumb: FC<AssetBreadcrumbProps> = ({ breadcrumb, navigateToFolder }) => {
    const navigate = useNavigate()
    return (
        <header className=" border-b border-secondary px-6 py-4">
            <div className="mb-2 flex items-center space-x-2">
                <h3 className="pb-4 font-semibold text-lg cursor-pointer" onClick={() => navigate('/ws')}>
                    Home
                </h3>
            </div>
            <nav className="flex items-center space-x-2 text-sm text-foreground/85 mb-2">
                <button
                    onClick={() => navigateToFolder(null)}
                    className="text-black dark:text-white font-medium transition-colors cursor-pointer">
                    <Folder />
                </button>

                {breadcrumb.map((crumb) => (
                    <Fragment key={crumb.id}>
                        <ChevronRightIcon className="w-4 h-4 text-foreground/85" />
                        <button
                            onClick={() => navigateToFolder(crumb.id)}
                            className="hover:text-primary font-medium transition-colors cursor-pointer">
                            {crumb.name}
                        </button>
                    </Fragment>
                ))}
            </nav>
        </header>
    )
}

export default AssetBreadcrumb
