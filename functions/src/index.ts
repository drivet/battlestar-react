import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FullGameData, GameDocument, newGame } from "./game";
import { runGame } from "./game-manager";
import { convertToViewable } from "./viewable";
import { InputResponse } from "../../src/models/inputs";

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

export const processResponse = functions.database.ref('/games/{gameId}/responses')
    .onCreate((responseSnapshot, context) => {
        const gameId = context.params.gameId;
        const response = Object.values(responseSnapshot.val())[0] as InputResponse;
        const gameDocRef = admin.database().ref('/games/' + gameId);
        return gameDocRef.once('value').then(snapshot => {
            const gameDoc: GameDocument = snapshot.val();

            // consume the response.  Only need one at a time
            gameDoc.responses = null;

            // run through simulation
            runGame(gameDoc, response);

            // re-create view
            gameDoc.view = convertToViewable(gameDoc.gameState, gameDoc.players);

            return admin.database().ref('/games/' + gameId).set(gameDoc);
        });
    });
