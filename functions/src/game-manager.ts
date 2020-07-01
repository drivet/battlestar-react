import { CharacterId, GameState, getCharacter, LocationId, SkillType } from "../../src/models/game-data";
import {
    distributeTitles,
    FullPlayer,
    GameDocument,
    setupDecks,
    setupDestinyDeck,
    setupInitialShips,
    setupLoyalty
} from "./game";
import {
    CharacterSelectionInput,
    CharacterSelectionRequest,
    InitialLocationInput,
    InputId,
    ReceiveInitialSkillsInput,
    ReceiveSkillsInput
} from "../../src/models/inputs";
import { selectCharacter } from "./character";
import { addCard, addCards, deal, dealOne } from "./deck";
import { handleMovement } from "./location";
import { handleAction } from "./action";

/**
 * This is always called because someone has given an input which in theory should allow us to continue the game
 */
export function runGame(gameDoc: GameDocument) {

    while (!gameDoc.gameState.inputRequest) {
        if (gameDoc.gameState.state === GameState.CharacterSelection) {
            handleCharacterSelection(gameDoc);
        } else if (gameDoc.gameState.state === GameState.CharacterSetup) {
            handleCharacterSetup(gameDoc);
        } else if (gameDoc.gameState.state === GameState.SetupCards) {
            setupDecksAndTitles(gameDoc);
        } else if (gameDoc.gameState.state === GameState.InitialSkillSelection) {
            handleReceiveInitialSkills(gameDoc);
        } else if (gameDoc.gameState.state === GameState.SetupDestiny) {
            handleSetupDestiny(gameDoc);
        } else if (gameDoc.gameState.state === GameState.SetupInitialShips) {
            handleSetupInitialShips(gameDoc);
        } else if (gameDoc.gameState.state === GameState.ReceiveSkills) {
            handleReceiveSkills(gameDoc);
        } else if (gameDoc.gameState.state === GameState.Movement) {
            handleMovement(gameDoc);
        } else if (gameDoc.gameState.state === GameState.Action) {
            handleAction(gameDoc)
        }

        // we assume the data was used up in one iteration
        gameDoc.input = null;
    }
}

function handleCharacterSelection(gameDoc: GameDocument) {
    const possibleInput = gameDoc.input as CharacterSelectionInput;
    const currentPlayer = getCurrentPlayer(gameDoc);
    const input = !possibleInput && currentPlayer.bot ? {
        inputId: InputId.SelectCharacter,
        userId: currentPlayer.userId,
        characterPool: gameDoc.gameState.characterPool,
        selectedCharacter: gameDoc.gameState.characterPool.selectable[0]
    }: possibleInput;

    if (input) {
        currentPlayer.characterId = input.selectedCharacter;
        gameDoc.gameState.characterPool = selectCharacter(input.characterPool, input.selectedCharacter);
        nextPlayerAndChangeState(gameDoc, GameState.CharacterSetup)
    } else {
        gameDoc.gameState.inputRequest = {
            userId: gameDoc.gameState.userIds[gameDoc.gameState.currentPlayer],
            inputId: InputId.SelectCharacter,
            characterPool: gameDoc.gameState.characterPool
        } as CharacterSelectionRequest
    }
}

function handleCharacterSetup(gameDoc: GameDocument) {
    const currentPlayer = getCurrentPlayer(gameDoc);
    if (currentPlayer.characterId === CharacterId.LeeAdama) {
        handleApolloSetup(gameDoc, currentPlayer);
    } else {
        handleStandardCharacterSetup(gameDoc, currentPlayer);
    }
}

function handleApolloSetup(gameDoc: GameDocument, player: FullPlayer) {
    const possibleInput = gameDoc.input as InitialLocationInput;
    const input = !possibleInput && player.bot ? {
        inputId: InputId.SelectInitialLocation,
        userId: player.userId,
        left: true
    } : possibleInput;

    if (input) {
        player.location = input.left ? LocationId.FrontBelow : LocationId.BackBelow;
        nextPlayerAndChangeState(gameDoc, GameState.SetupCards)
    } else {
        gameDoc.gameState.inputRequest = {
            userId: player.userId,
            inputId: InputId.SelectInitialLocation,
        }
    }
}

function handleStandardCharacterSetup(gameDoc: GameDocument, player: FullPlayer) {
    const character = getCharacter(player.characterId);
    if (character.startLocation !== null && character.startLocation !== undefined) {
        player.location = getCharacter(player.characterId).startLocation;
    }
    nextPlayerAndChangeState(gameDoc, GameState.SetupCards)
}

function setupDecksAndTitles(gameDoc: GameDocument) {
    const players = Object.values(gameDoc.players)

    distributeTitles(players);
    setupLoyalty(gameDoc);
    setupDecks(gameDoc.gameState);

    const president = players.find(p => p.president);
    addCards(president.quorumHand, deal(gameDoc.gameState.quorumDeck, 2));

    gameDoc.gameState.state = GameState.InitialSkillSelection;

    // first player doesn't get initial skills
    gameDoc.gameState.currentPlayer = 1;
}

function handleReceiveInitialSkills(gameDoc: GameDocument) {
    const possibleInput = gameDoc.input as ReceiveInitialSkillsInput;
    const currentPlayer = getCurrentPlayer(gameDoc);
    const input = !possibleInput && currentPlayer.bot ? {
        userId: currentPlayer.userId,
        inputId: InputId.ReceiveInitialSkills,
        skills: botInitialSkills(currentPlayer.characterId)
    } : possibleInput;

    if (input) {
        validateSkills(currentPlayer.characterId, input.skills);
        input.skills.forEach(s => addCard(currentPlayer.skillCards,
            dealOne(gameDoc.gameState.skillDecks[SkillType[s]])));
        nextPlayerAndChangeState(gameDoc, GameState.SetupDestiny);
    } else {
        gameDoc.gameState.inputRequest = {
            userId: gameDoc.gameState.userIds[gameDoc.gameState.currentPlayer],
            inputId: InputId.ReceiveInitialSkills,
        }
    }
}

function handleSetupDestiny(gameDoc: GameDocument) {
    setupDestinyDeck(gameDoc.gameState);
    gameDoc.gameState.state = GameState.SetupInitialShips;
}

function handleSetupInitialShips(gameDoc: GameDocument) {
    setupInitialShips(gameDoc.gameState)
    gameDoc.gameState.state = GameState.ReceiveSkills;
}

function handleReceiveSkills(gameDoc: GameDocument) {
    const currentPlayer = getCurrentPlayer(gameDoc);
    if (hasMultiSkills(currentPlayer.characterId)) {
        handleReceiveMultiSkills(gameDoc);
    } else {
        handleReceiveStandardSkills(gameDoc);
    }
}

function handleReceiveMultiSkills(gameDoc: GameDocument) {
    const possibleInput = gameDoc.input as ReceiveSkillsInput;
    const currentPlayer = getCurrentPlayer(gameDoc);
    const input: ReceiveSkillsInput = !possibleInput && currentPlayer.bot ? {
        userId: currentPlayer.userId,
        inputId: InputId.ReceiveSkills,
        skills: botSkills(currentPlayer.characterId)
    } : possibleInput;

    if (input) {
        // validateSkills(currentPlayer.characterId, input.skills);

        // hand out the multi skills
        input.skills.forEach(s => addCard(currentPlayer.skillCards,
            dealOne(gameDoc.gameState.skillDecks[SkillType[s]])));

        // hand out the standard skills
        handleReceiveStandardSkills(gameDoc);

    } else {
        gameDoc.gameState.inputRequest = {
            userId: gameDoc.gameState.userIds[gameDoc.gameState.currentPlayer],
            inputId: InputId.ReceiveSkills,
        }
    }
}

function handleReceiveStandardSkills(gameDoc: GameDocument) {
    const currentPlayer = getCurrentPlayer(gameDoc);
    const c = getCharacter(currentPlayer.characterId);
    c.cardsDue.filter(cd => cd.skills.length === 1).forEach(cd => {
        const skill = cd.skills[0];
        const count = cd.count;
        addCards(currentPlayer.skillCards, deal(gameDoc.gameState.skillDecks[SkillType[skill]], count));
    });
    gameDoc.gameState.state = GameState.Movement;
}

function hasMultiSkills(character: CharacterId): boolean {
    return getCharacter(character).cardsDue.some(cd => cd.skills.length > 1);
}

function validateSkills(character: CharacterId, skills: SkillType[]): boolean {
    const c = getCharacter(character);
    return skills.every(s => c.cardsDue.map(d => d.skills)
                                       .some((ds: SkillType[]) => ds.indexOf(s) !== -1));
}

function botSkills(character: CharacterId): SkillType[] {
    const c = getCharacter(character);
    const skills: SkillType[] = [];
    c.cardsDue.forEach(cd => {
        if (cd.skills.length > 1) {
            for (let i = 0; i < cd.count; i++) {
                skills.push(cd.skills[0]);
            }
        }
    });
    return skills;
}

function botInitialSkills(character: CharacterId): SkillType[] {
    const c = getCharacter(character);
    const skill = c.cardsDue[0].skills[0];
    return [skill, skill, skill];
}

export function getCurrentPlayer(gameDoc: GameDocument): FullPlayer {
    return gameDoc.players[gameDoc.gameState.userIds[gameDoc.gameState.currentPlayer]];
}

function isLastPlayer(gameDoc: GameDocument): boolean {
    return gameDoc.gameState.currentPlayer === (gameDoc.gameState.userIds.length - 1);
}

function nextPlayerAndChangeState(gameDoc: GameDocument, stateIfDone: GameState) {
    if (isLastPlayer(gameDoc)) {
        gameDoc.gameState.currentPlayer = 0;
        gameDoc.gameState.state = stateIfDone;
    } else {
        gameDoc.gameState.currentPlayer++;
    }
}
