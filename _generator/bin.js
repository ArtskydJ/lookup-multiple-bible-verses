const books = require('books-of-the-bible')

const path = require('path')
const fs = require('fs')

const bible_text_dir = path.join(__dirname, '..', 'bible_text')
const write_json = (rel_file_path, obj) => {
	const abs_file_path = path.join(bible_text_dir, rel_file_path + '.json')
	const json = JSON.stringify(obj, null, 1)
	fs.writeFileSync(abs_file_path, json, { encoding: 'UTF-8' })
}

books.forEach(({ name }) => {
	const normalized_name = name.toLowerCase().replace(/ /g, '')
	const book_dir = path.join(bible_text_dir, normalized_name)
	try {
		fs.mkdirSync(book_dir)
	} catch (e) {
		if (e.code !== 'EEXIST') throw e
	}

	const book_obj = require(`world-english-bible/json/${normalized_name}`)
	const chapters_array = book_obj
		.filter(chunk => chunk.type.endsWith(' text'))
		.reduce((chapters, chunk) => {
			let chapter = chapters[chunk.chapterNumber]
			if (!chapter) {
				if (!chapters.length) {
					chapters.push(null) // 1-index the chapters
				}
				chapter = [ null ] // 1-index the verses
				chapters.push(chapter)
			}

			if (!chapter[chunk.verseNumber]) {
				chapter.push(chunk.value)
			} else if (chunk.type === 'paragraph text') {
				chapter[chunk.verseNumber] += chunk.value
			} else { // line text
				chapter[chunk.verseNumber] += '\n' + chunk.value
			}

			return chapters
		}, [])
	chapters_array.forEach((chapter, chapter_number) => {
		if (chapter) {
			write_json(`${normalized_name}/${chapter_number}`, chapter)
		}
	})
})

write_json('last_update', new Date().toISOString())
console.log(`complete`)
