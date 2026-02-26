export interface Project {
   id: string
   title: string
   description: string  // texto extraído do conteúdo EditorJS
   content?: any        // conteúdo EditorJS completo
   image: string        // base64 data URL
   imageName?: string   // nome do arquivo no Minio
   category: string
   technologies: string[]
   creator: string
   slug: string
   githubURL?: string
   liveURL?: string
}

export interface ProjectAPIResponse {
   id: string
   name: string
   content: any
   image: {
      name: string
      url: string
   } | null
   category: string
   usedTechnologies: string[]
   creator: string
   createdAt: string
   updatedAt: string
}

export interface ProjectsPageResponse {
   content: ProjectAPIResponse[]
   totalPages?: number
   totalElements?: number
}
