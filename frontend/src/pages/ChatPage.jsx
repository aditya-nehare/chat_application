import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatContainer from "../components/ChatContainer";
import ChatsList from "../components/ChatsList";
import ContactLists from "../components/ContactLists";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import ProfileHeader from "../components/ProfileHeader";
import { useChatStore } from "../store/useChatStore";

function ChatPage() {
  // const { logout } = useAuthStore();

  const { activeTab, selectedUser } = useChatStore();

  return (
    <>
      {/*
      <div className="z-10">
        <button onClick={logout}>Logout</button>
      </div>
      */}

      <div className="relative flex w-full max-w-6xl h-[800px] overflow-hidden rounded-xl border border-slate-700">
        {/* Sidebar */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col border-r border-slate-700">
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactLists />}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </div>
    </>
  );
}

export default ChatPage;
