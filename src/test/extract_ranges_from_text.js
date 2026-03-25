import extract_ranges_from_text from '../js/extract_ranges_from_text.js'

import { test } from 'uvu'
import * as assert from 'uvu/assert'

const equal_ranges = (text, expect_ranges, message = '') => {
	const actual = extract_ranges_from_text(text)
	const expect = expect_ranges.map(({ book, start, end }) => ({
		book,
		start: { verse: null, section: null, ...start },
		end: { verse: null, section: null, ...end },
	}))
	assert.equal(actual, expect, message)
}

test(`single chapter`, () => {
	equal_ranges('Genesis 1', [{ book: 'Genesis', start: { chapter: 1 }, end: { chapter: 1 } }])
	equal_ranges('Gen 1', [{ book: 'Genesis', start: { chapter: 1 }, end: { chapter: 1 } }])
	// This doesn't work because my custom "books-of-the-bible" is not getting replaced at runtime, but at build time
	// assert.equal(extract_ranges_from_text(`Gn 1`), [{ book: 'Genesis', start: { ...r, chapter: 1 }, end: { ...r, chapter: 1 } }])
})

test(`ignore non-verse text`, () => {
	equal_ranges('herp Gen 1 derp', [{ book: 'Genesis', start: { chapter: 1 }, end: { chapter: 1 } }])
})

test(`single verse`, () => {
	equal_ranges('Exodus 1:1', [{ book: 'Exodus', start: { chapter: 1, verse: 1 }, end: { chapter: 1, verse: 1 } }])
	equal_ranges('Ex 1:1', [{ book: 'Exodus', start: { chapter: 1, verse: 1 }, end: { chapter: 1, verse: 1 } }])
	equal_ranges('Exodus 1.1', [{ book: 'Exodus', start: { chapter: 1, verse: 1 }, end: { chapter: 1, verse: 1 } }])
	equal_ranges('Ex 1.1', [{ book: 'Exodus', start: { chapter: 1, verse: 1 }, end: { chapter: 1, verse: 1 } }])
})

test(`"passages" that don't exist`, () => {
	equal_ranges('Hezekiah 1', [])
	equal_ranges('Genesis 51', [{ book: 'Genesis', start: { chapter: 51 }, end: { chapter: 51 } }])
	equal_ranges('Genesis 1:100', [{ book: 'Genesis', start: { chapter: 1, verse: 100 }, end: { chapter: 1, verse: 100 } }])
})

test(`ranges`, () => {
	equal_ranges('Mark 2-4', [{ book: 'Mark', start: { chapter: 2 }, end: { chapter: 4 } }])
	equal_ranges('Mark 1:3-9, 11', [
		{ book: 'Mark', start: { chapter: 1, verse: 3 }, end: { chapter: 1, verse: 9 } },
		{ book: 'Mark', start: { chapter: 1, verse: 11 }, end: { chapter: 1, verse: 11 } },
	])
	equal_ranges('Mark 1.3-2.4', [{ book: 'Mark', start: { chapter: 1, verse: 3 }, end: { chapter: 2, verse: 4 } }])
})

test(`comma-separated verses`, () => {
	equal_ranges('Heb 7:5,9', [
		{ book: 'Hebrews', start: { chapter: 7, verse: 5 }, end: { chapter: 7, verse: 5 } },
		{ book: 'Hebrews', start: { chapter: 7, verse: 9 }, end: { chapter: 7, verse: 9 } },
	])
	equal_ranges('Heb. 7:5,9.', [
		{ book: 'Hebrews', start: { chapter: 7, verse: 5 }, end: { chapter: 7, verse: 5 } },
		{ book: 'Hebrews', start: { chapter: 7, verse: 9 }, end: { chapter: 7, verse: 9 } },
	])
})

test(`semicolon-separated chapter references`, () => {
	equal_ranges('Deut. 14:22-27; 12:6,11,17; 16:16', [
		{ book: 'Deuteronomy', start: { chapter: 14, verse: 22 }, end: { chapter: 14, verse: 27 } },
		{ book: 'Deuteronomy', start: { chapter: 12, verse: 6 }, end: { chapter: 12, verse: 6 } },
		{ book: 'Deuteronomy', start: { chapter: 12, verse: 11 }, end: { chapter: 12, verse: 11 } },
		{ book: 'Deuteronomy', start: { chapter: 12, verse: 17 }, end: { chapter: 12, verse: 17 } },
		{ book: 'Deuteronomy', start: { chapter: 16, verse: 16 }, end: { chapter: 16, verse: 16 } },
	])
})

test(`impossible ranges`, () => {
	assert.throws(() => extract_ranges_from_text('Mark 4-2'), /chapter/i)
	assert.throws(() => extract_ranges_from_text('Mark 1:9-3'), /verse/i)
})

test.run()
