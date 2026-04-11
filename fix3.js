const fs = require('fs');

let c = fs.readFileSync('app/news/SpaceNewsPanel.tsx', 'utf8');

c = c.replace(
  'import type { SpaceNewsBase } from "../lib/types";',
  'import type { SpaceNewsBase } from "../lib/types";\nimport { Carousel, CarouselContent, CarouselNavigation, CarouselItem } from "../components/ui/carousel";'
);

c = c.replace(
  'layout?: "grid" | "compact";',
  'layout?: "grid" | "compact" | "carousel";'
);

const startMarker = '<div className={layout === "compact" ? "flex flex-col gap-4 mt-3 h-full" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3"}>';
const endMarker = '          </DataCard>\n        ))}\n      </div>';

const newBlock = `<div className={layout === "compact" ? "flex flex-col gap-4 mt-3 h-full" : layout === "carousel" ? "relative w-full mt-3 block" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3"}>
        {layout === "carousel" ? (
          <div className="relative w-full">  
            <Carousel>
              <CarouselContent className="pb-4 pt-2 -ml-4 flex">
                {displayItems.map((item) => (
                  <CarouselItem key={\`carousel-\${item._type}-\${item.id}\`} className="basis-full md:basis-1/2 lg:basis-1/3 min-w-0 pl-4">
                    <DataCard
                      onClick={() => window.open(item.url, "_blank")}
                      className="flex flex-col h-full bg-bg-card p-4 cursor-pointer hover:-translate-y-1 transition-transform"
                    >
                      {item.image_url && (
                        <div className="w-full aspect-video overflow-hidden rounded-xl mb-3">
                        <img
                          src={item.image_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        </div>
                      )}
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center justify-between gap-2 mb-2">    
                          <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-accent/10 text-accent rounded-full">
                            {item._type}
                          </span>
                          <span className="text-[10px] text-text-muted opacity-80">{item.news_site}</span>
                        </div>
                        <h3 className="font-bold text-sm line-clamp-2">{item.title}</h3>
                        <p className="text-sm mt-2 line-clamp-3 text-text-muted flex-1">{item.summary}</p>
                        <div className="opacity-50 text-[10px] mt-auto pt-2 border-t border-border/50 mt-4">
                          {new Date(item.published_at).toLocaleDateString()} {new Date(item.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </DataCard>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNavigation
                className="absolute left-[-10%] sm:left-[-5%] w-[120%] sm:w-[110%] top-1/2 flex items-center justify-between pointer-events-none -translate-y-1/2"
                classNameButton="pointer-events-auto bg-zinc-800 *:stroke-white hover:bg-zinc-700 dark:bg-zinc-200 dark:*:stroke-zinc-800"
                alwaysShow={false}
              />
            </Carousel>
          </div>
        ) : (
          displayItems.map((item) => (
            <DataCard
              key={\`\${item._type}-\${item.id}\`}
              onClick={() => window.open(item.url, "_blank")}
              className={layout === "compact" ? "flex-1 flex flex-col p-4" : ""}  
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt=""
                  className={\`w-full object-cover mb-3 rounded-xl \${layout === "compact" ? "h-32 lg:h-36" : "h-40"}\`}
                />
              )}
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between gap-2 mb-2">    
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-accent/10 text-accent rounded-full">
                    {item._type}
                  </span>
                  <span className="text-[10px] text-text-muted opacity-80">{item.news_site}</span>
                </div>
                <h3 className={\`font-bold \${layout === "compact" ? "text-sm line-clamp-2" : "line-clamp-2"}\`}>{item.title}</h3>
                {layout !== "compact" && (
                   <p className="text-sm mt-2 line-clamp-3 text-text-muted flex-1">{item.summary}</p>
                )}
                <div className={\`opacity-50 text-[10px] \${layout === "compact" ? "mt-auto pt-2" : "mt-2 pt-2"}\`}>
                  {new Date(item.published_at).toLocaleDateString()} {new Date(item.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                </div>
              </div>
            </DataCard>
          ))
        )}
      </div>`;

c = c.replace(c.substring(c.indexOf(startMarker), c.indexOf(endMarker) + endMarker.length), newBlock);

fs.writeFileSync('app/news/SpaceNewsPanel.tsx', c);
console.log('done!');