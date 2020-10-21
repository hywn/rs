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
explore shared Korean & Japanese vocabulary

; sche !h
make a block schedule

; vsus

;phll ;plll
;bbs ;poof
;s-straight ;h-seee
;disc ;sjjj ;yoat
;sett ;prrr ;cntp ;weeblayouttool

;hywn ;resume

;Scorebook ;simple-Yelp ;ACS ; PotatoBird ;RockPaperScissors

`.split(';').map(chunk => {
	const [, name, flags, description] = chunk.trim().match(/(\S+)( +!.+)?\n*(.+)?/)
	return [name, { description, f_homepage: (flags || '').includes('h') }]
}))

const style = `<style>
html { display: flex; flex-direction: column; justify-content: center; align-items: center }
body { 45em; margin: 5em }
table { width: 100% }
td, th { border: outset; padding: 0.2em }

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
	<tr><th colspan='2'>notes?</th></tr>` +
		Object.entries(acceptable)
			.map(([name, { description: extra, f_homepage }]) => {
				const { html_url, homepage, language, description } = all[name]
				const cols = [ `<a href='${html_url}'>${name}</a>` + (f_homepage ? ` (<a href='${homepage}'>site</a>)` : '')
				             , language
				             , description || ''
				             ]
				const first = extra ? `<td rowspan='2'>${cols.shift()}</td>` : ''
				const rest = cols.map(td).join('')
				const note = extra ? `<td colspan='2' align='center'>${extra}</td>` : ''
				return tr(`${first}${rest}</tr>${note ? tr(note) : ''}`)
			}
		).join('\n')
	+ '</table>'
)