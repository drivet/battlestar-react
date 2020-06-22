import { LocationId } from "./game-data";
import { FullPlayer } from "../../functions/src/game";

export function isSpace(location: LocationId): boolean {
    return location in [LocationId.Back, LocationId.Front,
        LocationId.FrontBelow, LocationId.FrontAbove,
        LocationId.BackBelow, LocationId.BackAbove];
}

export function requiresDiscard(location: LocationId, player: FullPlayer): boolean {
    return (onColonialOne(player.location) && onGalactica(location)) ||
        (onGalactica(player.location) && onColonialOne(location)) ||
        (isSpace(player.location) && (onGalactica(location) || onColonialOne(location)))
}

function onGalactica(location: LocationId) {
    return [LocationId.FtlControl, LocationId.WeaponsControl, LocationId.Communications, LocationId.Command,
        LocationId.AdmiralsQuarters, LocationId.Armory, LocationId.ResearchLab, LocationId.HangarDeck, LocationId.Sickbay,
        LocationId.Brig].indexOf(location) !== -1;
}

function onColonialOne(location: LocationId) {
    return [LocationId.PressRoom, LocationId.PresidentsOffice, LocationId.Administration].indexOf(location) !== -1;
}
