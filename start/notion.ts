import Route from "@ioc:Adonis/Core/Route";
import { Client } from '@notionhq/client'
import markdownToHtml from "App/Utils/markdown";
import { NotionToMarkdown } from 'notion-to-md'
import Env from '@ioc:Adonis/Core/Env'

const notion = new Client({
    auth: Env.get('NOTION_KEY')
})

const ntmd = new NotionToMarkdown({notionClient: notion})

Route.get('notion/:id', async ({params}) => {
    const blocks = await ntmd.pageToMarkdown(params.id)

    return {html: markdownToHtml(ntmd.toMarkdownString(blocks))}
}).prefix('api')
