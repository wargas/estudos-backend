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

  let text = '';

  try {
    text = decodeURIComponent(escape(markdown))
  } catch (error) {
    text = markdown
  }

  return md.render(
    text
    .replace(/\n/g, "\n\n")
    .replace(/\n\n\|/g, "\n|")
  )

}
