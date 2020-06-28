import { LoyaltyCardId } from "./models/game-data";
import sympathizer from './images/loyalty/BSG_Loyalty_Sympathizer.png';
import human from './images/loyalty/BSG_Loyalty_Not_Cylon.png';
import brig from './images/loyalty/BSG_Loyalty_Brig.png';
import damage from './images/loyalty/BSG_Loyalty_Damage_Gal.png';
import morale from './images/loyalty/BSG_Loyalty_Morale.png';
import sickbay from './images/loyalty/BSG_Loyalty_Sickbay.png';

const cards = {
    [LoyaltyCardId[LoyaltyCardId.Sympathizer]]: sympathizer,
    [LoyaltyCardId[LoyaltyCardId.Human]]: human,
    [LoyaltyCardId[LoyaltyCardId.SendCharToBrig]]: brig,
    [LoyaltyCardId[LoyaltyCardId.SendCharToSickbay]]: sickbay,
    [LoyaltyCardId[LoyaltyCardId.DamageGalactica]]: damage,
    [LoyaltyCardId[LoyaltyCardId.ReduceMorale]]: morale,
}

export enum Loyalty {
    Cylon,
    Human
}

export function getLoyaltyImage(loyalty: LoyaltyCardId) {
    return cards[LoyaltyCardId[loyalty]];
}

export function isCylon(loyalties: LoyaltyCardId[]): boolean {
    return loyalties.some(l => l !== LoyaltyCardId.Human)
}
