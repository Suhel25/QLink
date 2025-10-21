import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link as LinkIcon, ArrowRight } from "lucide-react";
import { guestAPI } from "../lib/api";

export default function Landing() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestLinksCount, setGuestLinksCount] = useState(
    parseInt(localStorage.getItem("guestLinksCount") || "0")
  );

  const handleGuestShorten = async () => {
    setError("");
    setShortUrl("");

    if (guestLinksCount >= 5) {
      setError("Free limit reached! Please login or register to continue.");
      return;
    }

    if (!originalUrl.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    try {
      setLoading(true);
      const { data } = await guestAPI.post("/links/guest", { originalUrl });
      setShortUrl(data.link.shortUrl);
      const newCount = guestLinksCount + 1;
      setGuestLinksCount(newCount);
      localStorage.setItem("guestLinksCount", newCount.toString());
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to shorten link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <nav className="bg-[#0B0F19] border-b border-gray-800 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-6 sm:w-7 h-6 sm:h-7 text-[#E8468E]" />
            <h1 className="text-xl sm:text-2xl font-bold">
              <span className="text-[#E8468E]">Q</span>
              <span className="text-white">Link</span>
              <span className="text-gray-400 text-base sm:text-lg">®</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <RouterLink
              to="/login"
              className="px-4 sm:px-6 py-2 text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
            >
              Login
            </RouterLink>
            <RouterLink
              to="/signup"
              className="px-4 sm:px-6 py-2 bg-[#1A4FE3] hover:bg-[#1a4fe3dd] text-white font-semibold rounded-lg transition-all duration-200 text-sm sm:text-base"
            >
              Register Now
            </RouterLink>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-[#1A4FE3]">Shorten</span>{" "}
            <span className="text-[#E8468E]">Your</span>{" "}
            <span className="bg-gradient-to-r from-[#1A4FE3] to-[#E8468E] text-transparent bg-clip-text">
              Loooong Links :)
            </span>
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-8">
            QLink lets you shorten 5 free links — then sign up for unlimited usage.
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="bg-[#1A1F2E] rounded-2xl p-4 sm:p-8 border border-gray-800">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <input
                  type="url"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  placeholder="Enter the link here"
                  className="w-full pl-12 pr-4 sm:pr-40 py-4 bg-[#0B0F19] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1A4FE3] focus:border-transparent transition-all"
                />
                <button
                  onClick={handleGuestShorten}
                  disabled={loading}
                  className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 bg-[#1A4FE3] hover:bg-[#1a4fe3dd] text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-200 items-center gap-2"
                >
                  {loading ? "Shortening..." : "Shorten Now!"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleGuestShorten}
                disabled={loading}
                className="flex sm:hidden mt-4 w-full bg-[#1A4FE3] hover:bg-[#1a4fe3dd] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 items-center justify-center gap-2"
              >
                {loading ? "Shortening..." : "Shorten Now!"}
                <ArrowRight className="w-4 h-4" />
              </button>

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

              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm sm:text-base">
                  You can create{" "}
                  <span className="text-[#E8468E] font-semibold">
                    {Math.max(0, 5 - guestLinksCount).toString().padStart(2, "0")}
                  </span>{" "}
                  more links.{" "}
                  <RouterLink
                    to="/signup"
                    className="text-[#1A4FE3] hover:underline font-medium"
                  >
                    Register Now
                  </RouterLink>{" "}
                  to enjoy Unlimited usage
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
