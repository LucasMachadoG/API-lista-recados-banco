export interface cacheRepositoryContract {
    get: <T> (key: string) => Promise<T | null> 
    delete: (key: string) => Promise<void>
    set: (key: string, value: any) => Promise<void>
}