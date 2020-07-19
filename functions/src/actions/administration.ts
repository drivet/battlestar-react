import { findVp, GameDocument, getCurrentPlayer, getPlayer } from "../game";
import { Input, InputId } from "../../../src/models/inputs";
import { SkillType } from "../../../src/models/game-data";
import { makeRequest } from "../input";
import { createSkillCtx, handleCollectSkills } from "../skill-check";
import { finishAction } from "../transitions/action";

enum AdminState {
    ChoosePlayer,
    CollectSkills
}

interface AdminCtx {
    state: AdminState;
    chosenPlayer: string;
}

function handleChoosePlayer(gameDoc: GameDocument, input: Input<string>) {
    const ctx = gameDoc.gameState.actionCtx;
    const vp = findVp(gameDoc);
    if (vp && !vp.president) {
        ctx.chosenPlayer = vp;
    } else {
        if (!input) {
            const currentPlayer = getCurrentPlayer(gameDoc);
            gameDoc.gameState.inputRequest =
                makeRequest(InputId.PlayerSelect, currentPlayer.userId);
            return;
        }
        ctx.chosenPlayer = getPlayer(gameDoc, input.data);
    }

    gameDoc.gameState.skillCheckCtx =
        createSkillCtx(gameDoc, [SkillType.Leadership, SkillType.Politics]);
    ctx.state = AdminState.CollectSkills;
}

function executeOutcome(gameDoc: GameDocument) {
    const score = gameDoc.gameState.skillCheckCtx.score;
    if (score >= 5) {
        const ctx = gameDoc.gameState.actionCtx;
        getPlayer(gameDoc, ctx.chosenPlayer).president = true;
        getCurrentPlayer(gameDoc).president = false;
    }
    finishAction(gameDoc);
}

export function actionAdministration(gameDoc: GameDocument, input: Input<any>) {
    const currentPlayer = getCurrentPlayer(gameDoc);
    if (!currentPlayer.president) {
        throw new Error('Administration can only be executed by the President');
    }

    if (!gameDoc.gameState.actionCtx) {
        gameDoc.gameState.actionCtx = {
            state: AdminState.ChoosePlayer,
        } as AdminCtx;
    }
    const ctx = gameDoc.gameState.actionCtx;
    if (ctx.state === AdminState.ChoosePlayer) {
        handleChoosePlayer(gameDoc, input);
    } else if (ctx.state === AdminState.CollectSkills) {
        if (handleCollectSkills(gameDoc, input)) {
            executeOutcome(gameDoc);
        }
    }
}
