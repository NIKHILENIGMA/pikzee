/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DefaultOptions, UseMutationOptions } from '@tanstack/react-query'

export const queryConfig = {
    queries: {
        refetchOnWindowFocus: false, // Disable refetch on window focus
        retry: false, // Disable automatic retries
        staleTime: 1000 * 60 * 2, // 2 minutes
        gcTime: 1000 * 60 * 5 // 5 minutes
    }
} satisfies DefaultOptions

export type QueryConfig<T extends (...args: any[]) => any> = Omit<ReturnType<T>, 'queryKey' | 'queryFn'>

export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> = Awaited<ReturnType<FnType>>

export type MutationConfig<MutationFnType extends (...args: any) => Promise<any>> = UseMutationOptions<
    ApiFnReturnType<MutationFnType>,
    Error,
    Parameters<MutationFnType>[0]
>
