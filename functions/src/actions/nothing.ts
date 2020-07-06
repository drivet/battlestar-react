import { GameDocument } from "../game";
import { GameState } from "../../../src/models/game-data";

export function actionNothing(gameDoc: GameDocument) {
    gameDoc.gameState.state = GameState.CrisisDrawn;
}
