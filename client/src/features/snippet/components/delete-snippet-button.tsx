import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "#/components/ui/alert-dialog";
import { Button } from "#/components/ui/button";
import { useDeleteSnippet } from "#/features/snippet/snippet.query";
import { getContext } from "#/integrations/tanstack-query/root-provider";
import { useNavigate } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import type { ApiResponse } from "../../../..";

interface DeleteSnippetButtonProps {
	id: string;
}

function DeleteSnippetButton({ id }: DeleteSnippetButtonProps) {
	const navigate = useNavigate();
	const { queryClient } = getContext();
	const deleteSnippetMutation = useDeleteSnippet(queryClient, id);

	const onDeleteSnippet = async () => {
		await toast.promise(deleteSnippetMutation.mutateAsync(), {
			pending: "Deleting snippet...",
			success: "Snippet deleted.",
			error: {
				render({ data }) {
					const error = data as AxiosError<ApiResponse>;
					return error.response?.data.message || "Failed to delete snippet.";
				},
			},
		});

		await navigate({
			to: "/snippets",
			search: { page: 1, size: 10 },
		});
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					type="button"
					variant="destructive"
					size="sm"
					disabled={deleteSnippetMutation.isPending}
				>
					<Trash2 className="size-4" />
					{deleteSnippetMutation.isPending ? "Deleting" : "Delete"}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete this snippet?</AlertDialogTitle>
					<AlertDialogDescription>
						This permanently deletes the snippet and removes it from any
						collections that include it.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={deleteSnippetMutation.isPending}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						disabled={deleteSnippetMutation.isPending}
						onClick={() => {
							void onDeleteSnippet();
						}}
					>
						<Trash2 className="size-4" />
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export { DeleteSnippetButton };
