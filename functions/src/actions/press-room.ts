import { GameDocument, getCurrentPlayer } from "../game";
import { addCards, deal } from "../deck";
import { GameState, SkillType } from "../../../src/models/game-data";

export function actionPressRoom(gameDoc: GameDocument) {
    const player = getCurrentPlayer(gameDoc);
    addCards(player.skillCards, deal(gameDoc.gameState.skillDecks[SkillType.Politics], 2));
    gameDoc.gameState.state = GameState.CrisisDrawn;
}
