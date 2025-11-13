import { type FC } from 'react'
import { Outlet } from 'react-router'

import Footer from './footer-layout'
import Header from './header-layout'

const MainLayout: FC = () => {
    return (
        <>
            <Header />
            <main className="">
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default MainLayout
