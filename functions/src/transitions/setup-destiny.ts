import { GameDocument, setupDestinyDeck } from "../game";
import { GameState } from "../../../src/models/game-data";

export function handleSetupDestiny(gameDoc: GameDocument) {
    setupDestinyDeck(gameDoc.gameState);
    gameDoc.gameState.state = GameState.SetupInitialShips;
}
