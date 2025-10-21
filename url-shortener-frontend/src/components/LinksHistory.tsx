import { useEffect, useState } from "react";
import API from "../lib/api";
import { Copy, Edit2, Trash2, ExternalLink, MoreVertical, SlidersHorizontal, List } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface Link {
  _id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  isActive: boolean;
  createdAt: string;
}

export default function LinksHistory() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQRCode, setShowQRCode] = useState<string | null>(null);

  const loadLinks = async () => {
    try {
      const { data } = await API.get("/links");
      setLinks(data);
    } catch (error: any) {
      console.error("Error loading links:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const deleteLink = async (id: string) => {
    try {
      await API.delete(`/links/${id}`);
      setLinks((prev) => prev.filter((link) => link._id !== id));
    } catch (error: any) {
      console.error("Error deleting link:", error.response?.data || error.message);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await API.patch(`/links/${id}`, { isActive: !currentStatus });
      setLinks((prev) =>
        prev.map((link) => (link._id === id ? { ...link, isActive: !currentStatus } : link))
      );
    } catch (error: any) {
      console.error("Error updating status:", error.response?.data || error.message);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getIconForUrl = (url: string) => {
    if (url.includes("twitter.com") || url.includes("x.com")) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#1DA1F2] flex items-center justify-center">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
      );
    }
    if (url.includes("youtube.com")) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#FF0000] flex items-center justify-center">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
        <ExternalLink className="w-4 h-4 text-gray-400" />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-[#1A4FE3] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          History <span className="text-gray-400">({links.length})</span>
        </h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1F2E] hover:bg-[#252b3d] text-gray-300 rounded-lg border border-gray-800">
            <List className="w-4 h-4" />
            Bulk Edit
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1F2E] hover:bg-[#252b3d] text-gray-300 rounded-lg border border-gray-800">
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-[#1A1F2E] rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Short Link</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Original Link</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">QR Code</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Clicks</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link._id} className="border-b border-gray-800 hover:bg-[#252b3d] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <a href={link.shortUrl} target="_blank" className="text-gray-300 font-mono text-sm hover:underline">
                        {link.shortUrl}
                      </a>
                      <button
                        onClick={() => copyToClipboard(link.shortUrl)}
                        className="text-gray-500 hover:text-[#1A4FE3] transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 max-w-md">
                      {getIconForUrl(link.originalUrl)}
                      <span className="text-gray-400 truncate text-sm">{link.originalUrl}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 relative">
                    <button onClick={() => setShowQRCode(showQRCode === link._id ? null : link._id)}>
                      <div className="w-8 h-8 bg-[#0B0F19] rounded border border-gray-700 flex items-center justify-center">
                        <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                          <div className="bg-gray-500 rounded-sm"></div>
                          <div className="bg-gray-700 rounded-sm"></div>
                          <div className="bg-gray-700 rounded-sm"></div>
                          <div className="bg-gray-500 rounded-sm"></div>
                        </div>
                      </div>
                    </button>
                    {showQRCode === link._id && (
                      <div className="absolute left-0 top-full mt-2 bg-white p-4 rounded-lg shadow-xl z-10">
                        <QRCodeSVG value={link.shortUrl} size={150} />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-white font-semibold">{link.clicks}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleStatus(link._id, link.isActive)} className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          link.isActive
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {link.isActive ? "Active" : "Inactive"}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {formatDate(link.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteLink(link._id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {links.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No links yet. Create your first shortened link above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
