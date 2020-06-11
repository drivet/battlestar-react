import { Character, CharacterId, Characters, CharacterType, LocationId, SkillType } from "./game-data";

export interface SkillCardChoice {
    skill: SkillType;
    count: number;
}

export type SkillCardChoices = SkillCardChoice[];

export interface SelectedCharacter {
    character: CharacterId;
    location: LocationId;
}

export function getCharacter(characterId: CharacterId) {
    return Characters[CharacterId[characterId]];
}

export class CharacterPool {
    selectable: Character[] = [Characters['TomZarek'], Characters['KarlAgathon'], Characters['SharonValerii'],
        Characters['LeeAdama'], Characters['WilliamAdama'], Characters['LauraRoslin'], Characters['GaiusBaltar'],
        Characters['KaraThrace'], Characters['GalenTyrol'], Characters['SaulTigh']];
    unselectable: Character[] = [];

    select(character: Character) {
        const index = this.find(character);
        if (index === -1) {
            throw new Error('invalid character selection');
        }

        this.selectable = this.selectable.splice(index, 1);
        this.split();
    }

    private find(character: Character): number {
        return this.selectable.indexOf(character);
    }

    private split() {
        const characters = this.selectable.concat(this.unselectable)
        const groups = groupByType(characters);
        const entries = Array.from(groups.entries());
        const max = Math.max(...(entries.map(e => e[1].length)));

        const selectable = [];
        const unselectable = [];
        entries.forEach(e => {
            if (e[1].length === max || e[0] === CharacterType.Support) {
                selectable.push(e[1]);
            } else {
                unselectable.push(e[1]);
            }
        });
        this.selectable = selectable;
        this.unselectable = unselectable;
    }
}

function groupByType(characters: Character[]): Map<CharacterType, Character[]> {
    const map = new Map<CharacterType, Character[]>();
    characters.forEach(c => {
        if (!map.has(c.type)) {
            map.set(c.type, []);
        }
        const v = map.get(c.type);
        v.push(c);
        map.set(c.type, v);
    });
    return map;
}
