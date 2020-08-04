import { FullGameData, FullPlayer, GameDocument, newGame } from "./game";
import {
    _adjustDifficulty,
    _adjustDifficultyFromProphecy,
    _handleFinalScoring,
    _handleScoring,
    _narrowBeforeSkillCheck,
    createSkillCheck,
    handleSkillCheck,
    setupSkillCtx,
    SkillCheck,
    SkillCheckCtx,
    SkillCheckResult,
    SkillCheckState
} from "./skill-check";
import {
    AfterSkillCheckTotalId,
    BeforeSkillCheckId,
    CharacterId,
    QuorumCardId,
    SkillCardId,
    SkillCheckType,
    SkillType
} from "../../src/models/game-data";
import { Input, InputId } from "../../src/models/inputs";

function skillCheck(): SkillCheck {
    return createSkillCheck(SkillCheckType.Administration,
        [SkillType.Engineering, SkillType.Politics], 7);
}
function makeInput (user: string, inputId: InputId, data: any, ctx?: any) {
    return {
        userId: user,
        inputId: inputId,
        data: data,
        ctx: ctx
    }
}

/**
 * Transition a skill check step while at the same time verifying that the step
 * is doing the right things.  We do this by calling handleSkillCheck twice, once
 * without an input and once with the provided input, verifying that the state in
 * between looks okay.
 *
 * The input does two things:
 *
 * - it acts as expectations against a generated input request from the first call
 * of handleSkillCheck
 *
 * - it acts as the actual input to pass to handleSkillCheck on the second call
 *
 * @param gameDoc
 * @param input
 * @param state1
 * @param state2
 * @param end
 */
function handleAndVerifySkillCheckStep(gameDoc: GameDocument,
                                       input: Input<any, any>,
                                       state1: SkillCheckState,
                                       state2: SkillCheckState,
                                       ctx: any = null,
                                       end: boolean = false) {
    // we ensure that we start off with no input request...
    expect(gameDoc.gameState.inputRequest).toBeFalsy();

    // This next call should make one, though
    expect(handleSkillCheck(gameDoc, null)).toBe(false);
    expect(gameDoc.gameState.inputRequest).toBeTruthy();
    expect(gameDoc.gameState.inputRequest.userId).toEqual(input.userId);
    expect(gameDoc.gameState.inputRequest.inputId).toBe(input.inputId);
    // expect(gameDoc.gameState.inputRequest.ctx).toBe(ctx);
    expect(gameDoc.gameState.skillCheckCtx.state).toBe(state1);

    // the game engine would normally do this...
    gameDoc.gameState.inputRequest = null;

    expect(handleSkillCheck(gameDoc, input)).toBe(end);
    expect(gameDoc.gameState.inputRequest).toBeFalsy();
    expect(gameDoc.gameState.skillCheckCtx.state).toBe(state2);
}

function verifySkillCheckState(game: GameDocument, state: SkillCheckState) {
    expect(game.gameState.skillCheckCtx.state).toBe(state);
}

describe('Skill check tests ', () => {
    describe('Misc', () => {
        let game: GameDocument;
        beforeEach(() => {
            game = newGame('gameId', ['c1', 'c2', 'c3']);
            game.gameState.inputRequest = null;
            game.gameState.currentPlayer = 2;
        });

        it('should create skill check check', () => {
            setupSkillCtx(game, skillCheck());
            expect(game.gameState.skillCheckCtx).toBeTruthy();
        });

        it('should handle before collect with no cards', () => {
            setupSkillCtx(game, skillCheck());
            verifySkillCheckState(game, SkillCheckState.BeforeCollect);
            expect(game.gameState.inputRequest).toBeFalsy();

            handleAndVerifySkillCheckStep(game,
                makeInput('c1', InputId.BeforeSkillCheckSelect, []),
                SkillCheckState.BeforeCollect, SkillCheckState.BeforeCollect);
        });
    });

    describe('Before skill check narrowing tests', () => {
        it('should handle no options', () => {
            const player: FullPlayer = {
                userId: 'desmond',
                bot: true,
                characterId: CharacterId.LeeAdama,
                arbitrator: false,
                skillCards: []
            }

            const result = _narrowBeforeSkillCheck(player);
            expect(result.length).toBe(0);
        });

        it('should handle arbitrator options', () => {
            const player: FullPlayer = {
                userId: 'desmond',
                bot: true,
                characterId: CharacterId.LeeAdama,
                arbitrator: true,
                skillCards: []
            }

            const result = _narrowBeforeSkillCheck(player);
            expect(result.length).toBe(2);
            expect(result).toContain(BeforeSkillCheckId.AssignArbitrator_Increase);
            expect(result).toContain(BeforeSkillCheckId.AssignArbitrator_Decrease);
        });

        it('should give Saul Tigh Cylon Hatred', () => {
            const player: FullPlayer = {
                userId: 'desmond',
                bot: true,
                characterId: CharacterId.SaulTigh,
                arbitrator: false,
                skillCards: []
            }

            const result = _narrowBeforeSkillCheck(player);
            expect(result.length).toBe(1);
            expect(result).toContain(BeforeSkillCheckId.CylonHatred);
        });

        it('should give Tom Zarek FILP', () => {
            const player: FullPlayer = {
                userId: 'desmond',
                bot: true,
                characterId: CharacterId.TomZarek,
                arbitrator: false,
                skillCards: []
            }

            const result = _narrowBeforeSkillCheck(player);
            expect(result.length).toBe(2);
            expect(result).toContain(BeforeSkillCheckId.FILP_Decrease);
            expect(result).toContain(BeforeSkillCheckId.FILP_Increase);
        })

        it('should handle Investigative Committee', () => {
            const player: FullPlayer = {
                userId: 'desmond',
                bot: true,
                characterId: CharacterId.LeeAdama,
                arbitrator: false
            }

            player.skillCards = [SkillCardId.InvestigativeCommittee3];
            const result1 = _narrowBeforeSkillCheck(player);
            expect(result1.length).toBe(1);
            expect(result1).toContain(BeforeSkillCheckId.InvestigativeCommittee3);

            player.skillCards = [SkillCardId.InvestigativeCommittee4];
            const result2 = _narrowBeforeSkillCheck(player);
            expect(result2.length).toBe(1);
            expect(result2).toContain(BeforeSkillCheckId.InvestigativeCommittee4);

            player.skillCards = [SkillCardId.InvestigativeCommittee5];
            const result3 = _narrowBeforeSkillCheck(player);
            expect(result3.length).toBe(1);
            expect(result3).toContain(BeforeSkillCheckId.InvestigativeCommittee5);
        });

        it('should handle Scientific Research', () => {
            const player: FullPlayer = {
                userId: 'desmond',
                bot: true,
                characterId: CharacterId.LeeAdama,
                arbitrator: false
            }

            player.skillCards = [SkillCardId.ScientificResearch3];
            const result1 = _narrowBeforeSkillCheck(player);
            expect(result1.length).toBe(1);
            expect(result1).toContain(BeforeSkillCheckId.ScientificResearch3);

            player.skillCards = [SkillCardId.ScientificResearch4];
            const result2 = _narrowBeforeSkillCheck(player);
            expect(result2.length).toBe(1);
            expect(result2).toContain(BeforeSkillCheckId.ScientificResearch4);

            player.skillCards = [SkillCardId.ScientificResearch5];
            const result3 = _narrowBeforeSkillCheck(player);
            expect(result3.length).toBe(1);
            expect(result3).toContain(BeforeSkillCheckId.ScientificResearch5);
        })
    });

    describe('Difficulty via Accept Prophecy', () => {
        it('should adjust difficulty', () => {
            const skillCheck: SkillCheck = {
                which: SkillCheckType.Administration,
                types: [SkillType.Politics, SkillType.Engineering],
                pass: 7
            }
            const game = {
                acceptProphecy: true,
                actionCtx: {
                    chosenPlayer: {
                        president: false
                    }
                },
                discardedQuorumDeck: [] as QuorumCardId[]
            }
            _adjustDifficultyFromProphecy(game as any, skillCheck);
            expect(skillCheck.pass).toBe(9);
            expect(game.discardedQuorumDeck).toEqual([QuorumCardId.AcceptProphecy]);
        });

        it('should not adjust difficulty when not accepting prophecy', () => {
            const skillCheck: SkillCheck = {
                which: SkillCheckType.Administration,
                types: [SkillType.Politics, SkillType.Engineering],
                pass: 7
            }
            const game = {
                acceptProphecy: false,
                actionCtx: {
                    chosenPlayer: {
                        president: false
                    }
                },
                discardedQuorumDeck: [] as QuorumCardId[]
            }
            _adjustDifficultyFromProphecy(game as any, skillCheck);
            expect(skillCheck.pass).toBe(7);
        });
        it('should have no effect when location is not Administration or AQ', () => {
            const skillCheck: SkillCheck = {
                which: SkillCheckType.Brig,
                types: [SkillType.Politics, SkillType.Engineering],
                pass: 7
            }
            const game = {
                acceptProphecy: true,
                actionCtx: {
                    chosenPlayer: {
                        president: true
                    }
                },
                discardedQuorumDeck: [] as QuorumCardId[]
            }
            _adjustDifficultyFromProphecy(game as any, skillCheck);
            expect(skillCheck.pass).toBe(7);
        });
        it('should have no effect when player is not president', () => {
            const skillCheck: SkillCheck = {
                which: SkillCheckType.AdmiralsQuarters,
                types: [SkillType.Politics, SkillType.Engineering],
                pass: 7
            }
            const game = {
                acceptProphecy: true,
                actionCtx: {
                    chosenPlayer: {
                        president: false
                    }
                },
                discardedQuorumDeck: [] as QuorumCardId[]
            }
            _adjustDifficultyFromProphecy(game as any, skillCheck);
            expect(skillCheck.pass).toBe(7);
        });
        it('should adjust when player is not president and location is Admin', () => {
            const skillCheck: SkillCheck = {
                which: SkillCheckType.Administration,
                types: [SkillType.Politics, SkillType.Engineering],
                pass: 7
            }
            const game = {
                acceptProphecy: true,
                actionCtx: {
                    chosenPlayer: {
                        president: false
                    }
                },
                discardedQuorumDeck: [] as QuorumCardId[]
            }
            _adjustDifficultyFromProphecy(game as any, skillCheck);
            expect(skillCheck.pass).toBe(9);
        });
    });

    describe('Adjust difficulty', () => {
        let game: FullGameData;
        beforeEach(() => {
            game = {
                skillCheckCtx: {
                    skillCheck: {
                        which: SkillCheckType.Crisis,
                        types: [SkillType.Engineering, SkillType.Leadership],
                        pass: 5
                    }
                },
                discardedQuorumDeck: [] as QuorumCardId[]
            } as FullGameData;
        });

        it('should handle arbitrator increase', () => {
            _adjustDifficulty(game, [BeforeSkillCheckId.AssignArbitrator_Increase]);
            expect(game.discardedQuorumDeck).toEqual([QuorumCardId.AssignArbitrator]);
            expect(game.skillCheckCtx.skillCheck.pass).toBe(8);
        });

        it('should handle arbitrator decrease', () => {
            _adjustDifficulty(game, [BeforeSkillCheckId.AssignArbitrator_Decrease]);
            expect(game.discardedQuorumDeck).toEqual([QuorumCardId.AssignArbitrator]);
            expect(game.skillCheckCtx.skillCheck.pass).toBe(2);
        });

        it('should handle FILP increase', () => {
            _adjustDifficulty(game, [BeforeSkillCheckId.FILP_Increase]);
            expect(game.discardedQuorumDeck).toEqual([]);
            expect(game.skillCheckCtx.skillCheck.pass).toBe(7);
        });

        it('should handle FILP decrease', () => {
            _adjustDifficulty(game, [BeforeSkillCheckId.FILP_Decrease]);
            expect(game.discardedQuorumDeck).toEqual([]);
            expect(game.skillCheckCtx.skillCheck.pass).toBe(3);
        });

        it('should handle Cylon hatred', () => {
            _adjustDifficulty(game, [BeforeSkillCheckId.CylonHatred]);
            expect(game.discardedQuorumDeck).toEqual([]);
            expect(game.skillCheckCtx.skillCheck.pass).toBe(2);
        });
    });

    describe('Scoring tests', () => {
        let skillCheckCtx: SkillCheckCtx;
        beforeEach(() => {
            skillCheckCtx = {
                skillCheck: {
                    which: SkillCheckType.Crisis,
                    pass: 11,
                    types: [SkillType.Politics, SkillType.Piloting]
                },
                state: SkillCheckState.Scoring,
                beforeCheck: [],
                afterTotal: [],
                skills: [
                    [SkillCardId.MaximumFirepower3],
                    [SkillCardId.ScientificResearch5],
                    [SkillCardId.InvestigativeCommittee3, SkillCardId.ConsolidatePower2]
                ],
                score: 0
            }
        });

        it('should score correctly', () => {
            _handleScoring(skillCheckCtx);
            expect(skillCheckCtx.score).toBe(3);
        });

        it('should handle scientific research', () => {
            skillCheckCtx.beforeCheck = [[BeforeSkillCheckId.ScientificResearch4]];
            _handleScoring(skillCheckCtx);
            expect(skillCheckCtx.score).toBe(13);
        });

        it('should handle blind devotion', () => {
            skillCheckCtx.blindDevotionSkill = SkillType.Piloting;
            _handleScoring(skillCheckCtx);
            expect(skillCheckCtx.score).toBe(0);
        });
    });

    describe('Final result tests', () => {
        let skillCheckCtx: SkillCheckCtx;
        beforeEach(() => {
            skillCheckCtx = {
                skillCheck: {
                    which: SkillCheckType.Crisis,
                    pass: 11,
                    types: [SkillType.Politics, SkillType.Piloting]
                },
                score: 0
            } as SkillCheckCtx;
        });

        it('should produce final result (fail)', () => {
            skillCheckCtx.score = 10;
            _handleFinalScoring(skillCheckCtx);
            expect(skillCheckCtx.result).toBe(SkillCheckResult.Fail);
        });

        it('should produce final result (success)', () => {
            skillCheckCtx.score = 13;
            _handleFinalScoring(skillCheckCtx);
            expect(skillCheckCtx.result).toBe(SkillCheckResult.Pass);
        });

        it('should handle declare emergency', () => {
            skillCheckCtx.score = 10;
            skillCheckCtx.afterTotal = [[AfterSkillCheckTotalId.DeclareEmergency5]];
            _handleFinalScoring(skillCheckCtx);
            expect(skillCheckCtx.result).toBe(SkillCheckResult.Pass);
        });
    });
});
