"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import {
  Play,
  Copy,
  Check,
  RefreshCw,
  Code,
  Database,
  Send,
  ChevronRight,
  Loader2,
  User,
  Mail,
  MapPin,
  Phone,
  CreditCard,
  Calendar,
  Globe,
  Hash,
  Type,
  FileText,
  ShoppingCart,
  Package,
  Building,
  Lightbulb
} from "lucide-react";

interface DemoEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  response: string;
}

interface FakerType {
  id: string;
  name: string;
  icon: React.ElementType;
}

const demoEndpoints: DemoEndpoint[] = [
  {
    method: "GET",
    path: "/api/users",
    description: "Get list of users",
    response: JSON.stringify([
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" }
    ], null, 2)
  },
  {
    method: "GET",
    path: "/api/users/:id",
    description: "Get user by ID",
    response: JSON.stringify({ id: 1, name: "John Doe", email: "john@example.com", role: "admin" }, null, 2)
  },
  {
    method: "POST",
    path: "/api/users",
    description: "Create new user",
    response: JSON.stringify({ id: 3, name: "New User", email: "new@example.com", created: true }, null, 2)
  },
  {
    method: "GET",
    path: "/api/products",
    description: "Get list of products",
    response: JSON.stringify([
      { id: 1, name: "Laptop", price: 999.99, inStock: true },
      { id: 2, name: "Mouse", price: 29.99, inStock: true }
    ], null, 2)
  },
  {
    method: "POST",
    path: "/api/products",
    description: "Create product",
    response: JSON.stringify({ id: 3, name: "Keyboard", price: 79.99, created: true }, null, 2)
  },
  {
    method: "GET",
    path: "/api/orders",
    description: "Get orders",
    response: JSON.stringify([
      { id: 1, userId: 1, total: 199.99, status: "pending" }
    ], null, 2)
  }
];

const fakerTypes: FakerType[] = [
  { id: "person", name: "Person", icon: User },
  { id: "email", name: "Email", icon: Mail },
  { id: "address", name: "Address", icon: MapPin },
  { id: "phone", name: "Phone", icon: Phone },
  { id: "creditCard", name: "Credit Card", icon: CreditCard },
  { id: "date", name: "Date", icon: Calendar },
  { id: "url", name: "URL", icon: Globe },
  { id: "uuid", name: "UUID", icon: Hash },
  { id: "word", name: "Word", icon: Type },
  { id: "sentence", name: "Sentence", icon: FileText },
  { id: "product", name: "Product", icon: ShoppingCart },
  { id: "company", name: "Company", icon: Building },
];

const codeLanguages = [
  { id: "curl", name: "cURL" },
  { id: "fetch", name: "Fetch API" },
  { id: "axios", name: "Axios" },
  { id: "python", name: "Python (requests)" },
  { id: "javascript", name: "JavaScript" },
];

export default function PlaygroundPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"demo" | "faker" | "code">("demo");
  const [selectedEndpoint, setSelectedEndpoint] = useState<DemoEndpoint>(demoEndpoints[0]);
  const [response, setResponse] = useState<string>(demoEndpoints[0].response);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [selectedFakerTypes, setSelectedFakerTypes] = useState<string[]>(["person", "email"]);
  const [fakerResults, setFakerResults] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [codeLanguage, setCodeLanguage] = useState("curl");
  const [generatedCode, setGeneratedCode] = useState("");

  const methodColors: Record<string, string> = {
    GET: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    POST: "bg-green-500/20 text-green-400 border-green-500/30",
    PUT: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const handleRunDemo = (endpoint: DemoEndpoint) => {
    setSelectedEndpoint(endpoint);
    setIsLoading(true);
    setResponse("");
    
    setTimeout(() => {
      setResponse(endpoint.response);
      setIsLoading(false);
    }, 500);
  };

  const handleGenerateFaker = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const results = selectedFakerTypes.map(type => {
        switch (type) {
          case "person": return "John Doe";
          case "email": return "john.doe@example.com";
          case "address": return "123 Main St, New York, NY 10001";
          case "phone": return "+1 (555) 123-4567";
          case "creditCard": return "4532-1234-5678-9012";
          case "date": return "2024-01-15T10:30:00.000Z";
          case "url": return "https://example.com";
          case "uuid": return "550e8400-e29b-41d4-a716-446655440000";
          case "word": return "lorem";
          case "sentence": return "Lorem ipsum dolor sit amet.";
          case "product": return "Ergonomic Chair - $299.99";
          case "company": return "Acme Corporation";
          default: return "Sample Data";
        }
      });
      setFakerResults(results);
      setIsGenerating(false);
    }, 300);
  };

  const generateCode = () => {
    const url = `http://localhost:3001${selectedEndpoint.path}`;
    const method = selectedEndpoint.method;
    
    switch (codeLanguage) {
      case "curl":
        setGeneratedCode(`curl -X ${method} "${url}" \\
  -H "Content-Type: application/json"`);
        break;
      case "fetch":
        setGeneratedCode(`fetch("${url}", {
  method: "${method}",
  headers: {
    "Content-Type": "application/json"
  }
})
.then(response => response.json())
.then(data => console.log(data));`);
        break;
      case "axios":
        setGeneratedCode(`import axios from "axios";

const response = await axios.${method.toLowerCase()}("${url}");
console.log(response.data);`);
        break;
      case "python":
        setGeneratedCode(`import requests

response = requests.${method.toLowerCase()}("${url}")
print(response.json())`);
        break;
      case "javascript":
        setGeneratedCode(`const response = await fetch("${url}", {
  method: "${method}",
  headers: {
    "Content-Type": "application/json"
  }
});
const data = await response.json();
console.log(data);`);
        break;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFakerType = (typeId: string) => {
    setSelectedFakerTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(t => t !== typeId)
        : [...prev, typeId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t.playground.title}</h1>
          <p className="text-lg text-muted-foreground">{t.playground.description}</p>
        </div>

        <div className="flex gap-2 mb-8 justify-center">
          <button
            onClick={() => setActiveTab("demo")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "demo" 
                ? "bg-green-600 text-white" 
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <Send className="inline-block w-4 h-4 mr-2" />
            {t.playground.demo}
          </button>
          <button
            onClick={() => setActiveTab("faker")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "faker" 
                ? "bg-green-600 text-white" 
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <Database className="inline-block w-4 h-4 mr-2" />
            {t.playground.faker}
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "code" 
                ? "bg-green-600 text-white" 
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code className="inline-block w-4 h-4 mr-2" />
            {t.playground.code}
          </button>
        </div>

        {activeTab === "demo" && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">{t.playground.quickDemo}</h2>
              {demoEndpoints.map((endpoint, index) => (
                <button
                  key={index}
                  onClick={() => handleRunDemo(endpoint)}
                  className={`w-full text-left p-4 rounded-lg border transition-all hover:border-green-600/50 ${
                    selectedEndpoint.path === endpoint.path && selectedEndpoint.method === endpoint.method
                      ? "border-green-600 bg-green-600/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono border ${methodColors[endpoint.method]}`}>
                      {endpoint.method}
                    </span>
                    <span className="font-mono text-sm">{endpoint.path}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{endpoint.description}</p>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{t.playground.response}</h2>
                <button
                  onClick={() => handleRunDemo(selectedEndpoint)}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-600/90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  {t.playground.run}
                </button>
              </div>
              <div className="bg-neutral-900 rounded-lg p-4 border border-border min-h-[300px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                  </div>
                ) : response ? (
                  <pre className="text-sm text-green-400 font-mono overflow-auto">
                    {response}
                  </pre>
                ) : (
                  <p className="text-muted-foreground text-center">{t.playground.clickRun}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "faker" && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">{t.playground.selectTypes}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {fakerTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => toggleFakerType(type.id)}
                    className={`p-3 rounded-lg border flex items-center gap-2 transition-all ${
                      selectedFakerTypes.includes(type.id)
                        ? "border-green-600 bg-green-600/10 text-green-400"
                        : "border-border bg-card text-muted-foreground hover:border-green-600/50"
                    }`}
                  >
                    <type.icon className="w-4 h-4" />
                    <span className="text-sm">{type.name}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={handleGenerateFaker}
                disabled={isGenerating || selectedFakerTypes.length === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-600/90 transition-colors disabled:opacity-50 mt-4"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {t.playground.generate}
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t.playground.output}</h2>
              <div className="bg-neutral-900 rounded-lg p-4 border border-border min-h-[300px]">
                {fakerResults.length > 0 ? (
                  <div className="space-y-2">
                    {fakerResults.map((result, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded bg-card border border-border">
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-mono">{result}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center">{t.playground.selectAndGenerate}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "code" && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">{t.playground.endpoint}</label>
                <select
                  value={`${selectedEndpoint.method} ${selectedEndpoint.path}`}
                  onChange={(e) => {
                    const [method, path] = e.target.value.split(" ");
                    const endpoint = demoEndpoints.find(ep => ep.method === method && ep.path === path);
                    if (endpoint) setSelectedEndpoint(endpoint);
                  }}
                  className="bg-card border border-border rounded-lg px-4 py-2 text-sm"
                >
                  {demoEndpoints.map((ep, i) => (
                    <option key={i} value={`${ep.method} ${ep.path}`}>
                      {ep.method} {ep.path}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">{t.playground.language}</label>
                <select
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  className="bg-card border border-border rounded-lg px-4 py-2 text-sm"
                >
                  {codeLanguages.map((lang) => (
                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={generateCode}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-600/90 transition-colors mt-5"
              >
                <Code className="w-4 h-4" />
                {t.playground.generateCode}
              </button>
            </div>

            {generatedCode && (
              <div className="relative">
                <button
                  onClick={handleCopyCode}
                  className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? t.playground.copied : t.playground.copy}
                </button>
                <pre className="bg-neutral-900 rounded-lg p-6 border border-border overflow-auto text-sm font-mono">
                  <code className="text-green-400">{generatedCode}</code>
                </pre>
              </div>
            )}
          </div>
        )}

        <div className="mt-16 p-6 rounded-lg border border-green-600/20 bg-green-600/5 text-center">
          <h3 className="text-lg font-semibold mb-2">{t.playground.tryItTitle}</h3>
          <p className="text-muted-foreground mb-4">{t.playground.tryItDesc}</p>
          <a
            href="/docs/quick-start"
            className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-600/90 transition-colors"
          >
            {t.playground.getStarted}
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
