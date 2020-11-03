import { addCard } from "../deck";
import { CharacterId, GameState, getCharacter, SkillType } from "../../../src/models/game-data";
import { nextPlayerAndChangeState } from "./defs";
import { dealSkillCard, GameDocument, getCurrentPlayer } from "../game";
import { InputId } from "../../../src/models/inputs";
import { Input, makeRequest } from "../inputs/input";

export function handleReceiveInitialSkills(gameDoc: GameDocument, input: Input<SkillType[]>) {
    if (!input) {
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.ReceiveInitialSkills, getCurrentPlayer(gameDoc).userId);
        return;
    }
    const player = gameDoc.players[input.userId];
    validateSkills(player.characterId, input.data);
    input.data.forEach(s => addCard(player.skillCards, dealSkillCard(gameDoc.gameState, s)));
    nextPlayerAndChangeState(gameDoc, GameState.SetupDestiny);
}

function validateSkills(character: CharacterId, skills: SkillType[]): boolean {
    const c = getCharacter(character);
    return skills.every(s => c.cardsDue.map(d => d.skills)
        .some((ds: SkillType[]) => ds.indexOf(s) !== -1));
}
