'use client';

import { useTechPort } from '../hooks/useTechPort';
import { Cpu, ExternalLink } from 'lucide-react';
import { DataCard } from '../components/ui/DataCard';

export default function TechPortPage({ limit, hideHeader }: { limit?: number, hideHeader?: boolean }) {
  const { data, isLoading, error } = useTechPort();

  return (
    <div className={`mx-auto max-w-7xl ${hideHeader ? '' : 'px-4 sm:px-6 py-6'} animate-fade-in`}>       
      {!hideHeader && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">NASA TechPort</h1>
          <p className="text-text-secondary text-sm mt-1 max-w-2xl">
            Explore the latest technology projects and building efforts happening across NASA centers right now.
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-3">
          {Array.from({ length: limit || 6 }).map((_, i) => (
            <div key={i} className={`flex flex-col h-64 bg-bg-card/40 rounded-xl overflow-hidden animate-pulse border border-border/50 ${limit && i > 1 ? 'hidden md:flex' : ''} ${limit && i > 2 ? 'hidden lg:flex' : ''}`}>
              <div className="h-32 w-full bg-border/20 shrink-0" />
              <div className="p-4 flex flex-col flex-1 mt-2">
                <div className="h-4 w-3/4 bg-border/20 rounded mb-3" />
                <div className="h-3 w-full bg-border/20 rounded mb-2" />
                <div className="h-3 w-5/6 bg-border/20 rounded mt-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500 bg-red-500/10 rounded-xl text-sm border border-red-500/20">
          Error loading TechPort data.
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-3">
          {data?.slice(0, limit || data.length).map((project: any) => (
            <a 
              key={project.projectId || project.id}
              href={`https://techport.nasa.gov/view/${project.projectId || project.id}`}
              target="_blank"
              rel="noreferrer"
              className="block group h-full focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-primary rounded-xl"
            >
              <DataCard className="relative flex flex-col h-full overflow-hidden group-hover:border-border-hover transition-colors border border-border/50 shadow-none hover:shadow-sm p-0">
                {project.imageUrl && (
                  <div className="h-32 w-full shrink-0 overflow-hidden bg-bg-card relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/20 to-transparent" />
                  </div>
                )}
                
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-3 gap-4">
                    <h3 className="font-bold text-base text-text-primary leading-tight line-clamp-2 group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    {!project.imageUrl && (
                      <div className="p-1.5 bg-accent/10 rounded-lg text-accent shrink-0 group-hover:bg-accent group-hover:text-bg-primary transition-colors">
                        <Cpu size={16} />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.trlCurrent && (
                     <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                       TRL {project.trlCurrent}
                     </span>
                    )}
                    {project.principalInvestigators?.length > 0 && (
                     <span className="bg-bg-card text-text-secondary border border-border/50 px-2 py-0.5 rounded text-[10px] font-medium truncate max-w-[150px]">
                       PI: {project.principalInvestigators[0]}
                     </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-text-secondary line-clamp-2 mb-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: project.benefits || project.description }} />
                  
                  <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                    <span className="font-medium bg-bg-card px-2.5 py-1 rounded-md text-text-primary border border-border/50 text-[10px] uppercase tracking-wider">
                      {project.status || project.statusDescription || 'Active'}
                    </span>
                    <div className="text-[10px] text-text-muted font-medium truncate flex items-center gap-1.5 uppercase tracking-wider">
                      {project.leadOrganization?.organization_name || project.leadOrganization?.name || 'NASA'}
                      <ExternalLink size={12} className="opacity-50" />
                    </div>
                  </div>
                </div>
              </DataCard>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
