import books from 'books-of-the-bible'

const cache_clearing_handled = fetch('https://www.canonapi.com/v1/last_update.json')
	.then(res => res.text())
	.then(last_update => {
		const cached_version = localStorage.getItem('last_update')
		if (cached_version !== last_update) {
			localStorage.clear()
			localStorage.setItem('last_update', last_update)
			// console.log('cleared cache')
		} else {
			// console.log('keeping cache')
		}
	})

function normalize(book) {
	return book.toLowerCase().replace(/ /g, '').trim()
}

function fetch_cached(book, chapter) {
	const normalized_book = normalize(book)
	const valid_book = books.find(({ name, aliases }) => [ name, ...aliases ].map(normalize).includes(normalized_book))
	const book_name = valid_book && valid_book.name

	return cache_clearing_handled.then(() => {
		if (book_name) {
			const key = normalize(book_name) + chapter
			const cached = localStorage.getItem(key)
			if (cached) {
				return Promise.resolve({ // THESE SHOULD MATCH
					verses: JSON.parse(cached),
					book_name,
				})
			}
			return fetch(`https://www.canonapi.com/v1/${ normalize(book_name) }/${ chapter }.json`)
				.then(res => {
					if (! res.ok) {
						throw new Error(`Invalid chapter: ${ book_name } ${ chapter }`)
					}
					return res.text()
				})
				.then(text => {
					localStorage.setItem(key, text)
					return { // THESE SHOULD MATCH
						verses: JSON.parse(text),
						book_name,
					}
				})
		}
		return Promise.reject(new Error(`Invalid book: ${ book }`))
	})
}

export default fetch_cached
