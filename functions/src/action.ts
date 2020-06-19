import { InputId } from "../../src/models/inputs";
import { GameDocument } from "./game";

export function handleAction(gameDoc: GameDocument) {
    gameDoc.gameState.inputRequest = {
        userId: gameDoc.gameState.userIds[gameDoc.gameState.currentPlayer],
        inputId: InputId.Action,
    };
}
