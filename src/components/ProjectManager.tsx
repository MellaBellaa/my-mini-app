import React, { useState } from 'react'
import type { Project, ProjectType } from '../types'
import { Icon } from './Icon'

interface ProjectManagerProps {
  projects: Project[]
  onOpenProject: (project: Project) => void
  onDeleteProject: (id: string) => void
  onToggleStar: (id: string) => void
  onDownloadProject: (project: Project) => void
  onNewProject: () => void
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  projects,
  onOpenProject,
  onDeleteProject,
  onToggleStar,
  onDownloadProject,
  onNewProject,
}) => {
  const [filter, setFilter] = useState<string>('All')
  const [query, setQuery] = useState('')

  const categories = ['All', 'App', 'Website', 'Game', 'Bug Fix', 'Roadmap']

  const filtered = projects.filter((p) => {
    if (filter !== 'All' && p.type !== filter) return false
    if (query.trim() && !p.title.toLowerCase().includes(query.toLowerCase()) && !p.prompt.toLowerCase().includes(query.toLowerCase())) {
      return false
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Workspace Library</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display mt-0.5">
            My Projects ({projects.length})
          </h2>
        </div>

        <button
          type="button"
          onClick={onNewProject}
          className="rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold px-5 py-2.5 text-xs shadow-md shadow-violet-600/30 flex items-center justify-center gap-2 transition w-fit"
        >
          <Icon name="plus" className="h-4 w-4" />
          <span>New Creation</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-1.5 bg-neutral-100 p-1 rounded-2xl w-fit">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                filter === cat
                  ? 'bg-white shadow text-violet-700'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects by name..."
            className="w-full sm:w-64 rounded-2xl border border-neutral-200 pl-9 pr-4 py-2 text-xs focus:border-violet-500 focus:outline-none"
          />
          <span className="absolute left-3 top-2.5 text-neutral-400">
            <Icon name="search" className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="group rounded-3xl border border-neutral-200/90 bg-white p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`grid h-10 w-10 place-items-center rounded-2xl ${proj.color} font-bold`}>
                  <Icon name={proj.icon} className="h-5 w-5" />
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onToggleStar(proj.id)}
                    className={`p-1.5 rounded-lg transition ${
                      proj.starred ? 'text-amber-500' : 'text-neutral-300 hover:text-amber-500'
                    }`}
                    aria-label="Star project"
                  >
                    ★
                  </button>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-bold text-neutral-600">
                    {proj.type}
                  </span>
                </div>
              </div>

              <h3 className="font-display font-bold text-base text-neutral-900 group-hover:text-violet-700 transition">
                {proj.title}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed mt-2 line-clamp-2">
                {proj.prompt}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100">
              <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-3">
                <span className="flex items-center gap-1">
                  <Icon name="clock" className="h-3 w-3" />
                  {proj.updated}
                </span>
                <span className="font-mono-code">Saved</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenProject(proj)}
                  className="flex-1 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Open Studio</span>
                  <Icon name="arrow" className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDownloadProject(proj)}
                  title="Download HTML"
                  className="rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 p-2 text-neutral-600 transition"
                  aria-label="Download standalone HTML"
                >
                  <Icon name="download" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteProject(proj.id)}
                  title="Delete project"
                  className="rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-rose-50 hover:text-rose-600 p-2 text-neutral-400 transition"
                  aria-label="Delete project"
                >
                  <Icon name="trash" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-neutral-200">
            <span className="text-4xl block mb-2">📁</span>
            <p className="font-bold text-neutral-800">No projects found</p>
            <p className="text-xs text-neutral-500 mt-1">Try adjusting your search query or create a new project above.</p>
          </div>
        )}
      </div>
    </div>
  )
}
