import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GameDocument, newGame } from "./game";
import { runGame } from "./game-manager";
import { InputResponse } from "../../src/models/inputs";

admin.initializeApp();

export interface StartGameParams {
    users: string[];
    tableId: string;
}

export const processTableDelete = functions.database.ref('/tables/{tableId}')
    .onDelete((snapshot, context) => {
        const table = snapshot.val();
        return admin.database().ref('/games/' + table.gameId).set(null);
    });

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

export const processResponse = functions.database.ref('/games/{gameId}/responses')
    .onCreate((responseSnapshot, context) => {
        const response = Object.values(responseSnapshot.val())[0] as InputResponse<any>;
        const gameId = context.params.gameId;
        const gameDocRef = admin.database().ref('/games/' + gameId);
        return gameDocRef.once('value').then(snapshot => {
            const gameDoc: GameDocument = snapshot.val();
            runGame(gameDoc, response);
            return admin.database().ref('/games/' + gameId).set(gameDoc);
        });
    });
