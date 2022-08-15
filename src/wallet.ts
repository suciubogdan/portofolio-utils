import {Transaction} from './models/transaction';
import {LinkedListNode} from './datastructures/linked-list-node';

export class Wallet {
  private transactionsHead?: LinkedListNode<Transaction>;

  constructor(public readonly symbol: string) {}

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
}