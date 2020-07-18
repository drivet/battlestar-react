import { discardQuorumCard, GameDocument, getCurrentPlayer, getPlayer } from "../game";
import { Input, InputId } from "../../../src/models/inputs";
import { LocationId, QuorumCardId } from "../../../src/models/game-data";
import { makeRequest } from "../input";

export function actionArrestOrder(gameDoc: GameDocument, input: Input<string>) {
    const player = getCurrentPlayer(gameDoc);
    if (!input) {
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.ActionArrestOrderPlayerSelect, player.userId);
        return;
    }
    const chosen = getPlayer(gameDoc, input.data);
    chosen.location = LocationId.Brig;
    discardQuorumCard(gameDoc.gameState, player, QuorumCardId.ArrestOrder);
}
