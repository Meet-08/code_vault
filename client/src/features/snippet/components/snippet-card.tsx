import { Button } from "#/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "#/components/ui/card";
import { useToggleFavorite } from "#/features/snippet/snippet.query";
import type { SnippetList } from "#/features/snippet/snippet.type";
import { getContext } from "#/integrations/tanstack-query/root-provider";
import { cn } from "#/lib/utils";
import type { AxiosError } from "axios";
import { Code2, Star } from "lucide-react";
import type { MouseEvent } from "react";
import { toast } from "react-toastify";
import type { ApiResponse } from "../../../..";

interface SnippetCardProps {
  snippet: SnippetList;
}

function SnippetCard({ snippet }: SnippetCardProps) {
  const { queryClient } = getContext();
  const toggleFavoriteMutation = useToggleFavorite(
    queryClient,
    snippet.id.toString(),
  );

  const onToggleFavorite = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    toggleFavoriteMutation.mutate(undefined, {
      onError(error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message || "Failed to update favourite.",
        );
      },
    });
  };

  return (
    <Card className="group flex h-full w-full flex-col overflow-hidden border-border-base/80 bg-[linear-gradient(180deg,rgba(17,19,24,0.98),rgba(13,15,19,0.98))] shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition-all duration-150 hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_24px_64px_rgba(0,0,0,0.3)]">
      <CardHeader className="border-b border-border-base/70 bg-[radial-gradient(circle_at_top_right,rgba(43,135,245,0.08),transparent_40%)] px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border-base bg-bg-subtle px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-text-muted">
              <Code2 className="size-3.5" />
              {snippet.language.toUpperCase()}
            </div>
            <div className="line-clamp-2 text-lg font-semibold tracking-tight text-text-primary">
              {snippet.title}
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            aria-pressed={snippet.isFavourite}
            disabled={toggleFavoriteMutation.isPending}
            onClick={onToggleFavorite}
            className={cn(
              "h-8 shrink-0 rounded-full border-border-base bg-bg-subtle px-3 text-xs text-text-muted hover:border-accent-400/60 hover:text-accent-300",
              snippet.isFavourite &&
                "border-accent-400/50 bg-[rgb(43_135_245/0.12)] text-accent-300",
            )}
          >
            <Star
              className={cn(
                "size-4",
                snippet.isFavourite && "fill-current text-accent-300",
              )}
            />
            {snippet.isFavourite ? "Favourited" : "Favourite"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 px-5 py-4">
        <CardDescription className="line-clamp-3 text-sm leading-relaxed text-text-secondary">
          {snippet.description}
        </CardDescription>

        <div className="mt-auto flex flex-wrap gap-2">
          {snippet.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-border-base bg-bg-subtle px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export { SnippetCard };
