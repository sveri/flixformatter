def compareHelper(a: Array[v], b: Array[v], len: Int32, i: Int32): Comparison & Impure with Order[v] =
    if (i < len) {
        let cmp = a[i] <=> b[i];
        if (cmp == EqualTo)
            compareHelper(a, b, len, i + 1)
        else
            cmp
    } else if (i < Array.length(a)) {
        GreaterThan
    } else if (i < Array.length(b)) {
        LessThan
    } else {
        EqualTo
    }

///
/// Returns a fresh array of length `l` filled with the element `x`.
///
/// Equivalent to the expression `[x; l]`.
///
@Time(l) @Space(l)
pub def new(x: a, l: Int32): Array[a] & Impure = [x; l]
        
        
        ///
/// Returns `true` if the elements of `a` are equal to the elements of `b`.
///
pub def eq(a: Array[v], b: Array[v]): Bool & Impure with Eq[v] =
    (Array.length(a) == Array.length(b)) and
    (Array.foldLeft((acc, p) -> let (x,y) = p; (acc and (x == y)), true, Array.zip(a, b)))

///
/// Compares `a` and `b` lexicographically.
///
pub def compare(a: Array[v], b: Array[v]): Comparison & Impure with Order[v] =
    compareHelper(a, b, Int32.min(Array.length(a), Array.length(b)), 0)
/// Returns `true` if the elements of `a` are equal to the elements of `b`.
///
pub def eq2(a: Array[v], b: Array[v]): Bool & Impure with Eq[v] =
    let a = 3
    +
    b;
    0


def foo(): Bool = true
