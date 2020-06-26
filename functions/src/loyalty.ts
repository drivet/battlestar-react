import { addCard, deal, shuffle } from "./deck";
import { LoyaltyCardId } from "../../src/models/game-data";

export interface LoyaltyDistribution {
    distributed: LoyaltyCardId[];
    remaining: LoyaltyCardId[];
}

export function loyaltyDeck(playerCount: number, extraHumans: number): LoyaltyDistribution {
    const cylonCards = [
        LoyaltyCardId.DamageGalactica,
        LoyaltyCardId.ReduceMorale,
        LoyaltyCardId.SendCharToBrig,
        LoyaltyCardId.SendCharToSickbay
    ];

    shuffle(cylonCards);

    let deck: LoyaltyCardId[];
    if (playerCount === 3) {
        deck = new Array(5).fill(LoyaltyCardId.Human).concat(deal(cylonCards, 1));
    } else if (playerCount === 4) {
        deck = new Array(6).fill(LoyaltyCardId.Human).concat(deal(cylonCards, 1));
    } else if (playerCount === 5) {
        deck = new Array(8).fill(LoyaltyCardId.Human).concat(deal(cylonCards, 2));
    } else if (playerCount === 6) {
        deck = new Array(9).fill(LoyaltyCardId.Human).concat(deal(cylonCards, 2));
    } else {
        throw new Error('Bad player count ' + playerCount);
    }

    for (let i = 0; i < extraHumans; i++) {
        addCard(deck, LoyaltyCardId.Human);
    }

    shuffle(deck);

    const distributed: LoyaltyCardId[] = deal(deck, playerCount + extraHumans);

    if (playerCount === 4 || playerCount === 6) {
        addCard(deck, LoyaltyCardId.Sympathizer);
        shuffle(deck);
    }

    return {
        distributed: distributed,
        remaining: deck
    }
}