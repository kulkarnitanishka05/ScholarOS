import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  Bell,
  Check,
  Trash2,
  X,
  FileText,
  Bot,
  Sparkles,
  Info,
} from "lucide-react";

import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  clearNotifications,
  deleteNotification,
} from "../services/notificationService";
export default function NotificationMenu() {
  const [open, setOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const [unread, setUnread] = useState(0);

  const menuRef = useRef(null);

  const loadNotifications = () => {
    setNotifications(getNotifications());
    setUnread(getUnreadCount());
  };

  useEffect(() => {
    loadNotifications();
  }, []);

    useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);
    const handleMarkRead = (id) => {
    markAsRead(id);
    loadNotifications();
  };

  const handleDelete = (id) => {
    deleteNotification(id);
    loadNotifications();
  };

  const handleClearAll = () => {
    clearNotifications();
    loadNotifications();
  };

    const getIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <Sparkles
            size={18}
            className="text-emerald-400"
          />
        );

      case "warning":
        return (
          <Info
            size={18}
            className="text-yellow-400"
          />
        );

      case "error":
        return (
          <X
            size={18}
            className="text-red-400"
          />
        );

      case "upload":
        return (
          <FileText
            size={18}
            className="text-cyan-400"
          />
        );

      default:
        return (
          <Bot
            size={18}
            className="text-violet-400"
          />
        );
    }
  };

    const formatTime = (date) => {
    return new Date(date).toLocaleString([], {
      dateStyle: "short",
      timeStyle: "short",
    });
  };
}