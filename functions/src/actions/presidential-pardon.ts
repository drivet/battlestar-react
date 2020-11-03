import { GameDocument, getCurrentPlayer } from "../game";
import { InputId } from "../../../src/models/inputs";
import { Input, makeRequest } from "../inputs/input";
import { LocationId } from "../../../src/models/game-data";
import { finishAction } from "../transitions/action";

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
    finishAction(gameDoc);
}
