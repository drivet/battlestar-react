import { GameDocument, roll } from "../game";
import { GameState } from "../../../src/models/game-data";

export function actionArmory(gameDoc: GameDocument) {
    const die = roll();
    if (die >= 7) {
        const centurions = gameDoc.gameState.boardedCenturions;
        // destroy a centurion closest to the end
        for (let i = centurions.length -1; i >= 0; i--) {
            if (centurions[i] > 0) {
                centurions[i]--;
            }
        }
    }
    gameDoc.gameState.state = GameState.CrisisDrawn;
}
