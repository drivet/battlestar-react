import { GameDocument, getPlayer, newGame } from "../game";
import { actionAdmiralsQuarters, AdmiralsQuartersState } from "./admirals-quarters";
import { InputId } from "../../../src/models/inputs";
import { LocationId, SkillCardId, SkillCards, SkillType } from "../../../src/models/game-data";

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
    });

    it('should proceed with skill check', () => {
        actionAdmiralsQuarters(game,
            {inputId: InputId.PlayerSelect, userId: 'c1', data: 'c2'});
        expect(game.gameState.actionCtx.chosenPlayer.userId).toBe('c2');
        expect(game.gameState.actionCtx.state).toBe(AdmiralsQuartersState.CollectSkills);
        expect(game.gameState.skillCheckCtx).toBeTruthy();
        expect(game.gameState.skillCheckCtx.types)
            .toEqual([SkillType.Leadership, SkillType.Tactics]);
    });

    it('should ask for skill cards', () => {
        game.gameState.actionCtx = {
            state: AdmiralsQuartersState.CollectSkills,
            chosenPlayer: getPlayer(game, 'c2')
        }

        game.gameState.skillCheckCtx = {
            skills: [],
            skillPlayer: 0,
            types: [SkillType.Leadership, SkillType.Tactics],
            score: 0
        }

        actionAdmiralsQuarters(game,null);
        const request = game.gameState.inputRequest;
        expect(request).toBeTruthy();
        expect(request.inputId).toBe(InputId.SkillCardSelect);
        expect(request.userId).toBe('c1');
    });

    it('should continue to ask for skill cards', () => {
        game.gameState.actionCtx = {
            state: AdmiralsQuartersState.CollectSkills,
            chosenPlayer: getPlayer(game, 'c2')
        }

        const skillCards = [
            [
                SkillCards[SkillCardId[SkillCardId.ConsolidatePower1]],
                SkillCards[SkillCardId[SkillCardId.Repair2]]
            ]
        ];
        game.gameState.skillCheckCtx = {
            skills: skillCards,
            skillPlayer: 1,
            types: [SkillType.Leadership, SkillType.Tactics],
            score: 0
        }

        actionAdmiralsQuarters(game,null);
        const request = game.gameState.inputRequest;
        expect(request).toBeTruthy();
        expect(request.inputId).toBe(InputId.SkillCardSelect);
        expect(request.userId).toBe('c2');
    });

    it('should send to brig', () => {
        game.gameState.actionCtx = {
            state: AdmiralsQuartersState.CollectSkills,
            chosenPlayer: getPlayer(game, 'c2')
        }

        const skillCards = [
            [SkillCardId.ExecutiveOrder2],
            [SkillCardId.DeclareEmergency5]
        ];
        game.gameState.skillCheckCtx = {
            skills: skillCards,
            skillPlayer: 0, // does not matter
            types: [SkillType.Leadership, SkillType.Tactics],
            score: 7
        }

        actionAdmiralsQuarters(game,
            {inputId: InputId.SkillCardSelect, userId: 'c1', data: [SkillCardId.DeclareEmergency4]});
        expect(getPlayer(game,'c2').location).toBe(LocationId.Brig);
    });

    it('should not send to brig', () => {
        game.gameState.actionCtx = {
            state: AdmiralsQuartersState.CollectSkills,
            chosenPlayer: getPlayer(game, 'c2')
        }

        const skillCards = [
            [SkillCardId.ExecutiveOrder1],
            [SkillCardId.ExecutiveOrder1]
        ];
        game.gameState.skillCheckCtx = {
            skills: skillCards,
            skillPlayer: 0, // does not matter
            types: [SkillType.Leadership, SkillType.Tactics],
            score: 7
        }

        actionAdmiralsQuarters(game,
            {inputId: InputId.SkillCardSelect, userId: 'c1', data: [SkillCardId.DeclareEmergency4]});
        expect(getPlayer(game,'c2').location).not.toBe(LocationId.Brig);
    });
});
