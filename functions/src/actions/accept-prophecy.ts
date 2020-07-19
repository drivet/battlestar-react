import { dealSkillCard, GameDocument, getCurrentPlayer, pullQuorumCardFromHand } from "../game";
import { Input, InputId } from "../../../src/models/inputs";
import { QuorumCardId, SkillType } from "../../../src/models/game-data";
import { makeRequest } from "../input";
import { addCard } from "../deck";
import { finishAction } from "../transitions/action";

export function actionAcceptProphecy(gameDoc: GameDocument, input: Input<SkillType[]>) {
    const currentPlayer = getCurrentPlayer(gameDoc);
    if (!input) {
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.SkillTypeSelect, currentPlayer.userId);
        return;
    }

    if (input.data.length > 1) {
        throw Error('Can only pick on skill card with Accept Prophecy');
    }

    input.data.forEach(s => addCard(currentPlayer.skillCards, dealSkillCard(gameDoc.gameState, s)));
    const cards = pullQuorumCardFromHand(gameDoc.gameState, currentPlayer, QuorumCardId.AcceptProphecy);
    gameDoc.gameState.acceptProphecy = cards[0];
    finishAction(gameDoc);
}
