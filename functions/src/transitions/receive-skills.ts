import { dealSkillCard, dealSkillCards, GameDocument, getCurrentPlayer } from "../game";
import { Input, InputId } from "../../../src/models/inputs";
import { addCard, addCards } from "../deck";
import { CharacterId, GameState, getCharacter, SkillType } from "../../../src/models/game-data";
import { makeRequest } from "../input";

export function handleReceiveSkills(gameDoc: GameDocument, input: Input<SkillType[]>) {
    const currentPlayer = getCurrentPlayer(gameDoc);
    if (hasMultiSkills(currentPlayer.characterId)) {
        handleReceiveMultiSkills(gameDoc, input);
    } else {
        handleReceiveStandardSkills(gameDoc);
    }
}

function handleReceiveMultiSkills(gameDoc: GameDocument, input: Input<SkillType[]>) {
    if (!input) {
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.ReceiveSkills, getCurrentPlayer(gameDoc).userId);
        return;
    }
    const player = gameDoc.players[input.userId];

    // validateSkills(currentPlayer.characterId, input.skills);

    // hand out the multi skills
    input.data.forEach(s => addCard(player.skillCards, dealSkillCard(gameDoc.gameState, s)));

    // hand out the standard skills
    handleReceiveStandardSkills(gameDoc);
}

function handleReceiveStandardSkills(gameDoc: GameDocument) {
    const currentPlayer = getCurrentPlayer(gameDoc);
    const c = getCharacter(currentPlayer.characterId);
    c.cardsDue.filter(cd => cd.skills.length === 1).forEach(cd => {
        const skill = cd.skills[0];
        const count = cd.count;
        addCards(currentPlayer.skillCards, dealSkillCards(gameDoc.gameState, skill, count));
    });
    gameDoc.gameState.state = GameState.Movement;
}

function hasMultiSkills(character: CharacterId): boolean {
    return getCharacter(character).cardsDue.some(cd => cd.skills.length > 1);
}
