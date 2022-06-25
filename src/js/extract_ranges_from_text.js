const { createRegex, createChapterVerseRangeRegex, extractRangeFromMatch } = require('verse-reference-regex')
// import { createChapterVerseRangeRegex, extractRangeFromMatch } from 'verse-reference-regex'


const cvr_all = createRegex({ flags: 'gi' })

export default function extract_references_from_text(text) {
	const matches = [ ...text.matchAll(cvr_all) ]

	// console.log(matches)

	const ranges = matches.map(match => extractRangeFromMatch(match))

	ranges.forEach(range => {
		const { start, end } = range

		if (end.chapter < start.chapter) {
			throw new Error('invalid chapter range')
		}

		if (end.chapter === start.chapter && end.verse < start.verse) {
			throw new Error('invalid verse range')
		}

		console.log(JSON.stringify(range))
	})

	return ranges
}
