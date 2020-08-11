import { GameDocument, getPlayer, newGame } from "../game";
import { LocationId, QuorumCardId } from "../../../src/models/game-data";
import { actionArrestOrder } from "./arrest-order";
import { InputId } from "../../../src/models/inputs";
import { sandGameDoc } from "../sand";

describe('Arrest order Action', () => {
    let game: GameDocument;
    beforeEach(() => {
        game = newGame('gameId', ['c1', 'c2', 'c3']);
        sandGameDoc(game);
        const player = getPlayer(game, 'c1');
        player.quorumHand = [QuorumCardId.ArrestOrder];
    });

    it('should request input', () => {
        actionArrestOrder(game, null);
        const request = game.gameState.inputRequest;
        expect(request).toBeTruthy();
        expect(request.inputId).toBe(InputId.ActionArrestOrderPlayerSelect);
        expect(request.userId).toBe('c1');
    });

    it('should proceed with arrest', () => {
        actionArrestOrder(game,
            {inputId: InputId.ActionArrestOrderPlayerSelect, userId: 'c1', data: 'c2'});
        const chosen = getPlayer(game, 'c2');
        expect(chosen.location).toBe(LocationId.Brig);
        expect(game.gameState.discardedQuorumDeck).toEqual([QuorumCardId.ArrestOrder]);
        expect(getPlayer(game, 'c1').quorumHand).toEqual([]);
    });
});
