import { ComponentType, RefAttributes } from "react";
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
import { extraThemes } from "./layouts/themes";
import EmeraldGardenTemplate from "./themed/EmeraldGardenTemplate";
import MidnightGoldTemplate from "./themed/MidnightGoldTemplate";
import SunsetPeachTemplate from "./themed/SunsetPeachTemplate";
import IvoryLaceTemplate from "./themed/IvoryLaceTemplate";
import TealBloomTemplate from "./themed/TealBloomTemplate";
import CrimsonRegalTemplate from "./themed/CrimsonRegalTemplate";
import SageSimplicityTemplate from "./themed/SageSimplicityTemplate";
import LavenderDreamTemplate from "./themed/LavenderDreamTemplate";
import CharcoalProfessionalTemplate from "./themed/CharcoalProfessionalTemplate";
import MarigoldFestiveTemplate from "./themed/MarigoldFestiveTemplate";
import RosewoodHeritageTemplate from "./themed/RosewoodHeritageTemplate";
import OceanPearlTemplate from "./themed/OceanPearlTemplate";
import TerracottaMosaicTemplate from "./themed/TerracottaMosaicTemplate";
import PineInkTemplate from "./themed/PineInkTemplate";
import SapphireSaffronTemplate from "./themed/SapphireSaffronTemplate";

export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  swatch: string[];
  Component: ComponentType<
    { doc: BiodataDocument; fonts: FontPack } & RefAttributes<HTMLDivElement>
  >;
}

const themedTemplateComponents: Record<
  string,
  TemplateMeta["Component"]
> = {
  "emerald-garden": EmeraldGardenTemplate,
  "midnight-gold": MidnightGoldTemplate,
  "sunset-peach": SunsetPeachTemplate,
  "ivory-lace": IvoryLaceTemplate,
  "teal-bloom": TealBloomTemplate,
  "crimson-regal": CrimsonRegalTemplate,
  "sage-simplicity": SageSimplicityTemplate,
  "lavender-dream": LavenderDreamTemplate,
  "charcoal-professional": CharcoalProfessionalTemplate,
  "marigold-festive": MarigoldFestiveTemplate,
  "rosewood-heritage": RosewoodHeritageTemplate,
  "ocean-pearl": OceanPearlTemplate,
  "terracotta-mosaic": TerracottaMosaicTemplate,
  "pine-ink": PineInkTemplate,
  "sapphire-saffron": SapphireSaffronTemplate,
};

const themedTemplates: TemplateMeta[] = extraThemes.map((theme) => {
  const Component = themedTemplateComponents[theme.id];
  if (!Component) {
    throw new Error(`No component is registered for biodata template "${theme.id}".`);
  }

  return {
    id: theme.id,
    name: theme.name,
    description: theme.description,
    swatch: theme.swatch,
    Component,
  };
});

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
