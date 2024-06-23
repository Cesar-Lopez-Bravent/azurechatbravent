import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"

import { ChatFileTranscription } from "@/components/chat/chat-file-transcription"
import ChatLoading from "@/components/chat/chat-loading"
import ChatRow from "@/components/chat/chat-row"
import { useChatScrollAnchor } from "@/components/hooks/use-chat-scroll-anchor"
import { ChatRole } from "@/features/chat/models"
import { AI_NAME } from "@/features/theme/theme-config"
import { Tabs, TabsList, TabsTrigger } from "@/features/ui/tabs"

import { useChatContext } from "./chat-context"
import { ChatHeader } from "./chat-header"

interface Props {
  chatThreadId: string
}

export const ChatMessageContainer: React.FC<Props> = ({ chatThreadId }) => {
  const { data: session } = useSession()
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const { messages, documents, isLoading, chatThreadLocked } = useChatContext()
  const [selectedTab, setSelectedTab] = useState<SectionTabsProps["selectedTab"]>(
    messages.length ? "chat" : "transcription"
  )

  const [previousScrollTop, setPreviousScrollTop] = useState(0)
  const [supressScrolling, setSupressScrolling] = useState(false)

  useChatScrollAnchor(messages, scrollRef, !supressScrolling)

  useEffect(() => {
    if (!isLoading) {
      router.refresh()
    }
  }, [isLoading, router])

  useEffect(() => {
    if (!isLoading) return
    setSupressScrolling(false)
    setSelectedTab("chat")
  }, [isLoading])

  const onScroll = (e: React.UIEvent<HTMLDivElement>): void => {
    if (isLoading) {
      if (e.currentTarget.scrollTop < previousScrollTop) {
        setSupressScrolling(true)
      }
      setPreviousScrollTop(e.currentTarget.scrollTop)
    }
  }

  const documentsWithTranscriptions = documents.filter(document => document.contents)

  return (
    <div className="h-full overflow-y-auto" ref={scrollRef} onScroll={onScroll}>
      <div className="flex h-auto justify-center p-2">
        <ChatHeader />
      </div>

      {documentsWithTranscriptions.length ? (
        <SectionTabs selectedTab={selectedTab} onSelectedTabChange={setSelectedTab} />
      ) : undefined}

      <div className="flex flex-1 flex-col justify-end pb-[140px]">
        {selectedTab === "chat"
          ? messages.map((message, index) => (
              <ChatRow
                key={message.id}
                chatMessageId={message.id}
                name={message.role === ChatRole.User ? session?.user?.name || "" : AI_NAME}
                message={message}
                type={message.role as ChatRole}
                chatThreadId={chatThreadId}
                showAssistantButtons={index === messages.length - 1 ? !isLoading : true}
                threadLocked={index === messages.length - 1 && chatThreadLocked}
              />
            ))
          : documentsWithTranscriptions.map(document => (
              <ChatFileTranscription
                key={document.id}
                name={document.name}
                contents={document.contents || ""}
                vtt={document.extraContents || ""}
              />
            ))}
        {isLoading && <ChatLoading />}
      </div>
    </div>
  )
}

interface SectionTabsProps {
  selectedTab: "chat" | "transcription"
  onSelectedTabChange: (value: SectionTabsProps["selectedTab"]) => void
}

const SectionTabs: React.FC<SectionTabsProps> = ({ selectedTab, onSelectedTabChange }) => (
  <Tabs value={selectedTab} onValueChange={onSelectedTabChange as (x: string) => void} className="container pb-2">
    <TabsList aria-label="Conversation Type" className="grid size-full grid-cols-2 items-stretch">
      <TabsTrigger value="chat" className="flex gap-2" role="tab" aria-selected={true}>
        Chat
      </TabsTrigger>
      <TabsTrigger value="transcription" className="flex gap-2" role="tab" aria-selected={true}>
        Transcription
      </TabsTrigger>
    </TabsList>
  </Tabs>
)
