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
