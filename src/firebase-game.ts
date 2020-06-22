import firebase from "./firebase";
import { myUserId } from "./App";

export function gameViewOn(gameId: string, cb: (ViewableGameData) =>  void) {
    return firebase.database().ref('/games/' + gameId + '/view')
        .on('value', snapshot => cb(snapshot.val()));
}

export function playerOn(gameId: string, cb: (FullPlayer) => void) {
    return firebase.database().ref('/games/' + gameId + '/players/' + myUserId)
        .on('value', snapshot => cb(snapshot.val()));
}

export function pushResponse<T>(gameId: string, response: T) {
    return firebase.database().ref('/games/' + gameId + '/responses').push(response);
}
