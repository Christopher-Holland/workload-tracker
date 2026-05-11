import activity from "@/app/data/activity.json";
import drafters from "@/app/data/drafters.json";
import engineers from "@/app/data/engineers.json";
import projects from "@/app/data/projects.json";

type Project = (typeof projects)[number];

function drafterForProject(projectId: number) {
  return drafters[(projectId - 1) % drafters.length];
}

function engineerForProject(projectId: number) {
  return engineers[(projectId - 1) % engineers.length];
}

function buildStats(projectList: Project[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeProjects = projectList.filter((p) => p.status !== "Complete").length;
  const projectsWaitingQa = projectList.filter((p) => p.status === "QA Review").length;
  const overdueTasks = projectList.filter((p) => {
    const due = new Date(p.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }).length;

  const inProgressDrafters = new Set(
    projectList
      .filter((p) => p.status === "In Progress")
      .map((p) => drafterForProject(p.id))
  );
  const availableDesigners = drafters.filter((d) => !inProgressDrafters.has(d)).length;

  return [
    { title: "Active Projects", value: String(activeProjects) },
    { title: "Projects Waiting QA", value: String(projectsWaitingQa) },
    { title: "Overdue Tasks", value: String(overdueTasks) },
    { title: "Available Designers", value: String(availableDesigners) },
  ];
}

export default function UtilityProjectManagerPrototype() {
  const stats = buildStats(projects);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "QA Review":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "Pending Field Data":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "Complete":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "Drafting":
        return "bg-violet-500/20 text-violet-300 border-violet-500/30";
      case "Pending Approval":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      default:
        return "bg-zinc-500/20 text-zinc-300 border-zinc-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1117] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-[#131b24] border border-white/5 rounded-3xl p-5 shadow-lg"
            >
              <p className="text-zinc-400 text-sm">{stat.title}</p>
              <h2 className="text-3xl font-bold mt-2">{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Project Table */}
          <div className="xl:col-span-2 bg-[#131b24] border border-white/5 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-semibold">Priority Queue</h2>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 transition font-medium">
                  Filters
                </button>
                <input
                  placeholder="Search projects..."
                  className="bg-[#0b1117] border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-emerald-500 w-56"
                />
              </div>
            </div>

            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-[#0d141c] border border-white/5 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-emerald-500/30 transition"
                >
                  <div>
                    <p className="text-2xl font-bold tracking-tight">Project # {project.projectNumber}</p>
                    <p className="text-lg font-semibold">{project.name}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>

                      <span className="px-3 py-1 rounded-full text-xs bg-zinc-800 text-zinc-300 border border-white/5">
                        {project.priority} Priority
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-8 text-sm">
                    <div>
                      <p className="text-zinc-500">Assigned</p>
                      <p className="font-medium mt-1">{drafterForProject(project.id)}</p>
                    </div>

                    <div>
                      <p className="text-zinc-500">Engineer</p>
                      <p className="font-medium mt-1">{engineerForProject(project.id)}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500">Budget Hours</p>
                      <p className="font-medium mt-1">{project.budgetHours}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500">Actual Hours</p>
                      <p className="font-medium mt-1">{project.actualHours}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-[#131b24] border border-white/5 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-semibold">Team Activity</h2>
              <span className="text-xs text-emerald-400">LIVE</span>
            </div>

            <div className="space-y-4 text-sm">
              {activity.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0d141c] rounded-2xl p-4 border border-white/5"
                >
                  <p>{item.message}</p>
                  <p className="text-zinc-500 mt-2">{item.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
