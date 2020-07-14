import { GameDocument, getCurrentPlayer } from "../game";
import { Input, InputId } from "../../../src/models/inputs";
import { makeRequest } from "../input";
import { GameState, LocationId } from "../../../src/models/game-data";

export interface PresidentialPardonInput {
    userId: string;
    location: LocationId;
}

export function actionPresidentialPardon(gameDoc: GameDocument, input: Input<PresidentialPardonInput>) {
    const player = getCurrentPlayer(gameDoc);
    if (!input) {
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.ActionPresidentialPardon, player.userId);
        return;
    }
    const chosenPlayer = Object.values(gameDoc.players).find(p => p.userId === input.data.userId);
    if (chosenPlayer.location !== LocationId.Brig) {
        throw new Error('player must be in the brig');
    }
    chosenPlayer.location = input.data.location;
    gameDoc.gameState.state = GameState.CrisisDrawn;
}
