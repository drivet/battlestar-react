import { distributeTitles, GameDocument, setupDecks, setupLoyalty } from "../game";
import { addCards, deal } from "../deck";
import { GameState } from "../../../src/models/game-data";

export function setupDecksAndTitles(gameDoc: GameDocument) {
    const players = Object.values(gameDoc.players)

    distributeTitles(players);
    setupLoyalty(gameDoc);
    setupDecks(gameDoc.gameState);

    const president = players.find(p => p.president);
    addCards(president.quorumHand, deal(gameDoc.gameState.quorumDeck, 2));

    gameDoc.gameState.state = GameState.InitialSkillSelection;

    // first player doesn't get initial skills
    gameDoc.gameState.currentPlayer = 1;
}
