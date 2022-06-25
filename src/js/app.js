import extract_ranges_from_text from './extract_ranges_from_text.js'
import fetch_bible_passage_from_range from './fetch_bible_passage_from_range.js'

const textarea = document.querySelector('textarea')
const output = document.querySelector('div.output')

async function refresh() {
	const text = textarea.value

	const ranges = extract_ranges_from_text(text)

	const html_chunks = await Promise.all(
		ranges.map(async range => {
			try {
				const { reference, text } = await fetch_bible_passage_from_range(range)
				return `<span class="verse"><span class="ref">${ reference }</span>${ text }</span>`
			} catch (e) {
				return `<span class="err">${ e.message }</span>`
			}
		}),
	)

	output.innerHTML = html_chunks.join('')
}

textarea.oninput = refresh

refresh()
