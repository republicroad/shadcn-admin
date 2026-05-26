import { createContext, useContext } from 'react'

type ProjectsContextType = {
  // Add any context values that projects page might need
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined)

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  // Add any provider logic that projects page might need

  return (
    <ProjectsContext.Provider value={{}}>
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectsContext)
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider')
  }
  return context
}