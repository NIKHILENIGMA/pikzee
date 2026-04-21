import { CropIcon, Download, History, Replace, Scaling, TextCursor, Wand } from "lucide-react";
import type { ReactNode } from "react";

export type Tool =
  | "resize"
  | "crop"
  | "effect"
  | "background"
  | "overlay"
  | "history"
  | "export";

interface EditorToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
}

export function EditorToolbar({ activeTool, onToolChange }: EditorToolbarProps) {

  const tools: { id: Tool; label: string; icon: ReactNode }[] = [
    { id: "resize", label: "Resize", icon: <Scaling /> },
    { id: "crop", label: "Crop", icon: <CropIcon /> },
    { id: "effect", label: "Effects", icon: <Replace /> },
    { id: "overlay", label: "Overlay", icon: <TextCursor /> },
    { id: "background", label: "AI Magic", icon: <Wand  /> },
    { id: "history", label: "History", icon: <History /> },
    { id: "export", label: "Export", icon: <Download /> }
  ];

  return (
    <div className="w-20 border-r border-border/60 dark:bg-[#202124] p-4 flex flex-col justify-start items-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tools</p>
      <div className="space-y-2">
        {tools.map((tool) => {
          const isActive = activeTool === tool.id;

          return (
            <button
              key={tool.id}
              onClick={() => onToolChange(tool.id)}
              className={`w-full rounded-md px-1 py-2 text-center text-sm transition-colors flex flex-col items-center ${
                isActive
                  ? "text-primary border-primary font-medium"
                  : "border-none text-foreground hover:bg-muted"
              }`}
              type="button">
              {tool.icon}
              {tool.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}