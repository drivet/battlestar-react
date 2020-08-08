import { GameDocument, newGame } from "./game";
import { createSkillCheckCtx, handleSkillCheck, setupSkillCtx, SkillCheckState } from "./skill-check";
import { Input, InputId } from "../../src/models/inputs";
import { CharacterId, SkillCheckType, SkillType } from "../../src/models/game-data";

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
                                       ctx: any = null,
                                       end: boolean = false) {
    // we ensure that we start off with no input request...
    expect(gameDoc.gameState.inputRequest).toBeFalsy();

    // This next call should make one, though
    expect(handleSkillCheck(gameDoc, null)).toBe(false);
    expect(gameDoc.gameState.inputRequest).toBeTruthy();
    expect(gameDoc.gameState.inputRequest.userId).toEqual(input.userId);
    expect(gameDoc.gameState.inputRequest.inputId).toBe(input.inputId);
    // expect(gameDoc.gameState.inputRequest.ctx).toBe(ctx);
    expect(gameDoc.gameState.skillCheckCtx.state).toBe(state1);

    // the game engine would normally do this...
    gameDoc.gameState.inputRequest = null;

    expect(handleSkillCheck(gameDoc, input)).toBe(end);
    expect(gameDoc.gameState.inputRequest).toBeFalsy();
    expect(gameDoc.gameState.skillCheckCtx.state).toBe(state2);
}

function verifySkillCheckState(game: GameDocument, state: SkillCheckState) {
    expect(game.gameState.skillCheckCtx.state).toBe(state);
}

function makeInput (user: string, inputId: InputId, data: any, ctx?: any) {
    return {
        userId: user,
        inputId: inputId,
        data: data,
        ctx: ctx
    }
}

describe('Skill check scenarios', () => {
    let gameDoc: GameDocument;
    beforeEach(() => {
        gameDoc = newGame('gameId', ['c1', 'c2', 'c3']);
        gameDoc.gameState.inputRequest = null;
        gameDoc.gameState.currentPlayer = 2;
    });

    it('should handle Administration', () => {
        const players = [
            {
                userId: 'u1',
                characterId: CharacterId.LeeAdama
            },
            {
                userId: 'u2',
                characterId: CharacterId.TomZarek,
                president: true
            }, {
                userId: 'u3',
                characterId: CharacterId.SaulTigh
            }
        ];
        const skillCheckCtx = createSkillCheckCtx(players,false,
            SkillCheckType.Administration,
            [SkillType.Politics, SkillType.Leadership], 5);
        skillCheckCtx.chosenPlayer = 0;
        setupSkillCtx(gameDoc.gameState, skillCheckCtx);

        verifySkillCheckState(gameDoc, SkillCheckState.Setup);
        expect(gameDoc.gameState.inputRequest).toBeFalsy();

        expect(handleSkillCheck(gameDoc, null)).toBe(false);
        verifySkillCheckState(gameDoc, SkillCheckState.BeforeCollect);

        handleAndVerifySkillCheckStep(gameDoc,
            makeInput('c1', InputId.BeforeSkillCheckSelect, []),
            SkillCheckState.BeforeCollect, SkillCheckState.BeforeCollect);

        handleAndVerifySkillCheckStep(gameDoc,
            makeInput('c2', InputId.BeforeSkillCheckSelect, []),
            SkillCheckState.BeforeCollect, SkillCheckState.BeforeCollect);

        handleAndVerifySkillCheckStep(gameDoc,
            makeInput('c3', InputId.BeforeSkillCheckSelect, []),
            SkillCheckState.BeforeCollect, SkillCheckState.Collect, null, true);
    });


});
