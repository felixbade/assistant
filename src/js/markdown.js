// renderMarkdown('& < &amp; `& < &amp;`')
// returns: '<p>&amp; &lt; &amp;amp; <code>&amp; &lt; &amp;amp;</code></p>'
// but as an element

export const renderMarkdownToElement = md => {
    // escape &<>
    md = md.replaceAll('&', '&amp;')
    md = md.replaceAll('<', '&lt;')
    md = md.replaceAll('>', '&gt;')

    // markdown -> sanitized html -> element
    const html = DOMPurify.sanitize(marked.parse(md, {
        gfm: true
    }))
    const element = htmlToElement(html)

    // marked also escapes &<>, but only in code blocks
    // now they are double-escaped
    // unwrap one layer from <code> elements
    // & - &amp; - &amp;amp; - &amp;
    // < - &lt; - &amp;lt; - &lt;
    // > - &gt; - &amp;gt; - &gt;
    //
    // if marked.parse didn't escape &<> for some reason,
    // like upgrading marked version later and forgetting about this function,
    // it's not a security problem because we are working with innerText, not innerHTML
    //
    // even then, the only problem would be if the user supplies already escaped &<> text,
    // it would be unescaped. no HTML elements created.
    for (const code of element.querySelectorAll('code')) {
        code.innerText = code.innerText.replaceAll('&lt;', '<')
        code.innerText = code.innerText.replaceAll('&gt;', '>')
        code.innerText = code.innerText.replaceAll('&amp;', '&')
    }

    // since we are in the browser, it's more efficient to keep it as an element
    // instead of converting element -> html -> element later
    return element
}

// https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
const htmlToElement = html => {
    var template = document.createElement('template')
    html = html.trim() // Never return a text node of whitespace as the result
    template.innerHTML = html
    return template.content.firstChild
}