import { useState, useEffect } from 'react'
import { Requests } from '@/services/requests'

export interface Collaborator {
   id: number
   name: string
   bio: string
   creator: string
   role: string
   githubURL: string
   linkedinURL: string
   expertise: string[]
   image: {
      name: string
      url: string  // base64 após fetch
   }
}

export const useCollaborators = () => {
   const [collaborators, setCollaborators] = useState<Collaborator[]>([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)

   const fetchCollaborators = async () => {
      try {
         setLoading(true)
         setError(null)
         const response = await Requests.GetCollaborators()
         const items: Collaborator[] = response?.content ?? (Array.isArray(response) ? response : [])
         setCollaborators(items)

         // Buscar imagens em paralelo após renderizar a lista
         const withImages = await Promise.all(
            items.map(async (col) => {
               const imageName = col.image?.name
               if (!imageName) return col
               const base64 = await Requests.GetCollaboratorImage(imageName).catch(() => null)
               return base64
                  ? { ...col, image: { ...col.image, url: base64 as string } }
                  : col
            })
         )
         setCollaborators(withImages)
      } catch {
         setError('Erro ao carregar colaboradores')
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      fetchCollaborators()
   }, [])

   return { collaborators, loading, error, refetch: fetchCollaborators }
}