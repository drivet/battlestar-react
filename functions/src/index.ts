import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FullGameData, newGame } from "./game";

admin.initializeApp();

export interface StartGameParams {
    users: string[];
    tableId: string;
}

export const startGame = functions.https.onCall((params: StartGameParams, context) => {
    const gameRef = admin.database().ref('games').push();
    const gameId = gameRef.key;

    const gameDoc = newGame(gameId, params.users);

    const updates = {};
    updates['/games/' + gameId] = gameDoc;
    updates['/tables/' + params.tableId + '/gameId'] = gameId;

    return admin.database().ref().update(updates)
        .then(() => console.log('Game document created'));
});

export const runGame = functions.database.ref('/games/{gameId}/responses')
    .onCreate((snapshot, context) => {
        const gameId = context.params.gameId;
        const response = snapshot.val();
        const gameState = admin.database().ref('/games/' + gameId + '/gameState').once('value');
        const players = admin.database().ref('/games/' + gameId + '/players').once('value');
        const viewable = convertToViewable(fullGame);
    });
