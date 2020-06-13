import { shuffle } from "./deck";
import { CivilianShip, LocationIdKeys } from "../../src/models/game-data";

export type LocatedCivilianShips = {
    [key in LocationIdKeys]?: CivilianShip[];
}

function createCivilian(food: number, fuel: number, morale: number, population: number): CivilianShip {
    return {
        food: food,
        fuel: fuel,
        morale: morale,
        population: population
    }
}

export function createCivilianPile(): CivilianShip[] {
    return shuffle([
        createCivilian(0, 0, 0, 0),
        createCivilian(0, 0, 0, 0),
        createCivilian(0, 0, 0, 1),
        createCivilian(0, 0, 0, 1),
        createCivilian(0, 0, 0, 1),
        createCivilian(0, 0, 0, 1),
        createCivilian(0, 0, 0, 1),
        createCivilian(0, 0, 0, 1),
        createCivilian(0, 0, 0, 2),
        createCivilian(0, 0, 0, 2),
        createCivilian(0, 1, 0, 1),
        createCivilian(0, 0, 1, 1),
    ]);
}