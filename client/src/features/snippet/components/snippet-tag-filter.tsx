import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Loader } from "#/components/ui/loader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/components/ui/popover";
import { cn } from "#/lib/utils";
import { Check, ChevronDown, Search, Tag, X } from "lucide-react";
import { useState } from "react";
import { useUserTagsQuery } from "../tags.query";

type SnippetTagFilterProps = {
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
};

function SnippetTagFilter({
  selectedTags,
  onToggleTag,
}: SnippetTagFilterProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const tagsQuery = useUserTagsQuery();
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const tags = tagsQuery.data ?? [];
  const filteredTags =
    normalizedSearch ?
      tags.filter((tag) => tag.toLowerCase().includes(normalizedSearch))
    : tags;

  const closePopover = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setSearchTerm("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-text-primary">Tags</div>

      <Popover open={open} onOpenChange={closePopover}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full justify-between rounded-xl border-border-base/80 bg-bg-subtle/90 px-4 text-left font-normal"
          >
            <span className="flex min-w-0 items-center gap-2 text-text-primary">
              <Tag className="size-4 shrink-0 text-text-muted" />
              <span className="truncate">
                {selectedTags.length > 0 ?
                  `${selectedTags.length} selected`
                : "Browse tags"}
              </span>
            </span>
            <span className="flex items-center gap-2 text-xs text-text-muted">
              {tagsQuery.data ? `${tags.length} available` : "Loading"}
              <ChevronDown className="size-4" />
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-[min(28rem,calc(100vw-2rem))] border-border-base/80 bg-bg-raised p-0 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        >
          <div className="border-b border-border-base/70 px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <Tag className="size-4 text-accent-300" />
              Select tags
            </div>
            <p className="mt-1 text-xs leading-relaxed text-text-secondary">
              Search your saved tags and toggle as many as you need.
            </p>
          </div>

          <div className="space-y-3 p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search tags"
                className="h-10 rounded-xl border-border-base/80 bg-bg-subtle/90 pl-10 pr-4"
              />
            </div>

            {tagsQuery.isPending ?
              <Loader
                title="Loading tags"
                description="Fetching your saved tags"
                className="py-8"
              />
            : tagsQuery.isError ?
              <div className="rounded-xl border border-dashed border-border-base/80 px-4 py-8 text-center text-sm text-text-secondary">
                Unable to load tags right now.
              </div>
            : filteredTags.length === 0 ?
              <div className="rounded-xl border border-dashed border-border-base/80 px-4 py-8 text-center text-sm text-text-secondary">
                {normalizedSearch ?
                  "No tags match this search."
                : "No tags available yet."}
              </div>
            : <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {filteredTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);

                  return (
                    <button
                      key={tag}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => onToggleTag(tag)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                        isSelected ?
                          "border-accent-400/50 bg-[rgb(43_135_245/0.12)] text-text-primary"
                        : "border-border-base/80 bg-bg-subtle/70 text-text-secondary hover:border-accent-400/40 hover:bg-bg-subtle",
                      )}
                    >
                      <span className="min-w-0 truncate uppercase tracking-[0.18em]">
                        {tag}
                      </span>
                      {isSelected ?
                        <Check className="size-4 shrink-0 text-accent-300" />
                      : null}
                    </button>
                  );
                })}
              </div>
            }
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2">
        {selectedTags.length > 0 ?
          selectedTags.map((tag) => (
            <Button
              key={tag}
              type="button"
              variant="secondary"
              size="xs"
              className="rounded-full pr-2 uppercase tracking-[0.16em]"
              onClick={() => onToggleTag(tag)}
            >
              <span className="truncate">{tag}</span>
              <X className="size-3" />
            </Button>
          ))
        : <div className="rounded-full border border-dashed border-border-base/80 px-3 py-1.5 text-sm text-text-muted">
            No tags selected yet.
          </div>
        }
      </div>
    </div>
  );
}

export { SnippetTagFilter };
