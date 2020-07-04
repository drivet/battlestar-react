import {
    ActionId,
    CharacterId,
    CharacterType,
    getCharacter,
    LocationId,
    LoyaltyCardId,
    QuorumCardId,
    SkillCardType,
    ViewableGameData
} from "./models/game-data";
import { FullPlayer } from "../functions/src/game";
import { isSpace } from "./models/location";
import { isCylon } from "./loyalty";

export interface AvailableActions {
    miscActions: ActionId[];
    locationActions: ActionId[];
    characterActions: ActionId[];
    skillActions: ActionId[];
    titleActions: ActionId[];
    quorumActions: ActionId[];
    loyaltyActions: ActionId[];
}

export function getAvailableActions(game: ViewableGameData, player: FullPlayer): AvailableActions {
    const miscActions = [ActionId.Nothing];
    if (canActivateViper(player)) {
        miscActions.push(ActionId.ActivateViper);
    }
    const locationAction = getLocationAction(player);
    const characterAction = getActionFromCharacter(player.characterId);
    const skillActions = getActionsFromSkills(player.skillCards.map(sc => sc.cardType));
    const titleActions = getActionsFromTitle(player);
    const quorumActions = getActionsFromQuorum(player);
    const loyaltyActions = getActionsFromLoyalty(player);

    return {
        miscActions: miscActions,
        locationActions: locationAction ? [locationAction]: [],
        characterActions: characterAction ? [characterAction]: [],
        skillActions: skillActions,
        titleActions: titleActions,
        quorumActions: quorumActions,
        loyaltyActions: loyaltyActions
    };
}

function getActionsFromLoyalty(player: FullPlayer): ActionId[] {
    if (!isCylon(player.loyaltyCards)) {
        return [];
    }

    return player.loyaltyCards.map(getActionFromLoyalty).filter(a => !!a);
}

function getActionFromLoyalty(loyalty: LoyaltyCardId): ActionId {
    if (loyalty === LoyaltyCardId.ReduceMorale) {
        return ActionId.ReduceMorale;
    } else if (loyalty === LoyaltyCardId.DamageGalactica) {
        return ActionId.DamageGalactica;
    } else if (loyalty === LoyaltyCardId.SendCharToSickbay) {
        return ActionId.SendToSickbay;
    } else if (loyalty === LoyaltyCardId.SendCharToBrig) {
        return ActionId.SendToBrig;
    } else {
        return null;
    }
}

function isPilot(characterId: CharacterId) {
    const c = getCharacter(characterId);
    return c.type === CharacterType.Pilot;
}

function canActivateViper(player: FullPlayer) {
    return isSpace(player.location) && isPilot(player.characterId);
}

function getLocationAction(player: FullPlayer) {
    if (isSpace(player.location)) {
        return null;
    }

    if (player.location === LocationId.HangarDeck && !isPilot(player.characterId)) {
        return null;
    }

    return getActionFromLocation(player.location);
}

function getActionsFromTitle(player: FullPlayer): ActionId[] {
    const actions = [];
    if (player.admiral) {
        actions.push(ActionId.LaunchNuke);
    }
    if (player.president) {
        actions.push(ActionId.DrawQuorumCard);
    }
    return actions;
}

function getActionsFromQuorum(player: FullPlayer): ActionId[] {
    if (!player.president) {
        return [];
    }
    return player.quorumHand.map(getActionFromQuorumCard).filter(a => !!a);
}

function getActionFromQuorumCard(card: QuorumCardId): ActionId {
    if (card === QuorumCardId.AssignMissionSpecialist) {
        return ActionId.AssignMissionSpecialist;
    } else if (card === QuorumCardId.AuthorizationOfBrutalForce) {
        return ActionId.BrutalForce;
    } else if (card === QuorumCardId.FoodRationing) {
        return ActionId.FoodRationing;
    } else if (card === QuorumCardId.ReleaseCylonMugshots) {
        return ActionId.AssignMissionSpecialist;
    } else if (card === QuorumCardId.AssignVicePresident) {
        return ActionId.AssignVicePresident;
    } else if (card === QuorumCardId.AssignArbitrator) {
        return ActionId.AssignArbitrator;
    } else if (card === QuorumCardId.EncourageMutiny) {
        return ActionId.EncourageMutiny;
    } else if (card === QuorumCardId.PresidentialPardon) {
        return ActionId.PresidentialPardon;
    } else if (card === QuorumCardId.AcceptProphecy) {
        return ActionId.AcceptProphecy;
    } else if (card === QuorumCardId.ArrestOrder) {
        return ActionId.ArrestOrder;
    } else if (card === QuorumCardId.InspirationalSpeech) {
        return ActionId.InspirationalSpeech;
    } else {
        return null;
    }
}

function getActionsFromSkills(skillCards: SkillCardType[]): ActionId[] {
    const uniqueCards: SkillCardType[] = Array.from(new Set<SkillCardType>(skillCards));
    return uniqueCards.map(getActionFromSkillCard).filter(a => !!a);
}

function getActionFromSkillCard(skillCard: SkillCardType): ActionId {
    if (skillCard === SkillCardType.LaunchScout) {
        return ActionId.LaunchScout;
    } else if (skillCard === SkillCardType.MaximumFirepower) {
        return ActionId.MaximumFirepower;
    } else if (skillCard === SkillCardType.Repair) {
        return ActionId.Repair;
    } else if (skillCard === SkillCardType.ConsolidatePower) {
        return ActionId.ConsolidatePower;
    } else if (skillCard === SkillCardType.ExecutiveOrder) {
        return ActionId.ExecutiveOrder;
    } else {
        return null;
    }
}

function getActionFromCharacter(characterId: CharacterId): ActionId {
    if (characterId === CharacterId.TomZarek) {
        return ActionId.UnconventionalTactics;
    } else if (characterId === CharacterId.SaulTigh) {
        return ActionId.DeclareMartialLaw;
    } else if (characterId === CharacterId.LeeAdama) {
        return ActionId.CAG;
    } else if (characterId === CharacterId.GaiusBaltar) {
        return ActionId.CylonDetector;
    } else if (characterId === CharacterId.LauraRoslin) {
        return ActionId.SkilledPolitician;
    } else {
        return null;
    }
}

function getActionFromLocation(locationId: LocationId): ActionId {
    if (locationId === LocationId.PressRoom) {
        return ActionId.PressRoom;
    } else if (locationId === LocationId.PresidentsOffice) {
        return ActionId.PresidentsOffice;
    } else if (locationId === LocationId.Administration) {
        return ActionId.Administration;
    } else if (locationId === LocationId.Caprica) {
        return ActionId.Caprica;
    } else if (locationId === LocationId.CylonFleet) {
        return ActionId.CylonFleet;
    } else if (locationId === LocationId.HumanFleet) {
        return ActionId.HumanFleet;
    } else if (locationId === LocationId.ResurrectionShip) {
        return ActionId.ResurrectionShip;
    } else if (locationId === LocationId.FtlControl) {
        return ActionId.FtlControl;
    } else if (locationId === LocationId.WeaponsControl) {
        return ActionId.WeaponsControl;
    } else if (locationId === LocationId.Command) {
        return ActionId.Command;
    } else if (locationId === LocationId.Communications) {
        return ActionId.Communications;
    } else if (locationId === LocationId.AdmiralsQuarters) {
        return ActionId.AdmiralsQuarters;
    } else if (locationId === LocationId.ResearchLab) {
        return ActionId.ResearchLab;
    } else if (locationId === LocationId.HangarDeck) {
        return ActionId.HangarDeck;
    } else if (locationId === LocationId.Armory) {
        return ActionId.Armory;
    } else if (locationId === LocationId.Brig) {
        return ActionId.Brig;
    } else {
        return null;
    }
}
