// src/services/notificationService.js

const STORAGE_KEY = "scholaros_notifications";

/**
 * Get all notifications
 */
export const getNotifications = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * Save notifications
 */
const saveNotifications = (notifications) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(notifications)
  );
};

/**
 * Add notification
 */
export const addNotification = (
  title,
  message,
  type = "info"
) => {
  const notifications = getNotifications();

  const notification = {
    id: Date.now().toString(),
    title,
    message,
    type, // success | info | warning | error
    read: false,
    createdAt: new Date().toISOString(),
  };

  notifications.unshift(notification);

  // Keep only latest 50 notifications
  if (notifications.length > 50) {
    notifications.pop();
  }

  saveNotifications(notifications);

  return notification;
};

/**
 * Mark one notification as read
 */
export const markAsRead = (id) => {
  const notifications = getNotifications();

  const updated = notifications.map((item) =>
    item.id === id
      ? { ...item, read: true }
      : item
  );

  saveNotifications(updated);
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = () => {
  const notifications = getNotifications();

  const updated = notifications.map((item) => ({
    ...item,
    read: true,
  }));

  saveNotifications(updated);
};

/**
 * Delete notification
 */
export const deleteNotification = (id) => {
  const notifications = getNotifications();

  saveNotifications(
    notifications.filter(
      (item) => item.id !== id
    )
  );
};

/**
 * Clear all notifications
 */
export const clearNotifications = () => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Count unread notifications
 */
export const getUnreadCount = () => {
  return getNotifications().filter(
    (item) => !item.read
  ).length;
};

/**
 * Generate demo notifications
 * Call once during development.
 */
export const seedNotifications = () => {

  if (getNotifications().length > 0) return;

  addNotification(
    "Welcome",
    "Welcome to ScholarOS!",
    "success"
  );

  addNotification(
    "Upload",
    "Upload your first PDF document.",
    "info"
  );

  addNotification(
    "Research Assistant",
    "Ask AI questions after indexing documents.",
    "info"
  );
};