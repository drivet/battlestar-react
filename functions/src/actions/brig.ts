import { GameDocument, getCurrentPlayer, getPlayerByIndex, getPlayerCount } from "../game";
import { Input, InputId } from "../../../src/models/inputs";
import { LocationId, SkillCard, SkillType } from "../../../src/models/game-data";
import { makeRequest } from "../input";
import * as _ from 'lodash';

enum BrigState {
    CollectSkills,
    ChooseLocation,
}

interface SkillCheck {
    strength: number;
    types: SkillType[];
}

interface BrigCtx {
    state: BrigState;
    chosenPlayer: string;
    skillCheck: SkillCheck;
    skills: SkillCard[][];
    skillPlayer: number;
}

function getBrigSkillCheck(): SkillCheck {
    return {
        strength: 7,
        types: [SkillType.Leadership, SkillType.Tactics]
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
}

function handleCollectSkills(gameDoc: GameDocument, input: Input<SkillCard[]>) {
    if (!input) {
        const nextPlayer = getNextSkillCardPlayer(gameDoc);
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.SkillCardSelect, nextPlayer);
        return;
    }
    const ctx: BrigCtx = gameDoc.gameState.actionCtx;
    ctx.skills.push(input.data);
    if (ctx.skills.length === getPlayerCount(gameDoc)) {
        const score = calcSkillCheckResult(_.flatten(ctx.skills), ctx.skillCheck);
        if (score >= ctx.skillCheck.strength) {
            ctx.state = BrigState.ChooseLocation;
        }
    } else {
        gotoNextPlayer(gameDoc);
    }
}

function getNextSkillCardPlayer(gameDoc: GameDocument): string {
    const ctx: BrigCtx = gameDoc.gameState.actionCtx;
    return getPlayerByIndex(gameDoc, ctx.skillPlayer).userId;
}

function gotoNextPlayer(gameDoc: GameDocument) {
    const ctx: BrigCtx = gameDoc.gameState.actionCtx;
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

export function actionBrig(gameDoc: GameDocument, input: Input<any>) {
    if (!gameDoc.gameState.actionCtx) {
        gameDoc.gameState.actionCtx = {
            state: BrigState.CollectSkills,
            skills: [],
            skillCheck: getBrigSkillCheck()
        } as BrigCtx;
    }
    const ctx = gameDoc.gameState.actionCtx;
    if (ctx.state === BrigState.CollectSkills) {
        handleCollectSkills(gameDoc, input);
    } else if (ctx.state === BrigState.ChooseLocation) {
        handleChooseLocation(gameDoc, input);
    }
}
