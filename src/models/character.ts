import { LocationId } from "./locations";
import { SkillType } from "./skills";

export enum CharacterId {
    LeeAdama, GaiusBaltar, GalenTyrol, SaulTigh,
    LauraRoslin, TomZarek, KaraThrace, SharonValerii,
    WilliamAdama, KarlAgathon
}

export enum CharacterType {
    Pilot, Military, Political, Support
}

export interface SkillCardDue {
    skills: SkillType[];
    count: number;
}

export interface SkillCardChoice {
    skill: SkillType;
    count: number;
}

export type SkillCardChoices = SkillCardChoice[];

export interface Character {
    id: CharacterId;
    type: CharacterType;
    name: string;
    startLocation?: LocationId;
    cardsDue: SkillCardDue[];
}

type CharacterKeys = keyof typeof CharacterId;

export const Characters: {[key in CharacterKeys]: Character} = {
    'KaraThrace': {
        id: CharacterId.KaraThrace,
        name: 'Kara "Starbuck" Thrace',
        type: CharacterType.Pilot,
        startLocation: LocationId.HangarDeck,
        cardsDue: [
            {
                skills: [SkillType.Tactics],
                count: 2
            },
            {
                skills: [SkillType.Piloting],
                count: 2
            },
            {
                skills: [SkillType.Leadership, SkillType.Engineering],
                count: 1
            }
        ]
    },
    'WilliamAdama': {
        id: CharacterId.WilliamAdama,
        name: "William Adama",
        type: CharacterType.Military,
        startLocation: LocationId.AdmiralsQuarters,
        cardsDue: [
            {
                skills: [SkillType.Leadership],
                count: 3
            },
            {
                skills: [SkillType.Tactics],
                count: 2
            }
        ]
    },
    'SharonValerii': {
        id: CharacterId.SharonValerii,
        name: 'Sharon, "Boomer" Valeri',
        type: CharacterType.Pilot,
        startLocation: LocationId.Armory,
        cardsDue: [
            {
                skills: [SkillType.Tactics],
                count: 2
            },
            {
                skills: [SkillType.Piloting],
                count: 2
            },
            {
                skills: [SkillType.Engineering],
                count: 1
            }
        ]
    },
    'LeeAdama': {
        id: CharacterId.LeeAdama,
        name: 'Lee "Apollo" Adama',
        type: CharacterType.Pilot,
        cardsDue: [
            {
                skills: [SkillType.Tactics],
                count: 1
            },
            {
                skills: [SkillType.Piloting],
                count: 2
            },
            {
                skills: [SkillType.Leadership, SkillType.Politics],
                count: 2
            }
        ]
    },
    'KarlAgathon': {
        id: CharacterId.KarlAgathon,
        name: 'Karl "Helo" Agathon',
        type: CharacterType.Military,
        cardsDue: [
            {
                skills: [SkillType.Leadership],
                count: 2
            },
            {
                skills: [SkillType.Tactics],
                count: 2
            },
            {
                skills: [SkillType.Piloting],
                count: 1
            }
        ]
    },
    'GaiusBaltar': {
        id: CharacterId.GaiusBaltar,
        name: "Gaius Baltar",
        type: CharacterType.Political,
        startLocation: LocationId.ResearchLab,
        cardsDue: [
            {
                skills: [SkillType.Politics],
                count: 2
            },
            {
                skills: [SkillType.Leadership],
                count: 1
            },
            {
                skills: [SkillType.Engineering],
                count: 1
            }
        ]
    },
    'GalenTyrol': {
        id: CharacterId.GalenTyrol,
        name: '"Chief" Galen Tyrol',
        type: CharacterType.Support,
        startLocation: LocationId.HangarDeck,
        cardsDue: [
            {
                skills: [SkillType.Politics],
                count: 1
            },
            {
                skills: [SkillType.Leadership],
                count: 2
            },
            {
                skills: [SkillType.Engineering],
                count: 2
            }
        ]
    },
    'SaulTigh': {
        id: CharacterId.SaulTigh,
        name: "Saul Tigh",
        type: CharacterType.Military,
        startLocation: LocationId.Command,
        cardsDue: [
            {
                skills: [SkillType.Leadership],
                count: 2
            },
            {
                skills: [SkillType.Tactics],
                count: 3
            }
        ]

    },

    'LauraRoslin':{
        id: CharacterId.LauraRoslin,
        name: "Laura Roslin",
        type: CharacterType.Political,
        startLocation: LocationId.PresidentsOffice,
        cardsDue: [
            {
                skills: [SkillType.Politics],
                count: 3
            },
            {
                skills: [SkillType.Leadership],
                count: 2
            }
        ]
    },
    'TomZarek': {
        id: CharacterId.TomZarek,
        name: "Tom Zarek",
        type: CharacterType.Political,
        startLocation: LocationId.Administration,
        cardsDue: [
            {
                skills: [SkillType.Politics],
                count: 2
            },
            {
                skills: [SkillType.Leadership],
                count: 2
            },
            {
                skills: [SkillType.Tactics],
                count: 1
            }
        ]
    }
}

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
