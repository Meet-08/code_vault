import { Button } from "#/components/ui/button";
import { Link } from "@tanstack/react-router";
import { BookOpen, FolderKanban, Search, Tags } from "lucide-react";
import { WorkflowItem } from "./workflow-item";

interface WorkflowSectionProps {
	isAuthenticated: boolean;
	primaryLabel: string;
	primaryTarget: "/dashboard" | "/register";
}

export function WorkflowSection({
	isAuthenticated,
	primaryLabel,
	primaryTarget,
}: WorkflowSectionProps) {
	return (
		<section className="mx-auto w-full max-w-360 px-4 py-14 sm:px-6 sm:py-18">
			<div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
				<div className="rounded-3xl border border-border-base/80 bg-[linear-gradient(180deg,rgba(17,19,24,0.98),rgba(13,15,19,0.98))] p-6">
					<div className="grid gap-4 sm:grid-cols-2">
						<WorkflowItem
							icon={BookOpen}
							label="Capture"
							text="Save code with useful context."
						/>
						<WorkflowItem
							icon={Tags}
							label="Classify"
							text="Add language and tags."
						/>
						<WorkflowItem
							icon={Search}
							label="Retrieve"
							text="Search and filter the library."
						/>
						<WorkflowItem
							icon={FolderKanban}
							label="Curate"
							text="Group snippets into collections."
						/>
					</div>
				</div>

				<div>
					<p className="text-xs font-medium uppercase tracking-[0.28em] text-text-muted">
						Start building your library
					</p>
					<h2 className="mt-3 text-3xl font-semibold leading-tight text-text-primary">
						Turn solved problems into reusable developer assets.
					</h2>
					<p className="mt-4 text-base leading-8 text-text-secondary">
						Instead of losing working examples in chat history, project folders,
						or scratch files, keep your best code in a structured vault with the
						metadata needed to find it again.
					</p>
					<div className="mt-7 flex flex-col gap-3 sm:flex-row">
						<Button asChild size="lg" className="h-12 rounded-full px-6">
							<Link to={primaryTarget}>{primaryLabel}</Link>
						</Button>
						{!isAuthenticated ? (
							<Button
								asChild
								size="lg"
								variant="secondary"
								className="h-12 rounded-full border border-border-base/80 px-6"
							>
								<Link to="/login">Login to existing vault</Link>
							</Button>
						) : null}
					</div>
				</div>
			</div>
		</section>
	);
}
