import { FullPlayer, GameDocument, getCurrentPlayer, getPlayer, getPlayerByIndex, getPlayerCount } from "../game";
import { Input, InputId } from "../../../src/models/inputs";
import { LocationId, SkillCard, SkillType } from "../../../src/models/game-data";
import { makeRequest } from "../input";
import * as _ from 'lodash';

enum AdmiralsQuartersState {
    ChoosePlayer,
    CollectSkills
}

interface SkillCheck {
    strength: number;
    types: SkillType[];
}

interface AdmiralsQuartersCtx {
    state: AdmiralsQuartersState;
    chosenPlayer: string;
    skillCheck: SkillCheck;
    skills: SkillCard[][];
    skillPlayer: number;
}

function getAdmiralsQuartersSkillCheck(): SkillCheck {
    return {
        strength: 7,
        types: [SkillType.Leadership, SkillType.Tactics]
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
    ctx.chosenPlayer = getPlayer(gameDoc, input.data);
    ctx.state = AdmiralsQuartersState.CollectSkills;
}

function sendToBrig(gameDoc: GameDocument, currentPlayer: FullPlayer, chosenPlayer: FullPlayer) {
    chosenPlayer.location = LocationId.Brig;
}

function handleCollectSkills(gameDoc: GameDocument, input: Input<SkillCard[]>) {
    if (!input) {
        const nextPlayer = getNextSkillCardPlayer(gameDoc);
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.SkillCardSelect, nextPlayer);
        return;
    }
    const ctx: AdmiralsQuartersCtx = gameDoc.gameState.actionCtx;
    ctx.skills.push(input.data);
    if (ctx.skills.length === getPlayerCount(gameDoc)) {
        const score = calcSkillCheckResult(_.flatten(ctx.skills), ctx.skillCheck);
        if (score >= ctx.skillCheck.strength) {
            sendToBrig(gameDoc, getCurrentPlayer(gameDoc), getPlayer(gameDoc, ctx.chosenPlayer));
        }
    } else {
        gotoNextPlayer(gameDoc);
    }
}

function getNextSkillCardPlayer(gameDoc: GameDocument): string {
    const ctx: AdmiralsQuartersCtx = gameDoc.gameState.actionCtx;
    return getPlayerByIndex(gameDoc, ctx.skillPlayer).userId;
}

function gotoNextPlayer(gameDoc: GameDocument) {
    const ctx: AdmiralsQuartersCtx = gameDoc.gameState.actionCtx;
    ctx.skillPlayer++;
    if (ctx.skillPlayer === getPlayerCount(gameDoc)) {
        ctx.skillPlayer = 0;
    }
}

function calcSkillCheckResult(skills: SkillCard[], skillCheck: SkillCheck): number {
    let score = 0;
    skills.forEach(s => {
        if (skillCheck.types.indexOf(s.type) !== -1) {
            score += s.strength;
        } else {
            score -= s.strength;
        }
    });
    return score;
}

export function actionAdmiralsQuarters(gameDoc: GameDocument, input: Input<any>) {
    if (!gameDoc.gameState.actionCtx) {
        gameDoc.gameState.actionCtx = {
            state: AdmiralsQuartersState.ChoosePlayer,
            skills: [],
            skillCheck: getAdmiralsQuartersSkillCheck()
        } as AdmiralsQuartersCtx;
    }
    const ctx = gameDoc.gameState.actionCtx;
    if (ctx.state === AdmiralsQuartersState.ChoosePlayer) {
        handleChoosePlayer(gameDoc, input);
    } else if (ctx.state === AdmiralsQuartersState.CollectSkills) {
        handleCollectSkills(gameDoc, input);
    }
}
