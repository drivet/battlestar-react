import { discardQuorumCard, GameDocument, getCurrentPlayer, removeQuorumCard} from "../game";
import { QuorumCardId } from "../../../src/models/game-data";
import { roll } from "../roll";

export function actionInspirationalSpeech(gameDoc: GameDocument) {
    const die = roll();
    const player = getCurrentPlayer(gameDoc);
    if (die >= 6) {
        gameDoc.gameState.food++;
        removeQuorumCard(gameDoc.gameState, player, QuorumCardId.InspirationalSpeech);
    } else {
        discardQuorumCard(gameDoc.gameState, player, QuorumCardId.InspirationalSpeech);
    }
}
