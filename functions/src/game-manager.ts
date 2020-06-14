import { CharacterId, GameState, LocationId, SkillType } from "../../src/models/game-data";
import { distributeTitles, GameDocument, setupDecks, setupLoyalty } from "./game";
import {
    CharacterSelectionRequest,
    CharacterSelectionResponse,
    InitialLocationResponse,
    InputId,
    InputResponse,
    ReceiveInitialSkillsResponse
} from "../../src/models/inputs";
import { getCharacter, selectCharacter } from "./character";
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

    const data = { ...gameDoc.gameState.inputRequest, ...response };
    

    if (gameDoc.gameState.state === GameState.SetupCharacterSelection) {
        handleCharacterSelection(gameDoc, response as CharacterSelectionResponse);
    } else if (gameDoc.gameState.state === GameState.SetupSelectInitialLocation) {
        handleSelectInitialLocation(gameDoc, response as InitialLocationResponse);
    } else if (gameDoc.gameState.state === GameState.SetupInitialSkillSelection) {
        handleReceiveInitialSkills(gameDoc, response as ReceiveInitialSkillsResponse);
    }
}

function handleCharacterSelection(gameDoc: GameDocument, response: CharacterSelectionResponse) {
    const inputReq = gameDoc.gameState.inputRequest as CharacterSelectionRequest;
    const index = gameDoc.gameState.userIds.indexOf(inputReq.userId);
    const player = gameDoc.players[gameDoc.gameState.userIds[index]];
    player.characterId = response.selectedCharacter;

    const players = Object.values(gameDoc.players);
    if (index === gameDoc.gameState.userIds.length - 1) {
        // done with character selection, move to next phase

        // we skip the first player for the initial skill card choices
        gameDoc.gameState.currentPlayer = 1;

        // give everyone a location that you can
        players.filter(p => p.characterId !== CharacterId.LeeAdama && p.characterId !== CharacterId.KarlAgathon)
            .forEach(p => p.location = getCharacter(p.characterId).startLocation);

        // but apollo may need help
        const apollo = players.find(p => p.characterId === CharacterId.LeeAdama);
        gameDoc.gameState.state = apollo ? GameState.SetupSelectInitialLocation: GameState.SetupInitialSkillSelection;
        if (apollo) {
            gameDoc.gameState.inputRequest = {
                userId: apollo.userId,
                inputId: InputId.SelectInitialLocation,
            }
        } else {
            setupDecksAndTitles(gameDoc);
            gameDoc.gameState.inputRequest = {
                userId: gameDoc.gameState.userIds[gameDoc.gameState.currentPlayer],
                inputId: InputId.ReceiveInitialSkills,
            }
        }
    } else {
        gameDoc.gameState.currentPlayer++;
        gameDoc.gameState.inputRequest = {
            userId: gameDoc.gameState.userIds[gameDoc.gameState.currentPlayer],
            inputId: InputId.SelectCharacter,
            characterPool: selectCharacter(inputReq.characterPool, response.selectedCharacter)
        } as CharacterSelectionRequest
    }
}

function handleSelectInitialLocation(gameDoc: GameDocument, response: InitialLocationResponse) {
    const players = Object.values(gameDoc.players);
    const apollo = players.find(p => p.characterId === CharacterId.LeeAdama);
    apollo.location = response.left ? LocationId.FrontBelow : LocationId.BackBelow;
    gameDoc.gameState.state = GameState.SetupInitialSkillSelection;
    setupDecksAndTitles(gameDoc);
    gameDoc.gameState.inputRequest = {
        userId: gameDoc.gameState.userIds[gameDoc.gameState.currentPlayer],
        inputId: InputId.ReceiveInitialSkills,
    }
}

function handleReceiveInitialSkills(gameDoc: GameDocument, response: ReceiveInitialSkillsResponse) {
    const inputReq = gameDoc.gameState.inputRequest;
    const index = gameDoc.gameState.userIds.indexOf(inputReq.userId);
    const player = gameDoc.players[gameDoc.gameState.userIds[index]];

    validateSkills(player.characterId, response.skills);

    response.skills.forEach(s => addCard(player.skillCards, dealOne(gameDoc.gameState.skillDecks[SkillType[s]])));

    if (index === gameDoc.gameState.userIds.length - 1) {
        // done with receive initial skills
        gameDoc.gameState.currentPlayer = 0;
        gameDoc.gameState.inputRequest = {
            userId: gameDoc.gameState.userIds[gameDoc.gameState.currentPlayer],
            inputId: InputId.ReceiveSkills,
        }
    } else {
        gameDoc.gameState.currentPlayer++;
        gameDoc.gameState.inputRequest = {
            userId: gameDoc.gameState.userIds[gameDoc.gameState.currentPlayer],
            inputId: InputId.ReceiveInitialSkills,
        }
    }
}

function setupDecksAndTitles(gameDoc: GameDocument) {
    distributeTitles(Object.values(gameDoc.players));
    setupLoyalty(gameDoc);
    setupDecks(gameDoc.gameState);
    addCards(gameDoc.gameState.quorumHand, deal(gameDoc.gameState.quorumDeck, 2));
}

function validateSkills(character: CharacterId, skills: SkillType[]): boolean {
    const c = getCharacter(character);
    return skills.every(s => c.cardsDue.map(d => d.skills)
                                       .some((ds: SkillType[]) => ds.indexOf(s) !== -1))
}