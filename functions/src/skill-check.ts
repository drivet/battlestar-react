import { GameDocument, getPlayerByIndex, getPlayerCount } from "./game";
import {
    AfterSkillCheckAddedId,
    AfterSkillCheckTotalId,
    BeforeSkillCheckId,
    SkillCard,
    SkillCardId,
    SkillCards,
    SkillCheckType,
    SkillType
} from "../../src/models/game-data";
import { Input, InputId } from "../../src/models/inputs";
import { makeRequest } from "./input";
import * as _ from "lodash";

export interface SkillCheck {
    which: SkillCheckType;
    types: SkillType[];
    pass: number;
    partial: number;
}

export enum SkillCheckState {
    BeforeCollect,
    Collect,
    AfterCollect,
    AfterScore
}

export enum SkillCheckResult {
    Pass,
    Partial,
    Fail
}

export interface SkillCheckCtx {
    state: SkillCheckState;
    skillCheck: SkillCheck;
    beforeCheck: BeforeSkillCheckId[]
    skills: SkillCardId[][];
    afterCheck: AfterSkillCheckAddedId[];
    blindDevotionSkill?: SkillType;
    afterTotal: AfterSkillCheckTotalId[];
    skillPlayer: number;
    result?: SkillCheckResult;
}

export function createSkillCtx(gameDoc: GameDocument, skillCheck: SkillCheck): SkillCheckCtx {
    return {
        state: SkillCheckState.BeforeCollect,
        skillCheck: skillCheck,
        beforeCheck: [],
        skills: [],
        afterCheck: [],
        afterTotal: [],
        skillPlayer: getNextPlayer(gameDoc, gameDoc.gameState.currentPlayer),
    }
}

export function handleSkillCheck(gameDoc: GameDocument, input: Input<any>): boolean {
    const ctx = gameDoc.gameState.skillCheckCtx;
    if (ctx.state === SkillCheckState.BeforeCollect) {
        return handleCollectBeforeCheck(gameDoc, input);
    } else if (ctx.state === SkillCheckState.Collect) {
        return handleCollectSkills(gameDoc, input);
    } else if (ctx.state === SkillCheckState.AfterCollect) {
        return handleCollectAfterCheck(gameDoc, input);
    } else if (ctx.state === SkillCheckState.AfterScore) {
        return handleCollectAfterScore(gameDoc, input);
    }
}

function handleCollectBeforeCheck(gameDoc: GameDocument, input: Input<BeforeSkillCheckId[]>): boolean {
    if (!input) {
        const nextPlayer = getNextSkillCardPlayer(gameDoc);
        gameDoc.gameState.inputRequest = makeRequest(InputId.BeforeSkillCheckSelect, nextPlayer);
        return false;
    }
    const ctx = gameDoc.gameState.skillCheckCtx;
    ctx.beforeCheck.push(...input.data);
    if (ctx.beforeCheck.length === getPlayerCount(gameDoc)) {
        ctx.state = SkillCheckState.Collect;
    } else {
        gotoNextPlayer(gameDoc);
    }
    return false;
}

function handleCollectSkills(gameDoc: GameDocument, input: Input<SkillCardId[]>): boolean {
    if (!input) {
        const nextPlayer = getNextSkillCardPlayer(gameDoc);
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.SkillCardSelect, nextPlayer);
        return false;
    }
    const ctx = gameDoc.gameState.skillCheckCtx;
    ctx.skills.push(input.data);
    if (ctx.skills.length === getPlayerCount(gameDoc)) {
        ctx.state = SkillCheckState.AfterCollect
    } else {
        gotoNextPlayer(gameDoc);
    }
    return false;
}

function handleCollectAfterCheck(gameDoc: GameDocument, input: Input<AfterSkillCheckAddedId[]>): boolean {
    if (!input) {
        const nextPlayer = getNextSkillCardPlayer(gameDoc);
        gameDoc.gameState.inputRequest = makeRequest(InputId.AfterSkillCheckAdded, nextPlayer);
        return false;
    }
    const ctx = gameDoc.gameState.skillCheckCtx;
    ctx.afterCheck.push(...input.data);
    if (ctx.afterCheck.length === getPlayerCount(gameDoc)) {
        ctx.state = SkillCheckState.AfterScore;
    } else {
        gotoNextPlayer(gameDoc);
    }
    return false;
}

function handleCollectAfterScore(gameDoc: GameDocument, input: Input<AfterSkillCheckTotalId[]>): boolean {
    if (!input) {
        const nextPlayer = getNextSkillCardPlayer(gameDoc);
        gameDoc.gameState.inputRequest = makeRequest(InputId.AfterSkillCheckTotaled, nextPlayer);
        return false;
    }
    const ctx = gameDoc.gameState.skillCheckCtx;
    ctx.afterTotal.push(...input.data);
    if (ctx.afterTotal.length === getPlayerCount(gameDoc)) {
        ctx.result = calcSkillCheckResult(gameDoc);
        return true;
    } else {
        gotoNextPlayer(gameDoc);
        return false;
    }
}

function getNextSkillCardPlayer(gameDoc: GameDocument): string {
    const ctx = gameDoc.gameState.skillCheckCtx;
    return getPlayerByIndex(gameDoc, ctx.skillPlayer).userId;
}

function gotoNextPlayer(gameDoc: GameDocument) {
    const ctx = gameDoc.gameState.skillCheckCtx;
    ctx.skillPlayer = getNextPlayer(gameDoc, ctx.skillPlayer);
}

function getNextPlayer(gameDoc: GameDocument, player: number): number {
    let next = player++;
    if (next === getPlayerCount(gameDoc)) {
        next = 0;
    }
    return next;
}

function calcSkillCheckResult(gameDoc: GameDocument): SkillCheckResult {
    let score = 0;
    const ctx = gameDoc.gameState.skillCheckCtx;
    const skills = _.flatten(ctx.skills);
    skills.map(s => SkillCards[SkillCardId[s]])
        .forEach(s => score += calcSkillCardStrength(gameDoc, s));
    return score;
}

function calcSkillCardStrength(gameDoc: GameDocument, skillCard: SkillCard): number {
    const ctx = gameDoc.gameState.skillCheckCtx;
    if (ctx.beforeCheck.indexOf(BeforeSkillCheckId.ScientificResearch) !== -1 &&
        skillCard.type === SkillType.Engineering) {
        return skillCard.strength;
    }

    if (ctx.blindDevotionSkill === skillCard.type) {
        return 0;
    }

    if (ctx.skillCheck.types.indexOf(skillCard.type) !== -1) {
        return skillCard.strength;
    } else {
        return -1 * skillCard.strength;
    }
}
