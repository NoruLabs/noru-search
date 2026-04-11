const fs = require('fs');
let c = fs.readFileSync('app/news/SpaceNewsPanel.tsx', 'utf8');

const startMarker = '  return (\n    <section className="space-y-4">';
const endMarker = '    </section>\n  );\n}';

const start = c.indexOf(startMarker);
const end = c.lastIndexOf(endMarker);

if (start === -1 || end === -1) {
  console.log("Could not find markers!");
  process.exit(1);
}

const newContent = `${startMarker}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-text-primary">
          <div className="bg-bg-card p-1.5 rounded-md">
            <Newspaper size={16} className="text-text-secondary" />
          </div>
          <h2 className="text-sm font-semibold tracking-wide">Latest Spaceflight News</h2>
        </div>

        {showViewAll && (
          <Link
            href="/news"
            className="group flex items-center gap-1 text-xs font-medium text-text-muted hover:text-text-primary transition-colors"
          >
            View all
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      <div className={layout === "compact" ? "flex flex-col gap-4 mt-3 h-full" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-3"}>
        {displayItems.map((item) => (
          <DataCard
            key={\`\${item._type}-\${item.id}\`}
            onClick={() => window.open(item.url, "_blank")}
            className={layout === "compact" ? "flex-1 flex flex-col p-4 cursor-pointer hover:bg-bg-hover transition-colors" : "flex flex-col flex-1 p-4 cursor-pointer group hover:-translate-y-1 transition-all duration-300"}
          >
            {layout === "compact" ? (
              <div className="flex gap-4 h-full">
                {item.image_url && (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-lg overflow-hidden bg-bg-card">
                    <img
                      src={item.image_url}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-accent/10 text-accent rounded-full shrink-0">
                      {item._type}
                    </span>
                    <span className="text-[10px] text-text-muted truncate">{item.news_site}</span>
                  </div>
                  
                  <h3 className="font-bold leading-tight line-clamp-2 md:line-clamp-3 text-sm sm:text-base text-text-primary mb-2">
                    {item.title}
                  </h3>
                  
                  <div className="text-[10px] sm:text-xs text-text-muted flex items-center gap-2 mt-auto">
                    <span>{new Date(item.published_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {item.image_url && (
                  <div className="w-full aspect-video mb-4 rounded-xl overflow-hidden bg-bg-card">
                    <img
                      src={item.image_url}
                      alt=""
                      className={\`w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500\`}
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-accent/10 text-accent rounded-full">
                      {item._type}
                    </span>
                    <span className="text-[10px] text-text-muted truncate">{item.news_site}</span>
                  </div>
                  <h3 className="font-bold line-clamp-2 text-sm sm:text-base mb-2 flex-1">
                    {item.title}
                  </h3>
                  <div className="text-[10px] sm:text-xs text-text-muted flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                    <span>{new Date(item.published_at).toLocaleDateString()} {new Date(item.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </>
            )}
          </DataCard>
        ))}
      </div>
${endMarker}`;

fs.writeFileSync('app/news/SpaceNewsPanel.tsx', c.substring(0, start) + newContent + "\n");
console.log('done rewrite');