import { Outlet } from "react-router"
import DraftSidebar from "../../features/drafts/components/draft-sidebar"
import { DraftProvider } from "../../features/drafts/context/draft-context"


export default function DraftLayout() {
  return (
    <DraftProvider>
      <div className="flex h-screen w-full">
        <DraftSidebar />

        <main className="flex-1 overflow-y-auto minimal-scrollbar">
          <Outlet />
        </main>
      </div>
    </DraftProvider>
  )
}