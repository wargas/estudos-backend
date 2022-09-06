import Route from "@ioc:Adonis/Core/Route";
import { Client } from '@notionhq/client'
import markdownToHtml from "App/Utils/markdown";
import { NotionToMarkdown } from 'notion-to-md'
import Env from '@ioc:Adonis/Core/Env'

const notion = new Client({
    auth: Env.get('NOTION_KEY')
})

const ntmd = new NotionToMarkdown({ notionClient: notion })

Route.get('notion/:id', async ({ params }) => {

    const blocks = await ntmd.pageToMarkdown(params.id)

    const markdown = blocks.map(b => {
        const block = b
            .parent
            .replace(/<\/?details>/g, "")
            .replace(/\n\s+\n/g, '\n')
            .replace(/\>\s+\n/g, '')
        return markdownToHtml(block, false)
    }).join('\n\n');

    return { html: markdown }
}).prefix('api')
