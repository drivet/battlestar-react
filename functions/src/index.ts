import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FullGameData, GameDocument, newGame } from "./game-manager";
import { convertToViewable } from "./viewable";

admin.initializeApp();

export interface StartGameParams {
    users: string[];
    tableId: string;
}
export const startGame = functions.https.onCall((params, context) => {
    const gameRef = admin.database().ref('games').push();
    const gameId = gameRef.key;

    const gameDoc: GameDocument = { gameId: gameId!, full: newGame(params.users) }

    const updates = {};
    updates['/games/' + gameId] = gameDoc;
    updates['/tables/'+params.tableId+'/gameId'] = gameId;

    return admin.database().ref().update(updates).then(() => console.log('Game created'));
});

export const sendVisibleUpdates = functions.database.ref('/games/{gameId}/full')
    .onWrite((change, context) => {
        const gameId = context.params.gameId;
        const fullGame: FullGameData = change.after.val();
        const viewable = convertToViewable(fullGame);
        return admin.database().ref('/games/' + gameId + '/viewable').set(viewable).then(() => {
            console.log('Updates sent');
        });
    });
