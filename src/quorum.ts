import { QuorumCardId } from "./models/game-data";
import inspire from "./images/BSG_Quorum_Inspire_Speech.png";
import arrest from "./images/BSG_Quorum_Arrest_Order.png";
import accept from "./images/BSG_Quorum_Accept_Prophecy.png";
import pardon from "./images/BSG_Quorum_Pres_Pardon.png";
import mutiny from "./images/BSG_Quorum_Encourage_Mutiny.png";
import arbitrator from "./images/BSG_Quorum_Assign_Arbitrator.png";
import vice from "./images/BSG_Quorum_Assign_V_Pres.png";
import mug from "./images/BSG_Quorum_Release_Mugshots.png";
import food from "./images/BSG_Quorum_Food_Rationing.png";
import brutal from "./images/BSG_Quorum_Authorize_Brute_Force.png";
import specialist from "./images/BSG_Quorum_Assign_Miss_Specialist.png";


const cards = {
    [QuorumCardId[QuorumCardId.InspirationalSpeech]]: inspire,
    [QuorumCardId[QuorumCardId.ArrestOrder]]: arrest,
    [QuorumCardId[QuorumCardId.AcceptProphecy]]: accept,
    [QuorumCardId[QuorumCardId.PresidentialPardon]]: pardon,
    [QuorumCardId[QuorumCardId.EncourageMutiny]]: mutiny,
    [QuorumCardId[QuorumCardId.AssignArbitrator]]: arbitrator,
    [QuorumCardId[QuorumCardId.AssignVicePresident]]: vice,
    [QuorumCardId[QuorumCardId.ReleaseCylonMugshots]]: mug,
    [QuorumCardId[QuorumCardId.FoodRationing]]: food,
    [QuorumCardId[QuorumCardId.AuthorizationOfBrutalForce]]: brutal,
    [QuorumCardId[QuorumCardId.AssignMissionSpecialist]]: specialist,
}

export function getQuorumImage(card: QuorumCardId) {
    return cards[QuorumCardId[card]];
}
