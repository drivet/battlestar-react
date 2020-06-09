import { shuffle } from "./deck";

export interface CivilianShip {
    food: number;
    fuel: number;
    morale: number;
    population: number;
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