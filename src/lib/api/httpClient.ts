import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { logger } from './logs/logger';

export class HttpClient {
    private readonly instance: AxiosInstance;

    constructor(config: AxiosRequestConfig) {
        this.instance = axios.create(config);
        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.instance.interceptors.request.use(
            (config) => {
                logger.info(`${config.method?.toUpperCase()} ${config.url}`);
                return config;
            },
            (error) => {
                logger.error(`Request failed: ${error.message}`);
                return Promise.reject(error);
            }
        );
        this.instance.interceptors.response.use(
            (response) => {
                logger.info(`${response.status} ${response.config.url}`);
                return response;
            },
            (error) => {
                if (error.response) {
                    logger.error(`${error.response.status} ${error.config.url}`);
                } else {
                    logger.error(`Network error: ${error.message}`);
                }
                if (error.response?.status >= 500 && error.config && !error.config._retry) {
                    error.config._retry = true;
                    return this.instance.request(error.config);
                }
                return Promise.reject(error);
            }
        );
    }

    public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.get(url, config);
    }

    public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.post(url, data, config);
    }
}