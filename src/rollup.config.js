import alias from '@rollup/plugin-alias'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

export default {
	input: './js/app.js',
	output: {
		file: '../bundle.js',
		format: 'iife',
		sourcemap: true,
	},
	plugins: [
		alias({
			entries: [
				{ find: 'books-of-the-bible', replacement: './js/books-of-the-bible.js' },
			]
		}),
		resolve(),
		commonjs(),
		terser(),
	],
}
