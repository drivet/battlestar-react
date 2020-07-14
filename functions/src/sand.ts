import { SkillDecks } from "./skills";
import { SkillType } from "../../src/models/game-data";
import { GameDocument } from "./game";

/**
 * It appears that Firebase doesn't preserve empty arrays when doing a read.  But the objects are
 * easier to use if we have them so fill those out those sharp edges here.
 */
export function sandGameDoc(gameDoc: GameDocument) {
    gameDoc.gameState.quorumDeck = gameDoc.gameState.quorumDeck ? gameDoc.gameState.quorumDeck : [];
    gameDoc.gameState.discardedQuorumDeck = gameDoc.gameState.discardedQuorumDeck ? gameDoc.gameState.discardedQuorumDeck : [];

    gameDoc.gameState.discardedSkillDecks =
        gameDoc.gameState.discardedSkillDecks ? gameDoc.gameState.discardedSkillDecks : {}
    sandSkillDecks(gameDoc.gameState.discardedSkillDecks);
    gameDoc.view.discardedSkillDecks =
        gameDoc.view.discardedSkillDecks ? gameDoc.view.discardedSkillDecks : {}
    sandSkillDecks(gameDoc.view.discardedSkillDecks);

    gameDoc.view.activeRaiders = gameDoc.view.activeRaiders ? gameDoc.view.activeRaiders : {};
    gameDoc.view.activeHeavyRaiders = gameDoc.view.activeHeavyRaiders ? gameDoc.view.activeHeavyRaiders : {};
    gameDoc.view.activeCivilians = gameDoc.view.activeCivilians ? gameDoc.view.activeCivilians : {};
    gameDoc.view.activeBasestars = gameDoc.view.activeBasestars ? gameDoc.view.activeBasestars : [];

    const players = Object.values(gameDoc.players)
    players.forEach(p => {
        p.loyaltyCards = p.loyaltyCards ? p.loyaltyCards : [];
        p.quorumHand = p.quorumHand ? p.quorumHand : [];
        p.skillCards = p.skillCards ? p.skillCards : [];
    });
}

function sandSkillDecks(skillDecks: SkillDecks) {
    sandSkillDeck(skillDecks, SkillType.Tactics);
    sandSkillDeck(skillDecks, SkillType.Engineering);
    sandSkillDeck(skillDecks, SkillType.Leadership);
    sandSkillDeck(skillDecks, SkillType.Politics);
    sandSkillDeck(skillDecks, SkillType.Piloting);
}

function sandSkillDeck(skillDecks: SkillDecks, skillType: SkillType) {
    const key = SkillType[skillType];
    skillDecks[key] = skillDecks[key] ? skillDecks[key] : [];
}