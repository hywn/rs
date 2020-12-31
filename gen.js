#!/usr/bin/env -S deno run --allow-net

const rs = (await Promise.all(
	[1, 2, 3].map(i => fetch(`https://api.github.com/users/hywn/repos?page=${i}`).then(r => r.json()))
)).flat()

const all = Object.fromEntries(rs.map(json => ([json.name, json])))

const tag = tag => contents => `<${tag}>${contents}</${tag}>`
const td = tag('td')
const tr = tag('tr')

const acceptable = Object.fromEntries(`
han !h

;sche !h

;vsus

;zoop

;lihh

;phll ;plll

;copp

;bbs

;poof

;s-straight

;h-seee

;disc
uses now-obsolete Deno ws

;sjjj ;yoat
;sett ;prrr ;cntp ;weeblayouttool

;resume

;Scorebook ;simple-Yelp ;ACS ; PotatoBird ;RockPaperScissors

`.split(';').map(chunk => {
	const [, name, flags, description] = chunk.trim().match(/(\S+)( +!.+)?\n*(.+)?/)
	return [name, { description, f_homepage: (flags || '').includes('h') }]
}))

const style = `<style>
html { display: flex; flex-direction: column; justify-content: center; align-items: center }
body { 45em; margin: 5em }
table { width: 100%; border-collapse: collapse }
td, th { border: solid #bbb; padding: 0.25em }

.colored { background-color: #eee }
.note { color: #888; text-align: center }
</style>`

const intro = `
<h1>project index</h1>
<p>incomprehensive list of project repositories</p>
`

console.log(
	style +
	intro +
	'<table>' +
	`<tr><th rowspan='2'>project</th><th>language</th><th>description</th></tr>
	<tr><th class='note' colspan='2'>notes?</th></tr>` +
	Object.entries(acceptable).map(([name, { description: extra, f_homepage }], i) => {

		const even = !(i % 2)
		const { html_url, homepage, language, description } = all[name]
		const cols = [ `<a href='${html_url}'>${name}</a>` + (f_homepage ? ` (<a href='${homepage}'>site</a>)` : '')
		             , language
		             , description || ''
		             ]

		const first = extra ? `<td ${even ? "class='colored' " : ''}rowspan='2'>${cols.shift()}</td>` : ''
		const rest = cols.map(x => `<td${even ? " class='colored'" : ''}>${x}</td>`).join('')
		const note = extra ? `<td class='${even ? 'colored ' : ''}note' colspan='2'>${extra}</td>` : ''

		return tr(`${first}${rest}</tr>${note ? tr(note) : ''}`)

	}).join('\n')
	+ '</table>'
)