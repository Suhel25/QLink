import { useEffect, useState } from "react";
import API from "../../lib/api";
import { useParams } from "react-router-dom";
import { Link as LinkIcon } from "lucide-react";

export default function AdminUserLinks() {
  const { userId } = useParams();
  const [links, setLinks] = useState([]);

  useEffect(() => {
    API.get(`/admin/users/${userId}/links`).then((res) => setLinks(res.data));
  }, [userId]);

  return (
    <div className="bg-[#0B0F19] min-h-screen text-white p-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <LinkIcon className="w-6 h-6 text-[#1A4FE3]" /> Links by User
      </h1>

      <div className="bg-[#1A1F2E] rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-800 text-gray-400 text-sm">
            <tr>
              <th className="px-6 py-3 text-left">Short URL</th>
              <th className="px-6 py-3 text-left">Original URL</th>
              <th className="px-6 py-3 text-left">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {links.map((l: any) => (
              <tr
                key={l._id}
                className="border-b border-gray-800 hover:bg-[#252b3d] transition"
              >
                <td className="px-6 py-3">
                  <a
                    href={l.shortUrl}
                    target="_blank"
                    className="text-blue-400 underline"
                  >
                    {l.shortUrl}
                  </a>
                </td>
                <td className="px-6 py-3 text-gray-400 truncate">
                  {l.originalUrl}
                </td>
                <td className="px-6 py-3 text-[#1A4FE3]">{l.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
