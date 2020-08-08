import {
    BeforeSkillCheckId,
    CharacterId,
    SkillCard,
    SkillCardId,
    SkillCards,
    SkillCheckType,
    SkillType
} from "../../src/models/game-data";
import { SkillCheckResult } from "./skill-check";

/**
 * expose for testing
 */
export function adjustDifficultyFromProphecy(acceptingProphecy: boolean,
                                             which: SkillCheckType,
                                             presidentChosen: boolean,
                                             pass: number) {
    const adjust = acceptingProphecy &&
        (which === SkillCheckType.Administration ||
            (which === SkillCheckType.AdmiralsQuarters && presidentChosen));
    return adjust ? pass + 2 : pass;
}

/**
 * Expose for testing
 */
export function gatherBeforeSkills(characterId: CharacterId,
                                   arbitrator: boolean,
                                   skillCards: SkillCardId[]): BeforeSkillCheckId[] {
    const result: BeforeSkillCheckId[] = [];

    if (arbitrator) {
        result.push(BeforeSkillCheckId.AssignArbitrator_Increase,
            BeforeSkillCheckId.AssignArbitrator_Decrease);
    }

    if (hasSkillCard(skillCards, SkillCardId.InvestigativeCommittee3)) {
        result.push(BeforeSkillCheckId.InvestigativeCommittee3);
    }
    if (hasSkillCard(skillCards, SkillCardId.InvestigativeCommittee4)) {
        result.push(BeforeSkillCheckId.InvestigativeCommittee4);
    }
    if (hasSkillCard(skillCards, SkillCardId.InvestigativeCommittee5)) {
        result.push(BeforeSkillCheckId.InvestigativeCommittee5);
    }

    if (hasSkillCard(skillCards, SkillCardId.ScientificResearch3)) {
        result.push(BeforeSkillCheckId.ScientificResearch3);
    }

    if (hasSkillCard(skillCards, SkillCardId.ScientificResearch4)) {
        result.push(BeforeSkillCheckId.ScientificResearch4);
    }

    if (hasSkillCard(skillCards, SkillCardId.ScientificResearch5)) {
        result.push(BeforeSkillCheckId.ScientificResearch5);
    }

    if (characterId === CharacterId.SaulTigh) {
        result.push(BeforeSkillCheckId.CylonHatred);
    }

    if (characterId === CharacterId.TomZarek) {
        result.push(BeforeSkillCheckId.FILP_Decrease,
            BeforeSkillCheckId.FILP_Increase);
    }
    return result;
}

function hasSkillCard(skillCards: SkillCardId[], card: SkillCardId): boolean {
    return skillCards.indexOf(card) !== -1;
}

/**
 * expose for testing
 */
export function adjustDifficulty(pass: number, adjustments: BeforeSkillCheckId[]): number {
    let difficulty = pass;
    adjustments.forEach(a => {
        if (a === BeforeSkillCheckId.AssignArbitrator_Increase) {
            difficulty += 3;
        } else if (a === BeforeSkillCheckId.AssignArbitrator_Decrease) {
            difficulty -= 3;
        } else if (a === BeforeSkillCheckId.FILP_Increase) {
            difficulty += 2;
        } else if (a === BeforeSkillCheckId.FILP_Decrease) {
            difficulty -= 2;
        } else if (a === BeforeSkillCheckId.CylonHatred) {
            difficulty -= 3;
        }
    });
    return difficulty;
}

export function calcFinalResult(score: number,
                                pass: number,
                                partial: number,
                                hasDeclareEmergency: boolean): SkillCheckResult {
    const finalPass = hasDeclareEmergency ? pass - 2 : pass;
    if (score >= finalPass) {
        return SkillCheckResult.Pass;
    } else if (partial !== undefined && score >= partial) {
        return SkillCheckResult.Partial;
    } else {
        return SkillCheckResult.Fail;
    }
}

export function calcSkillCheckStrength(types: SkillType[],
                                       skills: SkillCardId[],
                                       hasScientificResearch: boolean,
                                       blindDevotionSkill: SkillType): number {
    let score = 0;
    skills.map(s => SkillCards[SkillCardId[s]])
        .forEach(s => score +=
            calcSkillCardStrength(types, s, hasScientificResearch, blindDevotionSkill));
    return score;
}

function calcSkillCardStrength(types: SkillType[],
                               skillCard: SkillCard,
                               hasScientificResearch: boolean,
                               blindDevotionSkill: SkillType): number {
    if (hasScientificResearch && skillCard.type === SkillType.Engineering) {
        return skillCard.strength;
    }

    if (blindDevotionSkill === skillCard.type) {
        return 0;
    }

    if (types.indexOf(skillCard.type) !== -1) {
        return skillCard.strength;
    } else {
        return -1 * skillCard.strength;
    }
}