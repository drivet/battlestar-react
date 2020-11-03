import { GameDocument, newGame } from "./game";
import { DicePlayer, handleRoll, RollState, setupRollCtx } from "./roll-manager";
import { BeforeRollId, CharacterId } from "../../src/models/game-data";
import { InputId } from "../../src/models/inputs";
import { Input } from "./inputs/input";

describe('Dice roll scenarios', () => {
    it('should perform a simple roll', () => {
        executeAndVerifyRoll(
            [CharacterId.TomZarek, CharacterId.SaulTigh, CharacterId.GalenTyrol],
            [[], [], []]);
    });
});

function executeAndVerifyRoll(characters: CharacterId[], before: BeforeRollId[][]) {
    const players: DicePlayer[] = makePlayers(characters);

    const users = players.map(p => p.userId);
    const gameDoc = newGame('gameId', users);
    gameDoc.gameState.inputRequest = null;
    gameDoc.gameState.currentPlayer = 2;

    setupRollCtx(gameDoc.gameState, players, 2);
    const rollCtx = gameDoc.gameState.rollCtx;

    executeAndVerifyRollStage(gameDoc, rollCtx.allPlayers.map(p => p.userId),
        RollState.BeforeRoll, RollState.Discard, InputId.BeforeRollSelect, before);

    expect(rollCtx.result).toBeGreaterThanOrEqual(1);
    expect(rollCtx.result).toBeLessThanOrEqual(8);
}

function executeAndVerifyRollStage(gameDoc: GameDocument, users: string[],
                                   state1: RollState, state2: RollState,
                                   inputId: InputId, data: any[]) {
    for (let i = 0; i < users.length; i++) {
        const last = i === users.length - 1;
        handleAndVerifyRollStep(gameDoc,
            makeInput(users[i], inputId, data[i]), state1, last ? state2 : state1);
    }
}

function handleAndVerifyRollStep(gameDoc: GameDocument,
                                 input: Input<any, any>,
                                 state1: RollState,
                                 state2: RollState,
                                 ctx: any = null) {
    // we ensure that we start off with no input request...
    expect(gameDoc.gameState.inputRequest).toBeFalsy();

    // This next call should make one, though
    handleRoll(gameDoc, null);
    expect(gameDoc.gameState.inputRequest).toBeTruthy();
    expect(gameDoc.gameState.inputRequest.userId).toEqual(input.userId);
    expect(gameDoc.gameState.inputRequest.inputId).toBe(input.inputId);
    // expect(gameDoc.gameState.inputRequest.ctx).toBe(ctx);
    expect(gameDoc.gameState.rollCtx.state).toBe(state1);

    // the game engine would normally do this...
    gameDoc.gameState.inputRequest = null;

    handleRoll(gameDoc, input);
    expect(gameDoc.gameState.inputRequest).toBeFalsy();
    expect(gameDoc.gameState.rollCtx.state).toBe(state2);
}

function makePlayers(characters: CharacterId[]): DicePlayer[] {
    return characters.map((c, i) => ({
        userId: 'user' + i,
        characterId: c,
    }));
}

function makeInput (user: string, inputId: InputId, data: any, ctx?: any): Input<any> {
    return {
        userId: user,
        inputId: inputId,
        data: data,
        ctx: ctx
    }
}
