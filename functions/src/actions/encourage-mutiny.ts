import { discardQuorumCard, findAdmiral, GameDocument, getCurrentPlayer, getPlayer, getPlayers } from "../game";
import { InputId } from "../../../src/models/inputs";
import { QuorumCardId } from "../../../src/models/game-data";
import { Input, makeRequest } from "../inputs/input";
import { DicePlayer, handleRoll, setupRollCtx } from "../roll-manager";
import { finishAction } from "../transitions/action";

export enum EncourageMutinyState {
    ChoosePlayer,
    Roll,
}

interface EncourageMutinyCtx {
    state: EncourageMutinyState;
    admiral: string;
    chosenPlayer: string;
}

export function actionEncourageMutiny(gameDoc: GameDocument, input: Input<string>) {
    if (!gameDoc.gameState.actionCtx) {
        gameDoc.gameState.actionCtx = {
            state: EncourageMutinyState.ChoosePlayer,
            admiral: findAdmiral(gameDoc).userId
        } as EncourageMutinyCtx;
    }
    const ctx = gameDoc.gameState.actionCtx;
    if (ctx.state === EncourageMutinyState.ChoosePlayer) {
        handleChoosePlayer(gameDoc, input);
    } else if (ctx.state === EncourageMutinyState.Roll) {
        const result = handleRoll(gameDoc, input)
        if (result) {
            executeOutcome(gameDoc, result);
        }
    }
}

function handleChoosePlayer(gameDoc: GameDocument, input: Input<string>) {
    const currentPlayer = getCurrentPlayer(gameDoc);
    if (!input) {
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.PlayerSelect, currentPlayer.userId);
        return;
    }

    const ctx = gameDoc.gameState.actionCtx;
    ctx.chosenPlayer = input.data;
    if (getPlayer(gameDoc, ctx.chosenPlayer).admiral) {
        throw new Error('Invalid player, must not be admiral');
    }

    ctx.state = EncourageMutinyState.Roll;
    setupRollCtx(gameDoc.gameState, getPlayers(gameDoc) as DicePlayer[], gameDoc.gameState.currentPlayer);
}

function executeOutcome(gameDoc: GameDocument, result: number) {
    const ctx = gameDoc.gameState.actionCtx;
    if (result >= 3) {
        getPlayer(gameDoc, ctx.chosenPlayer).admiral = true;
        getPlayer(gameDoc, ctx.admiral).admiral = false;
    } else {
        console.log('die was less than 3 ' + result);
        gameDoc.gameState.morale--;
    }

    const player = getCurrentPlayer(gameDoc);
    discardQuorumCard(gameDoc.gameState, player, QuorumCardId.EncourageMutiny);
    finishAction(gameDoc);
}
