import { GameDocument, getCurrentPlayer, getPlayers } from "../game";
import { Input, InputId } from "../../../src/models/inputs";
import { LocationId, SkillCheckType, SkillType } from "../../../src/models/game-data";
import { makeRequest } from "../input";
import { createSkillCheckCtx, handleSkillCheck, SkillCheckPlayer, SkillCheckResult } from "../skill-check";
import { finishAction } from "../transitions/action";

export enum BrigState {
    SkillCheck,
    ChooseLocation,
}

interface BrigCtx {
    state: BrigState;
}

export function actionBrig(gameDoc: GameDocument, input: Input<any>) {
    if (!gameDoc.gameState.actionCtx) {
        gameDoc.gameState.actionCtx = {
            state: BrigState.SkillCheck,
        } as BrigCtx;
        gameDoc.gameState.skillCheckCtx =
            createSkillCheckCtx(getPlayers(gameDoc) as SkillCheckPlayer[],
                gameDoc.gameState.acceptProphecy !== null,
                SkillCheckType.Brig,
                [SkillType.Leadership, SkillType.Tactics], 5);
    }

    const ctx = gameDoc.gameState.actionCtx;
    if (ctx.state === BrigState.SkillCheck) {
        const result = handleSkillCheck(gameDoc, input);
        if (result) {
            executeOutcome(gameDoc, result);
        }
    } else if (ctx.state === BrigState.ChooseLocation) {
        handleChooseLocation(gameDoc, input);
    }
}


function executeOutcome(gameDoc: GameDocument, result: SkillCheckResult) {
    if (result === SkillCheckResult.Pass) {
        gameDoc.gameState.actionCtx.state = BrigState.ChooseLocation;
    } else {
        finishAction(gameDoc);
    }
}

function handleChooseLocation(gameDoc: GameDocument, input: Input<LocationId>) {
    const currentPlayer = getCurrentPlayer(gameDoc);
    if (!input) {
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.LocationSelect, currentPlayer.userId);
        return;
    }

    currentPlayer.location = input.data;
    finishAction(gameDoc);
}
