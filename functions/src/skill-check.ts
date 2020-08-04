import {
    discardSkillCardsFromHand,
    FullGameData,
    FullPlayer,
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
    SkillCard,
    SkillCardId,
    SkillCards,
    SkillCheckType,
    SkillType
} from "../../src/models/game-data";
import { Input, InputId } from "../../src/models/inputs";
import * as _ from "lodash";
import { handleRoundTable, initRoundTable, InputCtxFactory, usersFromCurrent } from "./round-table";
import { addCard } from "./deck";

export interface SkillCheck {
    which: SkillCheckType;
    types: SkillType[];
    pass: number;
    partial?: number;
}

export enum SkillCheckState {
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
    Pass,
    Partial,
    Fail
}

export interface SkillCheckCtx {
    state: SkillCheckState;
    skillCheck: SkillCheck;
    beforeCheck: BeforeSkillCheckId[][]
    skills: SkillCardId[][];
    galen?: string;
    blindDevotionSkill?: SkillType;
    score: number;
    afterTotal: AfterSkillCheckTotalId[][];
    result?: SkillCheckResult;
}

export function createSkillCheck(which: SkillCheckType, types: SkillType[], pass: number, partial?: number): SkillCheck {
    return {
        which: which,
        types: types,
        pass: pass,
        partial: partial
    }
}

export function setupSkillCtx(gameDoc: GameDocument, skillCheck: SkillCheck) {
    _adjustDifficultyFromProphecy(gameDoc.gameState, skillCheck);
    gameDoc.gameState.skillCheckCtx = {
        state: SkillCheckState.BeforeCollect,
        skillCheck: skillCheck,
        beforeCheck: [],
        skills: [],
        score: 0,
        afterTotal: [],
    }
}

export function handleSkillCheck(gameDoc: GameDocument, input: Input<any, any>): boolean {
    const ctx = gameDoc.gameState.skillCheckCtx;
    if (ctx.state === SkillCheckState.BeforeCollect) {
        return handleBeforeCollect(gameDoc, input as Input<BeforeSkillCheckId[]>);
    } else if (ctx.state === SkillCheckState.Collect) {
        return handleCollectSkills(gameDoc, input);
    } else if (ctx.state === SkillCheckState.CheckForBlindDevotion) {
        return checkForBlindDevotion(gameDoc);
    } else if (ctx.state === SkillCheckState.BlindDevotionSkillSelect) {
        return handleBlindDevotionSkillSelect(gameDoc, input);
    } else if (ctx.state === SkillCheckState.Scoring) {
        return _handleScoring(gameDoc.gameState.skillCheckCtx);
    } else if (ctx.state === SkillCheckState.AfterScore) {
        return handleCollectAfterScore(gameDoc, input);
    } else if (ctx.state === SkillCheckState.FinalScoring) {
        return _handleFinalScoring(gameDoc.gameState.skillCheckCtx);
    } else if (ctx.state === SkillCheckState.Discard) {
        return handleDiscard(gameDoc);
    }
}

function narrowBeforeSkillCheck(gameDoc: GameDocument, user: string): BeforeSkillCheckId[] {
    return _narrowBeforeSkillCheck(getPlayer(gameDoc, user))
}

/**
 * Expose for testing
 */
export function _narrowBeforeSkillCheck(player: FullPlayer): BeforeSkillCheckId[] {
    const result: BeforeSkillCheckId[] = [];

    if (player.arbitrator) {
        result.push(BeforeSkillCheckId.AssignArbitrator_Increase, BeforeSkillCheckId.AssignArbitrator_Decrease);
    }

    if (hasSkillCard(player, SkillCardId.InvestigativeCommittee3)) {
        result.push(BeforeSkillCheckId.InvestigativeCommittee3);
    }
    if (hasSkillCard(player, SkillCardId.InvestigativeCommittee4)) {
        result.push(BeforeSkillCheckId.InvestigativeCommittee4);
    }
    if (hasSkillCard(player, SkillCardId.InvestigativeCommittee5)) {
        result.push(BeforeSkillCheckId.InvestigativeCommittee5);
    }

    if (hasSkillCard(player, SkillCardId.ScientificResearch3)) {
        result.push(BeforeSkillCheckId.ScientificResearch3);
    }

    if (hasSkillCard(player, SkillCardId.ScientificResearch4)) {
        result.push(BeforeSkillCheckId.ScientificResearch4);
    }

    if (hasSkillCard(player, SkillCardId.ScientificResearch5)) {
        result.push(BeforeSkillCheckId.ScientificResearch5);
    }

    if (player.characterId === CharacterId.SaulTigh) {
        result.push(BeforeSkillCheckId.CylonHatred);
    }

    if (player.characterId === CharacterId.TomZarek) {
        result.push(BeforeSkillCheckId.FILP_Decrease, BeforeSkillCheckId.FILP_Increase);
    }
    return result;
}

function hasSkillCard(player: FullPlayer, card: SkillCardId): boolean {
    return player.skillCards.indexOf(card) !== -1;
}

function handleBeforeCollect(gameDoc: GameDocument, input: Input<BeforeSkillCheckId[]>): boolean {
    const result = initAndHandleRoundTable(gameDoc, InputId.BeforeSkillCheckSelect, input, narrowBeforeSkillCheck);
    const skillCtx = gameDoc.gameState.skillCheckCtx;
    if (result) {
        _adjustDifficulty(gameDoc.gameState, _.flatten(skillCtx.beforeCheck));
    } else if (input) {
        skillCtx.beforeCheck.push(input.data);
    }
    return result;
}

/**
 * expose for testing
 * @param game
 * @param skillCheck
 */
export function _adjustDifficultyFromProphecy(game: FullGameData, skillCheck: SkillCheck) {
    const adjust = game.acceptProphecy &&
        (skillCheck.which === SkillCheckType.Administration ||
            (skillCheck.which === SkillCheckType.AdmiralsQuarters &&
                game.actionCtx.chosenPlayer.president));
    if (adjust) {
        skillCheck.pass += 2;
        addCard(game.discardedQuorumDeck, QuorumCardId.AcceptProphecy);
    }
}

export function _adjustDifficulty(game: FullGameData, adjustments: BeforeSkillCheckId[]) {
    const skillCheck = game.skillCheckCtx.skillCheck;
    adjustments.forEach(a => {
       if (a === BeforeSkillCheckId.AssignArbitrator_Increase) {
           skillCheck.pass += 3;
           addCard(game.discardedQuorumDeck, QuorumCardId.AssignArbitrator);
       } else if (a === BeforeSkillCheckId.AssignArbitrator_Decrease) {
           skillCheck.pass -= 3;
           addCard(game.discardedQuorumDeck, QuorumCardId.AssignArbitrator);
       } else if (a === BeforeSkillCheckId.FILP_Increase) {
           skillCheck.pass += 2;
       } else if (a === BeforeSkillCheckId.FILP_Decrease) {
           skillCheck.pass -= 2;
       } else if (a === BeforeSkillCheckId.CylonHatred) {
           skillCheck.pass -= 3;
       }
    });
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

/**
 * Exposed for testing
 * @param skillCtx
 */
export function _handleScoring(skillCtx: SkillCheckCtx): boolean {
    skillCtx.score = calcSkillCheckStrength(skillCtx);
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

/**
 * expose for testing
 * @param gameDoc
 */
export function _handleFinalScoring(skillCtx: SkillCheckCtx): boolean {
    const pass = hasDeclareEmergency(skillCtx) ?
        skillCtx.skillCheck.pass - 2 : skillCtx.skillCheck.pass;

    if (skillCtx.score >= pass) {
        skillCtx.result = SkillCheckResult.Pass;
    } else if (skillCtx.skillCheck.partial !== undefined &&
               skillCtx.score >= skillCtx.skillCheck.partial) {
        skillCtx.result = SkillCheckResult.Partial;
    } else {
        skillCtx.result = SkillCheckResult.Fail;
    }
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

function calcSkillCheckStrength(ctx: SkillCheckCtx): number {
    let score = 0;
    const skills = _.flatten(ctx.skills);
    skills.map(s => SkillCards[SkillCardId[s]])
        .forEach(s => score += calcSkillCardStrength(ctx, s));
    return score;
}

function calcSkillCardStrength(ctx: SkillCheckCtx, skillCard: SkillCard): number {
    if (hasScientificResearch(ctx) && skillCard.type === SkillType.Engineering) {
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
