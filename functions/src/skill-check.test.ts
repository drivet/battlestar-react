import { GameDocument, newGame } from "./game";
import {
    createSkillCheckCtx,
    handleDiscard,
    handleSkillCheck,
    setupSkillCtx,
    SkillCheckPlayer,
    SkillCheckResult,
    SkillCheckState
} from "./skill-check";
import { InputId } from "../../src/models/inputs";
import {
    AfterSkillCheckTotalId,
    BeforeSkillCheckId,
    CharacterId,
    QuorumCardId,
    SkillCardId,
    SkillCheckType,
    SkillType
} from "../../src/models/game-data";
import { sandGameDoc } from "./sand";
import { Input } from "./inputs/input";

function makePlayers(characters: CharacterId[], president: CharacterId, arbitrator: CharacterId): SkillCheckPlayer[] {
    return characters.map((c, i) => ({
        userId: 'user' + i,
        characterId: c,
        president: president === c,
        arbitrator: arbitrator === c,
    }));
}

function executeAndVerifySkillCheck(acceptingProphecy: boolean,
                                    chosenPlayer: number,
                                    characters: CharacterId[],
                                    president: CharacterId,
                                    arbitrator: CharacterId,
                                    which: SkillCheckType,
                                    types: SkillType[],
                                    pass: number,
                                    partial: number,
                                    beforeSkillCheck: BeforeSkillCheckId[][],
                                    skills: SkillCardId[][],
                                    afterTotal: AfterSkillCheckTotalId[][],
                                    result: SkillCheckResult) {
    const players: SkillCheckPlayer[] = makePlayers(characters, president, arbitrator);

    const users = players.map(p => p.userId);
    const gameDoc = newGame('gameId', users);
    gameDoc.gameState.inputRequest = null;
    gameDoc.gameState.currentPlayer = 2;

    const skillCheckCtx =
        createSkillCheckCtx(players, acceptingProphecy, which, types, pass, partial, chosenPlayer);
    setupSkillCtx(gameDoc.gameState, skillCheckCtx);

    verifySkillCheckState(gameDoc, SkillCheckState.Setup);
    expect(gameDoc.gameState.inputRequest).toBeFalsy();

    expect(handleSkillCheck(gameDoc, null)).toBe(SkillCheckResult.Unknown);
    verifySkillCheckState(gameDoc, SkillCheckState.BeforeCollect);

    executeAndVerifySkillCheckStage(gameDoc, users,
        SkillCheckState.BeforeCollect, SkillCheckState.Collect,
        InputId.BeforeSkillCheckSelect, beforeSkillCheck);

    executeAndVerifySkillCheckStage(gameDoc, users,
        SkillCheckState.Collect, SkillCheckState.Scoring,
        InputId.SkillCardSelect, skills);

    expect(handleSkillCheck(gameDoc, null)).toBe(SkillCheckResult.Unknown);
    verifySkillCheckState(gameDoc, SkillCheckState.AfterScore);

    executeAndVerifySkillCheckStage(gameDoc, users,
        SkillCheckState.AfterScore, SkillCheckState.FinalScoring,
        InputId.AfterSkillCheckTotaled, afterTotal);

    expect(handleSkillCheck(gameDoc, null)).toBe(SkillCheckResult.Unknown);
    verifySkillCheckState(gameDoc, SkillCheckState.Discard);

    expect(skillCheckCtx.result).toBe(result);
}

/**
 * Call this when your expecting the handleSkillCheck call to produce an input request.
 *
 * Transition a skill check step while at the same time verifying that the step
 * is doing the right things.  We do this by calling handleSkillCheck twice, once
 * without an input and once with the provided input, verifying that the state in
 * between looks okay.
 *
 * The input does two things:
 *
 * - it acts as expectations against a generated input request from the first call
 * of handleSkillCheck
 *
 * - it acts as the actual input to pass to handleSkillCheck on the second call
 *
 * @param gameDoc
 * @param input
 * @param state1
 * @param state2
 * @param end
 */
function handleAndVerifySkillCheckStep(gameDoc: GameDocument,
                                       input: Input<any, any>,
                                       state1: SkillCheckState,
                                       state2: SkillCheckState,
                                       ctx: any = null) {
    // we ensure that we start off with no input request...
    expect(gameDoc.gameState.inputRequest).toBeFalsy();

    // This next call should make one, though
    handleSkillCheck(gameDoc, null);
    expect(gameDoc.gameState.inputRequest).toBeTruthy();
    expect(gameDoc.gameState.inputRequest.userId).toEqual(input.userId);
    expect(gameDoc.gameState.inputRequest.inputId).toBe(input.inputId);
    // expect(gameDoc.gameState.inputRequest.ctx).toBe(ctx);
    expect(gameDoc.gameState.skillCheckCtx.state).toBe(state1);

    // the game engine would normally do this...
    gameDoc.gameState.inputRequest = null;

    handleSkillCheck(gameDoc, input);
    expect(gameDoc.gameState.inputRequest).toBeFalsy();
    expect(gameDoc.gameState.skillCheckCtx.state).toBe(state2);
}

function verifySkillCheckState(game: GameDocument, state: SkillCheckState) {
    expect(game.gameState.skillCheckCtx.state).toBe(state);
}

function makeInput (user: string, inputId: InputId, data: any, ctx?: any): Input<any> {
    return {
        userId: user,
        inputId: inputId,
        data: data,
        ctx: ctx
    }
}

function executeAndVerifySkillCheckStage(gameDoc: GameDocument, users: string[],
                                         state1: SkillCheckState, state2: SkillCheckState,
                                         inputId: InputId, data: any[]) {
    for (let i = 0; i < users.length; i++) {
        const last = i === users.length - 1;
        handleAndVerifySkillCheckStep(gameDoc,
            makeInput(users[i], inputId, data[i]), state1,
            last ? state2 : state1);
    }
}

describe('Skill check scenarios', () => {
    it('should pass Administration', () => {
        executeAndVerifySkillCheck(false, 0,
            [CharacterId.LeeAdama, CharacterId.TomZarek, CharacterId.SaulTigh],
            CharacterId.TomZarek, undefined, SkillCheckType.Administration,
            [SkillType.Politics, SkillType.Leadership], 5, undefined,
            [[], [BeforeSkillCheckId.FILP_Increase], []],
            [[SkillCardId.DeclareEmergency5],
                [SkillCardId.InvestigativeCommittee5],
                [SkillCardId.MaximumFirepower3]],
            [[], [], []],
            SkillCheckResult.Pass);
    });

    it('should fail Administration', () => {
        executeAndVerifySkillCheck(false, 0,
            [CharacterId.LeeAdama, CharacterId.TomZarek, CharacterId.SaulTigh],
            CharacterId.TomZarek, undefined, SkillCheckType.Administration,
            [SkillType.Politics, SkillType.Leadership], 5, undefined,
            [[], [BeforeSkillCheckId.FILP_Increase], []],
            [[SkillCardId.DeclareEmergency3],
                [SkillCardId.InvestigativeCommittee5],
                [SkillCardId.MaximumFirepower5]],
            [[], [], []],
            SkillCheckResult.Fail);
    });

    it('should discard the quorum cards', () => {
        const game: GameDocument = newGame('gameId', ['c1', 'c2', 'c3']);
        sandGameDoc(game);

        const players = makePlayers(
            [CharacterId.SaulTigh, CharacterId.TomZarek, CharacterId.KaraThrace],
            CharacterId.TomZarek, CharacterId.KaraThrace);

        const skillCtx = createSkillCheckCtx(players, true,  SkillCheckType.Crisis,
            [SkillType.Tactics, SkillType.Engineering], 5);

        setupSkillCtx(game.gameState, skillCtx);
        skillCtx.beforeCheck = [[], [], [BeforeSkillCheckId.AssignArbitrator_Decrease]];

        handleDiscard(game);

        expect(game.gameState.discardedQuorumDeck.length).toBe(2);
        expect(game.gameState.discardedQuorumDeck).toContain(QuorumCardId.AssignArbitrator);
        expect(game.gameState.discardedQuorumDeck).toContain(QuorumCardId.AcceptProphecy);
    });

    it('should not discard the quorum cards', () => {
        const game: GameDocument = newGame('gameId', ['c1', 'c2', 'c3']);
        sandGameDoc(game);

        const players = makePlayers(
            [CharacterId.SaulTigh, CharacterId.TomZarek, CharacterId.KaraThrace],
            CharacterId.TomZarek, CharacterId.KaraThrace);

        const skillCtx = createSkillCheckCtx(players, false,  SkillCheckType.Crisis,
            [SkillType.Tactics, SkillType.Engineering], 5);

        setupSkillCtx(game.gameState, skillCtx);
        skillCtx.beforeCheck = [[], [], [BeforeSkillCheckId.AssignArbitrator_Decrease]];

        handleDiscard(game);

        expect(game.gameState.discardedQuorumDeck.length).toBe(1);
        expect(game.gameState.discardedQuorumDeck).toContain(QuorumCardId.AssignArbitrator);
    });

    it('should discard the skill cards', () => {
        const game: GameDocument = newGame('gameId', ['c1', 'c2', 'c3']);
        sandGameDoc(game);

        const players = makePlayers(
            [CharacterId.SaulTigh, CharacterId.TomZarek, CharacterId.KaraThrace],
            CharacterId.TomZarek, CharacterId.KaraThrace);

        const skillCtx = createSkillCheckCtx(players, false,  SkillCheckType.Crisis,
            [SkillType.Tactics, SkillType.Engineering], 5);
        setupSkillCtx(game.gameState, skillCtx);
        skillCtx.beforeCheck = [[BeforeSkillCheckId.ScientificResearch5], [BeforeSkillCheckId.InvestigativeCommittee4], []];
        skillCtx.afterTotal = [[AfterSkillCheckTotalId.DeclareEmergency5], [], []];
        skillCtx.skills = [[SkillCardId.DeclareEmergency3],
            [SkillCardId.ConsolidatePower1, SkillCardId.EvasiveManeuvers1],
            [SkillCardId.ExecutiveOrder1]];
        handleDiscard(game);

        expect(game.gameState.discardedSkillDecks['Engineering'].length).toBe(1);
        expect(game.gameState.discardedSkillDecks['Leadership'].length).toBe(3);
        expect(game.gameState.discardedSkillDecks['Politics'].length).toBe(2);
        expect(game.gameState.discardedSkillDecks['Piloting'].length).toBe(1);
        expect(game.gameState.discardedSkillDecks['Tactics'].length).toBe(0);
    });
});
