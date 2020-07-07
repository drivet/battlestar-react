import { GameDocument, getCurrentPlayer, roll } from "../game";
import { Input, InputId } from "../../../src/models/inputs";
import { CharacterId, GameState } from "../../../src/models/game-data";
import { makeRequest } from "../input";

export function actionEncourageMutiny(gameDoc: GameDocument, input: Input<CharacterId>) {
    if (!input) {
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.ActionEncourageMutinyPlayerSelect, getCurrentPlayer(gameDoc).userId);
        return;
    }
    const players = Object.values(gameDoc.players);
    const chosenPlayer = players.find(p => p.characterId === input.data);
    if (chosenPlayer.admiral) {
        throw new Error('Invalid player, must not be admiral');
    }
    const die = roll();
    if (die >= 3) {
        chosenPlayer.admiral = true;
        players.find(p => p.admiral).admiral = false;
    } else {
        gameDoc.gameState.morale--;
    }
    gameDoc.gameState.state = GameState.CrisisDrawn;
}
