function _longestCommonPrefix(s1, s2) {
    if (!s1 || !s2) return undefined

    let lcp = ''
    for (let i = 0; i < Math.max(s1.length, s2.length); i++) {
        if (s1[i] === s2[i]) {
            lcp += s1[i]
        } else break
    }
    return lcp
}

export function longestCommonPrefix(strings) {
    // Pre-requisites and Trivial cases
    if (!Array.isArray(strings)) return undefined
    if (strings.length === 0) return undefined
    if (strings.length === 1) return strings[0]

    // Calc Bash expansion string
    const lcp = strings.reduce((_lcp, string) => _longestCommonPrefix(_lcp, string))
    const remainders = strings.map(string => string.substring(lcp.length))
    return lcp + '{' + remainders.join(',') + '}'
}
