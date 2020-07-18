import { dealSkillCards, GameDocument, getCurrentPlayer } from "../game";
import { addCards } from "../deck";
import { SkillType } from "../../../src/models/game-data";

export function actionPressRoom(gameDoc: GameDocument) {
    const player = getCurrentPlayer(gameDoc);
    addCards(player.skillCards, dealSkillCards(gameDoc.gameState, SkillType.Politics, 2));
}
