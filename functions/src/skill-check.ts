import { GameDocument, getPlayerByIndex, getPlayerCount } from "./game";
import { SkillCardId, SkillCards, SkillType } from "../../src/models/game-data";
import { Input, InputId } from "../../src/models/inputs";
import { makeRequest } from "./input";
import * as _ from "lodash";

export interface SkillCheckCtx {
    types: SkillType[];
    skills: SkillCardId[][];
    skillPlayer: number;
    score: number;
}

export function createSkillCtx(gameDoc: GameDocument, types: SkillType[]): SkillCheckCtx {
    return {
        types: types,
        skills: [],
        skillPlayer: getNextPlayer(gameDoc, gameDoc.gameState.currentPlayer),
        score: 0
    }
}

export function handleCollectSkills(gameDoc: GameDocument, input: Input<SkillCardId[]>): boolean {
    if (!input) {
        const nextPlayer = getNextSkillCardPlayer(gameDoc);
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.SkillCardSelect, nextPlayer);
        return false;
    }
    const ctx = gameDoc.gameState.skillCheckCtx;
    ctx.skills.push(input.data);
    if (ctx.skills.length === getPlayerCount(gameDoc)) {
        ctx.score = calcSkillCheckResult(_.flatten(ctx.skills), ctx.types);
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

function calcSkillCheckResult(skills: SkillCardId[], types: SkillType[]): number {
    let score = 0;
    skills.map(s => SkillCards[SkillCardId[s]])
        .forEach(s => score += ((types.indexOf(s.type) !== -1 ? 1 : -1) * s.strength));
    return score;
}
