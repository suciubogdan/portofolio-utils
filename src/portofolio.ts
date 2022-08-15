import {Transaction} from './models/transaction';
import {Wallet} from './wallet';

export class Portofolio {
  private wallets: Map<string, Wallet>;
  constructor() {
    this.wallets = new Map<string, Wallet>();
  }
  addTransaction(transaction: Transaction) {
    let wallet = this.wallets.get(transaction.symbol);
    if (!wallet) {
      wallet = new Wallet(transaction.symbol);
      this.wallets.set(transaction.symbol, wallet);
    }
    wallet.addTransaction(transaction);
  }
}
