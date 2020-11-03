import { dealSkillCard, GameDocument, getCurrentPlayer, getPlayer } from "../game";
import { InputId } from "../../../src/models/inputs";
import { SkillType } from "../../../src/models/game-data";
import { Input, makeRequest } from "../inputs/input";
import { addCard } from "../deck";
import { finishAction } from "../transitions/action";

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
    finishAction(gameDoc);
}

function validate(skill: SkillType): boolean {
    return skill === SkillType.Engineering || skill === SkillType.Tactics;
}
