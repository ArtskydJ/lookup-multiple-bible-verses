import extract_ranges_from_text from './extract_ranges_from_text.js'
import fetch_bible_passage_from_range from './fetch_bible_passage_from_range.js'

const textarea = document.querySelector('textarea')
const output = document.querySelector('div.output')

async function refresh() {
	const text = textarea.value

	const ranges = extract_ranges_from_text(text)

	const bible_passages = await Promise.all(
		ranges.map(async range => {
			try {
				const { reference, text } = await fetch_bible_passage_from_range(range)
				return { error: null, reference, text}
			} catch (error) {
				return { error }
			}
		})
	)

	const passage_html = bible_passages.map(({ error, reference, text }) => error
		? `<span class="err">${ error.message }</span>`
		: `<span class="verse"><span class="ref">${ reference }</span>${ text }</span>`
	).join('')

	const hash_fragment = bible_passages.filter(({ error }) => !error).map(({ reference }) => reference).join('/')
	const permalink_html = `<a class="permalink" href="#${encodeURIComponent(hash_fragment)}">Permalink</a>`
	console.log(permalink_html)

	output.innerHTML = passage_html // + permalink_html
}

textarea.oninput = refresh

refresh()
