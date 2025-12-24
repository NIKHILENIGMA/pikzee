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

    public async get<TResponse>(path: string, config?: AxiosRequestConfig): Promise<ApiResponse<TResponse>> {
        const response: AxiosResponse<ApiResponse<TResponse>> = await this.client.get(path, config)
        return response.data
    }

    public async post<TResponse, TRequest>(path: string, data: TRequest, config?: AxiosRequestConfig): Promise<ApiResponse<TResponse>> {
        const response: AxiosResponse<ApiResponse<TResponse>> = await this.client.post(path, data, config)
        return response.data
    }

    public async put<TResponse, TRequest>(path: string, data: TRequest, config?: AxiosRequestConfig): Promise<ApiResponse<TResponse>> {
        const response: AxiosResponse<ApiResponse<TResponse>> = await this.client.put(path, data, config)
        return response.data
    }

    public async patch<TResponse, TRequest>(path: string, data: TRequest, config?: AxiosRequestConfig): Promise<ApiResponse<TResponse>> {
        const response: AxiosResponse<ApiResponse<TResponse>> = await this.client.patch(path, data, config)
        return response.data
    }

    public async delete<TResponse>(path: string, config?: AxiosRequestConfig): Promise<ApiResponse<TResponse>> {
        const response: AxiosResponse<ApiResponse<TResponse>> = await this.client.delete(path, config)
        return response.data
    }
}

const client = new ApiClient(clientEnv.BACKEND_PROXY)

export default client
