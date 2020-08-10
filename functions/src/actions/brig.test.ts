import { InputId } from "../../../src/models/inputs";
import { GameDocument, getPlayer, newGame } from "../game";
import * as skillMod from "../skill-check";
import { SkillCheckResult } from "../skill-check";
import { actionBrig, BrigState } from "./brig";
import { LocationId } from "../../../src/models/game-data";
import { makeInput } from "../test-utils";

describe('Brig Action', () => {
    let game: GameDocument;
    beforeEach(() => {
        game = newGame('gameId', ['c1', 'c2', 'c3']);
    });

    it('should release from brig', () => {
        jest.spyOn(skillMod, 'handleSkillCheck').mockReturnValue(SkillCheckResult.Pass);
        actionBrig(game, null);
        expect(game.gameState.actionCtx.state).toBe(BrigState.ChooseLocation);
    });

    it('should not release from brig', () => {
        jest.spyOn(skillMod, 'handleSkillCheck').mockReturnValue(SkillCheckResult.Fail);
        actionBrig(game, null);
        expect(game.gameState.actionCtx).toBeFalsy();
    });

    it('should request location', () => {
        game.gameState.actionCtx = {
            state: BrigState.ChooseLocation,
        }

        actionBrig(game, null);
        const request = game.gameState.inputRequest;
        expect(request).toBeTruthy();
        expect(request.inputId).toBe(InputId.LocationSelect);
        expect(request.userId).toBe('c1');

        actionBrig(game, makeInput('c1', InputId.LocationSelect, LocationId.Command));
        expect(getPlayer(game,'c1').location).toBe(LocationId.Command);
    });
});
