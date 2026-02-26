'use client'

import PostOverlayCard from '@/components/molecules/card/PostOverlayCard'
import PostCard from '@/components/molecules/card/PostCard'
import PageInfo from '@/components/organism/pageInfo/PageInfo'
import Link from 'next/link'
import { usePosts } from '@/hooks/usePosts'
import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const BlogListing = ({ searchParams }: { searchParams: { search?: string; page?: string; category?: string } }) => {
   const { posts, loading, error } = usePosts()
   const clientSearchParams = useSearchParams()
   const searchTerm = searchParams.search || ''
   const categoryFilter = searchParams.category || ''
   const currentPage = parseInt(searchParams.page || '1', 10)
   const cardsPerPage = 9
   
   // Scroll to top when category filter changes
   useEffect(() => {
      if (categoryFilter) {
         window.scrollTo({ top: 0, behavior: 'smooth' })
      }
   }, [categoryFilter])
   
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
   
   // Filtrar por categoria e/ou busca
   let filteredPosts = sortedPosts
   
   if (categoryFilter) {
      filteredPosts = filteredPosts.filter(post => post.category === categoryFilter)
   }
   
   if (searchTerm) {
      filteredPosts = filteredPosts.filter(
         (post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
   }

   // Calcular paginação
   const totalPages = Math.ceil(filteredPosts.length / cardsPerPage)
   const startIndex = (currentPage - 1) * cardsPerPage
   const paginatedPosts = filteredPosts.slice(startIndex, startIndex + cardsPerPage)

   return (
      <main>
         <div className="container mx-auto">
            {/* Page title info */}
            <section>
               <PageInfo 
                  title={
                     categoryFilter 
                        ? `Categoria: ${categoryFilter}` 
                        : searchTerm 
                        ? `Resultados para: "${searchTerm}"` 
                        : 'Posts'
                  } 
                  breadcrumbLabel="Posts"
               />
            </section>

            {/* Loading State */}
            {loading && (
               <section className="my-20">
                  <div className="flex justify-center">
                     <span className="loading loading-spinner loading-lg"></span>
                  </div>
               </section>
            )}

            {/* Error State */}
            {error && (
               <section className="my-20">
                  <div className="alert alert-error">
                     <span>{error}</span>
                  </div>
               </section>
            )}

            {!loading && !error && (
               <>
                  {/* Filter info with clear button */}
                  {(searchTerm || categoryFilter) && (
                     <section className="my-6 flex items-center justify-between">
                        <p className="text-base-content/70">
                           {filteredPosts.length} resultado{filteredPosts.length !== 1 ? 's' : ''} encontrado{filteredPosts.length !== 1 ? 's' : ''}
                        </p>
                        <Link
                           href="/Posts"
                           className="btn btn-sm btn-outline"
                        >
                           Limpar Filtros
                        </Link>
                     </section>
                  )}

                  {/* Latest Post Highlight (only show if no filters and has posts) */}
                  {!searchTerm && !categoryFilter && latestPost && posts.length > 0 && (
                     <section className="my-16">
                        <h2 className="text-3xl font-bold mb-8 text-center">Post Mais recente</h2>
                        <PostOverlayCard post={latestPost} />
                     </section>
                  )}

                  {/* Posts Grid */}
                  <section className="my-20">
                     {filteredPosts.length > 0 ? (
                        <>
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                              {paginatedPosts.map((post) => (
                                 <PostCard key={post.id} post={post} />
                              ))}
                           </div>
                           
                           {/* Pagination */}
                           {totalPages > 1 && (
                              <div className="flex items-center justify-center w-full mt-8 gap-2">
                                 {currentPage > 1 && (
                                    <Link
                                       href={`/Posts?${categoryFilter ? `category=${categoryFilter}&` : ''}${searchTerm ? `search=${searchTerm}&` : ''}page=${currentPage - 1}`}
                                       className="btn btn-sm btn-outline"
                                    >
                                       ←
                                    </Link>
                                 )}
                                 
                                 {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <Link
                                       key={page}
                                       href={`/Posts?${categoryFilter ? `category=${categoryFilter}&` : ''}${searchTerm ? `search=${searchTerm}&` : ''}page=${page}`}
                                       className={`btn btn-sm ${currentPage === page ? 'btn-active' : 'btn-outline'}`}
                                    >
                                       {page}
                                    </Link>
                                 ))}
                                 
                                 {currentPage < totalPages && (
                                    <Link
                                       href={`/Posts?${categoryFilter ? `category=${categoryFilter}&` : ''}${searchTerm ? `search=${searchTerm}&` : ''}page=${currentPage + 1}`}
                                       className="btn btn-sm btn-outline"
                                    >
                                       →
                                    </Link>
                                 )}
                              </div>
                           )}
                        </>
                     ) : (
                        <div className="text-center py-12">
                           <p className="text-lg text-base-content/70">
                              {searchTerm || categoryFilter ? 'Nenhum post encontrado para sua busca.' : 'Nenhum post disponível no momento.'}
                           </p>
                           {(searchTerm || categoryFilter) && (
                              <Link
                                 href="/Posts"
                                 className="btn btn-outline mt-4"
                              >
                                 Ver todos os posts
                              </Link>
                           )}
                        </div>
                     )}
                  </section>
               </>
            )}
         </div>
      </main>
   )
}

export default BlogListing

