import { findVp, GameDocument, getCurrentPlayer, getPlayer, getPlayers } from "../game";
import { InputId } from "../../../src/models/inputs";
import { SkillCheckType, SkillType } from "../../../src/models/game-data";
import { Input, makeRequest } from "../inputs/input";
import { createSkillCheckCtx, handleSkillCheck, SkillCheckPlayer, SkillCheckResult } from "../skill-check";
import { finishAction } from "../transitions/action";

export enum AdminState {
    ChoosePlayer,
    SkillCheck
}

interface AdminCtx {
    state: AdminState;
    chosenPlayer: string;
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
    } else if (ctx.state === AdminState.SkillCheck) {
        const result = handleSkillCheck(gameDoc, input);
        if (result) {
            executeOutcome(gameDoc, result);
        }
    }
}

function handleChoosePlayer(gameDoc: GameDocument, input: Input<string>) {
    const ctx = gameDoc.gameState.actionCtx;
    const vp = findVp(gameDoc);
    if (vp && !vp.president) {
        ctx.chosenPlayer = vp.userId;
    } else {
        if (!input) {
            const currentPlayer = getCurrentPlayer(gameDoc);
            gameDoc.gameState.inputRequest =
                makeRequest(InputId.PlayerSelect, currentPlayer.userId);
            return;
        }
        ctx.chosenPlayer = input.data;
    }

    const players = getPlayers(gameDoc) as SkillCheckPlayer[];
    gameDoc.gameState.skillCheckCtx =
        createSkillCheckCtx(players,
            gameDoc.gameState.acceptProphecy !== null,
            SkillCheckType.Administration,
            [SkillType.Leadership, SkillType.Politics],
            5, undefined, players.map(p => p.userId).indexOf(ctx.chosenPlayer));

    ctx.state = AdminState.SkillCheck;
}

function executeOutcome(gameDoc: GameDocument, result: SkillCheckResult) {
    if (result === SkillCheckResult.Pass) {
        const ctx = gameDoc.gameState.actionCtx;
        getPlayer(gameDoc, ctx.chosenPlayer).president = true;
        getCurrentPlayer(gameDoc).president = false;
    }
    gameDoc.gameState.acceptProphecy = null;
    finishAction(gameDoc);
}
