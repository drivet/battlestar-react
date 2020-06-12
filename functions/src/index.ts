import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import firebase from "../../src/firebase";
import { FullGameData, GameDocument, newGame } from "./game-manager";

export const startGame = functions.https.onCall((players, context) => {
    const gameRef = firebase.database().ref('games').push();
    const gameId = gameRef.key;

    const users = [];
    for (let i = 0; i < players; i++) {
        users.push('player_'+i);
    }
    const gameDoc: GameDocument = { gameId: gameId, full: newGame(users) }

    return admin.database().ref('/games/' + gameId).set(gameDoc).then(() => {
        console.log('Game created');
    });
});

export const sendVisibleUpdates = functions.database.ref('/games/{gameId}/full')
    .onWrite((change, context) => {
        const fullGame: FullGameData = change.after.val();

        const uppercase = original.toUpperCase();
        // You must return a Promise when performing asynchronous tasks inside a Functions such as
        // writing to the Firebase Realtime Database.
        // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
        return change.after.ref.parent.child('uppercase').set(uppercase);

    });

