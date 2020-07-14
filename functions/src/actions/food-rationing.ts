import { discardQuorumCard, GameDocument, getCurrentPlayer, removeQuorumCard, roll } from "../game";
import { GameState, QuorumCardId } from "../../../src/models/game-data";

export function actionFoodRationing(gameDoc: GameDocument) {
    const die = roll();
    const player = getCurrentPlayer(gameDoc);
    if (die >= 6) {
        gameDoc.gameState.food++;
        removeQuorumCard(gameDoc.gameState, player, QuorumCardId.FoodRationing);
    } else {
        discardQuorumCard(gameDoc.gameState, player, QuorumCardId.FoodRationing);
    }
    gameDoc.gameState.state = GameState.CrisisDrawn;
}
