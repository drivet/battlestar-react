import { FullPlayer, GameDocument } from "../game";
import { CharacterId, getCharacter, SkillType } from "../../../src/models/game-data";
import { InputId, InputRequest, InputResponse } from "../../../src/models/inputs";
import { CharacterPool } from "../../../src/models/character";
import { getAvailableLocations, Movement } from "../locations";
import { requiresDiscard } from "../../../src/models/location";

export function getBotResponse(game: GameDocument, player: FullPlayer): InputResponse<any> {
    const inputId = game.gameState.inputRequest.inputId;
    const botFn = getBotFn(inputId);
    return botFn(game, player);
}

function getBotFn(inputId: InputId) {
    if (inputId === InputId.SelectCharacter) {
        return selectCharacter;
    } else if (inputId === InputId.SelectInitialLocation) {
        return apolloSetup;
    } else if (inputId === InputId.ReceiveInitialSkills) {
        return receiveInitialSkills;
    } else if (inputId === InputId.ReceiveSkills) {
        return botMultiSkills;
    } else if (inputId === InputId.Movement) {
        return createBotMoveSelectionInput;
    }
}

function selectCharacter(game: GameDocument, player: FullPlayer): InputResponse<CharacterId> {
    const req = game.gameState.inputRequest as InputRequest<CharacterPool>;
    return {
        inputId: InputId.SelectCharacter,
        userId: req.userId,
        data: req.ctx.selectable[0]
    }
}

/**
 * Choose left or right launch pad for initial location, true for left, false for right.
 */
function apolloSetup(game: GameDocument, player: FullPlayer): InputResponse<boolean> {
    return {
        inputId: InputId.SelectInitialLocation,
        userId: player.userId,
        data: true
    }
}

function receiveInitialSkills(game: GameDocument, player: FullPlayer): InputResponse<SkillType[]> {
    function botInitialSkills(character: CharacterId): SkillType[] {
        const c = getCharacter(character);
        const skill = c.cardsDue[0].skills[0];
        return [skill, skill, skill];
    }

    return {
        inputId: InputId.ReceiveInitialSkills,
        userId: player.userId,
        data: botInitialSkills(player.characterId)
    }
}

function botMultiSkills(game: GameDocument, player: FullPlayer): InputResponse<SkillType[]> {
    const c = getCharacter(player.characterId);
    const skills: SkillType[] = [];
    c.cardsDue.forEach(cd => {
        if (cd.skills.length > 1) {
            for (let i = 0; i < cd.count; i++) {
                skills.push(cd.skills[0]);
            }
        }
    });
    return {
        inputId: InputId.ReceiveSkills,
        userId: player.userId,
        data: skills
    }
}

function createBotMoveSelectionInput(game: GameDocument, player: FullPlayer): InputResponse<Movement> {
    const availableLocations = getAvailableLocations(player);
    const location = availableLocations[0];
    return {
        userId: player.userId,
        inputId: InputId.Movement,
        data: {
            location: location,
            discardedSkill: requiresDiscard(location, player) ? player.skillCards[0] : undefined
        }
    }
}
