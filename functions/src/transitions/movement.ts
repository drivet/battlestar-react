import { discardSkillCardFromHand, GameDocument, getCurrentPlayer } from "../game";
import { GameState, LocationId } from "../../../src/models/game-data";
import { InputId } from "../../../src/models/inputs";
import { getAvailableLocations, Movement } from "../locations";
import { Input, makeRequest } from "../inputs/input";

export function handleMovement(gameDoc: GameDocument, input: Input<Movement, LocationId[]>) {
    if (!input) {
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.Movement, getCurrentPlayer(gameDoc).userId,
                getAvailableLocations(getCurrentPlayer(gameDoc)));
        return;
    }
    const player = gameDoc.players[input.userId];
    player.location = input.data.location;
    if (input.data.discardedSkill) {
        discardSkillCardFromHand(gameDoc.gameState, player, input.data.discardedSkill);
    }
    gameDoc.gameState.state = GameState.ActionSelection;
}
