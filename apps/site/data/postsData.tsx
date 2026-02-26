export interface Post {
   id: string
   title: string
   category: string
   image: string        // base64 data URL
   imageName?: string   // nome do arquivo no Minio
   bannerImage?: string
   author: {
      name: string
      avatar: string
   }
   date: string
   slug: string
   content?: any
}

export interface PostAPIResponse {
   id: string
   title: string
   author: string
   authorPhoto?: string | null
   category: string
   image: {
      name: string
      url: string
   } | null
   content: any
   createdAt: string
   updatedAt: string
}

export interface PostsPageResponse {
   content: PostAPIResponse[]
   totalPages?: number
   totalElements?: number
}
