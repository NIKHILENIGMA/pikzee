import { type FC } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'

import { MainLayout, DashboardLayout } from '@/components'
import SettingsLayout from '@/components/layout/settings-layout'
import ProtectedRoute from '@/components/shared/protected-route'
import PublicRoute from '@/components/shared/public-route'

const router = createBrowserRouter([
    // Protected Routes (Authenticated users only)
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                path: 'ws',
                lazy: () => import('./routes/workspace/workspace-dashboard').then((module) => ({ Component: module.default }))
            },
            {
                path: 'documents',
                lazy: () => import('./routes/dashboard/document').then((module) => ({ Component: module.default }))
            },
            {
                path: 'magic-editor',
                lazy: () => import('./routes/dashboard/magic-editor').then((module) => ({ Component: module.default }))
            },
            {
                path: 'media-scheduler',
                lazy: () => import('./routes/dashboard/media-scheduler').then((module) => ({ Component: module.default }))
            },
            {
                path: 'projects/:projectId',
                lazy: () => import('./routes/workspace/project-management').then((module) => ({ Component: module.default }))
            },
            {
                path: 'settings',
                element: <SettingsLayout />,
                children: [
                    {
                        index: true,
                        lazy: () => import('./routes/settings/profile').then((module) => ({ Component: module.default }))
                    },
                    {
                        path: 'plans',
                        lazy: () => import('./routes/settings/plan').then((module) => ({ Component: module.default }))
                    },
                    {
                        path: 'integration',
                        lazy: () => import('./routes/settings/integration-hub').then((module) => ({ Component: module.default }))
                    },
                    {
                        path: 'workspace',
                        lazy: () => import('./routes/settings/workspace-settings').then((module) => ({ Component: module.default }))
                    },
                    {
                        path: 'project',
                        lazy: () => import('./routes/settings/project-settings').then((module) => ({ Component: module.default }))
                    }
                ]
            }
        ]
    },

    // Public Routes (Unauthenticated users only)
    {
        path: '/',
        element: (
            <PublicRoute>
                <MainLayout />
            </PublicRoute>
        ),
        children: [
            {
                index: true,
                lazy: () => import('./routes/home').then((module) => ({ Component: module.default }))
            },
            {
                path: 'about',
                lazy: () => import('./routes/about').then((module) => ({ Component: module.default }))
            }
        ]
    },
    {
        path: '/auth',
        children: [
            {
                path: 'login',
                lazy: () => import('./routes/auth/login').then((module) => ({ Component: module.default }))
            },
            {
                path: 'signup',
                lazy: () => import('./routes/auth/signup').then((module) => ({ Component: module.default }))
            },
            {
                path: 'sso-callback',
                lazy: () => import('./routes/auth/sso-callback').then((module) => ({ Component: module.default }))
            },
            {
                path: 'social/youtube/callback',
                lazy: () => import('./routes/auth/youtube-callback').then((module) => ({ Component: module.default }))
            }
        ]
    },
    {
        path: '*',
        lazy: () => import('./routes/not-found').then((module) => ({ Component: module.default }))
    }
])

const AppRouter: FC = () => {
    return <RouterProvider router={router} />
}

export default AppRouter
