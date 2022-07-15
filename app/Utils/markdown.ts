import markdownIt from 'markdown-it';
import markdownItSub from 'markdown-it-sub';
import markdownItSup from 'markdown-it-sup';
import markdownItLatex from 'markdown-it-latex';

export default function markdownToHtml(markdown: string): string {
  const md = markdownIt({
    html: true
  })
  .use(markdownItSub)
  .use(markdownItSup)
  .use(markdownItLatex)

  return md.render(markdown)

}
