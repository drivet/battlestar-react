// @ts-ignore
const fft = require("firebase-functions-test")({
    databaseURL: 'https://battlestar-test.firebaseio.com',
    storageBucket: 'battlestar-test.appspot.com',
    projectId: 'battlestar-test',
}, './battlestar-test-firebase-adminsdk-6peik-487fdb3883.json');

const admin = require('firebase-admin');

describe('Cloud Functions', () => {
    let functions: any;

    beforeEach(() => {
        functions = require('../src/index');
    });

    it('run startGame', async () => {
        const wrapped = fft.wrap(functions.startGame);
        const result = await wrapped({ users: ['a', 'b', 'c'], tableId: '123' }, null);
        expect(result).toBeFalsy();
    });

    afterEach(async () => {
        fft.cleanup();
        await admin.database().ref('/').remove();
    });
});
