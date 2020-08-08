import { SkillCheckResult } from "./skill-check";
import { BeforeSkillCheckId, CharacterId, SkillCardId, SkillCheckType, SkillType } from "../../src/models/game-data";
import {
    adjustDifficulty,
    adjustDifficultyFromProphecy,
    calcFinalResult,
    calcSkillCheckStrength,
    gatherBeforeSkills
} from "./skill-check-utils";

describe('Skill check utility tests ', () => {
    describe('Difficulty via Accept Prophecy', () => {
        it('should adjust when accepting prophecy (Administration)', () => {
            const pass = adjustDifficultyFromProphecy(true,
                SkillCheckType.Administration, false, 7);
            expect(pass).toBe(9);
        });

        it('should adjust when accepting prophecy (Admirals Quarters)', () => {
            const pass = adjustDifficultyFromProphecy(true,
                SkillCheckType.AdmiralsQuarters, true, 7);
            expect(pass).toBe(9);
        });

        it('should not adjust when not accepting prophecy', () => {
            const pass = adjustDifficultyFromProphecy(false,
                SkillCheckType.Administration, false, 7);
            expect(pass).toBe(7);
        });

        it('should not adjust when location is not Administration or Admirals Quarters', () => {
            const pass = adjustDifficultyFromProphecy(true,
                SkillCheckType.Crisis, true, 7);
            expect(pass).toBe(7);

        });

        it('should not adjust when chosen player is not president', () => {
            const pass = adjustDifficultyFromProphecy(true,
                SkillCheckType.AdmiralsQuarters, false, 7);
            expect(pass).toBe(7);
        });
    });

    describe('Adjust difficulty', () => {
        it('should handle arbitrator increase', () => {
            const pass = adjustDifficulty(5, [BeforeSkillCheckId.AssignArbitrator_Increase]);
            expect(pass).toBe(8);
        });

        it('should handle arbitrator decrease', () => {
            const pass = adjustDifficulty(5, [BeforeSkillCheckId.AssignArbitrator_Decrease]);
            expect(pass).toBe(2);
        });

        it('should handle FILP increase', () => {
            const pass = adjustDifficulty(5, [BeforeSkillCheckId.FILP_Increase]);
            expect(pass).toBe(7);
        });

        it('should handle FILP decrease', () => {
            const pass = adjustDifficulty(5, [BeforeSkillCheckId.FILP_Decrease]);
            expect(pass).toBe(3);
        });

        it('should handle Cylon hatred', () => {
            const pass = adjustDifficulty(5, [BeforeSkillCheckId.CylonHatred]);
            expect(pass).toBe(2);
        });

        it('should accumulate adjustments', () => {
            const pass = adjustDifficulty(5, [BeforeSkillCheckId.AssignArbitrator_Increase,
                BeforeSkillCheckId.FILP_Decrease]);
            expect(pass).toBe(6);
        });
    });

    describe('Scoring tests', () => {
        const types = [SkillType.Politics, SkillType.Piloting];
        const skills = [
            SkillCardId.MaximumFirepower3,
            SkillCardId.ScientificResearch5,
            SkillCardId.InvestigativeCommittee3,
            SkillCardId.ConsolidatePower2
        ];

        it('should score correctly', () => {
            const score = calcSkillCheckStrength(types, skills,
                false, undefined);
            expect(score).toBe(3);
        });

        it('should handle scientific research', () => {
            const score = calcSkillCheckStrength(types, skills,
                true, undefined);
            expect(score).toBe(13);
        });

        it('should handle blind devotion', () => {
            const score = calcSkillCheckStrength(types, skills,
                false, SkillType.Piloting);
            expect(score).toBe(0);
        });
    });

    describe('Final result tests', () => {
        it('should produce fail', () => {
            const result = calcFinalResult(
                10, 11, undefined, false);
            expect(result).toBe(SkillCheckResult.Fail);
        });

        it('should produce success', () => {
            const result = calcFinalResult(
                13, 11, undefined, false);
            expect(result).toBe(SkillCheckResult.Pass);
        });

        it('should produce partial result', () => {
            const result = calcFinalResult(
                10, 11, 9, false);
            expect(result).toBe(SkillCheckResult.Partial);
        });

        it('should handle declare emergency', () => {
            const result = calcFinalResult(
                10, 11, undefined, true);
            expect(result).toBe(SkillCheckResult.Pass);
        });
    });

    describe('Before skill check narrowing tests', () => {
        it('should handle no options', () => {
            const result = gatherBeforeSkills(CharacterId.LeeAdama, false, []);
            expect(result.length).toBe(0);
        });

        it('should handle arbitrator options', () => {
            const result = gatherBeforeSkills(CharacterId.LeeAdama, true, []);
            expect(result.length).toBe(2);
            expect(result).toContain(BeforeSkillCheckId.AssignArbitrator_Increase);
            expect(result).toContain(BeforeSkillCheckId.AssignArbitrator_Decrease);
        });

        it('should give Saul Tigh Cylon Hatred', () => {
            const result = gatherBeforeSkills(CharacterId.SaulTigh, false, []);
            expect(result.length).toBe(1);
            expect(result).toContain(BeforeSkillCheckId.CylonHatred);
        });

        it('should give Tom Zarek FILP', () => {
            const result = gatherBeforeSkills(CharacterId.TomZarek, false, []);
            expect(result.length).toBe(2);
            expect(result).toContain(BeforeSkillCheckId.FILP_Decrease);
            expect(result).toContain(BeforeSkillCheckId.FILP_Increase);
        })

        it('should handle Investigative Committee', () => {
            const result1 = gatherBeforeSkills(CharacterId.LeeAdama, false,
                [SkillCardId.InvestigativeCommittee3]);
            expect(result1.length).toBe(1);
            expect(result1).toContain(BeforeSkillCheckId.InvestigativeCommittee3);

            const result2 = gatherBeforeSkills(CharacterId.LeeAdama, false,
                [SkillCardId.InvestigativeCommittee4]);
            expect(result2.length).toBe(1);
            expect(result2).toContain(BeforeSkillCheckId.InvestigativeCommittee4);

            const result3 = gatherBeforeSkills(CharacterId.LeeAdama, false,
                [SkillCardId.InvestigativeCommittee5]);
            expect(result3.length).toBe(1);
            expect(result3).toContain(BeforeSkillCheckId.InvestigativeCommittee5);
        });

        it('should handle Scientific Research', () => {
            const result1 = gatherBeforeSkills(CharacterId.LeeAdama, false,
                [SkillCardId.ScientificResearch3]);
            expect(result1.length).toBe(1);
            expect(result1).toContain(BeforeSkillCheckId.ScientificResearch3);

            const result2 = gatherBeforeSkills(CharacterId.LeeAdama, false,
                [SkillCardId.ScientificResearch4]);
            expect(result2.length).toBe(1);
            expect(result2).toContain(BeforeSkillCheckId.ScientificResearch4);

            const result3 = gatherBeforeSkills(CharacterId.LeeAdama, false,
                [SkillCardId.ScientificResearch5]);
            expect(result3.length).toBe(1);
            expect(result3).toContain(BeforeSkillCheckId.ScientificResearch5);
        });

        it('should add options together', () => {
            const result = gatherBeforeSkills(CharacterId.TomZarek, true,
                [
                    SkillCardId.ScientificResearch4, SkillCardId.ScientificResearch3,
                    SkillCardId.InvestigativeCommittee3, SkillCardId.InvestigativeCommittee5
                ]);
            expect(result.length).toBe(8);
            expect(result).toContain(BeforeSkillCheckId.FILP_Decrease);
            expect(result).toContain(BeforeSkillCheckId.FILP_Increase);
            expect(result).toContain(BeforeSkillCheckId.ScientificResearch4);
            expect(result).toContain(BeforeSkillCheckId.ScientificResearch3);
            expect(result).toContain(BeforeSkillCheckId.InvestigativeCommittee5);
            expect(result).toContain(BeforeSkillCheckId.InvestigativeCommittee3);
            expect(result).toContain(BeforeSkillCheckId.AssignArbitrator_Increase);
            expect(result).toContain(BeforeSkillCheckId.AssignArbitrator_Decrease);
        })
    });

});
