import {MarketHistory} from "../src/market-history";
import {expect} from 'chai';

describe('Market History', () => {
   const today = new Date();
   const yesterday = new Date(today.valueOf() - 24*60*60*1000);
   const lastWeek = new Date(today.valueOf() - 7 * 24*60*60*1000);
   const tomorrow = new Date(today.valueOf() + 24*60*60*1000);

   const marketHistory = new MarketHistory("RON");
   marketHistory.addEntry(lastWeek, "EUR", 4.9, 4.92, 4.89, 4.91, 1000);
   marketHistory.addEntry(yesterday, "EUR", 4.95, 4.97, 4.92, 4.96, 1000);
   marketHistory.addEntry(today, "EUR", 4.92, 4.95, 4.89, 4.93, 1000);
   it(`high`, () =>{
      expect(marketHistory.high("EUR", yesterday)).to.equal(4.97);
      expect(marketHistory.high("EUR", tomorrow)).to.equal(4.95);
   });
});
