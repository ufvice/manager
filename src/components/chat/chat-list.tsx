import { ChatItem } from "./chat-item"

const chatItems = [
  {
    id: 1,
    title: "New Chat",
    preview: "你好啊空空如也的聊天窗口...",
    time: "1d",
  },
  {
    id: 2,
    title: "New Chat",
    preview: "【嗨呀，朱鱼，你又犯困啦？】huhu...",
    time: "1d",
  },
  {
    id: 3,
    title: "New Chat",
    preview: "你好, 我是huhu, 一个可爱的猫咪...",
    time: "1d",
  },
]

export function ChatList() {
  return (
    <div className="py-2">
      {chatItems.map((chat) => (
        <ChatItem key={chat.id} {...chat} />
      ))}
    </div>
  )
}

