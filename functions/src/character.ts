import { Character, CharacterId, Characters, CharacterType } from "../../src/models/game-data";

export interface CharacterPool {
    selectable: CharacterId[];
    unselectable: CharacterId[];
}

export function getCharacter(characterId: CharacterId): Character {
    return Characters[CharacterId[characterId]];
}

export function initCharacterPool(): CharacterPool {
    return {
        selectable: [CharacterId.TomZarek, CharacterId.LauraRoslin, CharacterId.SaulTigh,
            CharacterId.GalenTyrol, CharacterId.GaiusBaltar, CharacterId.KarlAgathon, CharacterId.LeeAdama,
            CharacterId.SharonValerii, CharacterId.WilliamAdama, CharacterId.KaraThrace],
        unselectable: []
    }
}

export function selectCharacter(pool: CharacterPool, selected: CharacterId): CharacterPool {
    const index = pool.selectable.indexOf(selected);
    if (index === -1) {
        throw new Error('invalid character selection');
    }

    const selectable = pool.selectable.splice(index, 1);
    return split(selectable.concat(pool.unselectable));
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
