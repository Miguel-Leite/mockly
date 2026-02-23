"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "@/lib/i18n";
import {
  Send,
  Plus,
  Trash2,
  Clock,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Loader2,
  X,
  Key,
  Lock,
  Globe,
  History,
  Code,
  Variable,
  FileJson,
  Database,
  Play,
  RefreshCw,
  Search,
  FolderOpen,
} from "lucide-react";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface KeyValue {
  key: string;
  value: string;
  enabled: boolean;
}

interface HistoryItem {
  id: string;
  method: HttpMethod;
  url: string;
  timestamp: number;
  status: number;
  duration: number;
}

interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
  duration: number;
  size: number;
}

type BodyType = "json" | "graphql" | "text" | "none";
type AuthType = "none" | "bearer" | "basic" | "apiKey";

const methodColors: Record<HttpMethod, string> = {
  GET: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  POST: "bg-green-500/20 text-green-400 border-green-500/30",
  PUT: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
  PATCH: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const demoRequests: { method: HttpMethod; url: string; name: string }[] = [
  { method: "GET", url: "http://localhost:3001/api/users", name: "Get Users" },
  { method: "POST", url: "http://localhost:3001/api/users", name: "Create User" },
  { method: "GET", url: "http://localhost:3001/api/products", name: "Get Products" },
  { method: "GET", url: "http://localhost:3001/api/orders", name: "Get Orders" },
];

const graphqlDemo = {
  query: `query {
  users(limit: 5) {
    id
    name
    email
  }
}`,
  variables: `{
  "limit": 5
}`,
};

export default function PlaygroundPage() {
  const { t } = useTranslation();

  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("http://localhost:3001/api/users");
  const [params, setParams] = useState<KeyValue[]>([{ key: "", value: "", enabled: true }]);
  const [headers, setHeaders] = useState<KeyValue[]>([
    { key: "Content-Type", value: "application/json", enabled: true }
  ]);
  const [bodyType, setBodyType] = useState<BodyType>("json");
  const [body, setBody] = useState('{\n  \n}');
  const [graphqlQuery, setGraphqlQuery] = useState(graphqlDemo.query);
  const [graphqlVariables, setGraphqlVariables] = useState(graphqlDemo.variables);
  const [authType, setAuthType] = useState<AuthType>("none");
  const [authToken, setAuthToken] = useState("");
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authApiKey, setAuthApiKey] = useState("");
  const [authApiKeyHeader, setAuthApiKeyHeader] = useState("X-API-Key");

  const [activeRequestTab, setActiveRequestTab] = useState<"params" | "headers" | "body" | "auth">("params");
  const [activeResponseTab, setActiveResponseTab] = useState<"body" | "headers">("body");

  const [response, setResponse] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showCollections, setShowCollections] = useState(false);

  const [copied, setCopied] = useState(false);
  const [graphqlSchema, setGraphqlSchema] = useState<unknown>(null);
  const [showSchemaModal, setShowSchemaModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("mockario-playground-history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const saveToHistory = useCallback((item: HistoryItem) => {
    const newHistory = [item, ...history.slice(0, 49)];
    setHistory(newHistory);
    localStorage.setItem("mockario-playground-history", JSON.stringify(newHistory));
  }, [history]);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("mockario-playground-history");
  };

  const buildUrl = useCallback(() => {
    let finalUrl = url;
    const enabledParams = params.filter(p => p.enabled && p.key);
    if (enabledParams.length > 0) {
      const searchParams = new URLSearchParams();
      enabledParams.forEach(p => searchParams.append(p.key, p.value));
      finalUrl += (finalUrl.includes("?") ? "&" : "?") + searchParams.toString();
    }
    return finalUrl;
  }, [url, params]);

  const buildHeaders = useCallback(() => {
    const result: Record<string, string> = {};
    headers.filter(h => h.enabled && h.key).forEach(h => {
      result[h.key] = h.value;
    });

    if (authType === "bearer" && authToken) {
      result["Authorization"] = `Bearer ${authToken}`;
    } else if (authType === "basic" && authUsername) {
      result["Authorization"] = `Basic ${btoa(`${authUsername}:${authPassword}`)}`;
    } else if (authType === "apiKey" && authApiKey) {
      result[authApiKeyHeader] = authApiKey;
    }

    return result;
  }, [headers, authType, authToken, authUsername, authPassword, authApiKey, authApiKeyHeader]);

  const buildBody = useCallback(() => {
    if (bodyType === "json") {
      try {
        return JSON.parse(body);
      } catch {
        return body;
      }
    } else if (bodyType === "graphql") {
      const parsed: Record<string, unknown> = { query: graphqlQuery };
      try {
        const vars = JSON.parse(graphqlVariables);
        if (Object.keys(vars).length > 0) {
          parsed.variables = vars;
        }
      } catch {}
      return parsed;
    }
    return body;
  }, [bodyType, body, graphqlQuery, graphqlVariables]);

  const sendRequest = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    const startTime = performance.now();
    const finalUrl = buildUrl();
    const reqHeaders = buildHeaders();
    const reqBody = ["POST", "PUT", "PATCH"].includes(method) && bodyType !== "none" ? buildBody() : undefined;

    try {
      const res = await fetch(finalUrl, {
        method,
        headers: reqHeaders,
        body: reqBody ? JSON.stringify(reqBody) : undefined,
      });

      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      let data: unknown;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      const resHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        resHeaders[key] = value;
      });

      const responseData: ResponseData = {
        status: res.status,
        statusText: res.statusText,
        headers: resHeaders,
        data,
        duration,
        size: JSON.stringify(data).length,
      };

      setResponse(responseData);

      saveToHistory({
        id: Date.now().toString(),
        method,
        url: finalUrl,
        timestamp: Date.now(),
        status: res.status,
        duration,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setMethod(item.method);
    setUrl(item.url);
    setShowHistory(false);
  };

  const loadDemoRequest = (demo: typeof demoRequests[0]) => {
    setMethod(demo.method);
    setUrl(demo.url);
    setShowCollections(false);
  };

  const copyResponse = () => {
    if (response?.data) {
      navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fetchGraphQLSchema = async () => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "{ __schema { types { name fields { name type { name kind } } } } }" }),
      });
      const data = await res.json();
      setGraphqlSchema(data.data?.__schema);
      setShowSchemaModal(true);
    } catch {
      setError("Failed to fetch GraphQL schema");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderResponseBody = () => {
    if (!response) return null;
    const data = response.data;
    if (typeof data === "string") return data;
    return JSON.stringify(data, null, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex gap-4 h-[calc(100vh-180px)]">
          <aside className={`${showHistory ? "w-72" : "w-0"} overflow-hidden transition-all duration-300`}>
            <div className="w-72 bg-card border border-border rounded-lg h-full flex flex-col">
              <div className="p-3 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <History className="w-4 h-4" />
                  History
                </h3>
                {history.length > 0 && (
                  <button onClick={clearHistory} className="text-xs text-muted-foreground hover:text-foreground">
                    Clear
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground">No requests yet</p>
                ) : (
                  history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className="w-full p-3 text-left hover:bg-secondary/50 border-b border-border"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded border ${methodColors[item.method]}`}>
                          {item.method}
                        </span>
                        <span className={`text-xs ${item.status >= 400 ? "text-red-400" : "text-green-400"}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-1">{item.url}</p>
                      <p className="text-xs text-muted-foreground/60">{item.duration}ms</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`p-2 rounded-lg border border-border hover:bg-secondary ${showHistory ? "bg-secondary" : ""}`}
              >
                <History className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowCollections(!showCollections)}
                className={`p-2 rounded-lg border border-border hover:bg-secondary ${showCollections ? "bg-secondary" : ""}`}
              >
                <FolderOpen className="w-4 h-4" />
              </button>
            </div>

            {showCollections && (
              <div className="bg-card border border-border rounded-lg p-3">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Demo Endpoints
                </h3>
                <div className="space-y-1">
                  {demoRequests.map((demo, i) => (
                    <button
                      key={i}
                      onClick={() => loadDemoRequest(demo)}
                      className="w-full text-left p-2 rounded hover:bg-secondary/50 flex items-center gap-2"
                    >
                      <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded border ${methodColors[demo.method]}`}>
                        {demo.method}
                      </span>
                      <span className="text-sm truncate">{demo.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex gap-2">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as HttpMethod)}
                  className="bg-secondary border border-border rounded-lg px-3 py-2 font-mono font-semibold"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter request URL"
                  className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2 font-mono text-sm"
                />
                <button
                  onClick={sendRequest}
                  disabled={isLoading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-600/90 disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Send
                </button>
              </div>

              <div className="flex gap-1 mt-4 border-b border-border">
                {(["params", "headers", "body", "auth"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveRequestTab(tab)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeRequestTab === tab
                        ? "border-green-600 text-green-400"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {tab === "params" && params.filter(p => p.enabled && p.key).length > 0 && (
                      <span className="ml-1 text-xs text-green-400">({params.filter(p => p.enabled && p.key).length})</span>
                    )}
                    {tab === "headers" && headers.filter(h => h.enabled && h.key).length > 0 && (
                      <span className="ml-1 text-xs text-green-400">({headers.filter(h => h.enabled && h.key).length})</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                {activeRequestTab === "params" && (
                  <div className="space-y-2">
                    {params.map((param, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input
                          type="checkbox"
                          checked={param.enabled}
                          onChange={(e) => {
                            const newParams = [...params];
                            newParams[i].enabled = e.target.checked;
                            setParams(newParams);
                          }}
                          className="w-4 h-4"
                        />
                        <input
                          type="text"
                          value={param.key}
                          onChange={(e) => {
                            const newParams = [...params];
                            newParams[i].key = e.target.value;
                            setParams(newParams);
                          }}
                          placeholder="Key"
                          className="flex-1 bg-secondary border border-border rounded px-3 py-1.5 text-sm"
                        />
                        <input
                          type="text"
                          value={param.value}
                          onChange={(e) => {
                            const newParams = [...params];
                            newParams[i].value = e.target.value;
                            setParams(newParams);
                          }}
                          placeholder="Value"
                          className="flex-1 bg-secondary border border-border rounded px-3 py-1.5 text-sm"
                        />
                        <button
                          onClick={() => setParams(params.filter((_, idx) => idx !== i))}
                          className="p-1.5 text-muted-foreground hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setParams([...params, { key: "", value: "", enabled: true }])}
                      className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Parameter
                    </button>
                  </div>
                )}

                {activeRequestTab === "headers" && (
                  <div className="space-y-2">
                    {headers.map((header, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input
                          type="checkbox"
                          checked={header.enabled}
                          onChange={(e) => {
                            const newHeaders = [...headers];
                            newHeaders[i].enabled = e.target.checked;
                            setHeaders(newHeaders);
                          }}
                          className="w-4 h-4"
                        />
                        <input
                          type="text"
                          value={header.key}
                          onChange={(e) => {
                            const newHeaders = [...headers];
                            newHeaders[i].key = e.target.value;
                            setHeaders(newHeaders);
                          }}
                          placeholder="Header name"
                          className="flex-1 bg-secondary border border-border rounded px-3 py-1.5 text-sm"
                        />
                        <input
                          type="text"
                          value={header.value}
                          onChange={(e) => {
                            const newHeaders = [...headers];
                            newHeaders[i].value = e.target.value;
                            setHeaders(newHeaders);
                          }}
                          placeholder="Value"
                          className="flex-1 bg-secondary border border-border rounded px-3 py-1.5 text-sm"
                        />
                        <button
                          onClick={() => setHeaders(headers.filter((_, idx) => idx !== i))}
                          className="p-1.5 text-muted-foreground hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setHeaders([...headers, { key: "", value: "", enabled: true }])}
                      className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Header
                    </button>
                  </div>
                )}

                {activeRequestTab === "body" && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      {(["json", "graphql", "text", "none"] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setBodyType(type)}
                          className={`px-3 py-1.5 text-sm rounded-lg ${
                            bodyType === type
                              ? "bg-green-600 text-white"
                              : "bg-secondary text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {type.toUpperCase()}
                        </button>
                      ))}
                      {bodyType === "graphql" && (
                        <button
                          onClick={fetchGraphQLSchema}
                          className="px-3 py-1.5 text-sm rounded-lg bg-secondary text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                          <Database className="w-4 h-4" />
                          Fetch Schema
                        </button>
                      )}
                    </div>
                    {bodyType !== "none" && (
                      <div className="border border-border rounded-lg overflow-hidden">
                        {bodyType === "json" && (
                          <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder='{"key": "value"}'
                            className="w-full h-48 bg-neutral-900 text-green-400 font-mono text-sm p-4 resize-none"
                          />
                        )}
                        {bodyType === "graphql" && (
                          <div className="space-y-2">
                            <div>
                              <label className="text-xs text-muted-foreground block mb-1">Query</label>
                              <textarea
                                value={graphqlQuery}
                                onChange={(e) => setGraphqlQuery(e.target.value)}
                                placeholder="query { ... }"
                                className="w-full h-32 bg-neutral-900 text-pink-400 font-mono text-sm p-4 resize-none"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground block mb-1">Variables</label>
                              <textarea
                                value={graphqlVariables}
                                onChange={(e) => setGraphqlVariables(e.target.value)}
                                placeholder='{"var": "value"}'
                                className="w-full h-20 bg-neutral-900 text-yellow-400 font-mono text-sm p-4 resize-none"
                              />
                            </div>
                          </div>
                        )}
                        {bodyType === "text" && (
                          <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Raw body text"
                            className="w-full h-48 bg-neutral-900 text-muted-foreground font-mono text-sm p-4 resize-none"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeRequestTab === "auth" && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      {([
                        { id: "none", label: "No Auth", icon: Key },
                        { id: "bearer", label: "Bearer Token", icon: Lock },
                        { id: "basic", label: "Basic Auth", icon: Lock },
                        { id: "apiKey", label: "API Key", icon: Key },
                      ] as const).map((auth) => (
                        <button
                          key={auth.id}
                          onClick={() => setAuthType(auth.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg ${
                            authType === auth.id
                              ? "bg-green-600 text-white"
                              : "bg-secondary text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <auth.icon className="w-4 h-4" />
                          {auth.label}
                        </button>
                      ))}
                    </div>
                    {authType === "bearer" && (
                      <div>
                        <label className="text-sm text-muted-foreground block mb-1">Token</label>
                        <input
                          type="text"
                          value={authToken}
                          onChange={(e) => setAuthToken(e.target.value)}
                          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                          className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm font-mono"
                        />
                      </div>
                    )}
                    {authType === "basic" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground block mb-1">Username</label>
                          <input
                            type="text"
                            value={authUsername}
                            onChange={(e) => setAuthUsername(e.target.value)}
                            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground block mb-1">Password</label>
                          <input
                            type="password"
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                    )}
                    {authType === "apiKey" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground block mb-1">Header Name</label>
                          <input
                            type="text"
                            value={authApiKeyHeader}
                            onChange={(e) => setAuthApiKeyHeader(e.target.value)}
                            placeholder="X-API-Key"
                            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground block mb-1">API Key</label>
                          <input
                            type="text"
                            value={authApiKey}
                            onChange={(e) => setAuthApiKey(e.target.value)}
                            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 bg-card border border-border rounded-lg flex flex-col overflow-hidden min-h-[200px]">
              <div className="flex items-center justify-between p-3 border-b border-border">
                <div className="flex gap-1">
                  {(["body", "headers"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveResponseTab(tab)}
                      className={`px-3 py-1.5 text-sm rounded-lg ${
                        activeResponseTab === tab
                          ? "bg-green-600 text-white"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  {response && (
                    <>
                      <span className={`text-sm font-medium ${response.status >= 400 ? "text-red-400" : "text-green-400"}`}>
                        {response.status} {response.statusText}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {response.duration}ms
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatSize(response.size)}
                      </span>
                      <button
                        onClick={copyResponse}
                        className="p-1.5 hover:bg-secondary rounded"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                    {error}
                  </div>
                )}
                {isLoading && (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                  </div>
                )}
                {!response && !isLoading && !error && (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Send className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p>Send a request to see the response</p>
                    </div>
                  </div>
                )}
                {response && activeResponseTab === "body" && (
                  <pre className="text-sm font-mono text-green-400 whitespace-pre-wrap">
                    {renderResponseBody()}
                  </pre>
                )}
                {response && activeResponseTab === "headers" && (
                  <div className="space-y-1">
                    {Object.entries(response.headers).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <span className="text-green-400 font-mono text-sm">{key}:</span>
                        <span className="text-muted-foreground font-mono text-sm">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSchemaModal && graphqlSchema !== null && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Database className="w-4 h-4" />
                GraphQL Schema
              </h3>
              <button onClick={() => setShowSchemaModal(false)} className="p-1 hover:bg-secondary rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap">
                {JSON.stringify(graphqlSchema as object, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
