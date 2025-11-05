"use client"

import { DashboardLayout } from '@/components/dashboard-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send, FileText, Download, Image as ImageIcon } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import { endpoints } from "@/lib/api/client";
import { toast } from 'sonner'

interface Message {
    text: string
    isUser: boolean
    time: string
    comment_id: number
    file?: {
        name: string
        type: string
        size: number
        data: string
    }
}

interface User {
    ID: string
    user_nicename: string
    user_email: string
    user_url: string
}

const UserMessages = () => {
    const [userHasMessage, setUserHasMessage] = useState(false);
    const [messages, setMessages] = useState<Message[]>([])
    const [user, setUser] = useState<User | null>(null)
    const [inputValue, setInputValue] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [lastMessageId, setLastMessageId] = useState(0)
    const [threadId, setThreadId] = useState<number | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (typeof window === "undefined") return;
                const user_id = localStorage.getItem('user_id');
                const token = localStorage.getItem('auth-token');
                
                if (!user_id || !token) { 
                    setUser(null);
                    // Redirect to login if no credentials
                    window.location.href = "/login";
                    return; 
                }
                
                const res = await endpoints.auth.getMe();
                if (res?.data && (res.data.user_email === user_id)) {
                    setUser({
                        ID: String(res.data.ID || res.data._id || ""),
                        user_nicename: res.data.user_nicename,
                        user_email: res.data.user_email,
                        user_url: res.data.user_url || ""
                    });
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error fetching user:", error)
                // If authentication error, clear user and redirect
                if (error instanceof Error && error.message.includes("not authenticated")) {
                    localStorage.removeItem("auth-token");
                    localStorage.removeItem("user_id");
                    window.location.href = "/login";
                    return;
                }
                setUser(null);
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
        const loadMessages = async () => {
            if (!user?.ID) {
                console.log("No user ID, skipping loadMessages");
                return;
            }
            
            // Check if user is authenticated
            if (typeof window === "undefined") return;
            const token = localStorage.getItem("auth-token");
            const isLoggedIn = localStorage.getItem("isLoggedIn");
            
            if (!token || isLoggedIn !== "true") {
                console.log("No auth token or not logged in, redirecting to login");
                window.location.href = "/login";
                return;
            }
            
            try {
                setLoading(true)
                console.log("Loading messages - token:", localStorage.getItem("auth-token"));
                const res = await endpoints.messages.getMyMessages();
                console.log("Messages response:", res);
                const allComments = Array.isArray(res?.data) ? res.data : [];
                if (allComments) {
                    // console.log(user?.ID);

                    const userMessages = allComments.filter((comment: any) => {
                        return String(comment.userEmail || comment.user_id) === String(user?.ID) || comment.userEmail === user?.user_email;
                    });
                    // console.log("User Messages", userMessages);
                   
                    if(userMessages.length > 0) {
                        setUserHasMessage(true);
                    }

                    if (userMessages.length > 0) {
                        setThreadId(userMessages[0].comment_ID)
                        const content = Array.isArray(userMessages[0].content) ? userMessages[0].content : (userMessages[0].comment_content || [])
                        // console.log(content);

                        const normalized = Array.isArray(content) ? content
                            .filter((msg: any) => msg.text || msg.file)
                            .map((msg: any) => ({
                                text: msg.text,
                                isUser: msg.isUser,
                                time: msg.time,
                                comment_id: parseInt(userMessages[0].comment_ID || userMessages[0].commentId || 0),
                                ...(msg.file && { file: msg.file })
                            })) : []
                            .sort((a: Message, b: Message) => new Date(a.time).getTime() - new Date(b.time).getTime())
                        // console.log("Normalized", normalized);
                        if (userHasMessage) {
                            setMessages(normalized)
                            setLastMessageId(parseInt(userMessages[0].comment_ID))
                        } else {
                            setLastMessageId(0)
                            setMessages([])
                        }

                    } else {
                        setThreadId(null)
                        setMessages([])
                    }
                    setLoading(false)
                } else {
                    toast.error('Messages Not Found')
                    setLoading(false)
                    setMessages([])
                }
            } catch (error) {
                console.error("Error fetching messages:", error)
                // If authentication error, redirect to login
                if (error instanceof Error && error.message.includes("not authenticated")) {
                    window.location.href = "/login";
                    return;
                }
                setLoading(false)
            }
        }
        loadMessages()
    }, [user?.ID])

    useEffect(() => {
        if (!userHasMessage) return;
console.log(userHasMessage);

        const evtSource = new EventSource(endpoints.messages.getMessageStreamUrl(String(lastMessageId)))
        console.log('SSE connected:', evtSource)

        evtSource.onmessage = function (event) {
            const data = JSON.parse(event.data)
            // console.log('New message data:', data)

            // if(!user?.ID) return;
            if(userHasMessage) {
                if (data.text || data.file) {
                    setMessages(prev => {
                        if (prev.some(msg => msg.comment_id === data.comment_id && msg.time === data.time)) {
                            return prev
                        }
                        const newMessage: Message = {
                            text: data.text,
                            isUser: data.isUser,
                            time: data.time,
                            comment_id: data.comment_id,
                            ...(data.file && { file: data.file })
                        }
                        return [...prev, newMessage]
                    })
                    setLastMessageId(data.comment_id)
    
                    // console.log(`📩 New message: ${data.text}${data.file ? ` (with file: ${data.file.name})` : ''}`)
                    toast.info(`📩 New message: ${data.text}${data.file ? ` (with file: ${data.file.name})` : ''}`)
                }
            }
        }
        // toast.info(`📩 New message: ${lastMessageId}`)

        evtSource.onerror = function () {
            console.error('SSE error; reconnecting...')
            evtSource.close()
            setTimeout(() => setLastMessageId(prev => prev), 5000)
        }

        return () => {
            evtSource.close()
            console.log('SSE connection closed')
        }
    }, [lastMessageId, userHasMessage])



    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('File size exceeds 5MB limit')
                return
            }
            setSelectedFile(file)
        }
    }

    const handleSendMessage = async (e: React.KeyboardEvent | React.MouseEvent) => {
        if (e.type === 'click' || (e as React.KeyboardEvent).key === 'Enter') {
            e.preventDefault()
            if (!inputValue.trim() && !selectedFile) {
                toast.error('Message or file required')
                return
            }
            if (!user) return

            const tempId = Date.now()
            let fileData: Message['file'] | undefined
            if (selectedFile) {
                const reader = new FileReader()
                const filePromise = new Promise<void>((resolve, reject) => {
                    reader.onload = () => {
                        fileData = {
                            name: selectedFile.name,
                            type: selectedFile.type,
                            size: selectedFile.size,
                            data: reader.result as string
                        }
                        resolve()
                    }
                    reader.onerror = () => reject(new Error('Failed to read file'))
                    reader.readAsDataURL(selectedFile)
                })
                await filePromise
            }

            const newMessage: Message = {
                text: inputValue,
                isUser: true,
                time: new Date().toISOString(),
                comment_id: threadId || tempId,
                ...(fileData && { file: fileData })
            }
            setMessages(prev => [...prev, newMessage])

            const createMessage = {
                commentId: String(threadId || tempId),
                userId: user.ID,
                userName: user.user_nicename || 'Anonymous',
                userEmail: user.user_email,
                type: 'message',
                content: [{
                    text: inputValue,
                    isUser: true,
                    time: new Date().toISOString(),
                    ...(fileData && { file: fileData })
                }],
                approved: 1,
                date: new Date().toISOString()
            }

            try {
                const method = threadId ? "PUT" : "POST"
                let response;

                if (method === "POST") {
                    response = await endpoints.messages.createMessage(createMessage);
                } else {
                    // For updates, we need to append to existing content
                    const updateData = {
                        $push: {
                            content: createMessage.content[0]
                        }
                    };
                    response = await endpoints.messages.updateMessage(String(threadId), updateData);
                }

                if (response?.success) {
                    const data = response.data;
                    console.log('Message sent:', data)
                    if (!threadId) {
                        setThreadId(data.comment_id || data.commentId)
                    }
                    setMessages(prev => prev.map(msg =>
                        msg.comment_id === tempId ? { ...msg, comment_id: data.comment_id || data.commentId } : msg
                    ))
                    toast.success('Message Sent Successfully')
                } else {
                    toast.error('Failed to send Message')
                    setMessages(prev => prev.filter(msg => msg.comment_id !== tempId))
                }
            } catch (error) {
                console.error("Error sending message:", error)
                toast.error('Failed to send Message')
                setMessages(prev => prev.filter(msg => msg.comment_id !== tempId))
            }

            setInputValue('')
            setSelectedFile(null)
        }
    }

    const handleDownloadFile = (file: Message['file']) => {
        try {
            const link = document.createElement("a")
            link.href = file ? file.data : ''
            link.download = file ? file.name : ''
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error("Error downloading file:", error)
            toast.error("Error downloading file")
        }
    }

    const formatTime = (timeStr: string) => {
        const messageDate = new Date(timeStr)
        const now = new Date()
        const yesterday = new Date(now)
        yesterday.setDate(now.getDate() - 1)

        const isToday = messageDate.toDateString() === now.toDateString()
        const isYesterday = messageDate.toDateString() === yesterday.toDateString()

        if (isToday) {
            return `Today ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        } else if (isYesterday) {
            return `Yesterday ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        } else {
            return `${messageDate.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' })} ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        }
    }

    const isImage = (file: Message['file']) => {
        return file?.type.startsWith('image/')
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Messages</h1>
                    <p className="text-gray-800">You can ask anything to admin.</p>
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-xl px-3 py-1 w-auto h-auto">
                    {loading ? (
                        <div className="h-full w-full flex justify-center items-center">
                            <div className="h-[500px] flex flex-col w-full justify-center items-center">
                                <p>Loading Messages...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full">
                            <div className="w-full flex flex-col justify-between gap-6 h-auto">
                                <div className="h-[550px] overflow-auto hide-scrollbar border-b shadow-inner shadow-primary/5 border-primary/20 w-full ">
                                    <div className="h-auto w-full overflow-y-auto p-4  space-y-4">
                                        {messages.map((msg, index) => (
                                            <div
                                                key={`${msg.comment_id}-${msg.time}-${index}`}
                                                className={`w-full flex-col flex ${msg.isUser ? 'items-end' : 'items-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] p-3 rounded-lg ${msg.isUser ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'
                                                        }`}
                                                >
                                                    <p>{msg.text}</p>
                                                    {msg.file && (
                                                        <div className="mt-2">
                                                            {isImage(msg.file) ? (
                                                                <img
                                                                    src={msg.file.data}
                                                                    alt={msg.file.name}
                                                                    className="max-w-[200px] rounded-md"
                                                                />
                                                            ) : (
                                                                <div className="flex items-center space-x-2">
                                                                    <FileText className="w-5 h-5" />
                                                                    <span>{msg.file.name}</span>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handleDownloadFile(msg.file)}
                                                                    >
                                                                        <Download className="w-4 h-4 mr-1" />
                                                                        Download
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    <p className="text-sm text-gray-500">{formatTime(msg.time)}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </div>
                                <div className="w-full h-auto flex justify-center items-center px-6">
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <Input
                                                type="file"
                                                accept="image/*,.pdf,.doc,.docx"
                                                onChange={handleFileChange}
                                                className="custom-file-input w-[40px] bg-white border-primary/20 text-black"
                                            />
                                            <Input
                                                type="text"
                                                placeholder="Ask me anything!"
                                                className="bg-gray-300 h-12 mb-3 rounded-xl text-black px-4 py-4 items-center flex-1"
                                                id="message"
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                onKeyDown={handleSendMessage}
                                            />
                                            <Button
                                                onClick={handleSendMessage}
                                                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl"
                                                style={{ pointerEvents: 'auto', zIndex: 10 }}
                                            >
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        {selectedFile && (
                                            <span className="text-sm text-gray-500">{selectedFile.name}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}

export default UserMessages