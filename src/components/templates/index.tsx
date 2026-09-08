import { ComponentType, RefAttributes, forwardRef } from "react";
import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";
import RoyalTemplate from "./RoyalTemplate";
import MinimalTemplate from "./MinimalTemplate";
import FloralTemplate from "./FloralTemplate";
import ClassicTemplate from "./ClassicTemplate";
import LotusEditorialTemplate from "./LotusEditorialTemplate";
import CircuitFrameTemplate from "./CircuitFrameTemplate";
import AuroraTemplate from "./AuroraTemplate";
import FuturisticTemplate from "./FuturisticTemplate";
import HoloCardTemplate from "./HoloCardTemplate";
import NeoGlassTemplate from "./NeoGlassTemplate";
import QuantumGridTemplate from "./QuantumGridTemplate";
import FrameLayout from "./layouts/FrameLayout";
import BandLayout from "./layouts/BandLayout";
import CenteredLayout from "./layouts/CenteredLayout";
import SidebarLayout from "./layouts/SidebarLayout";
import SplitLayout from "./layouts/SplitLayout";
import { extraThemes, ThemeTemplate } from "./layouts/themes";

export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  swatch: string[];
  Component: ComponentType<
    { doc: BiodataDocument; fonts: FontPack } & RefAttributes<HTMLDivElement>
  >;
}

const layoutEngines = {
  frame: FrameLayout,
  band: BandLayout,
  centered: CenteredLayout,
  sidebar: SidebarLayout,
  split: SplitLayout,
} as const;

function makeThemedTemplate(theme: ThemeTemplate) {
  const Engine = layoutEngines[theme.layout];
  const Comp = forwardRef<HTMLDivElement, { doc: BiodataDocument; fonts: FontPack }>(
    ({ doc, fonts }, ref) => (
      <div ref={ref}>
        <Engine doc={doc} fonts={fonts} theme={theme} />
      </div>
    )
  );
  Comp.displayName = `Themed_${theme.id}`;
  return Comp;
}

const themedTemplates: TemplateMeta[] = extraThemes.map((theme) => ({
  id: theme.id,
  name: theme.name,
  description: theme.description,
  swatch: theme.swatch,
  Component: makeThemedTemplate(theme),
}));

export const templates: TemplateMeta[] = [
  {
    id: "royal",
    name: "Royal Maroon",
    description: "Regal maroon tones with ornate gold detailing",
    swatch: ["#6b1220", "#c9a227", "#fbf3e3"],
    Component: RoyalTemplate,
  },
  {
    id: "minimal",
    name: "Modern Minimal",
    description: "Crisp structure, airy spacing, and a clean profile focus",
    swatch: ["#2f3a2b", "#5b7c99", "#ffffff"],
    Component: MinimalTemplate,
  },
  {
    id: "floral",
    name: "Floral Blush",
    description: "Soft romantic styling with blooming decorative accents",
    swatch: ["#c98fa0", "#f0cdd3", "#fffaf8"],
    Component: FloralTemplate,
  },
  {
    id: "classic",
    name: "Classic Navy",
    description: "Balanced navy framing with polished heritage details",
    swatch: ["#1b2a4a", "#b08d57", "#ffffff"],
    Component: ClassicTemplate,
  },
  {
    id: "lotus-editorial",
    name: "Lotus Editorial",
    description: "An asymmetric editorial profile with teal and coral accents",
    swatch: ["#176b72", "#c86b52", "#f7f2e8"],
    Component: LotusEditorialTemplate,
  },
  {
    id: "circuit-frame",
    name: "Circuit Frame",
    description: "A dark technical layout with luminous circuit traces and node accents",
    swatch: ["#0a0f0c", "#39ff9d", "#c6ff5e"],
    Component: CircuitFrameTemplate,
  },
  {
    id: "aurora",
    name: "Aurora",
    description: "A cool atmospheric layout with flowing aurora bands and luminous accents",
    swatch: ["#080b14", "#2ee6c6", "#4f8bff"],
    Component: AuroraTemplate,
  },
  {
    id: "futuristic",
    name: "Futuristic",
    description: "A sleek HUD-inspired layout with precise brackets and cyan glow",
    swatch: ["#080b14", "#22d3ee", "#8b5cf6"],
    Component: FuturisticTemplate,
  },
  {
    id: "holo-card",
    name: "Holo Card",
    description: "A holographic identity-card design with pink, violet, and cyan highlights",
    swatch: ["#0c0a14", "#ff5fae", "#4fd8ff"],
    Component: HoloCardTemplate,
  },
  {
    id: "neo-glass",
    name: "Neo Glass",
    description: "A dark glass-panel layout with a slim luminous accent rail",
    swatch: ["#0a0c12", "#2dd4ff", "#fb7dc4"],
    Component: NeoGlassTemplate,
  },
  {
    id: "quantum-grid",
    name: "Quantum Grid",
    description: "A technical hex-grid layout with cyan, green, and amber data accents",
    swatch: ["#070a10", "#38d6ff", "#ffb84d"],
    Component: QuantumGridTemplate,
  },
  ...themedTemplates,
];

export function getTemplate(id: string): TemplateMeta {
  return templates.find((t) => t.id === id) ?? templates[0];
}
