export interface Transaction {
  date: Date;
  symbol: string;
  amount: number;
  description?: string;
}
