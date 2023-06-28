export interface cacheRepositoryContract {
    get: <T> (key: string) => Promise<T | null> 
    delete: (key: string) => Promise<any>
    set: (key: string, value: any) => Promise<void>
    keys: (key: string) => Promise<string[]>
}