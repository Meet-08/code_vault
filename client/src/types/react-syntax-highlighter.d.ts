declare module "react-syntax-highlighter" {
	import type { CSSProperties, ReactNode } from "react";

	type SyntaxHighlighterProps = {
		children: string | string[];
		language?: string;
		style?: Record<string, CSSProperties>;
		showLineNumbers?: boolean;
		wrapLongLines?: boolean;
		customStyle?: CSSProperties;
		codeTagProps?: { className?: string; style?: CSSProperties };
		lineNumberStyle?: CSSProperties;
		PreTag?: keyof JSX.IntrinsicElements;
	};

	export function Prism(props: SyntaxHighlighterProps): ReactNode;
	export default function SyntaxHighlighter(
		props: SyntaxHighlighterProps,
	): ReactNode;
}

declare module "react-syntax-highlighter/dist/esm/styles/prism" {
	import type { CSSProperties } from "react";

	export const oneDark: Record<string, CSSProperties>;
	export const vscDarkPlus: Record<string, CSSProperties>;
}
