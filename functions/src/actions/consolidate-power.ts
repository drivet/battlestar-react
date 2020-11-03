import { dealSkillCard, discardSkillCardFromHand, GameDocument, getCurrentPlayer, getPlayer } from "../game";
import { InputId } from "../../../src/models/inputs";
import { ActionId, SkillCardId, SkillType } from "../../../src/models/game-data";
import { Input, makeRequest } from "../inputs/input";
import { addCard } from "../deck";
import { finishAction } from "../transitions/action";

export function actionConsolidatePower(gameDoc: GameDocument, input: Input<SkillType[]>) {
    if (!input) {
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.ActionConsolidatePowerSkillSelect, getCurrentPlayer(gameDoc).userId);
        return;
    }
    const player = getPlayer(gameDoc, input.userId);
    input.data.forEach(s => addCard(player.skillCards, dealSkillCard(gameDoc.gameState, s)));
    const skillCard = getSkillCard(gameDoc.gameState.currentAction);
    discardSkillCardFromHand(gameDoc.gameState, player, skillCard);
    finishAction(gameDoc);
}

function getSkillCard(action: ActionId): SkillCardId {
    if (action === ActionId.ConsolidatePower1) {
        return SkillCardId.ConsolidatePower1;
    } else if (action === ActionId.ConsolidatePower2) {
        return SkillCardId.ConsolidatePower2;
    }
}