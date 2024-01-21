
export type Optional<T> = {
    [P in keyof T]?: T[P]
}

export type EscConfig = {

}

export type ReadlineOptions = {
    input?: NodeJS.ReadStream & {fd: 0}
    output?: NodeJS.WriteStream & {fd: 1}
    terminal?: boolean
    outStyle?:string|string[]
    [key:string] : any
}