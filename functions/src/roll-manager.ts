import { discardSkillCardsFromHand, FullGameData, GameDocument, getPlayerByIndex, setInputReq } from "./game";
import { InputId } from "../../src/models/inputs";
import { BeforeRollId, CharacterId, SkillCardId } from "../../src/models/game-data";
import { initAndHandleRoundTable } from "./round-table";
import * as _ from "lodash";
import { roll } from "./roll";
import { Input } from "./inputs/input";

export enum RollState {
    BeforeRoll,
    Reroll,
    Discard
}

export interface RollCtx {
    state: RollState;
    player: number;
    allPlayers: DicePlayer[];
    beforeRoll: BeforeRollId[][];
    result: number;
}

export interface DicePlayer {
    userId: string;
    characterId: CharacterId;
}

export function createRollCtx(allPlayers: DicePlayer[], player: number): RollCtx {
    return {
        state: RollState.BeforeRoll,
        allPlayers: allPlayers,
        player: player,
        beforeRoll: [] as BeforeRollId[][],
        result: undefined
    }
}

export function setupRollCtx(game: FullGameData, allPlayers: DicePlayer[], player: number) {
    if (!game.rollCtx) {
        game.rollCtx = createRollCtx(allPlayers, player);
    }
}

export function handleRoll(gameDoc: GameDocument, input: Input<any, any>): number {
    const ctx = gameDoc.gameState.rollCtx;
    if (ctx.state === RollState.BeforeRoll) {
        handleBeforeRoll(gameDoc, input as Input<BeforeRollId[]>);
    } else if (ctx.state === RollState.Reroll) {
        handleReroll(gameDoc, input as Input<boolean>);
    } else if (ctx.state === RollState.Discard) {
        return handleDiscard(gameDoc);
    }
}

function handleBeforeRoll(gameDoc: GameDocument, input: Input<BeforeRollId[]>) {
    const rollCtx = gameDoc.gameState.rollCtx;
    const result = initAndHandleRoundTable(gameDoc, InputId.BeforeRollSelect, input);

    if (input) {
        rollCtx.beforeRoll.push(input.data);
    }

    if (result) {
        rollCtx.result = strategicRoll(hasStrategicPlanning(rollCtx));
        rollCtx.state = isHeloRolling(rollCtx) ? RollState.Reroll : RollState.Discard;
    }
}

function isHeloRolling(rollCtx: RollCtx): boolean {
    return rollCtx.allPlayers[rollCtx.player].characterId === CharacterId.KarlAgathon
}

function handleReroll(gameDoc: GameDocument, input: Input<boolean>) {
    const rollCtx = gameDoc.gameState.rollCtx;
    if (!input) {
        setInputReq(gameDoc, InputId.ReRollSelect, findHelo(rollCtx));
    } else {
        rollCtx.result = strategicRoll(hasStrategicPlanning(rollCtx));
        rollCtx.state = RollState.Discard;
    }
}

function handleDiscard(gameDoc: GameDocument): number {
    const rollCtx = gameDoc.gameState.rollCtx;

    for (let i = 0; i < rollCtx.beforeRoll.length; i++) {
        discardSkills(gameDoc, i, getBeforeSkillCards(rollCtx.beforeRoll[i]));
    }

    return rollCtx.result;
}

function getBeforeSkillCards(beforeRoll: BeforeRollId[]): SkillCardId[] {
    return beforeRoll.map(getBeforeSkillCard).filter(s => s !== undefined);
}

function getBeforeSkillCard(beforeRoll: BeforeRollId): SkillCardId {
    if (beforeRoll === BeforeRollId.StrategicPlanning3) {
        return SkillCardId.StrategicPlanning3;
    } else if (beforeRoll === BeforeRollId.StrategicPlanning4) {
        return SkillCardId.StrategicPlanning4;
    } else if (beforeRoll === BeforeRollId.StrategicPlanning5) {
        return SkillCardId.StrategicPlanning5;
    } else {
        return undefined;
    }
}

function discardSkills(gameDoc: GameDocument, playerIndex: number, skills: SkillCardId[]) {
    discardSkillCardsFromHand(gameDoc.gameState, getPlayerByIndex(gameDoc, playerIndex), skills);
}

function findHelo(rollCtx: RollCtx): string {
    const helo = rollCtx.allPlayers.filter(p => p.characterId === CharacterId.KarlAgathon)
        .map(p => p.userId);
    return helo[0];
}

function hasStrategicPlanning(ctx: RollCtx) {
    return _.flatten(ctx.beforeRoll).findIndex(b => b === BeforeRollId.StrategicPlanning3 ||
        b === BeforeRollId.StrategicPlanning4 ||
        b === BeforeRollId.StrategicPlanning5) !== -1;
}

function strategicRoll(strategicPlanning: boolean): number {
    const result = roll();
    return strategicPlanning ? result + 2 : result;
}
