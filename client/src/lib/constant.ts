export const navigationItems = [
  {
    label: "Dashboard",
    description: "View your dashboard and recent activity",
    to: "/dashboard",
    exact: true,
  },
  {
    label: "Snippets",
    description: "Open your saved snippets",
    to: "/snippets",
    exact: true,
  },
  {
    label: "Collection",
    description: "Browse your collections",
    to: "/collections",
    exact: true,
  },
];

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Code2,
  FolderKanban,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface PreviewSnippet {
  label: string;
  title: string;
  lines: string[];
}

export const productFeatures = [
  {
    icon: Code2,
    title: "Snippet Library",
    description:
      "Create, edit, and store reusable code snippets with titles, descriptions, languages, tags, and full code blocks.",
  },
  {
    icon: Search,
    title: "Fast Retrieval",
    description:
      "Find saved snippets by keyword, language, and tags so useful patterns are available when you need them.",
  },
  {
    icon: Star,
    title: "Favorites",
    description:
      "Mark high-value snippets as favorites and surface the references you return to most often.",
  },
  {
    icon: FolderKanban,
    title: "Collections",
    description:
      "Group related snippets into focused collections for projects, frameworks, workflows, or learning tracks.",
  },
  {
    icon: BarChart3,
    title: "Workspace Dashboard",
    description:
      "Review total snippets, favorites, collections, recent saves, and your language mix from a single dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Private Workspace",
    description:
      "Create a protected account with sign in, sign out, remembered sessions, and password recovery support.",
  },
] satisfies FeatureItem[];

export const serviceHighlights = [
  "Private user workspace",
  "Snippet create, update, delete, and detail views",
  "Full-text search-ready snippet filtering",
  "Language and tag based organization",
  "Collection creation and snippet assignment",
  "Recent snippet and language analytics",
  "Stay signed in between visits",
  "Password recovery support",
];

export const previewSnippets = [
  {
    label: "React",
    title: "Reusable form hook",
    lines: [
      "const form = useForm({",
      "  resolver: zodResolver(schema),",
      "});",
    ],
  },
  {
    label: "API",
    title: "Authenticated request",
    lines: [
      "api.interceptors.request.use((config) => {",
      "  return config;",
      "});",
    ],
  },
  {
    label: "SQL",
    title: "Search-backed notes",
    lines: [
      "CREATE INDEX idx_snippet_search",
      "ON snippets USING gin",
      "(search_vector);",
    ],
  },
] satisfies PreviewSnippet[];
