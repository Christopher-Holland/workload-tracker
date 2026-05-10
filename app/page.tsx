export default function UtilityProjectManagerPrototype() {
  const projects = [
    {
      id: 1,
      name: "KY-102 Gas Main Replacement",
      status: "In Progress",
      assigned: "Chris",
      due: "May 21",
      priority: "High",
      budgetHours: 30,
      actualHours: 20,
    },
    {
      id: 2,
      name: "County Road Relocation",
      status: "QA Review",
      assigned: "Megan",
      due: "May 16",
      priority: "Medium",
      budgetHours: 20,
      actualHours: 15,
    },
    {
      id: 3,
      name: "Service Transfer Batch",
      status: "Pending Field Data",
      assigned: "Jacob",
      due: "May 28",
      priority: "Low",
      budgetHours: 10,
      actualHours: 8,
    },
  ];

  const stats = [
    {
      title: "Active Projects",
      value: "24",
    },
    {
      title: "Projects Waiting QA",
      value: "7",
    },
    {
      title: "Overdue Tasks",
      value: "3",
    },
    {
      title: "Available Designers",
      value: "5",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "QA Review":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "Pending Field Data":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-zinc-500/20 text-zinc-300 border-zinc-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1117] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              UtilityOps Dashboard
            </h1>
            <p className="text-zinc-400 mt-1">
              Internal project and workflow management prototype
            </p>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-2xl bg-zinc-800 hover:bg-zinc-700 transition">
              Filter Projects
            </button>
            <button className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 transition font-medium">
              + New Project
            </button>
          </div>
        </div>

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
              <input
                placeholder="Search projects..."
                className="bg-[#0b1117] border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-emerald-500 w-56"
              />
            </div>

            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-[#0d141c] border border-white/5 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-emerald-500/30 transition"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{project.name}</h3>
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
                      <p className="font-medium mt-1">{project.assigned}</p>
                    </div>

                    <div>
                      <p className="text-zinc-500">Due Date</p>
                      <p className="font-medium mt-1">{project.due}</p>
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
              <div className="bg-[#0d141c] rounded-2xl p-4 border border-white/5">
                <p>
                  <span className="font-semibold text-emerald-400">Chris</span>{" "}
                  updated gas main redesign notes.
                </p>
                <p className="text-zinc-500 mt-2">12 minutes ago</p>
              </div>

              <div className="bg-[#0d141c] rounded-2xl p-4 border border-white/5">
                <p>
                  QA review completed for County Road Relocation.
                </p>
                <p className="text-zinc-500 mt-2">34 minutes ago</p>
              </div>

              <div className="bg-[#0d141c] rounded-2xl p-4 border border-white/5">
                <p>
                  New field photos uploaded for service transfer batch.
                </p>
                <p className="text-zinc-500 mt-2">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
