import { useState, useEffect } from 'react'
import { Requests } from '@/services/requests'
import { Post, PostsPageResponse, PostAPIResponse } from '@/data/postsData'
import { Collaborator } from './useCollaborators'

const generateAvatar = (name: string) => {
   const initials = name.split(' ').map(word => word.charAt(0).toUpperCase()).join('')
   return `https://placehold.co/100x100/4F46E5/FFFFFF?text=${initials}`
}

const formatDate = (isoDate: string) =>
   new Date(isoDate).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
   })

// Função para encontrar avatar do colaborador por nome
const findCollaboratorAvatar = (authorName: string, collaborators: Collaborator[]): string => {
   const collaborator = collaborators.find(col => 
      col.name.toLowerCase().includes(authorName.toLowerCase()) || 
      authorName.toLowerCase().includes(col.name.toLowerCase())
   )
   return collaborator?.image?.url || generateAvatar(authorName)
}

const convertAPIPostToPost = (apiPost: PostAPIResponse, collaborators: Collaborator[] = []): Post => ({
   id: apiPost.id,
   title: apiPost.title,
   category: apiPost.category,
   image: '',
   imageName: apiPost.image?.name ?? undefined,
   author: {
      name: apiPost.author,
      avatar: apiPost.authorPhoto || findCollaboratorAvatar(apiPost.author, collaborators),
   },
   date: formatDate(apiPost.createdAt),
   slug: apiPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
   content: apiPost.content,
})

export const usePosts = () => {
   const [posts, setPosts] = useState<Post[]>([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)

   const fetchPosts = async () => {
      try {
         setLoading(true)
         setError(null)
         
         // Buscar colaboradores primeiro para ter os avatares
         const collaboratorsResponse = await Requests.GetCollaborators()
         const collaborators: Collaborator[] = collaboratorsResponse?.content ?? (Array.isArray(collaboratorsResponse) ? collaboratorsResponse : [])
         
         // Carregar imagens dos colaboradores
         const collaboratorsWithImages = await Promise.all(
            collaborators.map(async (col) => {
               const imageName = col.image?.name
               if (!imageName) return col
               const base64 = await Requests.GetCollaboratorImage(imageName).catch(() => null)
               return base64
                  ? { ...col, image: { ...col.image, url: base64 as string } }
                  : col
            })
         )
         
         // Buscar posts
         const response: PostsPageResponse = await Requests.GetPosts()
         const items: PostAPIResponse[] = response?.content ?? []
         const mapped = items.map(post => convertAPIPostToPost(post, collaboratorsWithImages))
         setPosts(mapped)

         // Buscar imagens dos posts em paralelo após renderizar a lista
         const withImages = await Promise.all(
            mapped.map(async (post) => {
               if (!post.imageName) return post
               const base64 = await Requests.GetPostImage(post.imageName).catch(() => null)
               return base64 ? { ...post, image: base64 as string } : post
            })
         )
         setPosts(withImages)
      } catch {
         setError('Erro ao carregar posts')
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      fetchPosts()
   }, [])

   return { posts, loading, error, refetch: fetchPosts }
}