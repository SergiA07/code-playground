import './style.css'
import Split from 'split-grid'
import { encode, decode } from 'js-base64'

const $ = selector => document.querySelector(selector)

Split({
  columnGutters: [
    {
      track: 1,
      element: $('.vertical-gutter')
    }
  ],
  rowGutters: [
    {
      track: 1,
      element: $('.horizontal-gutter')
    }
  ]
})

const $html = $('#html')
const $css = $('#css')
const $js = $('#js')

$html.addEventListener('input', update)
$css.addEventListener('input', update)
$js.addEventListener('input', update)

// eslint-disable-next-line space-before-function-paren
function init() {
  const { pathname } = window.location
  const [rawHtml, rawCss, rawJs] = pathname.slice(1).split('%7C')

  const html = decode(rawHtml)
  const css = decode(rawCss)
  const js = decode(rawJs)

  $html.value = html
  $css.value = css
  $js.value = js

  $('iframe').setAttribute('srcdoc', createHtml({ html, css, js }))
}

// eslint-disable-next-line space-before-function-paren
function update() {
  const html = $html.value
  const css = $css.value
  const js = $js.value

  const hashedCode = `${encode(html)}|${encode(css)}|${encode(js)}`
  window.history.replaceState(null, null, `/${hashedCode}`)

  const code = createHtml({ html, css, js })
  $('iframe').setAttribute('srcdoc', code)
}

const createHtml = ({ html, css, js }) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        ${css}
      </style>
      <meta charset="UTF-8" />
      <title>title</title>
    </head>
    <body>
      ${html}
      <script>
        ${js}
      </script>
    </body>
  </html>
  `
}

init()
