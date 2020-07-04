import { GameDocument, setupInitialShips } from "../game";
import { GameState } from "../../../src/models/game-data";

export function handleSetupInitialShips(gameDoc: GameDocument) {
    setupInitialShips(gameDoc.gameState)
    gameDoc.gameState.state = GameState.ReceiveSkills;
}
