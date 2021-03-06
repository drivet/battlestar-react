import { discardQuorumCard, GameDocument, getCurrentPlayer } from "../game";
import { Input, InputId } from "../../../src/models/inputs";
import { GameState, LocationId, QuorumCardId } from "../../../src/models/game-data";
import { makeRequest } from "../input";

export function actionArrestOrder(gameDoc: GameDocument, input: Input<string>) {
    const player = getCurrentPlayer(gameDoc);
    if (!input) {
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.ActionArrestOrderPlayerSelect, player.userId);
        return;
    }
    const chosenPlayer = Object.values(gameDoc.players).find(p => p.userId === input.data);
    chosenPlayer.location = LocationId.Brig;
    discardQuorumCard(gameDoc.gameState, player, QuorumCardId.ArrestOrder);
    gameDoc.gameState.state = GameState.CrisisDrawn;
}
