import {
    discardSkillCardsFromHand,
    FullGameData,
    GameDocument,
    getPlayer,
    getPlayerByIndex,
    getUserByCharacter,
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
import { initAndHandleRoundTable } from "./round-table";
import {
    adjustDifficulty,
    adjustDifficultyFromProphecy,
    calcFinalResult,
    calcSkillCheckStrength,
    gatherBeforeSkills
} from "./skill-check-utils";
import { addCard, addCardToTop } from "./deck";

export enum SkillCheckState {
    Setup,
    BeforeCollect,
    Collect,
    BlindDevotionSkillSelect,
    Scoring,
    AfterScore,
    FinalScoring,
    Discard,
    CommandAuthority,
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
    adama?: string;
    commandAuthority?: boolean;
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

export function handleSkillCheck(gameDoc: GameDocument, input: Input<any, any>): SkillCheckResult {
    const ctx = gameDoc.gameState.skillCheckCtx;
    if (ctx.state === SkillCheckState.Setup) {
        return handleSetup(gameDoc.gameState);
    } else if (ctx.state === SkillCheckState.BeforeCollect) {
        return handleBeforeCollect(gameDoc, input as Input<BeforeSkillCheckId[]>);
    } else if (ctx.state === SkillCheckState.Collect) {
        return handleCollectSkills(gameDoc, input);
    } else if (ctx.state === SkillCheckState.BlindDevotionSkillSelect) {
        return handleBlindDevotionSkillSelect(gameDoc, input);
    } else if (ctx.state === SkillCheckState.Scoring) {
        return handleScoring(gameDoc.gameState.skillCheckCtx);
    } else if (ctx.state === SkillCheckState.AfterScore) {
        return handleCollectAfterScore(gameDoc, input);
    } else if (ctx.state === SkillCheckState.FinalScoring) {
        return handleFinalResult(gameDoc);
    } else if (ctx.state === SkillCheckState.CommandAuthority) {
        return handleCommandAuthority(gameDoc, input);
    } else if (ctx.state === SkillCheckState.Discard) {
        return handleDiscard(gameDoc);
    }
}

function handleSetup(game: FullGameData): SkillCheckResult {
    const s = game.skillCheckCtx;
    const presidentChosen = s.players[s.chosenPlayer].president;
    s.pass = adjustDifficultyFromProphecy(s.acceptingProphecy, s.which, presidentChosen, s.pass);
    game.skillCheckCtx.state = SkillCheckState.BeforeCollect;
    return SkillCheckResult.Unknown;
}

function handleBeforeCollect(gameDoc: GameDocument, input: Input<BeforeSkillCheckId[]>): SkillCheckResult {
    const result = initAndHandleRoundTable(gameDoc, InputId.BeforeSkillCheckSelect, input, narrowBeforeSkillCheck);
    const skillCtx = gameDoc.gameState.skillCheckCtx;
    if (input) {
        skillCtx.beforeCheck.push(input.data);
    }

    if (result) {
        skillCtx.pass = adjustDifficulty(skillCtx.pass, _.flatten(skillCtx.beforeCheck));
        skillCtx.state = SkillCheckState.Collect;
    }
    return SkillCheckResult.Unknown;
}

function narrowBeforeSkillCheck(gameDoc: GameDocument, user: string): BeforeSkillCheckId[] {
    const player = getPlayer(gameDoc, user);
    return gatherBeforeSkills(player.characterId, player.arbitrator, player.skillCards)
}

function handleCollectSkills(gameDoc: GameDocument, input: Input<SkillCardId[]>): SkillCheckResult {
    const result = initAndHandleRoundTable(gameDoc, InputId.SkillCardSelect, input);
    const skillCtx = gameDoc.gameState.skillCheckCtx;
    if (input) {
        skillCtx.skills.push(input.data);
    }

    if (result) {
        checkForBlindDevotion(gameDoc);
    }
    return SkillCheckResult.Unknown;
}

function checkForBlindDevotion(gameDoc: GameDocument) {
    const skillCtx = gameDoc.gameState.skillCheckCtx;
    const galenUser = getUserByCharacter(gameDoc, CharacterId.GalenTyrol);
    if (!galenUser || getPlayer(gameDoc, galenUser).blindDevotionUsed) {
        skillCtx.state = SkillCheckState.Scoring;
    } else {
        skillCtx.galen = galenUser;
        skillCtx.state = SkillCheckState.BlindDevotionSkillSelect;
    }
}

function handleBlindDevotionSkillSelect(gameDoc: GameDocument, input: Input<SkillType>): SkillCheckResult {
    const skillCtx = gameDoc.gameState.skillCheckCtx;
    if (!input) {
        setInputReq(gameDoc, InputId.SkillTypeSelect, skillCtx.galen);
        return SkillCheckResult.Unknown;
    }
    skillCtx.blindDevotionSkill = input.data;
    if (skillCtx.blindDevotionSkill !== undefined) {
        getPlayer(gameDoc, skillCtx.galen).blindDevotionUsed = true;
    }
    skillCtx.state = SkillCheckState.Scoring;
    return SkillCheckResult.Unknown;
}

function handleScoring(skillCtx: SkillCheckCtx): SkillCheckResult {
    skillCtx.score = calcSkillCheckStrength(skillCtx.types,
        _.flatten(skillCtx.skills), hasScientificResearch(skillCtx),
        skillCtx.blindDevotionSkill);
    skillCtx.state = SkillCheckState.AfterScore;
    return SkillCheckResult.Unknown;
}

function handleCollectAfterScore(gameDoc: GameDocument, input: Input<AfterSkillCheckTotalId[]>): SkillCheckResult{
    const result = initAndHandleRoundTable(gameDoc, InputId.AfterSkillCheckTotaled, input);
    const skillCtx = gameDoc.gameState.skillCheckCtx;
    if (input) {
        skillCtx.afterTotal.push(input.data);
    }
    if (result) {
        skillCtx.state = SkillCheckState.FinalScoring;
    }
    return SkillCheckResult.Unknown;
}

function handleFinalResult(gameDoc: GameDocument): SkillCheckResult {
    const skillCtx = gameDoc.gameState.skillCheckCtx;
    skillCtx.result = calcFinalResult(
        skillCtx.score, skillCtx.pass, skillCtx.partial, hasDeclareEmergency(skillCtx));
    const adama = getUserByCharacter(gameDoc, CharacterId.WilliamAdama);
    if (adama && !getPlayer(gameDoc, adama).commandAuthorityUsed) {
        skillCtx.state = SkillCheckState.CommandAuthority;
    } else {
        skillCtx.state = SkillCheckState.Discard;
    }
    return SkillCheckResult.Unknown;
}

function handleCommandAuthority(gameDoc: GameDocument, input: Input<boolean>): SkillCheckResult {
    const skillCtx = gameDoc.gameState.skillCheckCtx;
    if (!input) {
        setInputReq(gameDoc, InputId.CommandAuthority, skillCtx.adama);
        return SkillCheckResult.Unknown;
    }
    skillCtx.commandAuthority = input.data;
    if (skillCtx.commandAuthority) {
        getPlayer(gameDoc, skillCtx.adama).commandAuthorityUsed = true;
    }
    skillCtx.state = SkillCheckState.Discard;
    return SkillCheckResult.Unknown;

}

export function handleDiscard(gameDoc: GameDocument): SkillCheckResult {
    const skillCtx = gameDoc.gameState.skillCheckCtx;

    for (let i = 0; i < skillCtx.beforeCheck.length; i++) {
        discardSkills(gameDoc, i, getBeforeSkillCards(skillCtx.beforeCheck[i]));
    }

    for (let i = 0; i < skillCtx.skills.length; i++) {
        if (skillCtx.commandAuthority) {
            giveSkillsToAdama(gameDoc, i, skillCtx.skills[i]);
        } else {
            discardSkills(gameDoc, i, skillCtx.skills[i]);
        }
    }

    for (let i = 0; i < skillCtx.afterTotal.length; i++) {
        discardSkills(gameDoc, i, getAfterSkillCards(skillCtx.afterTotal[i]));
    }

    if (skillCtx.acceptingProphecy) {
        addCardToTop(gameDoc.gameState.discardedQuorumDeck, QuorumCardId.AcceptProphecy);
    }

    if (hasArbitrator(skillCtx)) {
        findArbitrator(skillCtx).arbitrator = false;
        addCardToTop(gameDoc.gameState.discardedQuorumDeck, QuorumCardId.AssignArbitrator);
    }

    return skillCtx.result;
}

function hasArbitrator(ctx: SkillCheckCtx) {
    return _.flatten(ctx.beforeCheck).findIndex(b =>
        b === BeforeSkillCheckId.AssignArbitrator_Increase ||
        b === BeforeSkillCheckId.AssignArbitrator_Decrease) !== -1;
}

function findArbitrator(skillCtx: SkillCheckCtx): SkillCheckPlayer {
    const arbitrators = skillCtx.players.filter(p => p.arbitrator);
    return arbitrators[0];
}

function discardSkills(gameDoc: GameDocument, playerIndex: number, skills: SkillCardId[]) {
    discardSkillCardsFromHand(gameDoc.gameState, getPlayerByIndex(gameDoc, playerIndex), skills);
}

function giveSkillsToAdama(gameDoc: GameDocument, playerIndex: number, skills: SkillCardId[]) {
    const player = getPlayerByIndex(gameDoc, playerIndex);
    const adama = getPlayer(gameDoc, gameDoc.gameState.skillCheckCtx.adama)
    skills.forEach(c => {
        const index = player.skillCards.findIndex(q => q === c);
        player.skillCards.splice(index, 1);
        addCard(adama.skillCards, c);
    });
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
