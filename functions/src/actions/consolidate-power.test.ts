import { GameDocument, getPlayer, newGame } from "../game";
import { ActionId, SkillCardId, SkillType } from "../../../src/models/game-data";
import { InputId } from "../../../src/models/inputs";
import { actionConsolidatePower } from "./consolidate-power";

describe('Consolidate Power Action', () => {
    let game: GameDocument;
    beforeEach(() => {
        game = newGame('gameId', ['c1', 'c2', 'c3']);
        game.gameState.currentAction = ActionId.ConsolidatePower1;
        game.gameState.skillDecks = {
            'Tactics': [SkillCardId.StrategicPlanning4],
            'Engineering': [SkillCardId.Repair2]
        }
        game.gameState.discardedSkillDecks = {'Politics': []};
        const player = getPlayer(game, 'c1');
        player.skillCards = [SkillCardId.ConsolidatePower1];
    });

    it('should request input', () => {
        actionConsolidatePower(game, null);
        const request = game.gameState.inputRequest;
        expect(request).toBeTruthy();
        expect(request.inputId).toBe(InputId.ActionConsolidatePowerSkillSelect);
        expect(request.userId).toBe('c1');
    });

    it('should proceed', () => {
        actionConsolidatePower(game,
            {inputId: InputId.ActionConsolidatePowerSkillSelect,
                userId: 'c1',
                data: [SkillType.Tactics, SkillType.Engineering]});
        const player = getPlayer(game, 'c1');
        expect(player.skillCards.length).toBe(2);
        expect(game.gameState.discardedSkillDecks['Politics'].length).toBe(1);
    });
});
