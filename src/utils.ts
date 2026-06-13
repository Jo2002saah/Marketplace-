import { ArtisanCategory } from "./types";

export const getCategoryLabel = (cat: ArtisanCategory): string => {
  switch (cat) {
    case "electrician": return "Electrician";
    case "plumber": return "Plumber";
    case "carpenter": return "Carpenter";
    case "painter": return "Painter & Decorator";
    case "mechanic": return "Motor Mechanic";
    case "mason": return "Mason & Bricklayer";
    case "welder": return "Welder & Fabricator";
    case "ac_technician": return "Refrigeration & AC Tech";
    case "pop_technician": return "POP Technician";
    default: return cat;
  }
};

export const getCategoryColor = (cat: ArtisanCategory): string => {
  switch (cat) {
    case "electrician": return "bg-red-50 text-red-600 border-red-100";
    case "plumber": return "bg-blue-50 text-blue-600 border-blue-100";
    case "carpenter": return "bg-amber-50 text-amber-600 border-amber-100";
    case "painter": return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case "mechanic": return "bg-purple-50 text-purple-600 border-purple-100";
    case "mason": return "bg-orange-50 text-orange-600 border-orange-100";
    case "welder": return "bg-zinc-50 text-zinc-600 border-zinc-200";
    case "ac_technician": return "bg-sky-50 text-sky-600 border-sky-100";
    case "pop_technician": return "bg-teal-50 text-teal-600 border-teal-100";
    default: return "bg-slate-50 text-slate-600 border-slate-100";
  }
};

export const getCategoryThemeColor = (cat: ArtisanCategory): string => {
  switch (cat) {
    case "electrician": return "bg-red-500";
    case "plumber": return "bg-blue-500";
    case "carpenter": return "bg-amber-500";
    case "painter": return "bg-emerald-500";
    case "mechanic": return "bg-purple-500";
    case "mason": return "bg-orange-500";
    case "welder": return "bg-zinc-500";
    case "ac_technician": return "bg-sky-500";
    case "pop_technician": return "bg-teal-500";
    default: return "bg-slate-500";
  }
};
