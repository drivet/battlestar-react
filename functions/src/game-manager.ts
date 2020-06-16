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
    InputResponse,
    ReceiveInitialSkillsInput
} from "../../src/models/inputs";
import { selectCharacter } from "./character";
import { addCard, addCards, deal, dealOne } from "./deck";

/**
 * This is always called because someone has given an input which in theory should allow us to continue the game
 */
export function runGame(gameDoc: GameDocument, response: InputResponse) {
    if (gameDoc.gameState.inputRequest.userId !== response.userId) {
        console.log('InputRequest userId: ' + gameDoc.gameState.inputRequest.userId +
            ', response userId: ' + response.userId + ', does not match. Error!');
        return;
    }

    if (gameDoc.gameState.inputRequest.inputId !== response.inputId) {
        console.log('InputRequest inputId: ' + gameDoc.gameState.inputRequest.inputId +
            ', response inputId: ' + response.inputId + ', does not match. Error!');
        return;
    }

    let data = { ...gameDoc.gameState.inputRequest, ...response };

    // We've capture the input into a data variable, so we can delete the input request
    // Now we crank through the game until we need need another input, which may be a couple of cranks!
    gameDoc.gameState.inputRequest = null;
    while (!gameDoc.gameState.inputRequest) {
        if (gameDoc.gameState.state === GameState.CharacterSelection) {
            handleCharacterSelection(gameDoc, data as CharacterSelectionInput);
        } else if (gameDoc.gameState.state === GameState.CharacterSetup) {
            handleCharacterSetup(gameDoc, data as InitialLocationInput);
        } else if (gameDoc.gameState.state === GameState.SetupCards) {
            setupDecksAndTitles(gameDoc);
        } else if (gameDoc.gameState.state === GameState.InitialSkillSelection) {
            handleReceiveInitialSkills(gameDoc, data as ReceiveInitialSkillsInput);
        } else if (gameDoc.gameState.state === GameState.SetupDestiny) {
            handleSetupDestiny(gameDoc);
        } else if (gameDoc.gameState.state === GameState.SetupInitialShips) {
            handleSetupInitialShips(gameDoc);
        } else if (gameDoc.gameState.state === GameState.ReceiveSkills) {
            handleReceiveSkills(gameDoc);
        }

        // we assume the data was used up in one iteration
        data = null;
    }
}

function handleCharacterSelection(gameDoc: GameDocument, possibleInput: CharacterSelectionInput) {
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
        nextPlayerInSetup(gameDoc, GameState.CharacterSetup)
    } else {
        gameDoc.gameState.inputRequest = {
            userId: gameDoc.gameState.userIds[gameDoc.gameState.currentPlayer],
            inputId: InputId.SelectCharacter,
            characterPool: gameDoc.gameState.characterPool
        } as CharacterSelectionRequest
    }
}

function handleCharacterSetup(gameDoc: GameDocument, input?: any) {
    const currentPlayer = getCurrentPlayer(gameDoc);
    if (currentPlayer.characterId === CharacterId.LeeAdama) {
        handleApolloSetup(gameDoc, currentPlayer, input);
    } else {
        handleStandardCharacterSetup(gameDoc, currentPlayer);
    }
}

function handleApolloSetup(gameDoc: GameDocument, player: FullPlayer, possibleInput: InitialLocationInput) {
    const input = !possibleInput && player.bot ? {
        inputId: InputId.SelectInitialLocation,
        userId: player.userId,
        left: true
    } : possibleInput;

    if (input) {
        player.location = input.left ? LocationId.FrontBelow : LocationId.BackBelow;
        nextPlayerInSetup(gameDoc, GameState.SetupCards)
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
    nextPlayerInSetup(gameDoc, GameState.SetupCards)
}

function setupDecksAndTitles(gameDoc: GameDocument) {
    const players = Object.values(gameDoc.players)
    players.forEach(p => p.loyaltyCards = p.loyaltyCards ? p.loyaltyCards : []);
    gameDoc.gameState.quorumDeck = gameDoc.gameState.quorumDeck ? gameDoc.gameState.quorumDeck : [];

    distributeTitles(players);
    setupLoyalty(gameDoc);
    setupDecks(gameDoc.gameState);

    const president = players.find(p => p.president);
    president.quorumHand = president.quorumHand ? president.quorumHand : [];
    addCards(president.quorumHand, deal(gameDoc.gameState.quorumDeck, 2));

    gameDoc.gameState.state = GameState.InitialSkillSelection;

    // first player doesn't get initial skills
    gameDoc.gameState.currentPlayer = 1;
}

function handleReceiveInitialSkills(gameDoc: GameDocument, possibleInput: ReceiveInitialSkillsInput) {
    Object.values(gameDoc.players).forEach(p => p.skillCards = p.skillCards ? p.skillCards : []);
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
        nextPlayerInSetup(gameDoc, GameState.SetupDestiny);
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
    gameDoc.gameState.inputRequest = {
        userId: gameDoc.gameState.userIds[gameDoc.gameState.currentPlayer],
        inputId: InputId.ReceiveSkills,
    }
}

function validateSkills(character: CharacterId, skills: SkillType[]): boolean {
    const c = getCharacter(character);
    return skills.every(s => c.cardsDue.map(d => d.skills)
                                       .some((ds: SkillType[]) => ds.indexOf(s) !== -1));
}

// pick 3 skill types from characters skill set
function botInitialSkills(character: CharacterId): SkillType[] {
    const c = getCharacter(character);
    const skill = c.cardsDue[0].skills[0];
    return [skill, skill, skill];
}

function getCurrentPlayer(gameDoc: GameDocument): FullPlayer {
    return gameDoc.players[gameDoc.gameState.userIds[gameDoc.gameState.currentPlayer]];
}

function isLastPlayer(gameDoc: GameDocument): boolean {
    return gameDoc.gameState.currentPlayer === (gameDoc.gameState.userIds.length - 1);
}

function nextPlayerInSetup(gameDoc: GameDocument, stateIfDone: GameState) {
    if (isLastPlayer(gameDoc)) {
        gameDoc.gameState.currentPlayer = 0;
        gameDoc.gameState.state = stateIfDone;
    } else {
        gameDoc.gameState.currentPlayer++;
    }
}
