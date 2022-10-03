import TreeMap from "./tree-map";
const PRESENT = {};
export class TreeSet<E> {
    private m: TreeMap<E, object> = new TreeMap<E, object>();
    size() {
        return this.m.getSize();
    }
    isEmpty() {
        return this.m.isEmpty();
    }
    contains(o: E) {
        return this.m.containsKey(o);
    }
    add(e: E) {
        return this.m.put(e, PRESENT) == null;
    }
    remove(o: E) {
        return this.m.remove(o) === PRESENT;
    }
    clear() {
        this.m.clear();
    }
}
