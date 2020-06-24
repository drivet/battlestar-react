import { shuffle } from "./deck";
import { SkillCard, SkillCardType, SkillType, SkillTypeKeys } from "../../src/models/game-data";
import { FullPlayer } from "./game";

function skillCard(skillType: SkillType, card: SkillCardType, strength: number): SkillCard {
    return {
        cardType: card,
        type: skillType,
        strength: strength
    }
}

function tacticsCard(card: SkillCardType, strength: number): SkillCard {
    return skillCard(SkillType.Tactics, card, strength);
}

function tacticsDeck(): SkillCard[] {
    return [
        tacticsCard(SkillCardType.LaunchScout, 2),
        tacticsCard(SkillCardType.LaunchScout, 1),
        tacticsCard(SkillCardType.LaunchScout, 1),
        tacticsCard(SkillCardType.LaunchScout, 1),
        tacticsCard(SkillCardType.LaunchScout, 1),
        tacticsCard(SkillCardType.LaunchScout, 2),
        tacticsCard(SkillCardType.LaunchScout, 2),
        tacticsCard(SkillCardType.LaunchScout, 1),
        tacticsCard(SkillCardType.LaunchScout, 1),
        tacticsCard(SkillCardType.LaunchScout, 2),
        tacticsCard(SkillCardType.LaunchScout, 2),
        tacticsCard(SkillCardType.LaunchScout, 1),
        tacticsCard(SkillCardType.LaunchScout, 1),
        tacticsCard(SkillCardType.LaunchScout, 2),
        tacticsCard(SkillCardType.StrategicPlanning, 3),
        tacticsCard(SkillCardType.StrategicPlanning, 4),
        tacticsCard(SkillCardType.StrategicPlanning, 5),
        tacticsCard(SkillCardType.StrategicPlanning, 3),
        tacticsCard(SkillCardType.StrategicPlanning, 3),
        tacticsCard(SkillCardType.StrategicPlanning, 4),
        tacticsCard(SkillCardType.StrategicPlanning, 3),
    ];
}

function leadershipCard(card: SkillCardType, strength: number): SkillCard {
    return skillCard(SkillType.Leadership, card, strength);
}

function leadershipDeck(): SkillCard[] {
    return [
        leadershipCard(SkillCardType.ExecutiveOrder, 1),
        leadershipCard(SkillCardType.ExecutiveOrder, 1),
        leadershipCard(SkillCardType.ExecutiveOrder, 1),
        leadershipCard(SkillCardType.ExecutiveOrder, 1),
        leadershipCard(SkillCardType.ExecutiveOrder, 1),
        leadershipCard(SkillCardType.ExecutiveOrder, 1),
        leadershipCard(SkillCardType.ExecutiveOrder, 1),
        leadershipCard(SkillCardType.ExecutiveOrder, 1),
        leadershipCard(SkillCardType.ExecutiveOrder, 2),
        leadershipCard(SkillCardType.ExecutiveOrder, 2),
        leadershipCard(SkillCardType.ExecutiveOrder, 2),
        leadershipCard(SkillCardType.ExecutiveOrder, 2),
        leadershipCard(SkillCardType.ExecutiveOrder, 2),
        leadershipCard(SkillCardType.ExecutiveOrder, 2),
        leadershipCard(SkillCardType.DeclareEmergency, 3),
        leadershipCard(SkillCardType.DeclareEmergency, 3),
        leadershipCard(SkillCardType.DeclareEmergency, 3),
        leadershipCard(SkillCardType.DeclareEmergency, 3),
        leadershipCard(SkillCardType.DeclareEmergency, 4),
        leadershipCard(SkillCardType.DeclareEmergency, 4),
        leadershipCard(SkillCardType.DeclareEmergency, 5),
    ];
}


function politicsCard(card: SkillCardType, strength: number): SkillCard {
    return skillCard(SkillType.Politics, card, strength);
}

function politicsDeck(): SkillCard[] {
    return [
        politicsCard(SkillCardType.ConsolidatePower, 1),
        politicsCard(SkillCardType.ConsolidatePower, 1),
        politicsCard(SkillCardType.ConsolidatePower, 1),
        politicsCard(SkillCardType.ConsolidatePower, 1),
        politicsCard(SkillCardType.ConsolidatePower, 1),
        politicsCard(SkillCardType.ConsolidatePower, 1),
        politicsCard(SkillCardType.ConsolidatePower, 1),
        politicsCard(SkillCardType.ConsolidatePower, 1),
        politicsCard(SkillCardType.ConsolidatePower, 2),
        politicsCard(SkillCardType.ConsolidatePower, 2),
        politicsCard(SkillCardType.ConsolidatePower, 2),
        politicsCard(SkillCardType.ConsolidatePower, 2),
        politicsCard(SkillCardType.ConsolidatePower, 2),
        politicsCard(SkillCardType.ConsolidatePower, 2),
        politicsCard(SkillCardType.InvestigativeCommittee, 3),
        politicsCard(SkillCardType.InvestigativeCommittee, 3),
        politicsCard(SkillCardType.InvestigativeCommittee, 3),
        politicsCard(SkillCardType.InvestigativeCommittee, 3),
        politicsCard(SkillCardType.InvestigativeCommittee, 4),
        politicsCard(SkillCardType.InvestigativeCommittee, 4),
        politicsCard(SkillCardType.InvestigativeCommittee, 5),
    ];
}


function engineeringCard(card: SkillCardType, strength: number): SkillCard {
    return skillCard(SkillType.Engineering, card, strength);
}

function engineeringDeck(): SkillCard[] {
    return [
        engineeringCard(SkillCardType.Repair, 1),
        engineeringCard(SkillCardType.Repair, 1),
        engineeringCard(SkillCardType.Repair, 1),
        engineeringCard(SkillCardType.Repair, 1),
        engineeringCard(SkillCardType.Repair, 1),
        engineeringCard(SkillCardType.Repair, 1),
        engineeringCard(SkillCardType.Repair, 1),
        engineeringCard(SkillCardType.Repair, 1),
        engineeringCard(SkillCardType.Repair, 2),
        engineeringCard(SkillCardType.Repair, 2),
        engineeringCard(SkillCardType.Repair, 2),
        engineeringCard(SkillCardType.Repair, 2),
        engineeringCard(SkillCardType.Repair, 2),
        engineeringCard(SkillCardType.Repair, 2),
        engineeringCard(SkillCardType.ScientificResearch, 3),
        engineeringCard(SkillCardType.ScientificResearch, 3),
        engineeringCard(SkillCardType.ScientificResearch, 3),
        engineeringCard(SkillCardType.ScientificResearch, 3),
        engineeringCard(SkillCardType.ScientificResearch, 4),
        engineeringCard(SkillCardType.ScientificResearch, 4),
        engineeringCard(SkillCardType.ScientificResearch, 5),
    ];
}

function pilotingCard(card: SkillCardType, strength: number): SkillCard {
    return skillCard(SkillType.Piloting, card, strength);
}

function pilotingDeck(): SkillCard[] {
    return [
        pilotingCard(SkillCardType.EvasiveManeuvers, 1),
        pilotingCard(SkillCardType.EvasiveManeuvers, 1),
        pilotingCard(SkillCardType.EvasiveManeuvers, 1),
        pilotingCard(SkillCardType.EvasiveManeuvers, 1),
        pilotingCard(SkillCardType.EvasiveManeuvers, 1),
        pilotingCard(SkillCardType.EvasiveManeuvers, 1),
        pilotingCard(SkillCardType.EvasiveManeuvers, 1),
        pilotingCard(SkillCardType.EvasiveManeuvers, 1),
        pilotingCard(SkillCardType.EvasiveManeuvers, 2),
        pilotingCard(SkillCardType.EvasiveManeuvers, 2),
        pilotingCard(SkillCardType.EvasiveManeuvers, 2),
        pilotingCard(SkillCardType.EvasiveManeuvers, 2),
        pilotingCard(SkillCardType.EvasiveManeuvers, 2),
        pilotingCard(SkillCardType.EvasiveManeuvers, 2),
        pilotingCard(SkillCardType.MaximumFirepower, 3),
        pilotingCard(SkillCardType.MaximumFirepower, 3),
        pilotingCard(SkillCardType.MaximumFirepower, 3),
        pilotingCard(SkillCardType.MaximumFirepower, 3),
        pilotingCard(SkillCardType.MaximumFirepower, 4),
        pilotingCard(SkillCardType.MaximumFirepower, 4),
        pilotingCard(SkillCardType.MaximumFirepower, 5),
    ];
}

export type SkillDecks = {
    [key in SkillTypeKeys]?: SkillCard[]
}

export function createSkillDecks(): SkillDecks {
    return {
        [SkillType[SkillType.Tactics]]: shuffle(tacticsDeck()),
        [SkillType[SkillType.Politics]]: shuffle(politicsDeck()),
        [SkillType[SkillType.Leadership]]: shuffle(leadershipDeck()),
        [SkillType[SkillType.Piloting]]: shuffle(pilotingDeck()),
        [SkillType[SkillType.Engineering]]: shuffle(engineeringDeck())
    }
}

export function findMatchingSkillCard(player: FullPlayer, card: SkillCard): SkillCard {
    return player.skillCards.find(s => s.strength === card.strength &&
        s.type === card.type &&
        s.cardType === card.cardType);
}