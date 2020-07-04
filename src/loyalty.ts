import { LoyaltyCardId } from "./models/game-data";

export function isCylon(loyalties: LoyaltyCardId[]): boolean {
    return loyalties.some(l => l !== LoyaltyCardId.Human)
}
