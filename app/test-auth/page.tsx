"use client";

import { useState, useEffect } from "react";
import { endpoints } from "@/lib/api/client";

export default function TestAuthPage() {
  const [authStatus, setAuthStatus] = useState<string>("Checking...");
  const [userData, setUserData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check localStorage
      const token = localStorage.getItem("auth-token");
      const userId = localStorage.getItem("user_id");
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      
      console.log("Auth check:", { token: !!token, userId, isLoggedIn });
      
      if (!token || !userId || isLoggedIn !== "true") {
        setAuthStatus("Not authenticated - please login first");
        return;
      }

      setAuthStatus("Authenticated - testing API calls...");

      // Test getMe
      try {
        const userResponse = await endpoints.auth.getMe();
        console.log("User response:", userResponse);
        setUserData(userResponse.data);
      } catch (error) {
        console.error("getMe error:", error);
        setAuthStatus(`getMe failed: ${error}`);
        return;
      }

      // Test getMyMessages
      try {
        const messagesResponse = await endpoints.messages.getMyMessages();
        console.log("Messages response:", messagesResponse);
        setMessages(messagesResponse.data || []);
        setAuthStatus("All API calls successful!");
      } catch (error) {
        console.error("getMyMessages error:", error);
        setAuthStatus(`getMyMessages failed: ${error}`);
      }

    } catch (error) {
      console.error("Auth check error:", error);
      setAuthStatus(`Error: ${error}`);
    }
  };

  const loginTest = () => {
    // Simulate login by setting test values
    localStorage.setItem("auth-token", "test-token");
    localStorage.setItem("user_id", "test@example.com");
    localStorage.setItem("isLoggedIn", "true");
    setAuthStatus("Test login set - refresh page to test");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Authentication Test Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Auth Status:</h2>
          <p>{authStatus}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">LocalStorage Values:</h2>
          <p>Token: {localStorage.getItem("auth-token") ? "Present" : "Missing"}</p>
          <p>User ID: {localStorage.getItem("user_id") || "Missing"}</p>
          <p>Is Logged In: {localStorage.getItem("isLoggedIn") || "Missing"}</p>
        </div>

        {userData && (
          <div className="p-4 border rounded">
            <h2 className="font-semibold">User Data:</h2>
            <pre>{JSON.stringify(userData, null, 2)}</pre>
          </div>
        )}

        {messages.length > 0 && (
          <div className="p-4 border rounded">
            <h2 className="font-semibold">Messages ({messages.length}):</h2>
            <pre>{JSON.stringify(messages, null, 2)}</pre>
          </div>
        )}

        <button 
          onClick={loginTest}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Set Test Login (for testing)
        </button>

        <button 
          onClick={checkAuth}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-2"
        >
          Test Auth Again
        </button>
      </div>
    </div>
  );
}
