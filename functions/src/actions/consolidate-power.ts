import { dealSkillCard, GameDocument, getCurrentPlayer, getPlayer } from "../game";
import { Input, InputId } from "../../../src/models/inputs";
import { GameState, SkillType } from "../../../src/models/game-data";
import { makeRequest } from "../input";
import { addCard } from "../deck";

export function actionConsolidatePower(gameDoc: GameDocument, input: Input<SkillType[]>) {
    if (!input) {
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.ActionConsolidatePowerSkillSelect, getCurrentPlayer(gameDoc).userId);
        return;
    }
    const player = getPlayer(gameDoc, input.userId);
    input.data.forEach(s => addCard(player.skillCards, dealSkillCard(gameDoc.gameState, s)));
    gameDoc.gameState.state = GameState.CrisisDrawn;
}
