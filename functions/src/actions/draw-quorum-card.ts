import { dealQuorumCard, GameDocument, getCurrentPlayer } from "../game";
import { addCard } from "../deck";
import { GameState } from "../../../src/models/game-data";

export function actionDrawQuorumCard(gameDoc: GameDocument) {
    const player = getCurrentPlayer(gameDoc);
    if (player.president) {
        addCard(player.quorumHand, dealQuorumCard(gameDoc.gameState));
    } else {
        console.warn('non-president trying to draw quorum card, skipping...');
    }
    gameDoc.gameState.state = GameState.CrisisDrawn;
}
