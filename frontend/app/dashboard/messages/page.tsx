"use client"

import { DashboardLayout } from '@/components/dashboard-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send, FileText, Download, Image as ImageIcon } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
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
                const response = await fetch("https://guestpostnow.io/guestpost-backend/users.php", {
                    method: "GET"
                })
                const userData = await response.json()
                if (userData) {
                    const user_id = localStorage.getItem('user_id');
                    const foundUser = userData.find((user: any) => user.user_email === user_id)
                    console.log('User:', foundUser)
                    setUser(foundUser)
                }
            } catch (error) {
                console.error("Error fetching user:", error)
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
            try {
                setLoading(true)
                const res = await fetch("https://guestpostnow.io/guestpost-backend/comments.php", {
                    method: "GET"
                })
                const commentsData = await res.json();
                const allComments = commentsData.data
                if (allComments) {
                    // console.log(user?.ID);

                    const userMessages = allComments.filter((comment: any) => parseInt(comment.user_id) === parseInt(user?.ID));
                    // console.log("User Messages", userMessages);
                   
                    if(userMessages.length > 0) {
                        setUserHasMessage(true);
                    }

                    if (userMessages.length > 0) {
                        setThreadId(userMessages[0].comment_ID)
                        const content = userMessages[0].comment_content || '[]'
                        // console.log(content);

                        const normalized = content
                            .filter((msg: any) => msg.text || msg.file)
                            .map((msg: any) => ({
                                text: msg.text,
                                isUser: msg.isUser,
                                time: msg.time,
                                comment_id: parseInt(userMessages[0].comment_ID),
                                ...(msg.file && { file: msg.file })
                            }))
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
                setLoading(false)
            }
        }
        loadMessages()
    }, [user?.ID])

    useEffect(() => {
        if (!userHasMessage) return;
console.log(userHasMessage);

        const evtSource = new EventSource(`https://guestpostnow.io/guestpost-backend/message-stream.php?lastId=${lastMessageId}`)
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
                comment_ID: threadId,
                user_id: parseInt(user.ID),
                comment_author: user.user_nicename || 'Anonymous',
                comment_author_email: user.user_email,
                comment_author_url: user.user_url || '',
                comment_content: inputValue,
                isUser: true,
                comment_type: 'thread',
                comment_date: new Date().toISOString(),
                comment_date_gmt: new Date().toISOString(),
                comment_approved: 1,
                comment_karma: 0,
                ...(fileData && { file: fileData })
            }

            try {
                const method = threadId ? "PUT" : "POST"
                const url = "https://guestpostnow.io/guestpost-backend/comments.php"

                const res = await fetch(url, {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(createMessage),
                })

                if (res.ok) {
                    const data = await res.json()
                    console.log('Message sent:', data)
                    if (!threadId) {
                        setThreadId(data.comment_id)
                    }
                    setMessages(prev => prev.map(msg =>
                        msg.comment_id === tempId ? { ...msg, comment_id: data.comment_id } : msg
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