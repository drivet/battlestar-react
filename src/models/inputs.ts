export enum InputId {
    SelectCharacter,
    SelectInitialLocation,
    ReceiveInitialSkills
}

export interface InputRequest {
    requestId: string;
    userId: string;
    inputId: InputId;
}

export interface InputResponse {
    requestId: string;
    userId: string;
    data: any;
}

export function makeResponse(request: InputRequest, data: any): InputResponse {
    return {
        requestId: request.requestId,
        userId: request.userId,
        data: data
    }
}
