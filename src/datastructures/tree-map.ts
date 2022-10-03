export default class TreeMap<K, V> {
    size: number = 0;
    root: Entry<K, V> | null = null;
    modCount: number = 0;

    getSize() : number {
        return this.size;
    }

    containsKey(key: K): boolean {
        return this.getEntry(key) != null;
    }

    getEntry(key: K): Entry<K,V> | null {
        let p = this.root;
        while(p != null) {
            if(key < p.key) {
                p = p.left;
            } else if (key > p.key) {
                p = p.right;
            } else {
                return p;
            }
        }
        return null;
    }

    isEmpty() {
        return this.getSize() == 0;
    }

    put(key: K, value: V, replaceOld: boolean = false) {
        let t: Entry<K, V> | null = this.root;
        if(t == null) {
            this.addEntryToEmptyMap(key, value);
            return null;
        }
        let parent : Entry<K, V> | null;
        do {
            parent = t;
            if(key < t.key) {
                t = t.left;
            } else if(key > t.key) {
                t = t.right;
            } else {
                const oldValue = t.value;
                if(replaceOld || oldValue == null) {
                    t.value = value;
                }
                return oldValue;
            }
        } while (t != null);
        this.addEntry(key, value, parent);
        return null;
    }
    addEntryToEmptyMap(key: K,  value: V) {
        this.root = new Entry<K, V>(key, value, null);
        this.size = 1;
        this.modCount++;
    }
    private addEntry(key: K, value: V, parent: Entry<K, V>) {
        const e = new Entry(key, value, parent);
        if(parent.key > key) {
            parent.left = e;
        } else {
            parent.right = e;
        }
        this.fixAfterInsertion(e);
        this.size++;
        this.modCount++;
    }
    private fixAfterInsertion(entry: Entry<K, V>) {
        let x: Entry<K, V> | null = entry;
        x.color = RED;

        while(x != null && x != this.root && x.parent?.color == RED) {
            if(parentOf(x) == leftOf(parentOf(parentOf(x)))) {
                const y = rightOf(parentOf(parentOf(x)));
                if(colorOf(y) == RED) {
                    setColor(parentOf(x), BLACK);
                    setColor(y, BLACK)
                    setColor(parentOf(parentOf(x)), RED);
                    x = parentOf(parentOf(x));
                } else {
                    if(x == rightOf(parentOf(x))) {
                        x = parentOf(x);
                        this.rotateLeft(x);
                    }
                    setColor(parentOf(x), BLACK);
                    setColor(parentOf(parentOf(x)), RED);
                    this.rotateRight(parentOf(parentOf(x)));
                }
            } else {
                const y = leftOf(parentOf(parentOf(x)));
                if(colorOf(y) == RED) {
                    setColor(parentOf(x), BLACK);
                    setColor(y, BLACK);
                    setColor(parentOf(parentOf(x)), RED);
                    x = parentOf(parentOf(x));
                } else {
                    if(x == leftOf(parentOf(x))) {
                        x = parentOf(x);
                        this.rotateRight(x);
                    }
                    setColor(parentOf(x), BLACK);
                    setColor(parentOf(parentOf(x)), RED);
                    this.rotateLeft(parentOf(parentOf(x)));
                }
            }
        }
        if(this.root) {
            this.root.color = BLACK;
        }
    }
    rotateLeft(p: Entry<K, V> | null) {
        if(p != null && p.right != null) {
            const r = p.right;
            p.right = r.left;
            if(r.left != null) {
                r.left.parent = p;
            }
            r.parent = p.parent;
            if(p.parent == null) {
                this.root = r;
            } else if(p.parent.left == p) {
                p.parent.left = r;
            } else {
                p.parent.right = r;
            }
            r.left = p;
            p.parent = r;
        }
    }
    rotateRight(p: Entry<K, V> | null) {
        if(p != null && p.left != null) {
            const l = p.left;
            p.left = l.right;
            if(l.right != null) {
                l.right.parent = p;
            }
            l.parent = p.parent;
            if(p.parent == null) {
                this.root = l;
            } else if(p.parent.right == p) {
                p.parent.right = l;
            } else {
                p.parent.left = l;
            }
            l.right = p;
            p.parent = l;
        }
    }

    remove(key: K) {
        const p = this.getEntry(key);
        if(p == null) {
            return null;
        }
        const oldValue = p.value;
        this.deleteEntry(p);
        return oldValue;
    }

    private deleteEntry(e: Entry<K, V>) {
        let p: Entry<K, V> | null = e;
        this.modCount++;
        this.size--;

        // If strictly internal, copy successor's element to p and then make p
        // point to successor.
        if (p.left != null && p.right != null) {
            const s = successor(p);
            if(s != null) {
                p.key = s.key;
                p.value = s.value;
                p = s;
            }
        } // p has 2 children

        // Start fixup at replacement node, if it exists.
        const replacement = (p.left != null ? p.left : p.right);

        if (replacement != null) {
            // Link replacement to parent
            replacement.parent = p.parent;
            if (p.parent == null)
                this.root = replacement;
            else if (p == p.parent.left)
                p.parent.left  = replacement;
            else
                p.parent.right = replacement;

            // Null out links so they are OK to use by fixAfterDeletion.
            p.left = p.right = p.parent = null;

            // Fix replacement
            if (p.color == BLACK) {
                this.fixAfterDeletion(replacement);
            }
        } else if (p.parent == null) { // return if we are the only node.
            this.root = null;
        } else { //  No children. Use self as phantom replacement and unlink.
            if (p.color == BLACK) {
                this.fixAfterDeletion(p);
            }

            if (p.parent != null) {
                if (p == p.parent.left)
                    p.parent.left = null;
                else if (p == p.parent.right)
                    p.parent.right = null;
                p.parent = null;
            }
        }
    }
    private fixAfterDeletion(e: Entry<K,V> | null) {
        let x = e;
        while(x != this.root && colorOf(x) == BLACK) {
            if (x == leftOf(parentOf(x))) {
                let sib = rightOf(parentOf(x));

                if (colorOf(sib) == RED) {
                    setColor(sib, BLACK);
                    setColor(parentOf(x), RED);
                    this.rotateLeft(parentOf(x));
                    sib = rightOf(parentOf(x));
                }

                if (colorOf(leftOf(sib))  == BLACK &&
                    colorOf(rightOf(sib)) == BLACK) {
                    setColor(sib, RED);
                    x = parentOf(x);
                } else {
                    if (colorOf(rightOf(sib)) == BLACK) {
                        setColor(leftOf(sib), BLACK);
                        setColor(sib, RED);
                        this.rotateRight(sib);
                        sib = rightOf(parentOf(x));
                    }
                    setColor(sib, colorOf(parentOf(x)));
                    setColor(parentOf(x), BLACK);
                    setColor(rightOf(sib), BLACK);
                    this.rotateLeft(parentOf(x));
                    x = this.root;
                }
            } else { // symmetric
                let sib = leftOf(parentOf(x));

                if (colorOf(sib) == RED) {
                    setColor(sib, BLACK);
                    setColor(parentOf(x), RED);
                    this.rotateRight(parentOf(x));
                    sib = leftOf(parentOf(x));
                }

                if (colorOf(rightOf(sib)) == BLACK &&
                    colorOf(leftOf(sib)) == BLACK) {
                    setColor(sib, RED);
                    x = parentOf(x);
                } else {
                    if (colorOf(leftOf(sib)) == BLACK) {
                        setColor(rightOf(sib), BLACK);
                        setColor(sib, RED);
                        this.rotateLeft(sib);
                        sib = leftOf(parentOf(x));
                    }
                    setColor(sib, colorOf(parentOf(x)));
                    setColor(parentOf(x), BLACK);
                    setColor(leftOf(sib), BLACK);
                    this.rotateRight(parentOf(x));
                    x = this.root;
                }
            }
        }
        setColor(x, BLACK);
    }

    clear() {
        this.modCount++;
        this.size = 0;
        this.root = null;
    }
    getEqualOrLowerEntry(key: K) {
        let p = this.root;
        while (p != null) {
            if (key > p.key) {
                if (p.right != null)
                    p = p.right;
                else
                    return p;
            } else if(key < p.key) {
                if (p.left != null) {
                    p = p.left;
                } else {
                    let parent = p.parent;
                    let ch = p;
                    while (parent != null && ch == parent.left) {
                        ch = parent;
                        parent = parent.parent;
                    }
                    return parent;
                }
            } else {
                return p;
            }
        }
        return null;
    }

    getEqualOrHigherEntry(key: K) {
        let p = this.root;
        while (p != null) {
            if (key < p.key) {
                if (p.left != null)
                    p = p.left;
                else
                    return p;
            } else if(key > p.key) {
                if (p.right != null) {
                    p = p.right;
                } else {
                    let parent = p.parent;
                    let ch = p;
                    while (parent != null && ch == parent.right) {
                        ch = parent;
                        parent = parent.parent;
                    }
                    return parent;
                }
            } else {
                return p;
            }
        }
        return null;
    }
    getFirstEntry() {
        let p = this.root;
        if (p != null)
            while (p.left != null)
                p = p.left;
        return p;
    }
    getLastEntry() {
        let p = this.root;
        if (p != null)
            while (p.right != null)
                p = p.right;
        return p;
    }
}
function parentOf<K, V>(p: Entry<K, V> | null) {
    return p == null ? null : p.parent;
}
function leftOf<K, V>(p: Entry<K, V> | null) {
    return p == null ? null : p.left;
}
function rightOf<K, V>(p: Entry<K, V> | null) {
    return p == null ? null : p.right;
}
function colorOf<K,V>(p: Entry<K, V> | null) {
    return p == null ? BLACK : p.color;
}
function setColor<K, V>(p: Entry<K, V> | null, c: boolean) {
    if(p != null) {
        p.color = c;
    }
}
function successor<K, V>(t: Entry<K, V> | null) {
    if (t == null)
        return null;
    else if (t.right != null) {
        let p = t.right;
        while (p.left != null)
            p = p.left;
        return p;
    } else {
        let p = t.parent;
        let ch = t;
        while (p != null && ch == p.right) {
            ch = p;
            p = p.parent;
        }
        return p;
    }
}
function predecessor<K, V>(t: Entry<K, V>) {
    if (t == null)
        return null;
    else if (t.left != null) {
        let p = t.left;
        while (p.right != null)
            p = p.right;
        return p;
    } else {
        let p = t.parent;
        let ch = t;
        while (p != null && ch == p.left) {
            ch = p;
            p = p.parent;
        }
        return p;
    }
}
const RED = false;
const BLACK = true;

class Entry<K, V> {
    left: Entry<K, V> | null = null;
    right: Entry<K, V> | null = null;
    color: boolean = BLACK;
    constructor(public key: K, public value: V, public parent: Entry<K, V> | null) {
    }
    setValue(value: V) : V {
        const oldValue = this.value;
        this.value = value;
        return oldValue;
    }
}
