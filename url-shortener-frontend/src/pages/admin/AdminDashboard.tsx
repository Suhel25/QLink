import { useEffect, useState } from "react";
import API from "../../lib/api";
import { BarChart3, User, Link as LinkIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [topUsers, setTopUsers] = useState([]);
  const [topLinks, setTopLinks] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/admin/top-users").then((res) => setTopUsers(res.data));
    API.get("/admin/top-links").then((res) => setTopLinks(res.data));
  }, []);

  if (user?.role !== "admin") {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <BarChart3 className="w-7 h-7 text-[#1A4FE3]" /> Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-[#1A1F2E] p-6 rounded-xl border border-gray-800">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-[#E8468E]" /> Top Users
          </h2>
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 text-sm border-b border-gray-800">
                <th className="py-2 text-left">Name</th>
                <th className="py-2 text-left">Email</th>
                <th className="py-2 text-left">Clicks</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((u: any, i) => (
                <tr key={i} className="border-b border-gray-800">
                  <td className="py-2">{u.name}</td>
                  <td className="py-2 text-gray-400">{u.email}</td>
                  <td className="py-2 text-[#1A4FE3]">{u.totalClicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#1A1F2E] p-6 rounded-xl border border-gray-800">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-[#E8468E]" /> Top Links
          </h2>
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 text-sm border-b border-gray-800">
                <th className="py-2 text-left">Short URL</th>
                <th className="py-2 text-left">Clicks</th>
              </tr>
            </thead>
            <tbody>
              {topLinks.map((l: any, i) => (
                <tr key={i} className="border-b border-gray-800">
                  <td className="py-2">
                    <a
                      href={l.shortUrl}
                      target="_blank"
                      className="text-blue-400 underline"
                    >
                      {l.shortUrl}
                    </a>
                  </td>
                  <td className="py-2 text-[#1A4FE3]">{l.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
