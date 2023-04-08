import canonapiv1 from './canonapiv1.js'

function number_range(start, end) {
	if (end < start) {
		throw new RangeError('start must be less than end')
	}
	return new Array(end - start + 1).fill().map((_, i) => start + i)
}

export default async function fetch_bible_passage_from_range(range) {
	const { book, start, end } = range

	const chapter_numbers = number_range(start.chapter, end.chapter)

	const chapters_html = await Promise.all(
		chapter_numbers.map(async chapter_number => {
			const { verses } = await canonapiv1(book, chapter_number)

			let slice_start = 0
			if (start.chapter === chapter_number && start.verse) {
				slice_start = start.verse - 1
			}
			let slice_end = Infinity
			if (end.chapter === chapter_number && end.verse) {
				slice_end = end.verse
			}

			if (verses.length <= slice_start) {
				throw new Error(`Invalid verse: ${ book } ${ chapter_number }:${ slice_start + 1 }`)
			}

			if (verses.length < slice_end && slice_end !== Infinity) {
				const plural = verses.length + 1 < slice_end
				const prefix = plural ? verses.length + 1 + '-' : ''
				throw new Error(`Th${ plural ? 'ese' : 'is'} verse${ plural ? 's' : '' } don't exist: ${ book } ${ chapter_number }:${ prefix }${ slice_end }`)
			}

			const multiple_verses = chapter_numbers.length > 1 || slice_end - slice_start > 1

			let html_verses = verses.slice(slice_start, slice_end)

			if (multiple_verses) {
				html_verses = html_verses.map((text, i) => {
					let verse_ref = slice_start + i + 1
					if (chapter_number > chapter_numbers[0] && verse_ref === 1) {
						verse_ref = book + ' ' + chapter_number + ':' + verse_ref
					}
					return `<small>${ verse_ref }</small> ${ text }`
				})
			}

			return html_verses.join('')
		}),
	)

	let reference = book + ' ' + start.chapter
	if (start.verse) {
		reference += ':' + start.verse
	}
	if (start.chapter !== end.chapter) {
		reference += '-' + end.chapter
		if (end.verse) {
			reference += ':' + end.verse
		}
	} else if (end.verse && end.verse !== start.verse) {
		reference += '-' + end.verse
	}

	return {
		reference,
		text: chapters_html.join(''),
	}
}
