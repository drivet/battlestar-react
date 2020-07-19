import { discardQuorumCard, GameDocument, getCurrentPlayer } from "../game";
import { Input, InputId } from "../../../src/models/inputs";
import { QuorumCardId } from "../../../src/models/game-data";
import { makeRequest } from "../input";
import { roll } from "../roll";
import { finishAction } from "../transitions/action";

export function actionEncourageMutiny(gameDoc: GameDocument, input: Input<string>) {
    const player = getCurrentPlayer(gameDoc);
    if (!input) {
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.ActionEncourageMutinyPlayerSelect, player.userId);
        return;
    }
    const players = Object.values(gameDoc.players);
    const chosenPlayer = players.find(p => p.userId === input.data);
    if (chosenPlayer.admiral) {
        throw new Error('Invalid player, must not be admiral');
    }
    const die = roll();
    if (die >= 3) {
        chosenPlayer.admiral = true;
        players.find(p => p.admiral).admiral = false;
    } else {
        console.log('die was less than 3 ' + die);
        gameDoc.gameState.morale--;
    }
    discardQuorumCard(gameDoc.gameState, player, QuorumCardId.EncourageMutiny);
    finishAction(gameDoc);
}
