import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Standard fetch to the search endpoint
    const response = await fetch("https://techport.nasa.gov/api/projects/search", {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch TechPort projects: ${response.statusText}`);
    }
    
    const data = await response.json();
    const projects = data.results || [];
    
    // Sort by end date descending so recent/current projects are shown first
    projects.sort((a: any, b: any) => {
      const dateA = new Date(a.endDate || "2000-01-01").getTime();
      const dateB = new Date(b.endDate || "2000-01-01").getTime();
      return dateB - dateA;
    });

    // Return the top 12 results after sorting
    const topProjects = projects.slice(0, 12);
    
    // Fetch detailed info for these top projects
    const detailedProjects = await Promise.all(topProjects.map(async (p: any) => {
      const id = p.projectId || p.id;
      try {
        const detailRes = await fetch(`https://techport.nasa.gov/api/projects/${id}`, {
          next: { revalidate: 3600 },
        });
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          const proj = detailData.project || {};
          
          // Image Extraction
          const imageItem = proj.libraryItems?.find((i: any) => i.libraryItemType === 'Image' || i.file?.fileExtension?.match(/jpg|jpeg|png/i));
          let imageUrl = null;
          if (imageItem && imageItem.file?.fileId) {
            imageUrl = `https://techport.nasa.gov/api/file/${imageItem.file.fileId}`;
          }

          // PI Contacts
          const principalInvestigators = proj.projectContacts?.filter((c: any) => c.projectContactRole === 'Principal_Investigator' || c.projectContactRolePretty === 'Principal Investigator').map((c: any) => c.fullName) || [];

          return {
            ...p,
            imageUrl,
            principalInvestigators,
            benefits: proj.benefits || '',
            trlBegin: proj.trlBegin || p.trlBegin,
            trlCurrent: proj.trlCurrent,
            trlEnd: proj.trlEnd || p.trlEnd,
            leadOrganization: proj.leadOrganization || p.leadOrganization,
            statusDescription: proj.statusDescription || p.statusDescription || p.status,
            description: proj.description || p.description,
          };
        }
      } catch (err) {
        console.error(`Failed to fetch detail for project ${id}`, err);
      }
      return p;
    }));

    return NextResponse.json(detailedProjects);
  } catch (error) {
    console.error("TechPort fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
