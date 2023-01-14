import { GameTable } from '../src/assests/gameTable';
import expect from 'chai';

describe("Checking GameTable's methods", () => {
    it("returns 6 cards in case of 'low' option", () => {
        expect(GameTable.getCardsByLevel('low')).to.have.lengthOf(6);
    });
});
