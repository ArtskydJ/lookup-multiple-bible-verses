import alias from '@rollup/plugin-alias'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

const dev = true

export default {
	input: './js/app.js',
	output: {
		file: '../bundle.js',
		format: 'iife',
		sourcemap: dev,
	},
	plugins: [
		alias({
			entries: [
				{ find: 'books-of-the-bible', replacement: './js/books-of-the-bible.json' },
			]
		}),
		resolve(),
		json(),
		commonjs({
			transformMixedEsModules: true,
		}),
		! dev && terser(),
	],
}
