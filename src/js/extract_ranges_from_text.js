import { createRegex, extractRangeFromMatch, createChapterVerseRangeRegex } from 'verse-reference-regex'

const cvr_all = createRegex({ flags: 'gi' })
const anchored_cv_re = new RegExp('^' + createChapterVerseRangeRegex({ flags: 'i' }).source, 'i')

export default function extract_references_from_text(text) {
	text = text.replace(/(\d+)\.(\d+)/g, '$1:$2')

	const results = []

	for (const match of text.matchAll(cvr_all)) {
		const range = extractRangeFromMatch(match)
		results.push(range)

		const book = range.book
		let current_chapter = range.end.chapter
		let pos = match.index + match[0].length

		while (pos < text.length) {
			const sep_match = text.slice(pos).match(/^\s*([,;])\s*/)
			if (!sep_match) break

			const separator = sep_match[1]
			const after_sep = pos + sep_match[0].length
			const remaining = text.slice(after_sep)

			if (separator === ';') {
				const cv_match = remaining.match(anchored_cv_re)
				if (cv_match) {
					const cv_range = extractRangeFromMatch.chapterVerseRange(cv_match)
					results.push({ ...cv_range, book })
					current_chapter = cv_range.end.chapter
					pos = after_sep + cv_match[0].length
				} else {
					break
				}
			} else {
				const verse_match = remaining.match(/^(\d+)([a-z])?(?:-(\d+)([a-z])?)?/)
				if (verse_match) {
					const start_verse = parseInt(verse_match[1])
					const start_section = verse_match[2] || null
					const end_verse = verse_match[3] ? parseInt(verse_match[3]) : start_verse
					const end_section = verse_match[4] || null
					results.push({
						book,
						start: { chapter: current_chapter, verse: start_verse, section: start_section },
						end: { chapter: current_chapter, verse: end_verse, section: end_section },
					})
					pos = after_sep + verse_match[0].length
				} else {
					break
				}
			}
		}
	}

	results.forEach(range => {
		const { start, end } = range

		if (end.chapter < start.chapter) {
			throw new Error('invalid chapter range')
		}

		if (end.chapter === start.chapter && start.verse !== null && end.verse !== null && end.verse < start.verse) {
			throw new Error('invalid verse range')
		}
	})

	return results
}
