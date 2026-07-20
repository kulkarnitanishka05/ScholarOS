import {
  LayoutDashboard,
  Upload,
  MessageCircle,
  Files,
  FileText,
  GitCompare,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Upload",
    path: "/upload",
    icon: Upload,
  },
  {
    name: "AI Chat",
    path: "/chat",
    icon: MessageCircle,
  },
  {
    name: "Documents",
    path: "/documents",
    icon: Files,
  },
  {
    name: "Summary",
    path: "/summary",
    icon: FileText,
  },
  {
    name: "Compare",
    path: "/compare",
    icon: GitCompare,
  },
];

export default navigation;
