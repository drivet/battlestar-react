import {
    discardSkillCardsFromHand,
    FullGameData,
    GameDocument,
    getPlayer,
    getPlayerByIndex,
    setInputReq
} from "./game";
import {
    AfterSkillCheckTotalId,
    BeforeSkillCheckId,
    CharacterId,
    QuorumCardId,
    SkillCardId,
    SkillCheckType,
    SkillType
} from "../../src/models/game-data";
import { Input, InputId } from "../../src/models/inputs";
import * as _ from "lodash";
import { handleRoundTable, initRoundTable, InputCtxFactory, usersFromCurrent } from "./round-table";
import {
    adjustDifficulty,
    adjustDifficultyFromProphecy,
    calcFinalResult,
    calcSkillCheckStrength,
    gatherBeforeSkills
} from "./skill-check-utils";

export enum SkillCheckState {
    Setup,
    BeforeCollect,
    Collect,
    CheckForBlindDevotion,
    BlindDevotionSkillSelect,
    Scoring,
    AfterScore,
    FinalScoring,
    Discard
}

export enum SkillCheckResult {
    Unknown,
    Pass,
    Partial,
    Fail
}

export interface SkillCheckPlayer {
    userId: string;
    characterId: CharacterId;
    president?: boolean;
    skillCards?: SkillCardId[];
    quorumHand?: QuorumCardId[];
    arbitrator?: boolean;
}

export interface SkillCheckCtx {
    players: SkillCheckPlayer[];
    acceptingProphecy: boolean;
    chosenPlayer?: number;
    which: SkillCheckType;
    types: SkillType[];
    pass: number;
    partial?: number;
    state: SkillCheckState;
    beforeCheck: BeforeSkillCheckId[][]
    skills: SkillCardId[][];
    galen?: string;
    blindDevotionSkill?: SkillType;
    score: number;
    afterTotal: AfterSkillCheckTotalId[][];
    result?: SkillCheckResult;
}

export function createSkillCheckCtx(players: SkillCheckPlayer[],
                                    acceptingProphecy: boolean,
                                    which: SkillCheckType,
                                    types: SkillType[],
                                    pass: number,
                                    partial?: number,
                                    chosenPlayer?: number): SkillCheckCtx {
    return {
        players: players,
        acceptingProphecy: acceptingProphecy,
        chosenPlayer: chosenPlayer,
        state: SkillCheckState.Setup,
        which: which,
        types: types,
        pass: pass,
        partial: partial,
        beforeCheck: [],
        skills: [],
        score: undefined,
        afterTotal: [],
        result: SkillCheckResult.Unknown
    };
}

/**
 * Useful or not?
 *
 * @param game
 * @param skillCheckCtx
 */
export function setupSkillCtx(game: FullGameData, skillCheckCtx: SkillCheckCtx) {
    game.skillCheckCtx = skillCheckCtx;
}

export function handleSkillCheck(gameDoc: GameDocument, input: Input<any, any>): boolean {
    const ctx = gameDoc.gameState.skillCheckCtx;
    if (ctx.state === SkillCheckState.Setup) {
        return handleSetup(gameDoc.gameState);
    } else if (ctx.state === SkillCheckState.BeforeCollect) {
        return handleBeforeCollect(gameDoc, input as Input<BeforeSkillCheckId[]>);
    } else if (ctx.state === SkillCheckState.Collect) {
        return handleCollectSkills(gameDoc, input);
    } else if (ctx.state === SkillCheckState.CheckForBlindDevotion) {
        return checkForBlindDevotion(gameDoc);
    } else if (ctx.state === SkillCheckState.BlindDevotionSkillSelect) {
        return handleBlindDevotionSkillSelect(gameDoc, input);
    } else if (ctx.state === SkillCheckState.Scoring) {
        return handleScoring(gameDoc.gameState.skillCheckCtx);
    } else if (ctx.state === SkillCheckState.AfterScore) {
        return handleCollectAfterScore(gameDoc, input);
    } else if (ctx.state === SkillCheckState.FinalScoring) {
        return handleFinalResult(gameDoc.gameState.skillCheckCtx);
    } else if (ctx.state === SkillCheckState.Discard) {
        return handleDiscard(gameDoc);
    }
}

function handleSetup(game: FullGameData): boolean {
    const s = game.skillCheckCtx;
    const presidentChosen = s.players[s.chosenPlayer].president;
    s.pass = adjustDifficultyFromProphecy(s.acceptingProphecy, s.which, presidentChosen, s.pass);
    game.skillCheckCtx.state = SkillCheckState.BeforeCollect;
    return false;
}

function handleBeforeCollect(gameDoc: GameDocument, input: Input<BeforeSkillCheckId[]>): boolean {
    const result = initAndHandleRoundTable(gameDoc, InputId.BeforeSkillCheckSelect, input, narrowBeforeSkillCheck);
    const skillCtx = gameDoc.gameState.skillCheckCtx;
    if (result) {
        skillCtx.pass = adjustDifficulty(skillCtx.pass, _.flatten(skillCtx.beforeCheck));
        skillCtx.state = SkillCheckState.Collect;
    } else if (input) {
        skillCtx.beforeCheck.push(input.data);
    }
    return result;
}


function narrowBeforeSkillCheck(gameDoc: GameDocument, user: string): BeforeSkillCheckId[] {
    const player = getPlayer(gameDoc, user);
    return gatherBeforeSkills(player.characterId, player.arbitrator, player.skillCards)
}

function handleCollectSkills(gameDoc: GameDocument, input: Input<SkillCardId[]>): boolean {
    const result = initAndHandleRoundTable(gameDoc, InputId.SkillCardSelect, input);
    const skillCtx = gameDoc.gameState.skillCheckCtx;
    if (result) {
        checkForBlindDevotion(gameDoc);
    } else if (input) {
        skillCtx.skills.push(input.data);
    }
    return result;
}

function checkForBlindDevotion(gameDoc: GameDocument): boolean {
    const skillCtx = gameDoc.gameState.skillCheckCtx;
    const galenUser = findGalen(gameDoc);
    if (!galenUser) {
        skillCtx.state = SkillCheckState.Scoring;
    } else {
        skillCtx.galen = galenUser;
        skillCtx.state = SkillCheckState.BlindDevotionSkillSelect;
    }
    return false;
}

function findGalen(gameDoc: GameDocument): string {
    const galenIndex = Object.values(gameDoc.players)
        .findIndex(p => p.characterId === CharacterId.GalenTyrol);
    return gameDoc.gameState.userIds[galenIndex];
}

function handleBlindDevotionSkillSelect(gameDoc: GameDocument, input: Input<SkillType>): boolean {
    const skillCtx = gameDoc.gameState.skillCheckCtx;
    if (!input) {
        setInputReq(gameDoc, InputId.SkillTypeSelect, skillCtx.galen);
        return false;
    }
    skillCtx.blindDevotionSkill = input.data;
    skillCtx.state = SkillCheckState.Scoring;
    return false;
}

function handleScoring(skillCtx: SkillCheckCtx): boolean {
    skillCtx.score = calcSkillCheckStrength(skillCtx.types,
        _.flatten(skillCtx.skills), hasScientificResearch(skillCtx),
        skillCtx.blindDevotionSkill);
    skillCtx.state = SkillCheckState.AfterScore;
    return false;
}

function handleCollectAfterScore(gameDoc: GameDocument, input: Input<AfterSkillCheckTotalId[]>): boolean {
    const result = initAndHandleRoundTable(gameDoc, InputId.AfterSkillCheckTotaled, input);
    const skillCtx = gameDoc.gameState.skillCheckCtx;
    if (result) {
        skillCtx.state = SkillCheckState.FinalScoring;
    } else if (input) {
        skillCtx.afterTotal.push(input.data);
    }
    return result;
}

function handleFinalResult(skillCtx: SkillCheckCtx): boolean {
    skillCtx.result = calcFinalResult(
        skillCtx.score, skillCtx.pass, skillCtx.partial, hasDeclareEmergency(skillCtx));
    return false;
}

function handleDiscard(gameDoc: GameDocument): boolean {
    const skillCtx = gameDoc.gameState.skillCheckCtx;

    for (let i = 0; i < skillCtx.beforeCheck.length; i++) {
        discardSkills(gameDoc, i, getBeforeSkillCards(skillCtx.beforeCheck[i]));
    }

    for (let i = 0; i < skillCtx.skills.length; i++) {
        discardSkills(gameDoc, i, skillCtx.skills[i]);
    }

    for (let i = 0; i < skillCtx.afterTotal.length; i++) {
        discardSkills(gameDoc, i, getAfterSkillCards(skillCtx.afterTotal[i]));
    }
    return true;
}

function discardSkills(gameDoc: GameDocument, playerIndex: number, skills: SkillCardId[]) {
    discardSkillCardsFromHand(gameDoc.gameState, getPlayerByIndex(gameDoc, playerIndex), skills);
}

function getBeforeSkillCards(beforeCheck: BeforeSkillCheckId[]): SkillCardId[] {
    return beforeCheck.map(getBeforeSkillCard).filter(s => s !== undefined);
}

function getBeforeSkillCard(beforeCheck: BeforeSkillCheckId): SkillCardId {
    if (beforeCheck === BeforeSkillCheckId.InvestigativeCommittee3) {
        return SkillCardId.InvestigativeCommittee3;
    } else if (beforeCheck === BeforeSkillCheckId.InvestigativeCommittee4) {
        return SkillCardId.InvestigativeCommittee4;
    } else if (beforeCheck === BeforeSkillCheckId.InvestigativeCommittee5) {
        return SkillCardId.InvestigativeCommittee5;
    } else if (beforeCheck === BeforeSkillCheckId.ScientificResearch3) {
        return SkillCardId.ScientificResearch3;
    } else if (beforeCheck === BeforeSkillCheckId.ScientificResearch4) {
        return SkillCardId.ScientificResearch4;
    } else if (beforeCheck === BeforeSkillCheckId.ScientificResearch5) {
        return SkillCardId.ScientificResearch5;
    } else {
        return undefined;
    }
}

function getAfterSkillCards(afterCheck: AfterSkillCheckTotalId[]): SkillCardId[] {
    return afterCheck.map(getAfterSkillCard).filter(s => s !== undefined);
}

function getAfterSkillCard(afterCheck: AfterSkillCheckTotalId): SkillCardId {
    if (afterCheck === AfterSkillCheckTotalId.DeclareEmergency3) {
        return SkillCardId.DeclareEmergency3;
    } else if (afterCheck === AfterSkillCheckTotalId.DeclareEmergency4) {
        return SkillCardId.DeclareEmergency4;
    } else if (afterCheck === AfterSkillCheckTotalId.DeclareEmergency5) {
        return SkillCardId.DeclareEmergency5;
    } else {
        return undefined;
    }
}

function initAndHandleRoundTable<T, S>(gameDoc: GameDocument, inputId: InputId, input: Input<T>,
                                       inputCtxFactory: InputCtxFactory<S> = undefined): boolean {
    if (!gameDoc.gameState.roundTableCtx) {
        initRoundTable(gameDoc, inputId, usersFromCurrent(gameDoc), inputCtxFactory)
    }
    return handleRoundTable(gameDoc, input);
}

function hasScientificResearch(ctx: SkillCheckCtx) {
    return _.flatten(ctx.beforeCheck).findIndex(b => b === BeforeSkillCheckId.ScientificResearch3 ||
                                                              b === BeforeSkillCheckId.ScientificResearch4 ||
                                                              b === BeforeSkillCheckId.ScientificResearch5) !== -1;
}

function hasDeclareEmergency(ctx: SkillCheckCtx) {
    return _.flatten(ctx.afterTotal).findIndex(b => b === AfterSkillCheckTotalId.DeclareEmergency3 ||
                                                             b === AfterSkillCheckTotalId.DeclareEmergency4 ||
                                                             b === AfterSkillCheckTotalId.DeclareEmergency5) !== -1;
}
