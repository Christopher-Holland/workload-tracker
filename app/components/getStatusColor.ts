export function getStatusColor(status: string): string {
  switch (status) {
    case "Not started":
      return "bg-zinc-500/20 text-zinc-300 border-zinc-500/30";
    case "Preliminary":
      return "bg-violet-500/20 text-violet-300 border-violet-500/30";
    case "Preliminary Complete":
      return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
    case "1st round close outs":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "final closeouts":
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    case "QA Review":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    case "Complete":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    default:
      return "bg-zinc-500/20 text-zinc-300 border-zinc-500/30";
  }
}
