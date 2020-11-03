import { InputId, InputRequest, InputResponse } from "../../../src/models/inputs";
import { GameDocument } from "../game";

export type InputCtxFactory<C> = (game: GameDocument, userId: string) => C;
export type InputValidationFn<C,D> = (game: GameDocument, input: Input<C,D>) => boolean;

export interface NoInputError {
    inputId: InputId;
    userId: string;
}

export interface InputParameters<C,D> {
    inputRequest?: InputRequest<C>;
    inputResponse?: InputResponse<D>;
    input?: Input<C,D>;
}

export interface InputSupport<C,D> {
    inputId: InputId;
    ctxFactory?: InputCtxFactory<C>;
    validate?: InputValidationFn<C, D>;
}

export function getInput(gameDoc: GameDocument, inputId: InputId, userId: String): Input<any, any> {
    if (gameDoc.input) {
        return gameDoc.input
    } else {
        throw {
            inputId: inputId,
            userId: userId,
        }
    }
}

export function setupRequest(gameDoc: GameDocument, input: InputId, userId: string) {

}

export function makeRequest<T extends any = undefined>(inputId: InputId, userId: string, ctx: T = null): InputRequest<T> {
    return {
        inputId: inputId,
        userId: userId,
        ctx: ctx
    }
}

export interface Input<S, T extends any = undefined> extends InputRequest<T>, InputResponse<S> {}