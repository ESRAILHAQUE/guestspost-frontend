// import { X, Send } from 'lucide-react'
// import React, { useState, useRef, useEffect } from 'react'
// import { Input } from './ui/input'

// const UserChat = (prop : any) => {
//     const [messages, setMessages] = useState([]); // Array of {text: string, isUser: boolean}
//     const [inputValue, setInputValue] = useState('');
//     const messagesEndRef = useRef(null); // For scrolling to bottom

//     // Scroll to bottom when new messages added
//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);

//     const handleSendMessage = (e: any) => {
//         if (e.key === 'Enter' || e.type === 'click') {
//             e.preventDefault();
//             const messageText = inputValue.trim();
//             if (messageText) {
//                 // Add user message (light blue)
//                 setMessages(prev => [...prev, { text: messageText, isUser: true }]);
//                 setInputValue('');

//                 // Simulate admin reply after a delay (gray) - replace with real API call if needed
//                 setTimeout(() => {
//                     const adminReply = "This is an auto-generated reply from Guest Post AI. Your query has been noted, and the admin will respond soon.";
//                     setMessages(prev => [...prev, { text: adminReply, isUser: false }]);
//                 }, 1000);
//             }
//         }
//     };

//     return (

//             <div className='w-full h-full'>
//                 <div className='w-full flex flex-col gap-6 h-auto'>
//                     <div className='w-full flex justify-between'>
//                         <h2 className='text-xl font-semibold'>Messages</h2>
//                         <div className="cross-button z-20 bg-gray-300 h-6 w-6 flex justify-center rounded-full items-center text-primary text-center">
//                         <X className='h-4 w-4 text-primary' />
//                     </div>
//                     </div>
//                     <div className='h-[320px] w-full'>
//                         <div className='h-auto w-full overflow-auto p-4 space-y-4'>
//                             {messages.map((msg, index) => (
//                                 <div key={index} className={`flex ${msg?.isUser ? 'justify-end' : 'justify-start'}`}>
//                                     <div className={`max-w-[80%] p-3 rounded-lg ${msg?.isUser ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'}`}>
//                                         {msg?.text}
//                                     </div>
//                                 </div>
//                             ))}
//                             <div ref={messagesEndRef} />
//                         </div>
//                     </div>
//                     <div className='w-full h-[50px] flex justify-center items-center px-6'>
//                         <div className='w-full flex gap-2'>
//                             <Input
//                                 type='text'
//                                 placeholder='Ask me anything!'
//                                 className='bg-gray-300 h-12 rounded-xl text-black px-4 py-4 items-center flex-1'
//                                 id='message'
//                                 value={inputValue}
//                                 onChange={(e) => setInputValue(e.target.value)}
//                                 onKeyDown={handleSendMessage}
//                             />
//                             <button
//                                 onClick={handleSendMessage}
//                                 className='bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl'
//                             >
//                                 <Send className='h-4 w-4' />
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
    
//     )
// }

// export default UserChat