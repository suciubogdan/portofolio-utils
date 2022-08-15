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

  it('should return the transactions added in the correct order', () => {
    const wallet = new Wallet(symbol);
    const today = new Date();
    const yesterday = new Date(today.valueOf() - 1 * 24*60*60*1000);
    const lastWeek = new Date(today.valueOf() - 7 * 24*60*60*1000);
    const transaction3 = wallet.createTransaction(today, 3, "third");
    const transaction1 = wallet.createTransaction(lastWeek, 1, "first");
    const transaction2 = wallet.createTransaction(yesterday, 2, "second");

    const transactions = Array.from(wallet.transactions());

    expect(transactions[0]).to.equal(transaction1);
    expect(transactions[1]).to.equal(transaction2);
    expect(transactions[2]).to.equal(transaction3);

    expect(transactions.length).to.equal(3);
  })
});
