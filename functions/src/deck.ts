export function addCards<T>(deck1: T[], deck2: T[]) {
    deck1.push(...deck2);
}

export function addCard<T>(cards: T[], card: T) {
    cards.push(card);
}

export function dealOne<T>(cards: T[]): T {
    return deal(cards, 1)[0];
}

export function deal<T>(cards: T[], count: number): T[] {
    return cards.splice(0, count);
}

export function shuffle<T>(cards: T[]): T[] {
    let currentIndex = cards.length;
    let temporaryValue;
    let randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }

    return cards;
}

export function makeDeck<T>(card: T, count: number): T[] {
    return new Array(count).fill(card);
}
