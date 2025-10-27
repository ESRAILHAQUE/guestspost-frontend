import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/types/api";
import { endpoints } from "@/lib/api/client";

export interface MessageContentType {
  text: string;
  isUser: boolean;
  time: string;
  file?: {
    name: string;
    type: string;
    size: number;
    data: string;
  };
}

export interface MessageType {
  _id?: string;
  commentId: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: "thread" | "message";
  content: MessageContentType[];
  approved: number;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function useMessages() {
  return useQuery({
    queryKey: QueryKeys.messages(),
    queryFn: async () => {
      try {
        const response = await endpoints.messages.getMessages();
        return response.data;
      } catch (error) {
        console.error("Error loading messages:", error);
        return [];
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: false,
  });
}

export function useMessage(id: string) {
  return useQuery({
    queryKey: QueryKeys.message(id),
    queryFn: async () => {
      const response = await endpoints.messages.getMessage(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 30 * 1000,
    retry: false,
  });
}

export function useCreateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageData: Partial<MessageType>) => {
      const response = await endpoints.messages.createMessage(messageData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.messages() });
    },
  });
}

export function useUpdateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      messageData,
    }: {
      id: string;
      messageData: Partial<MessageType>;
    }) => {
      const response = await endpoints.messages.updateMessage(id, messageData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.messages() });
    },
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await endpoints.messages.deleteMessage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.messages() });
    },
  });
}

export function useAddReplyToMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      replyData,
    }: {
      id: string;
      replyData: MessageContentType;
    }) => {
      const response = await endpoints.messages.addReplyToMessage(
        id,
        replyData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.messages() });
    },
  });
}

export function useMessageStats() {
  return useQuery({
    queryKey: QueryKeys.messageStats(),
    queryFn: async () => {
      const response = await endpoints.messages.getMessageStats();
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
    retry: false,
  });
}
