import { GameDocument, getCurrentPlayer, getPlayer, getPlayers } from "../game";
import { InputId } from "../../../src/models/inputs";
import { LocationId, SkillCheckType, SkillType } from "../../../src/models/game-data";
import { Input, makeRequest } from "../inputs/input";
import { createSkillCheckCtx, handleSkillCheck, SkillCheckPlayer, SkillCheckResult } from "../skill-check";
import { finishAction } from "../transitions/action";

export enum AdmiralsQuartersState {
    ChoosePlayer,
    SkillCheck,
}

interface AdmiralsQuartersCtx {
    state: AdmiralsQuartersState;
    chosenPlayer: string;
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
        const result = handleSkillCheck(gameDoc, input)
        if (result) {
            executeOutcome(gameDoc, result);
        }
    }
}

function handleChoosePlayer(gameDoc: GameDocument, input: Input<string>) {
    const currentPlayer =  getCurrentPlayer(gameDoc);
    if (!input) {
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.PlayerSelect, currentPlayer.userId);
        return;
    }

    const ctx = gameDoc.gameState.actionCtx;
    ctx.chosenPlayer = input.data;
    ctx.state = AdmiralsQuartersState.SkillCheck;
    const players = getPlayers(gameDoc) as SkillCheckPlayer[];
    gameDoc.gameState.skillCheckCtx =
        createSkillCheckCtx(players,
            gameDoc.gameState.acceptProphecy !== null,
            SkillCheckType.AdmiralsQuarters,
            [SkillType.Leadership, SkillType.Tactics],
            7, undefined, players.map(p => p.userId).indexOf(ctx.chosenPlayer));
}

function executeOutcome(gameDoc: GameDocument, result: SkillCheckResult) {
    if (result === SkillCheckResult.Pass) {
        const ctx = gameDoc.gameState.actionCtx;
        getPlayer(gameDoc, ctx.chosenPlayer).location = LocationId.Brig;
    }
    finishAction(gameDoc);
}
