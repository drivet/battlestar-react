import { Input, InputId } from "../../src/models/inputs";

export function makeInput (user: string, inputId: InputId, data: any, ctx?: any): Input<any> {
    return {
        userId: user,
        inputId: inputId,
        data: data,
        ctx: ctx
    }
}
