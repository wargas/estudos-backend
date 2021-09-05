import Redis from "@ioc:Adonis/Addons/Redis";

const messages: string[] = []

Redis.subscribe('message', (props) => {
  messages.push(props)
})

