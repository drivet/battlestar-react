import { CharacterId } from "./game-data";

export interface CharacterPool {
    selectable: CharacterId[];
    unselectable: CharacterId[];
}

export function initCharacterPool(): CharacterPool {
    return {
        selectable: [CharacterId.TomZarek, CharacterId.LauraRoslin, CharacterId.SaulTigh,
            CharacterId.GalenTyrol, CharacterId.GaiusBaltar, CharacterId.KarlAgathon, CharacterId.LeeAdama,
            CharacterId.SharonValerii, CharacterId.WilliamAdama, CharacterId.KaraThrace],
        unselectable: []
    }
}
