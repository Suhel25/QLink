import { useEffect, useState } from "react";
import API from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/admin/users").then((res) => setUsers(res.data));
  }, []);

  return (
    <div className="bg-[#0B0F19] min-h-screen text-white p-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <User className="w-6 h-6 text-[#E8468E]" /> All Users
      </h1>

      <div className="bg-[#1A1F2E] rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-800 text-gray-400 text-sm">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Links</th>
              <th className="px-6 py-3 text-left">Clicks</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr
                key={u._id}
                className="border-b border-gray-800 hover:bg-[#252b3d] transition"
              >
                <td className="px-6 py-3">{u.name}</td>
                <td className="px-6 py-3 text-gray-400">{u.email}</td>
                <td className="px-6 py-3">{u.totalLinks}</td>
                <td className="px-6 py-3">{u.totalClicks}</td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => navigate(`/admin/users/${u._id}/links`)}
                    className="text-blue-400 hover:underline"
                  >
                    View Links
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
