import { GameDocument, getCurrentPlayer, getPlayer } from "../game";
import { Input, InputId } from "../../../src/models/inputs";
import { GameState, SkillType } from "../../../src/models/game-data";
import { makeRequest } from "../input";
import { addCard, dealOne } from "../deck";

export function actionResearchLab(gameDoc: GameDocument, input: Input<SkillType>) {
    if (!input) {
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.ActionResearchLabSkillSelect, getCurrentPlayer(gameDoc).userId);
        return;
    }
    if (!validate(input.data)) {
        throw new Error('Invalid skill type selected ' + input.data);
    }
    const player = getPlayer(gameDoc, input.userId);
    addCard(player.skillCards, dealOne(gameDoc.gameState.skillDecks[SkillType[input.data]]));
    gameDoc.gameState.state = GameState.CrisisDrawn;
}

function validate(skill: SkillType): boolean {
    return skill === SkillType.Engineering || skill === SkillType.Tactics;
}
