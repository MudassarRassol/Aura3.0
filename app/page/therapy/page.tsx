"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  PlusCircle,
  MessageSquare,
  Trash2,
  StopCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
const suggestions = [
  "How can I manage my anxiety better?",
  "I've been feeling overwhelmed lately",
  "Can we talk about improving sleep?",
  "I need help with work-life balance",
];

const Page = () => {
  //sessionstate
  const [session, setSession] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [sessionLoading, setSessionLoading] = useState(false);
  //sessionstate
  //MessageEndRef
  const messagesEndRef = useRef<HTMLDivElement>(null);
  //MessageEndRef

  const [InputMessage, setInputMessage] = useState("");

  const [loadingMessage, setLoadingMessage] = useState(false);
  const [Sessionmessage, setSessionMessage] = useState<any[]>([]); // [sessionmessage,]

  const { messages, sendMessage, status, error, stop } = useChat({});

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000; // diff in seconds

    if (diff < 60) return "less than 1 min";
    if (diff < 3600) return `${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days`;
    return `${Math.floor(diff / 604800)} weeks`;
  };

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(
    () => scrollToBottom(),
    [status == "streaming" || status == "submitted"]
  );

  // Fetch all sessions
  const fetchSessions = async () => {
    try {
      setSessionLoading(true);
      const res = await axios.get("/api/session");
      setSession(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      setSessionLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Create a new session
  const createSession = async () => {
    try {
      setSessionMessage([]);
      messages.length = 0;
      setSessionLoading(true);
      const res = await axios.post(
        "/api/session",
        {},
        { headers: { userId: "YOUR_USER_ID" } }
      );
      setSession((prev) => [res.data, ...prev]);
      setSelectedSession(res.data);
      return res.data; // 👈 yeh important hai
    } catch (err) {
      console.error("Error creating session:", err);
    } finally {
      setSessionLoading(false);
    }
  };

  // Delete a session
  const deleteSession = async (sessionId: string) => {
    try {
      setSessionMessage([]);
      messages.length = 0;
      setLoadingMessage(true);
      setSessionLoading(true);
      await axios.delete(`/api/session`, {
        data: { sessionId },
      });
      setSession((prev) => prev.filter((s) => s.sessionId !== sessionId));

      if (selectedSession?.sessionId === sessionId) {
        setSelectedSession(null);
      }
    } catch (err) {
      console.error("Error deleting session:", err);
    } finally {
      setSessionLoading(false);
      setLoadingMessage(false);
      setSessionMessage([]);
    }
  };

  // Select a session and load its messages
  const selectSession = (sess: any) => {
    setSelectedSession(sess);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("sessionid", selectedSession);

    if (!InputMessage.trim()) return;

    let session = selectedSession;

    // Agar session nahi hai to pehle ek create karo
    if (!session) {
      session = await createSession(); // ✅ wait for session creation
      toast.success(
        "Session created successfully , now you can chat with your therapist"
      );
      return;
    }

    // Ab message send karo
    sendMessage({
      text: InputMessage,
      metadata: {
        sessionId: session.sessionId,
      },
    });

    setInputMessage("");
  };

  const fetchMessages = async (sessionId: string) => {
    setLoadingMessage(true);
    setSessionMessage([]);
    messages.length = 0;
    const res = await axios.post(`/api/getchatbysessionid`, {
      sessionId,
    });
    if (res.status === 201) {
      setLoadingMessage(false);
      setSessionMessage(res.data.messages);
    }

    if (!res) throw new Error("Failed to fetch messages");
    return;
  };

  const [ShowSidebar, setShowSidebar] = useState(false);

  // Example
  useEffect(() => {
    if (selectedSession) {
      fetchMessages(selectedSession.sessionId).then((msgs) =>
        console.log("Messages:", msgs)
      );
    }
  }, [selectedSession]);

  return (
    <div className="relative flex gap-2 mx-auto  md:px-10 py-2 mt-20">
      {/* Session List */}
      <div className=" md:block hidden max-w-xs w-full border border-primary/10 rounded-lg h-screen md:h-[calc(100vh-4rem)] select-none">
        <div className="flex flex-col gap-4 bg-gray-400/20 border-b border-primary/70 p-4">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-xl">Chat Sessions</h1>
            <PlusCircle
              className="w-5 h-5 cursor-pointer"
              onClick={createSession}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4 overflow-y-scroll h-[80%] no-scrollbar">
          {sessionLoading ? (
            <div className=" h-screen flex items-center justify-center ">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : session.length === 0 ? (
            <p className="text-sm text-muted-foreground">No chat sessions</p>
          ) : (
            session.map((sess) => (
              <div
                onClick={() => {
                  selectSession(sess);
                  fetchMessages(sess.sessionId);
                }}
                key={sess.sessionId}
                className={cn(
                  "flex flex-col gap-1 px-4 py-2 rounded-lg hover:bg-primary/30",
                  selectedSession?.sessionId === sess.sessionId
                    ? "bg-primary/40"
                    : "bg-primary/10"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 cursor-pointer">
                    <MessageSquare size={14} />
                    <span>Session</span>
                  </div>
                  <Trash2
                    className="w-4 h-4 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent selecting session when clicking delete
                      deleteSession(sess.sessionId);
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-foreground/40 text-sm">lets talk 😊</p>
                  <span className="text-sm text-muted-foreground">
                    {timeAgo(sess.updatedAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <AnimatePresence>
  {ShowSidebar && (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/40 z-50 flex"
      onClick={() => setShowSidebar(false)} // backdrop click se close
    >
      <div
        className="w-64 bg-background h-full shadow-lg p-4"
        onClick={(e) => e.stopPropagation()} // andar click pe backdrop close na ho
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold text-lg">Chat Sessions</h1>
          <PlusCircle
            className="w-5 h-5 cursor-pointer"
            onClick={createSession}
          />
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto h-[90%]">
          {sessionLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto mt-4" />
          ) : session.length === 0 ? (
            <p className="text-sm text-muted-foreground">No chat sessions</p>
          ) : (
            session.map((sess) => (
              <div
                key={sess.sessionId}
                onClick={() => {
                  selectSession(sess);
                  fetchMessages(sess.sessionId);
                  setShowSidebar(false); // ✅ session select hone ke baad close
                }}
                className={cn(
                  "flex flex-col gap-1 px-4 py-2 rounded-lg hover:bg-primary/30 cursor-pointer",
                  selectedSession?.sessionId === sess.sessionId
                    ? "bg-primary/40"
                    : "bg-primary/10"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <MessageSquare size={14} />
                    <span>Session</span>
                  </div>
                  <Trash2
                    className="w-4 h-4 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(sess.sessionId);
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-foreground/40 text-sm">lets talk 😊</p>
                  <span className="text-sm text-muted-foreground">
                    {timeAgo(sess.updatedAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>


      {/* Chat Area */}
      <div className=" flex  md:h-[calc(100vh-4rem)] w-full gap-2 md:gap-6 ">
        <div className="flex-1  flex flex-col gap-4 overflow-hidden p-4  dark:bg-background rounded-lg border border-primary/20  shadow   ">
          <div className="flex items-center justify-between gap-2 border-b border-primary/10 pb-4 select-none ">
            <div className="flex gap-2  w-full items-center">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <span>
                <h2 className=" font-semibold "> AI Therapist </h2>
              </span>
            </div>
            <button
              onClick={() => setShowSidebar(true)}
              className="md:hidden p-2 rounded bg-primary/10"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>

          {loadingMessage ? (
            <div className=" h-screen flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : Sessionmessage.length === 0 && messages.length === 0 ? (
            <div className=" h-screen flex flex-col items-center justify-center relative ">
              <div
                className=" w-[500px] h-[400px] rounded-full blur-3xl transition-all duration-700 ease-in-out bg-gradient-to-r from-[#5cffb0] 
                  via-[#5cffb0]/40 to-[#5cffb0]  absolute opacity-30  animate-pulse  "
              />
              <div className=" flex flex-col items-center gap-2 mb-10 ">
                <div className=" flex items-center gap-2 ">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <h2 className=" font-semibold text-2xl "> AI Therapist </h2>
                </div>
                <p className=" text-lg ">How can I assist you today?</p>
              </div>
              <div className="flex flex-col gap-4 items-center w-full mx-auto  z-40 ">
                {suggestions.map((i, index) => {
                  return (
                    <div
                      key={index}
                      className=" w-full sm:w-[80%] md:w-[40%] border border-primary/50 px-4 py-3 rounded-md cursor-pointer text-center "
                      onClick={() => {
                        setInputMessage(i);
                      }}
                    >
                      {i}
                    </div>
                  );
                })}
              </div>  
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto scroll-smooth">
              <div className=" max-w-3xl mx-auto ">
                <AnimatePresence initial={false}>
                  {Sessionmessage.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className={cn(
                        "px-6 py-8",
                        message.role === "assistant"
                          ? " bg-muted/30 "
                          : "bg-background"
                      )}
                    >
                      <div className=" flex gap-4 ">
                        <div className="w-8 h-8 shrink-0 mt-1">
                          {message.role === "assistant" ? (
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
                              <Bot className="w-6 h-6" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
                              <User className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2 overflow-hidden min-h-[2rem]">
                          <div className="flex items-center justify-between">
                            <p className=" font-medium text-sm">
                              {message.role === "assistant"
                                ? "AI Therapist"
                                : "You"}
                            </p>
                          </div>
                          <p>{message.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {messages.length > 0 && (
                  <AnimatePresence initial={false}>
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={cn(
                          "px-6 py-8",
                          message.role === "assistant"
                            ? " bg-muted/30 "
                            : "bg-background"
                        )}
                      >
                        <div className=" flex gap-4 ">
                          <div className="w-8 h-8 shrink-0 mt-1">
                            {message.role === "assistant" ? (
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
                                <Bot className="w-6 h-6" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
                                <User className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-2 overflow-hidden min-h-[2rem]">
                            <div className="flex items-center justify-between">
                              <p className=" font-medium text-sm">
                                {message.role === "assistant"
                                  ? "AI Therapist"
                                  : "You"}
                              </p>
                            </div>
                            {message.parts.map((part, index) => {
                              return part.type === "text" ? (
                                <ReactMarkdown key={index}>
                                  {part.text}
                                </ReactMarkdown>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
          {status === "submitted" || status === "streaming" ? (
            <div className="text-green-500/70 animate-pulse max-w-3xl">
              Thinking...
            </div>
          ) : null}

          <div className=" border-t border-primary/20 bg-background/50 supports-[backdrop-filter]:bg-background/50 p-4 ">
            <form
              className="max-w-3xl mx-auto flex gap-4 items-end relative"
              onSubmit={(e) => {
                handleSubmit(e);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSubmit(e);
                }
              }}
            >
              <div className=" flex-1 flex items-center relative group  border bg-background border-primary/60 rounded-md px-2  ">
                <textarea
                  required={status == "streaming" ? false : true}
                  value={InputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={
                    status == "submitted"
                      ? "Complete the activity to continue..."
                      : "Ask me anything...."
                  }
                  className={cn(
                    "w-full resize-none rounded-2xl  ",
                    "p-3 pr-12 min-h-[48px] max-h-[200px] ",
                    "focus:outline-none  ",
                    "transition-all duration-300 ease-in-out ",
                    "placeholder:text-muted-foreground/70",
                    (status == "streaming") &&
                      " opacity-50 cursor-not-allowed "
                  )}
                  rows={1}
                  disabled={ status == "streaming"}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                    }
                  }}
                ></textarea>

                {status === "streaming" || status === "submitted" ? (
                  <Button type="button" onClick={stop}>
                    <StopCircle className="w-6 h-6 text-black " />
                  </Button>
                ) : (
                  <Button type="submit">
                    <Send className="w-6 h-6 text-black " />
                  </Button>
                )}
              </div>
            </form>
            {error && (
              <div className="text-red-500 text-center mt-2">
                {error.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
