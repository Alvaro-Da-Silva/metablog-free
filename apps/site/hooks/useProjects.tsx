import { useState, useEffect } from 'react'
import { Requests } from '@/services/requests'
import { Project, ProjectsPageResponse, ProjectAPIResponse } from '@/data/projectsData'

// Extrai texto legível dos blocos EditorJS
const extractDescription = (content: any): string => {
   if (!content || !Array.isArray(content.blocks)) return ''
   return content.blocks
      .filter((b: any) => b.type === 'paragraph')
      .slice(0, 2)
      .map((b: any) => (b.data?.text || '').replace(/<[^>]+>/g, ''))
      .join(' ')
      .trim()
}

const convertAPIProjectToProject = (apiProject: ProjectAPIResponse): Project => ({
   id: apiProject.id,
   title: apiProject.name,
   description: extractDescription(apiProject.content),
   content: apiProject.content,
   image: '',
   imageName: apiProject.image?.name ?? undefined,
   category: apiProject.category,
   technologies: apiProject.usedTechnologies,
   creator: apiProject.creator,
   slug: apiProject.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
})

export const useProjects = () => {
   const [projects, setProjects] = useState<Project[]>([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)

   const fetchProjects = async () => {
      try {
         setLoading(true)
         setError(null)
         const response: ProjectsPageResponse = await Requests.GetProjects()
         const items: ProjectAPIResponse[] = response?.content ?? []
         const mapped = items.map(convertAPIProjectToProject)
         setProjects(mapped)

         // Buscar imagens em paralelo após renderizar a lista
         const withImages = await Promise.all(
            mapped.map(async (project) => {
               if (!project.imageName) return project
               const base64 = await Requests.GetProjectImage(project.imageName).catch(() => null)
               return base64 ? { ...project, image: base64 } : project
            })
         )
         setProjects(withImages)
      } catch {
         setError('Erro ao carregar projetos')
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      fetchProjects()
   }, [])

   return { projects, loading, error, refetch: fetchProjects }
}