import { CharacterType, getCharacter, LocationId, SkillCard } from "../../src/models/game-data";
import { isSpace } from "../../src/models/location";
import { FullPlayer } from "./game";

export interface Movement {
    location: LocationId;
    discardedSkill?: SkillCard;
}

export function getAvailableLocations(player: FullPlayer): LocationId[] {
    if (player.revealedCylon) {
        return [LocationId.Caprica, LocationId.ResurrectionShip,
            LocationId.HumanFleet, LocationId.CylonFleet];
    }
    const locations = [
        LocationId.PressRoom,
        LocationId.PresidentsOffice,
        LocationId.Administration,
        LocationId.AdmiralsQuarters,
        LocationId.Armory,
        LocationId.ResearchLab,
        LocationId.HangarDeck,
        LocationId.Command,
        LocationId.Communications,
        LocationId.WeaponsControl,
        LocationId.FtlControl
    ];
    const c = getCharacter(player.characterId);
    if (c.type === CharacterType.Pilot) {
        if (!isSpace(player.location)) {
            locations.push(...[LocationId.BackBelow, LocationId.FrontBelow]);
        } else {
            locations.push(...getAdjacentLocations(player.location));
        }
    }
    return locations;
}

function getAdjacentLocations(location: LocationId): LocationId[] {
    if (!isSpace(location)) {
        console.log('location is not in space, no adjacent location: ' + location);
        return null;
    }

    if (location === LocationId.Front) {
        return [LocationId.FrontBelow, LocationId.FrontAbove];
    } else if (location === LocationId.Back) {
        return [LocationId.BackBelow, LocationId.BackAbove];
    } else if (location === LocationId.FrontAbove) {
        return [LocationId.Front, LocationId.BackAbove];
    } else if (location === LocationId.FrontBelow) {
        return [LocationId.Front, LocationId.BackBelow];
    } else if (location === LocationId.BackAbove) {
        return [LocationId.FrontAbove, LocationId.Back];
    } else if (location === LocationId.BackBelow) {
        return [LocationId.FrontBelow, LocationId.Back];
    } else {
        // should not happen
        console.warn('unknown location for adjacent check: ' + location);
        return null;
    }
}