import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link as RouterLink } from "react-router-dom";
import { LogIn, Link } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Link className="w-8 h-8 text-[#E8468E]" />
            <h1 className="text-3xl font-bold">
              <span className="text-[#E8468E]">Q</span>
              <span className="text-white">Link</span>
              <span className="text-gray-400 text-xl">®</span>
            </h1>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Welcome Back!</h2>
          <p className="text-gray-400">Sign in to continue shortening your links</p>
        </div>

        <div className="bg-[#1A1F2E] rounded-2xl p-8 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0B0F19] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1A4FE3] focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0B0F19] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1A4FE3] focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A4FE3] hover:bg-[#1a4fe3dd] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don’t have an account?{" "}
              <RouterLink
                to="/signup"
                className="text-[#1A4FE3] hover:underline font-medium"
              >
                Register Now
              </RouterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
