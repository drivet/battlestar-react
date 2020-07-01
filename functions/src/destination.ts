import { makeDeck, shuffle } from "./deck";
import { DestinationCardId } from "../../src/models/game-data";

export function createDestinationDeck(): DestinationCardId[] {
    return shuffle([
        ...makeDeck(DestinationCardId.RagnarAnchorage, 1),
        ...makeDeck(DestinationCardId.DesolateMoon, 1),
        ...makeDeck(DestinationCardId.CylonAmbush, 1),
        ...makeDeck(DestinationCardId.CylonRefinery, 1),
        ...makeDeck(DestinationCardId.BarrenPlanet, 4),
        ...makeDeck(DestinationCardId.IcyMoon, 2),
        ...makeDeck(DestinationCardId.TyliumPlanet, 4),
        ...makeDeck(DestinationCardId.RemotePlanet, 3),
        ...makeDeck(DestinationCardId.DeepSpace, 3),
        ...makeDeck(DestinationCardId.AsteroidField, 2)
    ]);
}
