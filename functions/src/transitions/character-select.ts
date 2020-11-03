import { CharacterId, CharacterType, GameState, getCharacter } from "../../../src/models/game-data";
import { GameDocument, getCurrentPlayer } from "../game";
import { CharacterPool } from "../../../src/models/character";
import { InputId } from "../../../src/models/inputs";
import { Input, makeRequest } from "../inputs/input";
import { nextPlayerAndChangeState } from "./defs";

export function handleSelectCharacter(gameDoc: GameDocument, input: Input<CharacterId, CharacterPool>) {
    if (!input) {
        gameDoc.gameState.inputRequest =
            makeRequest(InputId.SelectCharacter, getCurrentPlayer(gameDoc).userId, gameDoc.gameState.characterPool);
        return;
    }
    const player = gameDoc.players[input.userId];
    player.characterId = input.data;
    gameDoc.gameState.characterPool = selectCharacter(input.ctx, input.data);
    nextPlayerAndChangeState(gameDoc, GameState.CharacterSetup);
}

function selectCharacter(pool: CharacterPool, selected: CharacterId): CharacterPool {
    const index = pool.selectable.indexOf(selected);
    if (index === -1) {
        throw new Error('invalid character selection');
    }

    pool.selectable.splice(index, 1);
    return split(pool.selectable.concat(pool.unselectable ? pool.unselectable : []));
}

function split(characters: CharacterId[]): CharacterPool {
    const groups: Map<CharacterType, CharacterId[]> = groupByType(characters);
    const entries = Array.from(groups.entries());
    const max = Math.max(...(entries.map(e => e[1].length)));

    const selectable: CharacterId[] = [];
    const unselectable: CharacterId[] = [];
    entries.forEach(e => {
        const type: CharacterType = e[0];
        const charList: CharacterId[] = e[1];
        if (charList.length === max || type === CharacterType.Support) {
            selectable.push(...charList);
        } else {
            unselectable.push(...charList);
        }
    });
    return {
        selectable: selectable,
        unselectable: unselectable
    }
}

function groupByType(characters: CharacterId[]): Map<CharacterType, CharacterId[]> {
    const map = new Map<CharacterType, CharacterId[]>();
    characters.forEach(c => {
        const type = getCharacter(c).type;
        if (!map.has(type)) {
            map.set(type, []);
        }
        const v = map.get(type);
        v.push(c);
        map.set(type, v);
    });
    return map;
}
