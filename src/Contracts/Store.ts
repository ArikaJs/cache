
export interface Store {
    get(key: string): Promise<any>;
    put(key: string, value: any, seconds: number): Promise<void>;
    increment(key: string, value?: number): Promise<number>;
    decrement(key: string, value?: number): Promise<number>;
    forever(key: string, value: any): Promise<void>;
    forget(key: string): Promise<void>;
    flush(): Promise<void>;
    getPrefix(): string;
}
