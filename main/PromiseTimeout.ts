
export function withTimeout<T>(future: Promise<T>, timeoutMilliseconds: number, customMessage?: string): Promise<T> {
    let timer: NodeJS.Timeout | undefined = undefined;
    return Promise.race([
        future,
        new Promise<never>((_resolve, reject) => {
            timer = setTimeout(() => reject(customMessage ?? `timed out after ${timeoutMilliseconds}ms`), timeoutMilliseconds);
        })
    ]).finally(() => {
        // cancel timer in case we succeeded
        if (timer !== undefined) {
            clearTimeout(timer);
        }
    });
}
