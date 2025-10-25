import { DiffSegment } from '../types';

/**
 * A standard implementation to find the Longest Common Subsequence of two string arrays.
 * This uses a dynamic programming table to find the length and then backtracks to reconstruct the LCS.
 * @param oldWords The first array of strings.
 * @param newWords The second array of strings.
 * @returns An array of strings representing the longest common subsequence.
 */
const findLCS = (oldWords: string[], newWords: string[]): string[] => {
    const m = oldWords.length;
    const n = newWords.length;
    // dp[i][j] will be the length of LCS of oldWords[0..i-1] and newWords[0..j-1]
    const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (oldWords[i - 1] === newWords[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // Backtrack from dp[m][n] to reconstruct the LCS
    const lcs: string[] = [];
    let i = m, j = n;
    while (i > 0 && j > 0) {
        if (oldWords[i - 1] === newWords[j - 1]) {
            lcs.unshift(oldWords[i - 1]);
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    return lcs;
};

/**
 * Generates a word-level diff between two strings.
 * This function is more accurate and robust than the previous version, correctly
 * handling various edge cases and producing a clean, merged output.
 * @param oldStr The original string.
 * @param newStr The new string.
 * @returns An array of DiffSegment objects representing the changes.
 */
export const getWordDiff = (oldStr: string, newStr: string): DiffSegment[] => {
    // Handle edge cases for empty or identical strings
    if (oldStr === newStr) return [{ value: oldStr, type: 'common' }];
    if (!oldStr) return [{ value: newStr, type: 'added' }];
    if (!newStr) return [{ value: oldStr, type: 'removed' }];
    
    // Split strings by whitespace, keeping the whitespace as tokens.
    // The filter(Boolean) removes empty strings from the result array.
    const oldWords = oldStr.split(/(\s+)/).filter(Boolean);
    const newWords = newStr.split(/(\s+)/).filter(Boolean);
    
    const lcs = findLCS(oldWords, newWords);
    const rawResult: DiffSegment[] = [];
    
    let oldIndex = 0;
    let newIndex = 0;
    let lcsIndex = 0;
    
    // Walk through the LCS to build the diff
    while(lcsIndex < lcs.length) {
        const commonWord = lcs[lcsIndex];
        
        // Add removed words that appear before the current common word
        while(oldIndex < oldWords.length && oldWords[oldIndex] !== commonWord) {
            rawResult.push({ value: oldWords[oldIndex], type: 'removed' });
            oldIndex++;
        }
        
        // Add added words that appear before the current common word
        while(newIndex < newWords.length && newWords[newIndex] !== commonWord) {
            rawResult.push({ value: newWords[newIndex], type: 'added' });
            newIndex++;
        }
        
        // Add the common word itself
        if (oldIndex < oldWords.length && newIndex < newWords.length) {
            rawResult.push({ value: commonWord, type: 'common' });
            oldIndex++;
            newIndex++;
            lcsIndex++;
        }
    }
    
    // Add any remaining words from the old string as removals
    while(oldIndex < oldWords.length) {
        rawResult.push({ value: oldWords[oldIndex], type: 'removed' });
        oldIndex++;
    }
    
    // Add any remaining words from the new string as additions
    while(newIndex < newWords.length) {
        rawResult.push({ value: newWords[newIndex], type: 'added' });
        newIndex++;
    }
    
    // Merge consecutive segments of the same type for a cleaner result
    if (rawResult.length === 0) return [];
    
    const mergedResult: DiffSegment[] = [{...rawResult[0]}];
    for (let i = 1; i < rawResult.length; i++) {
        const lastSegment = mergedResult[mergedResult.length - 1];
        const currentSegment = rawResult[i];
        
        if (lastSegment.type === currentSegment.type) {
            lastSegment.value += currentSegment.value;
        } else {
            mergedResult.push({...currentSegment});
        }
    }
    
    return mergedResult;
};
