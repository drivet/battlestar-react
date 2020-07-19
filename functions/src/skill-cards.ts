import { SkillCardId, SkillType, SkillTypeKeys } from "../../src/models/game-data";
import { shuffle } from "./deck";

function skillCardRun(skillCard: SkillCardId, count: number): SkillCardId[] {
    return new Array(count).fill(skillCard);
}

function tacticsDeck(): SkillCardId[] {
    return [
        ...skillCardRun(SkillCardId.LaunchScout1, 8),
        ...skillCardRun(SkillCardId.LaunchScout2, 6),
        ...skillCardRun(SkillCardId.StrategicPlanning3, 4),
        ...skillCardRun(SkillCardId.StrategicPlanning4, 2),
        ...skillCardRun(SkillCardId.StrategicPlanning5, 1)
    ]
}

function politicsDeck(): SkillCardId []{
    return [
        ...skillCardRun(SkillCardId.ConsolidatePower1, 8),
        ...skillCardRun(SkillCardId.ConsolidatePower2, 6),
        ...skillCardRun(SkillCardId.InvestigativeCommittee3, 4),
        ...skillCardRun(SkillCardId.InvestigativeCommittee4, 2),
        ...skillCardRun(SkillCardId.InvestigativeCommittee5, 1)
    ];
}

function pilotingDeck(): SkillCardId[] {
    return [
        ...skillCardRun(SkillCardId.EvasiveManeuvers1, 8),
        ...skillCardRun(SkillCardId.EvasiveManeuvers2, 6),
        ...skillCardRun(SkillCardId.MaximumFirepower3, 4),
        ...skillCardRun(SkillCardId.MaximumFirepower4, 2),
        ...skillCardRun(SkillCardId.MaximumFirepower5, 1)
    ];
}

function engineeringDeck(): SkillCardId[] {
    return [
        ...skillCardRun(SkillCardId.Repair1, 8),
        ...skillCardRun(SkillCardId.Repair2, 6),
        ...skillCardRun(SkillCardId.ScientificResearch3, 4),
        ...skillCardRun(SkillCardId.ScientificResearch4, 2),
        ...skillCardRun(SkillCardId.ScientificResearch5, 1)
    ];
}

function leadershipDeck(): SkillCardId[] {
    return [
        ...skillCardRun(SkillCardId.ExecutiveOrder1, 8),
        ...skillCardRun(SkillCardId.ExecutiveOrder2, 6),
        ...skillCardRun(SkillCardId.DeclareEmergency3, 4),
        ...skillCardRun(SkillCardId.DeclareEmergency4, 2),
        ...skillCardRun(SkillCardId.DeclareEmergency5, 1)
    ];
}

export type SkillCardDecks = {
    [key in SkillTypeKeys]?: SkillCardId[]
}

export function createSkillCardDecks(): SkillCardDecks {
    return {
        [SkillType[SkillType.Tactics]]: shuffle(tacticsDeck()),
        [SkillType[SkillType.Politics]]: shuffle(politicsDeck()),
        [SkillType[SkillType.Leadership]]: shuffle(leadershipDeck()),
        [SkillType[SkillType.Piloting]]: shuffle(pilotingDeck()),
        [SkillType[SkillType.Engineering]]: shuffle(engineeringDeck())
    }
}
