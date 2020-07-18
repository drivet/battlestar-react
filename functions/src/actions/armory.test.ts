import { GameDocument, newGame } from "../game";
import * as rollMod from "../roll";
import { actionArmory } from "./armory";

describe('Armory Action', () => {
    let game: GameDocument;
    beforeEach(() => {
        game = newGame('gameId', ['c1', 'c2', 'c3']);
    });

    it('should destroy centurions if die >= 7', () => {
        game.gameState.boardedCenturions = [1, 2];
        jest.spyOn(rollMod, 'roll').mockReturnValue(7);

        actionArmory(game);
        expect(game.gameState.boardedCenturions).toEqual([1, 1]);
    });

    it('should do nothing if die < 7', () => {
        game.gameState.boardedCenturions = [1, 2];
        jest.spyOn(rollMod, 'roll').mockReturnValue(6);

        actionArmory(game);
        expect(game.gameState.boardedCenturions).toEqual([1, 2]);
    });

    it('should remove trailing zeros', () => {
        game.gameState.boardedCenturions = [1, 1];
        jest.spyOn(rollMod, 'roll').mockReturnValue(7);

        actionArmory(game);
        expect(game.gameState.boardedCenturions).toEqual([1]);
    });
});

