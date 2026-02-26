'use client'

import BannerCard from '@/components/molecules/card/BannerCard'
import PostCard from '@/components/molecules/card/PostCard'
import Link from 'next/link'
import { usePosts } from '@/hooks/usePosts'



export default function Home() {
   const { posts, loading, error } = usePosts()

   // Ordena posts do mais recente para o mais antigo
   const sortedPosts = [...posts].sort((a, b) => {
      // Se usar string ID, comparar as datas de criação
      if (typeof a.id === 'string' && typeof b.id === 'string') {
         return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      // Se usar número ID, comparar diretamente
      return Number(b.id) - Number(a.id)
   })
   
   // Pega o último post publicado (primeiro da lista ordenada)
   const latestPost = sortedPosts[0]

   if (loading) {
      return (
         <main className="container mx-auto">
            <section className="my-20">
               <div className="flex justify-center">
                  <span className="loading loading-spinner loading-lg"></span>
               </div>
            </section>
         </main>
      )
   }

   if (error) {
      return (
         <main className="container mx-auto">
            <section className="my-20">
               <div className="alert alert-error">
                  <span>{error}</span>
               </div>
            </section>
         </main>
      )
   }

   return (
      <main className="container mx-auto">
         {/* Banner Component - Último post publicado */}
         {latestPost && (
            <section>
               <BannerCard post={latestPost} />
            </section>
         )}

         {/* Latest Posts */}
         <section className="my-20">
            <h3 className="text-base-content font-bold text-2xl mb-8 font-work leading-8">
               Latest Posts
            </h3>
            {posts.length > 0 ? (
               <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                     {sortedPosts.slice(0, 9).map((post) => (
                        <PostCard key={post.id} post={post} />
                     ))}
                  </div>
                  <div className="flex items-center justify-center w-full mt-8">
                     <Link
                        href={`/Posts`}
                        className="btn btn-outline btn-secondary text-secondary-content/60 font-work font-medium text-base"
                     >
                        Veja todos os posts
                     </Link>
                  </div>
               </>
            ) : (
               <div className="text-center py-12">
                  <p className="text-lg text-base-content/70">
                     Nenhum post disponível no momento.
                  </p>
               </div>
            )}
         </section>
      </main>
   )
}
