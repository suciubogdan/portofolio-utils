import {Transaction} from './models/transaction';
import {LinkedListNode} from './datastructures/linked-list-node';

export class Wallet {
  private transactionsHead?: LinkedListNode<Transaction>;

  constructor(public readonly symbol: string) {}

  createTransaction(date: Date, amount: number, description?: string) {
    const transaction = {
      symbol: this.symbol,
      date: date,
      amount: amount,
      description: description
    }
    this.addTransaction(transaction);
    return transaction;
  }
  addTransaction(transaction: Transaction) {
    if (transaction.symbol !== this.symbol) {
      throw new Error(
        `Wrong symbol for the transaction. Expected ${this.symbol} but got ${transaction.symbol}`
      );
    }
    const transactionNode = new LinkedListNode<Transaction>(transaction);
    if (!this.transactionsHead) {
      this.transactionsHead = transactionNode;
    } else {
      if (this.transactionsHead.element.date > transaction.date) {
        transactionNode.next = this.transactionsHead;
        this.transactionsHead = transactionNode;
      } else {
        let current = this.transactionsHead;
        while (current && current !== transactionNode) {
          if (!current.next) {
            current.next = transactionNode;
          } else if (current.next.element.date > transaction.date) {
            transactionNode.next = current.next;
            current.next = transactionNode;
          }
          current = current.next;
        }
      }
    }
  }

  *transactions() {
    let current = this.transactionsHead;
    while (current) {
      yield current.element;
      current = current.next;
    }
  }

  balance(): number {
    if(!this.transactionsHead) {
      return 0;
    }
    let balance = 0;
    let current : LinkedListNode<Transaction> | undefined = this.transactionsHead;
    while(current) {
      balance = balance + current.element.amount;
      current = current.next;
    }
    return balance;
  }

  balanceOn(date?: Date) : number {
    if(!this.transactionsHead) {
      return 0;
    }
    let balance = 0;
    let current : LinkedListNode<Transaction> | undefined = this.transactionsHead;
    while(current && (!date || current.element.date <= date)) {
      balance = balance + current.element.amount;
      current = current.next;
    }
    return balance;
  }
}
