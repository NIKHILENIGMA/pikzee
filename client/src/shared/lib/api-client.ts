import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

import clientEnv from '../config/load-client-env'
import type { ApiResponse } from '../types/api'

class ApiClient {
    private client: AxiosInstance
    constructor(baseURL: string) {
        this.client = axios.create({
            baseURL,
            withCredentials: true
        })
    }

    public async get<T>(path: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response: AxiosResponse<ApiResponse<T>> = await this.client.get(path, config)
        return response.data
    }

    public async post<T, K>(path: string, data: K, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response: AxiosResponse<ApiResponse<T>> = await this.client.post(path, data, config)
        return response.data
    }

    public async put<T, K>(path: string, data: K, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response: AxiosResponse<ApiResponse<T>> = await this.client.put(path, data, config)
        return response.data
    }

    public async patch<T, K>(path: string, data: K, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response: AxiosResponse<ApiResponse<T>> = await this.client.patch(path, data, config)
        return response.data
    }

    public async delete<T>(path: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response: AxiosResponse<ApiResponse<T>> = await this.client.delete(path, config)
        return response.data
    }
}

const client = new ApiClient(clientEnv.BACKEND_PROXY)

export default client
