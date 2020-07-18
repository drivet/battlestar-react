import { FullPlayer, GameDocument, getCurrentPlayer, getPlayer, getPlayerByIndex, getPlayerCount } from "../game";
import { Input, InputId } from "../../../src/models/inputs";
import { SkillCard, SkillType } from "../../../src/models/game-data";
import { makeRequest } from "../input";
import * as _ from 'lodash';

enum AdminState {
    ChoosePlayer,
    CollectSkills
}

interface SkillCheck {
    strength: number;
    types: SkillType[];
}

interface AdminCtx {
    state: AdminState;
    chosenPlayer: string;
    skillCheck: SkillCheck;
    skills: SkillCard[][];
    skillPlayer: number;
}

function getAdminSkillCheck(): SkillCheck {
    return {
        strength: 5,
        types: [SkillType.Leadership, SkillType.Politics]
    }
}

function handleChoosePlayer(gameDoc: GameDocument, input: Input<string>) {
    const currentPlayer =  getCurrentPlayer(gameDoc);
    if (!currentPlayer.president) {
        throw new Error('Administration can only be executed by the President');
    }

    if (!input) {
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.PlayerSelect, currentPlayer.userId);
        return;
    }

    const ctx = gameDoc.gameState.actionCtx;
    ctx.chosenPlayer = getPlayer(gameDoc, input.data);
    ctx.state = AdminState.CollectSkills;
}

function passPresidentTitle(gameDoc: GameDocument, currentPlayer: FullPlayer, chosenPlayer: FullPlayer) {
    currentPlayer.president = false;
    chosenPlayer.president = true;
}

function handleCollectSkills(gameDoc: GameDocument, input: Input<SkillCard[]>) {
    if (!input) {
        const nextPlayer = getNextSkillCardPlayer(gameDoc);
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.SkillCardSelect, nextPlayer);
        return;
    }
    const ctx: AdminCtx = gameDoc.gameState.actionCtx;
    ctx.skills.push(input.data);
    if (ctx.skills.length === getPlayerCount(gameDoc)) {
        const score = calcSkillCheckResult(_.flatten(ctx.skills), ctx.skillCheck);
        if (score >= ctx.skillCheck.strength) {
            passPresidentTitle(gameDoc, getCurrentPlayer(gameDoc), getPlayer(gameDoc, ctx.chosenPlayer));
        }
    } else {
        gotoNextPlayer(gameDoc);
    }
}

function getNextSkillCardPlayer(gameDoc: GameDocument): string {
    const ctx: AdminCtx = gameDoc.gameState.actionCtx;
    return getPlayerByIndex(gameDoc, ctx.skillPlayer).userId;
}

function gotoNextPlayer(gameDoc: GameDocument) {
    const ctx: AdminCtx = gameDoc.gameState.actionCtx;
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

export function actionAdministration(gameDoc: GameDocument, input: Input<any>) {
    if (!gameDoc.gameState.actionCtx) {
        gameDoc.gameState.actionCtx = {
            state: AdminState.ChoosePlayer,
            skills: [],
            skillCheck: getAdminSkillCheck()
        } as AdminCtx;
    }
    const ctx = gameDoc.gameState.actionCtx;
    if (ctx.state === AdminState.ChoosePlayer) {
        handleChoosePlayer(gameDoc, input);
    } else if (ctx.state === AdminState.CollectSkills) {
        handleCollectSkills(gameDoc, input);
    }
}
