import extract_ranges_from_text from './extract_ranges_from_text.js'
import fetch_bible_passage_from_range from './fetch_bible_passage_from_range.js'

const textarea = document.querySelector('textarea')
const output = document.querySelector('div.output')

function decode_hash_fragment(hash) {
	const hash_fragment = decodeURIComponent(hash.slice(1))
	return hash_fragment
		.replace(/\./g, ':')
		.replace(/_/g, ` `)
} 

function encode_hash_fragment(bible_passages) {
	const hash_content = bible_passages
		.filter(({ error }) => !error)
		.map(({ reference }) => reference
			.replace(/:/g, '.')
			.replace(/ /g, '_')
		)
		.join('_')

	return '#' + encodeURIComponent(hash_content)
}

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

	output.innerHTML = passage_html

	document.location.hash = encode_hash_fragment(bible_passages)
}
 
if (document.location.hash) {
	textarea.value = decode_hash_fragment(document.location.hash)
}

textarea.oninput = refresh

refresh()
