import { GameDocument, getCurrentPlayer, roll } from "../game";
import { GameState, QuorumCardId } from "../../../src/models/game-data";

export function actionFoodRationing(gameDoc: GameDocument) {
    const die = roll();
    if (die >= 6) {
        gameDoc.gameState.food++;
    }
    const player = getCurrentPlayer(gameDoc);
    const index = player.quorumHand.findIndex(q => q === QuorumCardId.FoodRationing);
    player.quorumHand.splice(index, 1)
    gameDoc.gameState.state = GameState.CrisisDrawn;
}
