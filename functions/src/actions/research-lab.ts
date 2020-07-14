import { dealSkillCard, GameDocument, getCurrentPlayer, getPlayer } from "../game";
import { Input, InputId } from "../../../src/models/inputs";
import { GameState, SkillType } from "../../../src/models/game-data";
import { makeRequest } from "../input";
import { addCard } from "../deck";

export function actionResearchLab(gameDoc: GameDocument, input: Input<SkillType>) {
    if (!input) {
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.ActionResearchLabSkillSelect, getCurrentPlayer(gameDoc).userId);
        return;
    }
    const skill: SkillType = input.data;
    if (!validate(skill)) {
        throw new Error('Invalid skill type selected: ' + JSON.stringify(skill));
    }
    const player = getPlayer(gameDoc, input.userId);
    addCard(player.skillCards, dealSkillCard(gameDoc.gameState, skill));
    gameDoc.gameState.state = GameState.CrisisDrawn;
}

function validate(skill: SkillType): boolean {
    return skill === SkillType.Engineering || skill === SkillType.Tactics;
}
