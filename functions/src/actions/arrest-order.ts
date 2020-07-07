import { GameDocument, getCurrentPlayer } from "../game";
import { Input, InputId } from "../../../src/models/inputs";
import { CharacterId, GameState, LocationId } from "../../../src/models/game-data";
import { makeRequest } from "../input";

export function actionArrestOrder(gameDoc: GameDocument, input: Input<CharacterId>) {
    if (!input) {
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.ActionArrestOrderPlayerSelect, getCurrentPlayer(gameDoc).userId);
        return;
    }
    const chosenPlayer = Object.values(gameDoc.players).find(p => p.characterId === input.data);
    chosenPlayer.location = LocationId.Brig;
    gameDoc.gameState.state = GameState.CrisisDrawn;
}
