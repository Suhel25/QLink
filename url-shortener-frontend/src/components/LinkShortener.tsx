import { useState } from "react";
import API from "../lib/api";

export default function LinkShortener() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setLoading(true);

    try {
      const { data } = await API.post("/links", { originalUrl });
      setShortUrl(data.link.shortUrl);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to shorten link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1A1F2E] p-6 rounded-xl border border-gray-800 shadow-lg">
      <form onSubmit={handleShorten} className="flex flex-col sm:flex-row gap-4">
        <input
          type="url"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="Enter the link here"
          required
          className="flex-1 bg-[#0B0F19] text-white border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#1A4FE3] outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#1A4FE3] hover:bg-[#1a4fe3dd] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Shortening..." : "Shorten Now!"}
        </button>
      </form>

      {error && <p className="text-red-400 mt-3">{error}</p>}
      {shortUrl && (
        <p className="text-green-400 mt-3">
          Shortened Link:{" "}
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-400"
          >
            {shortUrl}
          </a>
        </p>
      )}
    </div>
  );
}
