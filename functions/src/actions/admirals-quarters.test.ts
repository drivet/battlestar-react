import { GameDocument, getPlayer, newGame } from "../game";
import { actionAdmiralsQuarters, AdmiralsQuartersState } from "./admirals-quarters";
import { InputId } from "../../../src/models/inputs";
import { LocationId } from "../../../src/models/game-data";
import * as skillMod from "../skill-check";
import { SkillCheckResult } from "../skill-check";
import { makeInput } from "../test-utils";

describe('Admirals Quarters Action', () => {
    let game: GameDocument;
    beforeEach(() => {
        game = newGame('gameId', ['c1', 'c2', 'c3']);
    });

    it('should request chosen player', () => {
        actionAdmiralsQuarters(game, null);
        const request = game.gameState.inputRequest;
        expect(request).toBeTruthy();
        expect(request.inputId).toBe(InputId.PlayerSelect);
        expect(request.userId).toBe('c1');

        actionAdmiralsQuarters(game, makeInput('c1', InputId.PlayerSelect, 'c2'));
        expect(game.gameState.actionCtx.chosenPlayer.userId).toBe('c2');
        expect(game.gameState.actionCtx.state).toBe(AdmiralsQuartersState.SkillCheck);
    });

    it('should send to brig', () => {
        game.gameState.actionCtx = {
            state: AdmiralsQuartersState.SkillCheck,
            chosenPlayer: getPlayer(game, 'c2')
        }

        jest.spyOn(skillMod, 'handleSkillCheck').mockReturnValue(SkillCheckResult.Pass);

        actionAdmiralsQuarters(game, null);
        expect(getPlayer(game,'c2').location).toBe(LocationId.Brig);
    });

    it('should not send to brig', () => {
        game.gameState.actionCtx = {
            state: AdmiralsQuartersState.SkillCheck,
            chosenPlayer: getPlayer(game, 'c2')
        }

        jest.spyOn(skillMod, 'handleSkillCheck').mockReturnValue(SkillCheckResult.Fail);

        actionAdmiralsQuarters(game, null);
        expect(getPlayer(game,'c2').location).not.toBe(LocationId.Brig);
    });
});
