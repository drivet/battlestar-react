import { FullPlayer, GameDocument, getCurrentPlayer, getPlayer } from "../game";
import { Input, InputId } from "../../../src/models/inputs";
import { LocationId, QuorumCardId, SkillType } from "../../../src/models/game-data";
import { makeRequest } from "../input";
import { createSkillCtx, handleCollectSkills } from "../skill-check";
import { finishAction } from "../transitions/action";
import { addCard } from "../deck";

export enum AdmiralsQuartersState {
    ChoosePlayer,
    CollectSkills,
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
    ctx.state = AdmiralsQuartersState.CollectSkills;
    gameDoc.gameState.skillCheckCtx =
        createSkillCtx(gameDoc, [SkillType.Leadership, SkillType.Tactics]);
}

function executeOutcome(gameDoc: GameDocument) {
    const score = gameDoc.gameState.skillCheckCtx.score;
    if (score >= getDifficulty(gameDoc)) {
        const ctx = gameDoc.gameState.actionCtx;
        ctx.chosenPlayer.location = LocationId.Brig;
    }
    if (gameDoc.gameState.acceptProphecy !== null) {
        addCard(gameDoc.gameState.discardedQuorumDeck, QuorumCardId.AcceptProphecy);
        gameDoc.gameState.acceptProphecy = null;
    }
    finishAction(gameDoc);
}


function getDifficulty(gameDoc: GameDocument) {
    const ctx = gameDoc.gameState.actionCtx;
    if (gameDoc.gameState.acceptProphecy !== null && ctx.chosenPlayer.president) {
        return 9;
    } else {
        return 7;
    }
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
    } else if (ctx.state === AdmiralsQuartersState.CollectSkills) {
        if (handleCollectSkills(gameDoc, input)) {
            executeOutcome(gameDoc);
        }
    }
}
