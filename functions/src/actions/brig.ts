import { GameDocument, getCurrentPlayer, getPlayers } from "../game";
import { Input, InputId } from "../../../src/models/inputs";
import { LocationId, SkillCheckType, SkillType } from "../../../src/models/game-data";
import { makeRequest } from "../input";
import { createSkillCheckCtx, handleSkillCheck, SkillCheckPlayer, SkillCheckResult } from "../skill-check";
import { finishAction } from "../transitions/action";

enum BrigState {
    CollectSkills,
    ChooseLocation,
}

interface BrigCtx {
    state: BrigState;
    chosenPlayer: string;
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

function executeOutcome(gameDoc: GameDocument) {
    const ctx = gameDoc.gameState.actionCtx;
    if (gameDoc.gameState.skillCheckCtx.result === SkillCheckResult.Pass) {
        ctx.state = BrigState.ChooseLocation;
    } else {
        finishAction(gameDoc);
    }
}

export function actionBrig(gameDoc: GameDocument, input: Input<any>) {
    if (!gameDoc.gameState.actionCtx) {
        gameDoc.gameState.actionCtx = {
            state: BrigState.CollectSkills,
        } as BrigCtx;
        gameDoc.gameState.skillCheckCtx =
            createSkillCheckCtx(getPlayers(gameDoc) as SkillCheckPlayer[],
                gameDoc.gameState.acceptProphecy !== null,
                SkillCheckType.Brig,
                [SkillType.Leadership, SkillType.Tactics], 5);
    }

    const ctx = gameDoc.gameState.actionCtx;
    if (ctx.state === BrigState.CollectSkills) {
        if (handleSkillCheck(gameDoc, input)) {
            executeOutcome(gameDoc);
        }
    } else if (ctx.state === BrigState.ChooseLocation) {
        handleChooseLocation(gameDoc, input);
    }
}
