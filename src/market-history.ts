import TreeMap from "./datastructures/tree-map";

export class MarketHistory {
    private symbols: Map<string, TreeMap<Date, MarketDataEntry>> = new Map<string, TreeMap<Date, MarketDataEntry>>();
    constructor(public currency: string) {

    }
    addEntry(date: Date, symbol: string, open: number, high: number, low: number, close: number, volume: number) {
        const md = new MarketDataEntry(date, symbol, this.currency, open, high, low, close, volume);
        let symbolData = this.symbols.get(symbol);
        if(!symbolData) {
            symbolData = new TreeMap<Date, MarketDataEntry>();
            this.symbols.set(symbol, symbolData);
        }
        symbolData.put(date, md);
    }
    open(symbol: string, date: Date) {
        return this.getValue(symbol, date, e => e.open);
    }
    high(symbol: string, date: Date) {
        return this.getValue(symbol, date, e => e.high);
    }
    low(symbol: string, date: Date) {
        return this.getValue(symbol, date, e => e.low);
    }
    close(symbol: string, date: Date) {
        return this.getValue(symbol, date, e => e.close);
    }
    volume(symbol: string, date: Date) {
        return this.getValue(symbol, date, e => e.volume);
    }

    private getValue(symbol: string, date: Date, f: (e: MarketDataEntry)=>number) {
        const symbolData = this.symbols.get(symbol);
        if(!symbolData) {
            throw new Error(`Symbol '${symbol}' is not supported.`);
        }
        const md = symbolData.getEqualOrLowerEntry(date);
        if(md) {
            return f(md.value)
        } else {
            throw new Error(`Cannot find value for symbol ${symbol} at date ${date}`);
        }
    }
}

class MarketDataEntry {
    constructor(
        public readonly date: Date,
        public readonly symbol: string,
        public readonly currency: string,
        public readonly open: number,
        public readonly high: number,
        public readonly low: number,
        public readonly close: number,
        public readonly volume: number,
                ) {

    }

}
