"use client"
// i got this background from 21st.dev lol
import { useTheme } from "@/app/components/ThemeProvider";
import { useEffect, useState } from "react";
import { DitheringShader } from "@/app/components/ui/dithering-shader";

export function BackgroundSwirl() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Provide a subtle contrast based on the active theme
  const isDark = theme === "dark";
  const backColor = isDark ? "#23262a" : "#f8f8ff";
  const frontColor = isDark ? "#383c42" : "#e5e5e5";

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-30 select-none">
      <DitheringShader 
        shape="swirl"
        type="4x4"
        colorBack={backColor}
        colorFront={frontColor}
        pxSize={4}
        speed={0.6}
        width="100%"
        height="100%"
      />
    </div>
  );
}
