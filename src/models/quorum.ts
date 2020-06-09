import { makeDeck, shuffle } from "./deck";

export enum QuorumCardId {
    AssignMissionSpecialist,
    AuthorizationOfBrutalForce,
    FoodRationing,
    ReleaseCylonMugshots,
    AssignVicePresident,
    AssignArbitrator,
    EncourageMutiny,
    PresidentialPardon,
    AcceptProphecy,
    ArrestOrder,
    InspirationalSpeech
}

export function createQuorumDeck() {
    return shuffle([
        ...makeDeck(QuorumCardId.AssignMissionSpecialist, 1),
        ...makeDeck(QuorumCardId.AuthorizationOfBrutalForce, 2),
        ...makeDeck(QuorumCardId.FoodRationing, 2),
        ...makeDeck(QuorumCardId.ReleaseCylonMugshots, 1),
        ...makeDeck(QuorumCardId.AssignVicePresident, 1),
        ...makeDeck(QuorumCardId.AssignArbitrator, 1),
        ...makeDeck(QuorumCardId.EncourageMutiny, 1),
        ...makeDeck(QuorumCardId.PresidentialPardon, 1),
        ...makeDeck(QuorumCardId.AcceptProphecy, 1),
        ...makeDeck(QuorumCardId.ArrestOrder, 2),
        ...makeDeck(QuorumCardId.InspirationalSpeech, 4)
    ]);
}
