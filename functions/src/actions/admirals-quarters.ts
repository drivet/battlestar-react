import { FullPlayer, GameDocument, getCurrentPlayer, getPlayer, getPlayers } from "../game";
import { Input, InputId } from "../../../src/models/inputs";
import { LocationId, SkillCheckType, SkillType } from "../../../src/models/game-data";
import { makeRequest } from "../input";
import { createSkillCheckCtx, handleSkillCheck, SkillCheckPlayer, SkillCheckResult } from "../skill-check";
import { finishAction } from "../transitions/action";

export enum AdmiralsQuartersState {
    ChoosePlayer,
    SkillCheck,
}

interface AdmiralsQuartersCtx {
    state: AdmiralsQuartersState;
    chosenPlayer: FullPlayer;
}

function handleChoosePlayer(gameDoc: GameDocument, input: Input<string>) {
    const currentPlayer =  getCurrentPlayer(gameDoc);
    if (!input) {
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.PlayerSelect, currentPlayer.userId);
        return;
    }

    const ctx = gameDoc.gameState.actionCtx;
    ctx.chosenPlayer = getPlayer(gameDoc, input.data);
    ctx.state = AdmiralsQuartersState.SkillCheck;
    gameDoc.gameState.skillCheckCtx =
        createSkillCheckCtx(getPlayers(gameDoc) as SkillCheckPlayer[],
            gameDoc.gameState.acceptProphecy !== null,
            SkillCheckType.AdmiralsQuarters,
            [SkillType.Leadership, SkillType.Tactics],
            7, undefined, ctx.chosenPlayer);
}

function executeOutcome(gameDoc: GameDocument) {
    const result = gameDoc.gameState.skillCheckCtx.result;
    if (result === SkillCheckResult.Pass) {
        const ctx = gameDoc.gameState.actionCtx;
        ctx.chosenPlayer.location = LocationId.Brig;
    }
    finishAction(gameDoc);
}

export function actionAdmiralsQuarters(gameDoc: GameDocument, input: Input<any>) {
    if (!gameDoc.gameState.actionCtx) {
        gameDoc.gameState.actionCtx = {
            state: AdmiralsQuartersState.ChoosePlayer,
        } as AdmiralsQuartersCtx;
    }
    const ctx = gameDoc.gameState.actionCtx;
    if (ctx.state === AdmiralsQuartersState.ChoosePlayer) {
        handleChoosePlayer(gameDoc, input);
    } else if (ctx.state === AdmiralsQuartersState.SkillCheck) {
        if (handleSkillCheck(gameDoc, input)) {
            executeOutcome(gameDoc);
        }
    }
}
