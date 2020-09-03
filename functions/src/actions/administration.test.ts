import { InputId } from "../../../src/models/inputs";
import { GameDocument, getPlayer, newGame } from "../game";
import * as skillMod from "../skill-check";
import { SkillCheckResult } from "../skill-check";
import { actionAdministration, AdminState } from "./administration";
import { makeInput } from "../test-utils";

describe('Administration Action', () => {
    let game: GameDocument;
    beforeEach(() => {
        game = newGame('gameId', ['c1', 'c2', 'c3']);
        getPlayer(game, 'c1').president = true;
    });

    it('should request chosen player', () => {
        actionAdministration(game, null);
        const request = game.gameState.inputRequest;
        expect(request).toBeTruthy();
        expect(request.inputId).toBe(InputId.PlayerSelect);
        expect(request.userId).toBe('c1');

        actionAdministration(game, makeInput('c1', InputId.PlayerSelect, 'c2'));
        expect(game.gameState.actionCtx.chosenPlayer).toBe('c2');
        expect(game.gameState.actionCtx.state).toBe(AdminState.SkillCheck);
    });

    it('should choose the vice president', () => {
        getPlayer(game, 'c3').vicePresident = true;
        actionAdministration(game, null);
        expect(game.gameState.actionCtx.chosenPlayer).toBe('c3');
        expect(game.gameState.actionCtx.state).toBe(AdminState.SkillCheck);
    });

    it('should pass presidency', () => {
        game.gameState.actionCtx = {
            state: AdminState.SkillCheck,
            chosenPlayer: 'c2'
        }

        jest.spyOn(skillMod, 'handleSkillCheck').mockReturnValue(SkillCheckResult.Pass);

        actionAdministration(game, null);
        expect(getPlayer(game,'c2').president).toBe(true);
    });

    it('should not pass presidency', () => {
        game.gameState.actionCtx = {
            state: AdminState.SkillCheck,
            chosenPlayer: getPlayer(game, 'c2')
        }

        jest.spyOn(skillMod, 'handleSkillCheck').mockReturnValue(SkillCheckResult.Fail);

        actionAdministration(game, null);
        expect(getPlayer(game,'c2').president).toBe(false);
    });
});
