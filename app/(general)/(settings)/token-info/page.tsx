"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface TokenData {
  user: {
    id: string;
    email: string;
    name: string;
    image: string;
    username: string;
    isVerfied: boolean;
  };
  tokens: {
    accessToken: string;
    accessTokenType: string;
  };
  metadata: {
    expires: string;
    sessionCreatedAt: string;
  };
}

interface TokenResponse {
  success: boolean;
  message: string;
  data: TokenData;
  availableFields: Record<string, string>;
}

export default function TokenInfoPage() {
  const { data: session, status } = useSession();
  const [tokenData, setTokenData] = useState<TokenResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetchTokenInfo();
    }
  }, [status]);

  const fetchTokenInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/token-info");
      if (!response.ok) {
        throw new Error(`Failed to fetch token info: ${response.status}`);
      }
      const data = await response.json();
      setTokenData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch token info");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="p-8">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="p-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
          Please sign in to view JWT token information
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">JWT Token Information</h1>

      <button
        onClick={fetchTokenInfo}
        disabled={loading}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Refreshing..." : "Refresh Token Info"}
      </button>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {tokenData && (
        <div className="space-y-6">
          {/* User Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">User ID</p>
                <p className="text-lg text-gray-900 break-all">
                  {tokenData.data.user.id}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg text-gray-900">{tokenData.data.user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Username</p>
                <p className="text-lg text-gray-900">{tokenData.data.user.username}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-lg text-gray-900">
                  {tokenData.data.user.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email Verified</p>
                <p className="text-lg">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      tokenData.data.user.isVerfied
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {tokenData.data.user.isVerfied ? "Yes" : "No"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Token Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Token Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Access Token (Truncated)
                </p>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm break-all">
                  {tokenData.data.tokens.accessToken}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Token Type</p>
                <p className="text-lg text-gray-900">
                  {tokenData.data.tokens.accessTokenType}
                </p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Session Metadata</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Session Expires</p>
                <p className="text-lg text-gray-900">
                  {new Date(tokenData.data.metadata.expires).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Last Refreshed At
                </p>
                <p className="text-lg text-gray-900">
                  {new Date(tokenData.data.metadata.sessionCreatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Available Fields Reference */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Available JWT Fields</h2>
            <div className="space-y-2">
              {Object.entries(tokenData.availableFields).map(([field, description]) => (
                <div key={field} className="flex justify-between items-start">
                  <code className="text-sm font-mono bg-white px-2 py-1 rounded border border-blue-300">
                    {field}
                  </code>
                  <span className="text-sm text-gray-700">{description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Raw Session Data */}
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Raw Response</h2>
            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto text-xs">
              {JSON.stringify(tokenData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
