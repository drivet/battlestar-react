import { InputId, InputRequest } from "../../src/models/inputs";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function makeInputRequest(user: string, input: InputId, data: any = null): InputRequest {
    return {
        requestId: uuidv4(),
        userId: user,
        inputId: input,
        data: data
    }
}
