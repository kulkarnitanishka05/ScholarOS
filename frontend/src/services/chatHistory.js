// src/services/chatHistory.js

const STORAGE_KEY = "scholaros_chat_history";

/**
 * Get all conversations
 */
export const getConversations = () => {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

/**
 * Save all conversations
 */
const saveAllConversations = (conversations) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(conversations)
  );
};

/**
 * Create a new conversation
 */
export const createConversation = (firstQuestion = "New Chat") => {
  const conversations = getConversations();

  const conversation = {
    id: Date.now().toString(),
    title:
      firstQuestion.length > 40
        ? firstQuestion.substring(0, 40) + "..."
        : firstQuestion,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
  };

  conversations.unshift(conversation);

  saveAllConversations(conversations);

  return conversation;
};

/**
 * Get one conversation
 */
export const getConversation = (id) => {
  const conversations = getConversations();

  return conversations.find(
    (chat) => chat.id === id
  );
};

/**
 * Update an existing conversation
 */
export const updateConversation = (
  id,
  messages
) => {
  const conversations = getConversations();

  const updated = conversations.map((chat) => {
    if (chat.id === id) {
      return {
        ...chat,
        messages,
        updatedAt: new Date().toISOString(),
      };
    }

    return chat;
  });

  saveAllConversations(updated);
};

/**
 * Add a message to conversation
 */
export const addMessage = (
  conversationId,
  message
) => {
  const conversations = getConversations();

  const updated = conversations.map((chat) => {
    if (chat.id === conversationId) {
      return {
        ...chat,
        messages: [...chat.messages, message],
        updatedAt: new Date().toISOString(),
      };
    }

    return chat;
  });

  saveAllConversations(updated);
};

/**
 * Rename conversation
 */
export const renameConversation = (
  id,
  newTitle
) => {
  const conversations = getConversations();

  const updated = conversations.map((chat) => {
    if (chat.id === id) {
      return {
        ...chat,
        title: newTitle,
      };
    }

    return chat;
  });

  saveAllConversations(updated);
};

/**
 * Delete conversation
 */
export const deleteConversation = (id) => {
  const conversations = getConversations();

  const updated = conversations.filter(
    (chat) => chat.id !== id
  );

  saveAllConversations(updated);
};

/**
 * Clear entire chat history
 */
export const clearAllConversations = () => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Save entire conversation
 */
export const saveConversation = (
  conversation
) => {
  const conversations = getConversations();

  const index = conversations.findIndex(
    (chat) => chat.id === conversation.id
  );

  if (index === -1) {
    conversations.unshift(conversation);
  } else {
    conversations[index] = {
      ...conversation,
      updatedAt: new Date().toISOString(),
    };
  }

  saveAllConversations(conversations);
};

/**
 * Sort conversations by latest activity
 */
export const getSortedConversations = () => {
  const conversations = getConversations();

  return conversations.sort(
    (a, b) =>
      new Date(b.updatedAt) -
      new Date(a.updatedAt)
  );
};
