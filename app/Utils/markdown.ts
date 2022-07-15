import markdownIt from 'markdown-it';
import markdownItSub from 'markdown-it-sub';
import markdownItSup from 'markdown-it-sup';
import markdownItKatex from 'markdown-it-katex';

export default function markdownToHtml(markdown: string): string {
  const md = markdownIt({
    html: true
  })
  .use(markdownItKatex)
  .use(markdownItSub)
  .use(markdownItSup)

  return md.render(
    markdown
    .replace(/\n/g, "\n\n")
    .replace(/\n\n\|/g, "\n|")
  )

}
