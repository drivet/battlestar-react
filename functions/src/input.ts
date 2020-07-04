import { InputId, InputRequest } from "../../src/models/inputs";


export function makeRequest<T extends any = undefined>(inputId: InputId, userId: string, ctx: T = null): InputRequest<T> {
    return {
        inputId: inputId,
        userId: userId,
        ctx: ctx
    }
}
