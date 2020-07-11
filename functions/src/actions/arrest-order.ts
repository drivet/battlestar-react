import { GameDocument, getCurrentPlayer } from "../game";
import { Input, InputId } from "../../../src/models/inputs";
import { GameState, LocationId } from "../../../src/models/game-data";
import { makeRequest } from "../input";

export function actionArrestOrder(gameDoc: GameDocument, input: Input<string>) {
    if (!input) {
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.ActionArrestOrderPlayerSelect, getCurrentPlayer(gameDoc).userId);
        return;
    }
    const chosenPlayer = Object.values(gameDoc.players).find(p => p.userId === input.data);
    chosenPlayer.location = LocationId.Brig;
    gameDoc.gameState.state = GameState.CrisisDrawn;
}
