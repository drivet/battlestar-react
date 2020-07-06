import { GameDocument, getCurrentPlayer } from "../game";
import { addCards, deal } from "../deck";
import { GameState } from "../../../src/models/game-data";

export function actionDrawQuorumCard(gameDoc: GameDocument) {
    const player = getCurrentPlayer(gameDoc);
    if (player.president) {
        addCards(player.quorumHand, deal(gameDoc.gameState.quorumDeck, 1));
    } else {
        console.warn('non-president trying to draw quorum card, skipping...');
    }
    gameDoc.gameState.state = GameState.CrisisDrawn;
}
