import { GameDocument, getCurrentPlayer } from "../game";
import { GameState, LocationId, SkillCard, SkillCardId, SkillCards, SkillType } from "../../../src/models/game-data";
import { Input, InputId } from "../../../src/models/inputs";
import { addCardToTop, removeCard } from "../deck";
import { getAvailableLocations, Movement } from "../locations";
import { makeRequest } from "../input";

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
        const skillCardId: SkillCardId = input.data.discardedSkill;
        const cardFromHand: SkillCard = SkillCards[SkillCardId[skillCardId]];
        addCardToTop(gameDoc.gameState.discardedSkillDecks[SkillType[cardFromHand.type]], skillCardId);
        removeCard(player.skillCards, skillCardId);
    }
    gameDoc.gameState.state = GameState.ActionSelection;
}
