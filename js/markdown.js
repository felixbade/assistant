import { sanitize } from 'dompurify'
import { parse } from 'marked'

// renderMarkdown('& < &amp; `& < &amp;`')
// returns: '<p>&amp; &lt; &amp;amp; <code>&amp; &lt; &amp;amp;</code></p>'
// but as an element

export const markdownToDocumentFragment = md => {
    // escape &<>
    md = md.replaceAll('&', '&amp;')
    md = md.replaceAll('<', '&lt;')
    md = md.replaceAll('>', '&gt;')

    // markdown -> sanitized html -> element
    const html = sanitize(parse(md, {
        gfm: true,
        breaks: true,
    }))
    const documentFragment = htmlToDocumentFragment(html)

    // marked also escapes &<>, but only in code blocks
    // now they are double-escaped
    // unwrap one layer from <code> elements
    // & - &amp; - &amp;amp; - &amp;
    // < - &lt; - &amp;lt; - &lt;
    // > - &gt; - &amp;gt; - &gt;
    //
    // if marked.parse didn't escape &<> for some reason,
    // like upgrading marked version later and forgetting about this function,
    // it's not a security problem because we are not unescaping < and > in
    // the innerHTML level
    for (const code of documentFragment.querySelectorAll('code')) {
        code.innerHTML = code.innerHTML.replaceAll('&amp;', '&')
    }

    // since we are in the browser, it's more efficient to keep it as an element
    // instead of converting element -> html -> element later
    return documentFragment
}

const htmlToDocumentFragment = html => {
    var template = document.createElement('template')
    template.innerHTML = html
    return template.content
}