import {Wallet} from '../src/wallet';
import {Transaction} from '../src/models/transaction';
import {expect} from 'chai';

const symbol = 'SYM';
const anotherSymbol = 'BOL';
describe('wallet', () => {
  it("shouldn't add transactions for the wrong symbol", () => {
    const wallet = new Wallet(symbol);
    const transaction: Transaction = {
      date: new Date(),
      symbol: anotherSymbol,
      amount: 14,
      description: 'this is the wrong symbol for the wallet',
    };
    expect(() => {
      wallet.addTransaction(transaction);
    }).to.throw();
  });
});
