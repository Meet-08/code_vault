import { Card, CardContent } from "#/components/ui/card";
import { Loader } from "#/components/ui/loader";
import { useAdminDashboardQuery } from "#/features/admin/admin.query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChartColumnIncreasing,
  FolderKanban,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/_app/admin/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const dashboardQuery = useAdminDashboardQuery();

  if (dashboardQuery.isPending) {
    return (
      <div className="page-wide">
        <Card className="border-border-base/80 bg-bg-raised/70 px-6 py-16">
          <Loader
            title="Loading admin dashboard"
            description="Fetching platform totals"
          />
        </Card>
      </div>
    );
  }

  if (dashboardQuery.isError) {
    return (
      <div className="page-wide">
        <Card className="border-border-base/80 bg-bg-raised/70 px-6 py-12 text-center">
          <div className="text-lg font-semibold text-text-primary">
            Unable to load admin stats
          </div>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            Check the admin stats endpoint and try again.
          </p>
        </Card>
      </div>
    );
  }

  const stats = dashboardQuery.data;

  return (
    <div className="page-wide space-y-6">
      <section className="overflow-hidden rounded-3xl border border-border-base/80 bg-[linear-gradient(180deg,rgba(17,19,24,0.98),rgba(13,15,19,0.98))] shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
        <div className="flex flex-col gap-4 border-b border-border-base/70 px-6 py-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 inline-flex w-fit items-center rounded-full border border-border-strong bg-bg-subtle px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-text-muted">
              <ChartColumnIncreasing className="mr-2 size-3.5" />
              Admin
            </div>
            <h1 className="text-[clamp(1.75rem,2.4vw,2.4rem)] font-semibold leading-tight tracking-tight text-text-primary">
              Admin dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
              Track users, snippets, and collections from one place.
            </p>
          </div>

          <Link
            to="/admin/users"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border-base/80 bg-bg-subtle px-4 text-sm font-medium text-text-primary transition-colors hover:bg-bg-overlay"
          >
            <Users className="size-4" />
            View users
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <CardContent className="grid gap-4 px-6 py-6 sm:grid-cols-3">
          <AdminStatCard
            icon={Users}
            label="Users"
            value={stats.userCount}
            detail="Registered accounts"
          />
          <AdminStatCard
            icon={ChartColumnIncreasing}
            label="Snippets"
            value={stats.snippetsCount}
            detail="Saved code entries"
          />
          <AdminStatCard
            icon={FolderKanban}
            label="Collections"
            value={stats.collectionCount}
            detail="Curated groups"
          />
        </CardContent>
      </section>
    </div>
  );
}

interface AdminStatCardProps {
  icon: typeof Users;
  label: string;
  value: number;
  detail: string;
}

function AdminStatCard({
  icon: Icon,
  label,
  value,
  detail,
}: AdminStatCardProps) {
  return (
    <div className="rounded-2xl border border-border-base/80 bg-bg-subtle/55 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
          {label}
        </div>
        <Icon className="size-4 text-accent-300" />
      </div>
      <div className="mt-3 text-2xl font-semibold leading-none text-text-primary">
        {value}
      </div>
      <div className="mt-2 text-xs text-text-muted">{detail}</div>
    </div>
  );
}
