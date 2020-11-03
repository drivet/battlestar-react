import { GameDocument, getCurrentPlayer } from "../game";
import { InputId } from "../../../src/models/inputs";
import { makeRequest } from "../inputs/input";

export function handleCrisis(gameDoc: GameDocument) {
    const player = getCurrentPlayer(gameDoc);
    gameDoc.gameState.inputRequest = makeRequest(InputId.SelectCrisisAction, player.userId);
}
