import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { newGame } from "./game-manager";

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

/*
export const sendVisibleUpdates = functions.database.ref('/games/{gameId}/full')
    .onWrite((change, context) => {
        const gameId = context.params.gameId;
        const fullGame: FullGameData = change.after.val();
        const viewable = convertToViewable(fullGame);
        return admin.database().ref('/games/' + gameId + '/viewable').set(viewable).then(() => {
            console.log('Updates sent');
        });
    });
*/