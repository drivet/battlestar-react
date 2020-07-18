import { GameDocument, getPlayerByIndex, getPlayerCount } from "./game";
import { SkillCard, SkillType } from "../../src/models/game-data";
import { Input, InputId } from "../../src/models/inputs";
import { makeRequest } from "./input";
import * as _ from "lodash";

export interface SkillCheckCtx {
    types: SkillType[];
    skills: SkillCard[][];
    skillPlayer: number;
}

export function handleCollectSkills(gameDoc: GameDocument, input: Input<SkillCard[]>): number {
    if (!input) {
        const nextPlayer = getNextSkillCardPlayer(gameDoc);
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.SkillCardSelect, nextPlayer);
        return;
    }
    const ctx = gameDoc.gameState.skillCheckCtx;
    ctx.skills.push(input.data);
    if (ctx.skills.length === getPlayerCount(gameDoc)) {
        return calcSkillCheckResult(_.flatten(ctx.skills), ctx.types);
    } else {
        gotoNextPlayer(gameDoc);
    }
}

function getNextSkillCardPlayer(gameDoc: GameDocument): string {
    const ctx = gameDoc.gameState.skillCheckCtx;
    return getPlayerByIndex(gameDoc, ctx.skillPlayer).userId;
}

function gotoNextPlayer(gameDoc: GameDocument) {
    const ctx = gameDoc.gameState.skillCheckCtx;
    ctx.skillPlayer++;
    if (ctx.skillPlayer === getPlayerCount(gameDoc)) {
        ctx.skillPlayer = 0;
    }
}

function calcSkillCheckResult(skills: SkillCard[], types: SkillType[]): number {
    let score = 0;
    skills.forEach(s => score += ((types.indexOf(s.type) !== -1 ? 1 : -1) * s.strength));
    return score;
}
