(function () {
	'use strict';

	function getAugmentedNamespace(n) {
	  var f = n.default;
		if (typeof f == "function") {
			var a = function () {
				return f.apply(this, arguments);
			};
			a.prototype = f.prototype;
	  } else a = {};
	  Object.defineProperty(a, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	var flatmap$1 = function(arr, iter, context) {
	  var results = [];
	  if (!Array.isArray(arr)) return results;
	  arr.forEach(function(value, index, list) {
	    var res = iter.call(context, value, index, list);
	    if (Array.isArray(res)) {
	      results.push.apply(results, res);
	    } else if (res != null) {
	      results.push(res);
	    }
	  });
	  return results;
	};

	var regexSource$2 = regex => regex instanceof RegExp ? regex.source : regex;

	const regexSource$1 = regexSource$2;

	const closingCharacters = {
		'(': `)`,
		'[': `]`,
	};

	var isAtomic$1 = function isAtomic(regex) {
		const string = regexSource$1(regex);

		return /^\w$/.test(string) || enclosedByTopLevelCharacters(string)
	};

	function enclosedByTopLevelCharacters(string) {
		const openingCharacter = string[0];
		const closingCharacter = closingCharacters[openingCharacter];


		const closedByAppropriateCharacter = closingCharacter !== undefined
			&& string[string.length - 1] === closingCharacter;


		if (!closedByAppropriateCharacter) {
			return false
		}

		return !isClosedBeforeEndOfString(string, openingCharacter, closingCharacter)
	}


	function isClosedBeforeEndOfString(string, openingCharacter, closingCharacter) {
		let depth = 0;

		for (let characterIndex = 0; characterIndex < string.length - 1; ++characterIndex) {
			depth = calculateNewDepth(depth, openingCharacter, closingCharacter, string[characterIndex]);
			if (depth === 0) {
				return true
			}
		}

		return false
	}

	function calculateNewDepth(previousDepth, openingCharacter, closingCharacter, character) {
		if (character === openingCharacter) {
			return previousDepth + 1
		} else if (character === closingCharacter) {
			return previousDepth - 1
		} else {
			return previousDepth
		}
	}

	const isAtomic = isAtomic$1;
	const regexSource = regexSource$2;

	const combine$1 = returnsRegex((...args) => escapeInputForCombining(...args).join(``));
	const guaranteeAtomic = regex => isAtomic(regex) ? regex : `(?:${regexSource(regex)})`;
	const escapeRegex = str => str.replace(/[.?*+^$[\]\\(){}|-]/g, `\\$&`);
	const ifRegex = (input, ifCase, elseIfCase) => input instanceof RegExp ? ifCase(input) : elseIfCase(input);
	const escapeInputAndReturnString = regex => ifRegex(regex, regex => regex.source, escapeRegex);

	var regexFun = {
		combine: combine$1,
		either: makeJoiningFunction(`(?:`, `|`, `)`),
		capture: makeJoiningFunction(`(`, ``, `)`),

		flags: (flags, ...args) => new RegExp(combine$1(...args).source, flags),

		anyNumber: suffix(`*`),
		oneOrMore: suffix(`+`),
		optional: suffix(`?`),
		exactly: (n, ...regexes) => suffix(`{${n}}`)(...regexes),
		atLeast: (n, ...regexes) => suffix(`{${n},}`)(...regexes),
		between: (n, m, ...regexes) => suffix(`{${n},${m}}`)(...regexes),

		anyNumberNonGreedy: suffix(`*?`),
		oneOrMoreNonGreedy: suffix(`+?`),
		optionalNonGreedy: suffix(`??`),
		exactlyNonGreedy: (n, ...regexes) => suffix(`{${n}}?`)(...regexes),
		atLeastNonGreedy: (n, ...regexes) => suffix(`{${n},}?`)(...regexes),
		betweenNonGreedy: (n, m, ...regexes) => suffix(`{${n},${m}}?`)(...regexes),
	};

	function removeNonCapturingGroupIfExists(regexString) {
		const match = /^\(\?:(.+)\)$/.exec(regexString);
		return match ? match[1] : regexString
	}

	function guaranteeNoTopLevelOrs(regexString) {
		return regexString.indexOf(`|`) >= 0 ? guaranteeAtomic(regexString) : regexString
	}

	function escapeInputForCombining(...args) {
		return args.map(escapeInputAndReturnString).map(guaranteeNoTopLevelOrs)
	}

	function returnsRegex(fn) {
		return (...args) => ifRegex(fn(...args), regex => regex, input => new RegExp(input))
	}

	function makeJoiningFunction(openingCharacter, joinCharacter, closingCharacter) {
		return returnsRegex((...args) => {
			const naiveBody = escapeInputForCombining(...args).join(joinCharacter);
			const body = isAtomic(naiveBody) ? removeNonCapturingGroupIfExists(naiveBody) : naiveBody;

			return concat(openingCharacter, body, closingCharacter)
		})
	}

	function suffix(appendCharacter) {
		return returnsRegex((...args) => concat(guaranteeAtomic(combine$1(...args)), appendCharacter))
	}

	function concat(...regexes) {
		return regexes.map(regexSource).join(``)
	}

	var books = [
		{
			"name": "Genesis",
			"aliases": [
				"Gn",
				"Gen"
			]
		},
		{
			"name": "Exodus",
			"aliases": [
				"Exod",
				"Ex",
				"Exo"
			]
		},
		{
			"name": "Leviticus",
			"aliases": [
				"Lv",
				"Lev"
			]
		},
		{
			"name": "Numbers",
			"aliases": [
				"Nu",
				"Num",
				"Numb"
			]
		},
		{
			"name": "Deuteronomy",
			"aliases": [
				"Dt",
				"Deut"
			]
		},
		{
			"name": "Joshua",
			"aliases": [
				"Josh"
			]
		},
		{
			"name": "Judges",
			"aliases": [
				"Judg"
			]
		},
		{
			"name": "Ruth",
			"aliases": []
		},
		{
			"name": "1 Samuel",
			"aliases": [
				"1 Sm",
				"1 Sam",
				"1st Sam",
				"1st Samuel",
				"First Samuel"
			]
		},
		{
			"name": "2 Samuel",
			"aliases": [
				"2 Sm",
				"2 Sam",
				"2nd Sam",
				"2nd Samuel",
				"Second Samuel"
			]
		},
		{
			"name": "1 Kings",
			"aliases": [
				"1 Ki",
				"1 Kgs",
				"1st Kgs",
				"1st Kings",
				"First Kings"
			]
		},
		{
			"name": "2 Kings",
			"aliases": [
				"2 Ki",
				"2 Kgs",
				"2nd Kgs",
				"2nd Kings",
				"Second Kings"
			]
		},
		{
			"name": "1 Chronicles",
			"aliases": [
				"1 Ch",
				"1 Chr",
				"1st Chr",
				"1st Chronicles",
				"First Chronicles"
			]
		},
		{
			"name": "2 Chronicles",
			"aliases": [
				"2 Ch",
				"2 Chr",
				"2nd Chr",
				"2nd Chronicles",
				"Second Chronicles"
			]
		},
		{
			"name": "Ezra",
			"aliases": [
				"Ezr"
			]
		},
		{
			"name": "Nehemiah",
			"aliases": [
				"Ne",
				"Neh"
			]
		},
		{
			"name": "Esther",
			"aliases": [
				"Esth",
				"Est"
			]
		},
		{
			"name": "Job",
			"aliases": []
		},
		{
			"name": "Psalms",
			"aliases": [
				"Ps",
				"Pss",
				"Psalm"
			]
		},
		{
			"name": "Proverbs",
			"aliases": [
				"Prov",
				"Pr",
				"Pro"
			]
		},
		{
			"name": "Ecclesiastes",
			"aliases": [
				"Eccl",
				"Ec",
				"Ecc"
			]
		},
		{
			"name": "Song of Solomon",
			"aliases": [
				"Song",
				"Song of Songs"
			]
		},
		{
			"name": "Isaiah",
			"aliases": [
				"Is",
				"Isa"
			]
		},
		{
			"name": "Jeremiah",
			"aliases": [
				"Jer"
			]
		},
		{
			"name": "Lamentations",
			"aliases": [
				"Lam"
			]
		},
		{
			"name": "Ezekiel",
			"aliases": [
				"Ezk",
				"Ezek"
			]
		},
		{
			"name": "Daniel",
			"aliases": [
				"Dn",
				"Dan"
			]
		},
		{
			"name": "Hosea",
			"aliases": [
				"Ho",
				"Hos"
			]
		},
		{
			"name": "Joel",
			"aliases": [
				"Jl"
			]
		},
		{
			"name": "Amos",
			"aliases": [
				"Am"
			]
		},
		{
			"name": "Obadiah",
			"aliases": [
				"Obad",
				"Ob",
				"Oba"
			]
		},
		{
			"name": "Jonah",
			"aliases": [
				"Jon"
			]
		},
		{
			"name": "Micah",
			"aliases": [
				"Mc",
				"Mi",
				"Mic"
			]
		},
		{
			"name": "Nahum",
			"aliases": [
				"Nah"
			]
		},
		{
			"name": "Habakkuk",
			"aliases": [
				"Hab"
			]
		},
		{
			"name": "Zephaniah",
			"aliases": [
				"Zp",
				"Zeph"
			]
		},
		{
			"name": "Haggai",
			"aliases": [
				"Hg",
				"Hag"
			]
		},
		{
			"name": "Zechariah",
			"aliases": [
				"Zc",
				"Zech"
			]
		},
		{
			"name": "Malachi",
			"aliases": [
				"Mal"
			]
		},
		{
			"name": "Matthew",
			"aliases": [
				"Mt",
				"Matt"
			]
		},
		{
			"name": "Mark",
			"aliases": [
				"Mk"
			]
		},
		{
			"name": "Luke",
			"aliases": [
				"Lk"
			]
		},
		{
			"name": "John",
			"aliases": [
				"Jn"
			]
		},
		{
			"name": "Acts",
			"aliases": [
				"Ac"
			]
		},
		{
			"name": "Romans",
			"aliases": [
				"Ro",
				"Rm",
				"Rom"
			]
		},
		{
			"name": "1 Corinthians",
			"aliases": [
				"1 Cor",
				"1st Cor",
				"1st Corinthians",
				"First Corinthians"
			]
		},
		{
			"name": "2 Corinthians",
			"aliases": [
				"2 Cor",
				"2nd Cor",
				"2nd Corinthians",
				"Second Corinthians"
			]
		},
		{
			"name": "Galatians",
			"aliases": [
				"Gal"
			]
		},
		{
			"name": "Ephesians",
			"aliases": [
				"Eph"
			]
		},
		{
			"name": "Philippians",
			"aliases": [
				"Ph",
				"Phil"
			]
		},
		{
			"name": "Colossians",
			"aliases": [
				"Col"
			]
		},
		{
			"name": "1 Thessalonians",
			"aliases": [
				"1 Th",
				"1 Thess",
				"1st Thess",
				"1st Thessalonians",
				"First Thessalonians"
			]
		},
		{
			"name": "2 Thessalonians",
			"aliases": [
				"2 Th",
				"2 Thess",
				"2nd Thess",
				"2nd Thessalonians",
				"Second Thessalonians"
			]
		},
		{
			"name": "1 Timothy",
			"aliases": [
				"1 Tim",
				"1st Tim",
				"1st Timothy",
				"First Timothy"
			]
		},
		{
			"name": "2 Timothy",
			"aliases": [
				"2 Tim",
				"2nd Tim",
				"2nd Timothy",
				"Second Timothy"
			]
		},
		{
			"name": "Titus",
			"aliases": [
				"Tit"
			]
		},
		{
			"name": "Philemon",
			"aliases": [
				"Phlm"
			]
		},
		{
			"name": "Hebrews",
			"aliases": [
				"Heb"
			]
		},
		{
			"name": "James",
			"aliases": [
				"Ja",
				"Jas"
			]
		},
		{
			"name": "1 Peter",
			"aliases": [
				"1 Pt",
				"1 Pet",
				"1st Pet",
				"1st Peter",
				"First Peter"
			]
		},
		{
			"name": "2 Peter",
			"aliases": [
				"2 Pt",
				"2 Pet",
				"2nd Pet",
				"2nd Peter",
				"Second Peter"
			]
		},
		{
			"name": "1 John",
			"aliases": [
				"1 Jn",
				"1st John",
				"First John"
			]
		},
		{
			"name": "2 John",
			"aliases": [
				"2 Jn",
				"2nd John",
				"Second John"
			]
		},
		{
			"name": "3 John",
			"aliases": [
				"3 Jn",
				"3rd John",
				"Third John"
			]
		},
		{
			"name": "Jude",
			"aliases": []
		},
		{
			"name": "Revelation",
			"aliases": [
				"Rv",
				"Rev"
			]
		}
	];

	var booksOfTheBible = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': books
	});

	var require$$0 = /*@__PURE__*/getAugmentedNamespace(booksOfTheBible);

	const {
		combine,
		flags: flags$1,
		either: either$1,
		optional,
	} = regexFun;

	var createChapterVerseRangeRegex = function createChapterVerseRangeRegex({
		requireVerse = false,
		flags: regexFlags = 'i',
	} = {}) {
		const number = /(\d+)/;
		const numberAndOptionalLetter = /(\d+)([a-z])?/;
		const colonVerse = combine(':', numberAndOptionalLetter);
		const chapterAndVerse = combine(number, requireVerse ? colonVerse : optional(colonVerse));

		const secondHalfOfRange = combine('-', either$1(/([a-z])/, /(\d+)([a-z])/, chapterAndVerse, numberAndOptionalLetter));

		return flags$1(regexFlags, chapterAndVerse, optional(secondHalfOfRange))
	};

	const flatmap = flatmap$1;
	const {
		either,
		capture,
		flags,
	} = regexFun;

	const canonBooks$1 = require$$0;

	const chapterVerseRange = createChapterVerseRangeRegex;

	var createRegex = function createRegex({
		requireVerse = false,
		flags: regexFlags = 'i',
		books = canonBooks$1,
	} = {}) {
		const bookNames = books.map(({ name }) => name);
		const abbreviations = flatmap(books, ({ aliases }) => {
			return flatmap(aliases, alias => [ alias, alias + '.' ])
		});

		const range = chapterVerseRange({ requireVerse, flags: regexFlags });

		return flags(
			regexFlags,
			capture(either(...bookNames, ...abbreviations)),
			' ',
			range
		)
	};

	var extractRangeFromMatch$1 = {exports: {}};

	const canonBooks = require$$0;

	const mapOfAliasesToCanonBookNames = makeMapOfAliases(canonBooks);

	const valueOr = (value, defaultValue) => value === undefined
		? evaluate(defaultValue)
		: value;
	const ifelse = (predicate, truthyCase, falsyCase) => evaluate(predicate)
		? evaluate(truthyCase)
		: evaluate(falsyCase);

	const valueOrNull = value => valueOr(value, null);
	const evaluate = value => typeof value === 'function' ? value() : value;
	const int = value => value === null ? value : parseInt(value, 10);
	const stripPeriod = str => str[str.length - 1] === '.' ? str.substr(0, str.length - 1) : str;
	const isSection = str => /[a-z]/.test(str);


	extractRangeFromMatch$1.exports = extractRangeFromMatch;

	function extractRangeFromMatch(match, books) {
		const mapOfAliasesToBookNames = books ? makeMapOfAliases(books) : mapOfAliasesToCanonBookNames;
		const [ , matchBook, matchStartChapter, matchStartVerse, matchStartSection, ...matchTail ] = match;
		const rangeEndValues = matchTail.filter(value => value !== undefined);

		const start = {
			chapter: int(valueOrNull(matchStartChapter)),
			verse: int(valueOrNull(matchStartVerse)),
			section: valueOrNull(matchStartSection),
		};

		const end = ifelse(rangeEndValues.length === 3, () => {
			const [ chapter, verse, section ] = rangeEndValues;
			return {
				chapter: int(chapter),
				verse: int(verse),
				section: valueOrNull(section),
			}
		}, () => {
			const { numbers, section } = separateSectionFromNumbers(rangeEndValues);

			if (numbers.length === 2) {
				const [ chapter, verse ] = numbers;
				return {
					chapter,
					verse,
					section,
				}
			} else if (numbers.length === 1) {
				const rangeIsChapter = start.verse === null;

				return rangeIsChapter ? {
					chapter: numbers[0],
					verse: null,
					section,
				} : {
					chapter: start.chapter,
					verse: numbers[0],
					section,
				}
			} else {
				return {
					chapter: start.chapter,
					verse: start.verse,
					section: section || start.section,
				}
			}
		});

		return {
			book: mapOfAliasesToBookNames[stripPeriod(matchBook).toLowerCase()].name,
			start,
			end,
		}
	}

	extractRangeFromMatch$1.exports.chapterVerseRange = match => {
		const [ , ...rest ] = match;
		const books = [{
			name: '',
			aliases: [],
		}];
		return Object.assign(
			extractRangeFromMatch([ null, '', ...rest ], books),
			{ book: null }
		)
	};


	function separateSectionFromNumbers(ary) {
		const lastValue = ary[ary.length - 1];

		if (ary.length > 0 && isSection(lastValue)) {
			return {
				numbers: ary.slice(0, ary.length - 1).map(int),
				section: lastValue,
			}
		} else {
			return {
				numbers: ary.map(int),
				section: null,
			}
		}
	}

	function makeMapOfAliases(books) {
		return books.reduce((map, book) => {
			map[book.name.toLowerCase()] = book;
			book.aliases.forEach(alias => map[alias.toLowerCase()] = book);
			return map
		}, Object.create(null))
	}

	const cvr_all = createRegex({ flags: 'gi' });

	function extract_references_from_text(text) {
		const matches = [ ...text.matchAll(cvr_all) ];

		const ranges = matches.map(match => extractRangeFromMatch$1.exports(match));

		ranges.forEach(range => {
			const { start, end } = range;

			if (end.chapter < start.chapter) {
				throw new Error('invalid chapter range')
			}

			if (end.chapter === start.chapter && end.verse < start.verse) {
				throw new Error('invalid verse range')
			}

			console.log(JSON.stringify(range));
		});

		return ranges
	}

	const cache_clearing_handled = fetch('https://www.canonapi.com/v1/last_update.json')
		.then(res => res.text())
		.then(last_update => {
			const cached_version = localStorage.getItem('last_update');
			if (cached_version !== last_update) {
				localStorage.clear();
				localStorage.setItem('last_update', last_update);
				// console.log('cleared cache')
			}
		});

	function normalize(book) {
		return book.toLowerCase().replace(/ /g, '').trim()
	}

	function fetch_cached(book, chapter) {
		const normalized_book = normalize(book);
		const valid_book = books.find(({ name, aliases }) => [ name, ...aliases ].map(normalize).includes(normalized_book));
		const book_name = valid_book && valid_book.name;

		return cache_clearing_handled.then(() => {
			if (book_name) {
				const key = normalize(book_name) + chapter;
				const cached = localStorage.getItem(key);
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
						localStorage.setItem(key, text);
						return { // THESE SHOULD MATCH
							verses: JSON.parse(text),
							book_name,
						}
					})
			}
			return Promise.reject(new Error(`Invalid book: ${ book }`))
		})
	}

	function number_range(start, end) {
		if (end < start) {
			throw new RangeError('start must be less than end')
		}
		return new Array(end - start + 1).fill().map((_, i) => start + i)
	}

	async function fetch_bible_passage_from_range(range) {
		const { book, start, end } = range;

		const chapter_numbers = number_range(start.chapter, end.chapter);

		const chapters_text = await Promise.all(
			chapter_numbers.map(async chapter_number => {
				const { verses } = await fetch_cached(book, chapter_number);

				let slice_start = 0;
				if (start.chapter === chapter_number && start.verse) {
					slice_start = start.verse - 1;
				}
				let slice_end = Infinity;
				if (end.chapter === chapter_number && end.verse) {
					slice_end = end.verse;
				}

				if (verses.length <= slice_start) {
					throw new Error(`Invalid verse: ${ book } ${ chapter_number }:${ slice_start + 1 }`)
				}

				if (verses.length < slice_end && slice_end !== Infinity) {
					const prefix = slice_end > verses.length + 1 ? verses.length + 1 + '-' : '';
					throw new Error(`Invalid verse${ prefix ? 's' : '' }: ${ book } ${ chapter_number }:${ prefix }${ slice_end }`)
				}

				const text = verses.slice(slice_start, slice_end).join('');

				return text
			}),
		);

		let reference = book + ' ' + start.chapter;
		if (start.verse) {
			reference += ':' + start.verse;
		}
		if (start.chapter !== end.chapter) {
			reference += '-' + end.chapter;
			if (end.verse) {
				reference += ':' + end.verse;
			}
		} else if (end.verse && end.verse !== start.verse) {
			reference += '-' + end.verse;
		}

		return {
			reference,
			text: chapters_text.join(''),
		}
	}

	const textarea = document.querySelector('textarea');
	const output = document.querySelector('div.output');

	async function refresh() {
		const text = textarea.value;

		const ranges = extract_references_from_text(text);

		const html_chunks = await Promise.all(
			ranges.map(async range => {
				try {
					const { reference, text } = await fetch_bible_passage_from_range(range);
					return `<span class="verse"><span class="ref">${ reference }</span>${ text }</span>`
				} catch (e) {
					return `<span class="err">${ e.message }</span>`
				}
			}),
		);

		output.innerHTML = html_chunks.join('');
	}

	textarea.oninput = refresh;

	refresh();

})();
//# sourceMappingURL=bundle.js.map
