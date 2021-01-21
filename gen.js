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
	const [, name, flags, note] = chunk.trim().match(/(\S+)( +!.+)?\n*(.+)?/)
	return [name, { note, f_homepage: (flags || '').includes('h') }]
}))

const style = `<style>
html
	{ display: flex
	; justify-content: center
	}
body
	{ display: grid
	; grid-template-columns: repeat(4, 7em)
	; grid-template-rows:    repeat(${1 + Math.ceil(Object.keys(acceptable).length / 2)}, 7em)
	; grid-gap: 1.2em
	; width: min-content
	; height: min-content
	; margin: 4em
	; line-height: 1.6
	}
#intro
	{ display: flex
	; flex-direction: column
	; grid-column-end: span 4
	}
h1 { margin: 0; font-size: 2.8em }
p  { margin: 0 }
.project
	{ display: flex
	; flex-direction: column
	; grid-column-end: span 2
	}
.links
	{ font-size: 1.2em
	; font-weight: bold
	}
.language
	{ font-size: 0.8em
	; font-style: italic
	}
.note
	{ font-size: 0.9em
	; font-style: italic
	; color: #777
	}
</style>`

const intro = `<div id=intro>
<h1>project index</h1>
<p>incomprehensive list of project repositories</p>
</div>`

console.log(
	style +
	intro +
	Object.entries(acceptable).map(([name, { f_homepage, note }]) => {

		const { html_url, homepage, language, description } = all[name]

		return `<div class=project>
			<span class=links><a href='${html_url}'>${name}</a>${!f_homepage ? '' : ` (<a href='${homepage}'>site</a>)`}</span>
			<span class=language>${language}</span>
			<span class=description>${description || ''}</span>
			${!note ? '' : `<span class=note>${note}</span>`}
		</div>`

	}).join('\n').replace(/[\n\t]/g, '')
)