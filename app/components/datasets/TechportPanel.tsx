"use client";

import { useState, useEffect } from "react";
import { Rocket, ExternalLink, ChevronLeft } from "lucide-react";
import { useTechportProjects, useTechportProject } from "../../hooks/useTechport";
import { DataCard } from "../ui/DataCard";
import { Loader, CardSkeleton } from "../ui/Loader";
import { ErrorState } from "../ui/ErrorState";
import { getApiErrorMessage } from "../../lib/api";

export function TechportPanel() {
  const { data, isLoading, error, refetch } = useTechportProjects();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detailIds, setDetailIds] = useState<number[]>([]);

  // Once we have the project list, pick first few to show details
  useEffect(() => {
    if (data?.projects) {
      setDetailIds(data.projects.slice(0, 12).map((p) => p.projectId));
    }
  }, [data]);

  if (selectedId !== null) {
    return (
      <TechportDetail
        projectId={selectedId}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">
          NASA TechPort
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Active space technology projects: propulsion, habitats, mission systems, and more
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          message={getApiErrorMessage(error)}
          onRetry={() => refetch()}
        />
      ) : data?.projects && data.projects.length > 0 ? (
        <>
          <p className="text-sm text-text-muted">
            <span className="font-semibold text-text-primary">
              {data.totalCount?.toLocaleString() ?? data.projects.length}
            </span>{" "}
            recently updated projects
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
            {detailIds.map((id) => (
              <TechportProjectCard
                key={id}
                projectId={id}
                onSelect={() => setSelectedId(id)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="py-16 text-center">
          <Rocket size={32} className="mx-auto mb-3 text-text-muted opacity-40" />
          <p className="text-sm text-text-muted">
            No projects found. Try again later.
          </p>
        </div>
      )}
    </div>
  );
}

function TechportProjectCard({
  projectId,
  onSelect,
}: {
  projectId: number;
  onSelect: () => void;
}) {
  const { data, isLoading } = useTechportProject(projectId);

  if (isLoading) return <CardSkeleton />;
  if (!data) return null;

  return (
    <DataCard onClick={onSelect} className="cursor-pointer">
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <Rocket size={14} className="mt-0.5 shrink-0 text-text-muted" />
          <h3 className="text-sm font-semibold text-text-primary line-clamp-2">
            {data.title}
          </h3>
        </div>
        {data.statusDescription && (
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[10px] ${
              data.statusDescription === "Active"
                ? "bg-accent text-accent-text font-medium"
                : data.statusDescription === "Completed"
                  ? "bg-accent-soft text-text-primary font-medium"
                  : "bg-accent-soft text-text-secondary"
            }`}
          >
            {data.statusDescription}
          </span>
        )}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {data.startDateString && (
            <div>
              <p className="text-text-muted">Start</p>
              <p className="text-text-secondary">{data.startDateString}</p>
            </div>
          )}
          {data.endDateString && (
            <div>
              <p className="text-text-muted">End</p>
              <p className="text-text-secondary">{data.endDateString}</p>
            </div>
          )}
        </div>
        {data.leadOrganization && (
          <p className="text-[11px] text-text-muted truncate">
            {data.leadOrganization.organizationName}
          </p>
        )}
        {data.description && (
          <p className="text-xs text-text-secondary line-clamp-2">
            {data.description}
          </p>
        )}
      </div>
    </DataCard>
  );
}

function TechportDetail({
  projectId,
  onBack,
}: {
  projectId: number;
  onBack: () => void;
}) {
  const { data, isLoading, error, refetch } = useTechportProject(projectId);

  if (isLoading) return <Loader text="Loading project details..." />;
  if (error)
    return (
      <ErrorState
        message={getApiErrorMessage(error)}
        onRetry={() => refetch()}
      />
    );
  if (!data) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-text-primary"
      >
        <ChevronLeft size={14} />
        Back to projects
      </button>

      <DataCard>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              {data.title}
            </h2>
            {data.statusDescription && (
              <span
                className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs ${
                  data.statusDescription === "Active"
                    ? "bg-accent text-accent-text font-medium"
                    : data.statusDescription === "Completed"
                      ? "bg-accent-soft text-text-primary font-medium"
                      : "bg-accent-soft text-text-secondary"
                }`}
              >
                {data.statusDescription}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            {data.startDateString && (
              <div>
                <p className="text-text-muted text-xs">Start Date</p>
                <p className="text-text-secondary">{data.startDateString}</p>
              </div>
            )}
            {data.endDateString && (
              <div>
                <p className="text-text-muted text-xs">End Date</p>
                <p className="text-text-secondary">{data.endDateString}</p>
              </div>
            )}
            {data.leadOrganization && (
              <div className="col-span-2">
                <p className="text-text-muted text-xs">Lead Organization</p>
                <p className="text-text-secondary">
                  {data.leadOrganization.organizationName}
                </p>
              </div>
            )}
          </div>

          {data.program && (
            <div>
              <p className="text-xs text-text-muted">Program</p>
              <p className="text-sm text-text-secondary">{data.program.title}</p>
            </div>
          )}

          {data.description && (
            <div>
              <p className="text-xs text-text-muted mb-1">Description</p>
              <p className="text-sm leading-relaxed text-text-secondary">
                {data.description}
              </p>
            </div>
          )}

          {data.benefits && (
            <div>
              <p className="text-xs text-text-muted mb-1">Benefits</p>
              <p className="text-sm leading-relaxed text-text-secondary">
                {data.benefits}
              </p>
            </div>
          )}

          {data.website && (
            <a
              href={data.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-text-primary"
            >
              Project Website
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </DataCard>
    </div>
  );
}
