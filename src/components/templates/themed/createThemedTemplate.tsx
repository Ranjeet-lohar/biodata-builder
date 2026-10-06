import { forwardRef } from "react";
import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";
import { Theme } from "../layouts/theme";
import BandLayout from "../layouts/BandLayout";
import CenteredLayout from "../layouts/CenteredLayout";
import FrameLayout from "../layouts/FrameLayout";
import SidebarLayout from "../layouts/SidebarLayout";
import SplitLayout from "../layouts/SplitLayout";

export interface ThemeTemplate extends Theme {
  layout: "frame" | "band" | "centered" | "sidebar" | "split";
}

type ThemeConfig = Omit<
  ThemeTemplate,
  "accent" | "accentSoft" | "style" | "radius"
> &
  Partial<Pick<ThemeTemplate, "accent" | "accentSoft" | "style" | "radius">>;

export function createTheme(theme: ThemeConfig): ThemeTemplate {
  return {
    ...theme,
    accent: theme.accent ?? theme.secondary,
    accentSoft: theme.accentSoft ?? `${theme.secondary}22`,
    style: theme.style ?? "classic",
    radius: theme.radius ?? "md",
  };
}

const layoutEngines = {
  frame: FrameLayout,
  band: BandLayout,
  centered: CenteredLayout,
  sidebar: SidebarLayout,
  split: SplitLayout,
} as const;

export function createThemedTemplate(theme: ThemeTemplate) {
  const Engine = layoutEngines[theme.layout];
  const Template = forwardRef<
    HTMLDivElement,
    { doc: BiodataDocument; fonts: FontPack }
  >(({ doc, fonts }, ref) => (
    <div ref={ref}>
      <Engine doc={doc} fonts={fonts} theme={theme} />
    </div>
  ));
  Template.displayName = `BiodataTemplate_${theme.id}`;
  return Template;
}
