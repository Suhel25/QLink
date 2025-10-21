import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Link as LinkIcon,
  Bell,
  ChevronDown,
  Clock,
  BarChart3,
  MousePointerClick,
  Settings,
  LogOut,
} from "lucide-react";
import LinkShortener from "../components/LinkShortener";
import LinksHistory from "../components/LinksHistory";

type Tab = "history" | "statistics" | "click-stream" | "settings";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("history");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const tabs: { id: Tab; label: string; icon: typeof Clock }[] = [
    { id: "history", label: "History", icon: Clock },
    { id: "statistics", label: "Statistics", icon: BarChart3 },
    { id: "click-stream", label: "Click Stream", icon: MousePointerClick },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <nav className="bg-[#0B0F19] border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-7 h-7 text-[#E8468E]" />
            <h1 className="text-2xl font-bold">
              <span className="text-[#E8468E]">Q</span>
              <span className="text-white">Link</span>
              <span className="text-gray-400 text-lg">®</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#1A4FE3] rounded-full"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 bg-[#1A1F2E] hover:bg-[#252b3d] px-4 py-2 rounded-lg transition-colors border border-gray-800"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-gray-400">Welcome</p>
                  <p className="text-sm font-semibold text-white">
                    {user?.name || "User"}
                  </p>
                </div>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1A1F2E] rounded-lg shadow-lg border border-gray-800 py-2 z-50">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-[#252b3d] transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <LinkShortener />

        <div className="mt-8">
          <div className="border-b border-gray-800 mb-6">
            <nav className="flex gap-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 pb-4 px-2 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-[#1A4FE3] text-white"
                        : "border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {activeTab === "history" && <LinksHistory />}
          {activeTab === "statistics" && (
            <div className="text-center py-12 text-gray-400">
              Statistics view coming soon
            </div>
          )}
          {activeTab === "click-stream" && (
            <div className="text-center py-12 text-gray-400">
              Click Stream view coming soon
            </div>
          )}
          {activeTab === "settings" && (
            <div className="text-center py-12 text-gray-400">
              Settings view coming soon
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-8 right-8">
        <button className="bg-[#1A4FE3] hover:bg-[#1a4fe3dd] text-white p-4 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2">
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-semibold hidden sm:block">Dark Theme</span>
        </button>
      </div>
    </div>
  );
}
