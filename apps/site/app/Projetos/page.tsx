'use client'
import ProjectCard from '@/components/molecules/card/ProjectCard'
import PageInfo from '@/components/organism/pageInfo/PageInfo'
import Link from 'next/link'
import React from 'react'
import { useProjects } from '@/hooks/useProjects'
import { useRouter } from 'next/navigation'

const Projects = ({ searchParams }: { searchParams: { search?: string; tag?: string; page?: string } }) => {
   const { projects, loading, error } = useProjects()
   const router = useRouter()
   const searchTerm = searchParams.search || ''
   const activeTag = searchParams.tag || ''
   const currentPage = parseInt(searchParams.page || '1', 10)
   const itemsPerPage = 9

   // Coletar todas as tags únicas de todos os projetos
   const allTags = Array.from(
      new Set(projects.flatMap((p) => p.technologies))
   ).sort()

   // Ordenar projetos por título
   const sortedProjects = [...projects].sort((a, b) =>
      a.title.localeCompare(b.title)
   )

   const filteredProjects = sortedProjects
      .filter((project) => {
         const matchesSearch =
            !searchTerm ||
            project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.technologies.some((tech) =>
               tech.toLowerCase().includes(searchTerm.toLowerCase())
            )
         const matchesTag =
            !activeTag ||
            project.technologies.some(
               (tech) => tech.toLowerCase() === activeTag.toLowerCase()
            )
         return matchesSearch && matchesTag
      })

   // Calcular paginação
   const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
   const startIndex = (currentPage - 1) * itemsPerPage
   const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage)

   const buildHref = (overrides: { search?: string; tag?: string; page?: number }) => {
      const params = new URLSearchParams()
      const s = 'search' in overrides ? overrides.search : searchTerm
      const t = 'tag' in overrides ? overrides.tag : activeTag
      const p = overrides.page ?? 1
      if (s) params.set('search', s)
      if (t) params.set('tag', t)
      if (p > 1) params.set('page', String(p))
      const qs = params.toString()
      return `/Projetos${qs ? `?${qs}` : ''}`
   }

   const hasFilters = searchTerm || activeTag

   return (
      <main>
         <div className="container mx-auto">
            {/* Page title info */}
            <section>
               <PageInfo
                  title={searchTerm ? `Resultados para: "${searchTerm}"` : 'Projetos'}
                  breadcrumbLabel="Projetos"
               />
            </section>

            {/* Tags filter */}
            {!loading && !error && allTags.length > 0 && (
               <section className="my-6 flex items-center gap-3">
                  <label className="text-sm font-medium text-base-content/60 whitespace-nowrap">
                     Filtrar por tecnologia:
                  </label>
                  <select
                     className="select select-bordered select-sm w-full max-w-xs"
                     value={activeTag}
                     onChange={(e) => {
                        const href = buildHref({ tag: e.target.value, page: 1 })
                        router.push(href)
                     }}
                  >
                     <option value="">Todas as tecnologias</option>
                     {allTags.map((tag) => (
                        <option key={tag} value={tag}>
                           {tag}
                        </option>
                     ))}
                  </select>
                  {activeTag && (
                     <Link href={buildHref({ tag: '' })} className="btn btn-sm btn-ghost text-base-content/50">
                        ✕
                     </Link>
                  )}
               </section>
            )}

            {/* Active filters info */}
            {hasFilters && (
               <section className="my-4 flex items-center justify-between">
                  <p className="text-base-content/70 text-sm">
                     {filteredProjects.length} projeto{filteredProjects.length !== 1 ? 's' : ''} encontrado{filteredProjects.length !== 1 ? 's' : ''}
                     {activeTag && <span className="ml-1">com a tag <strong>{activeTag}</strong></span>}
                  </p>
                  <Link href="/Projetos" className="btn btn-sm btn-outline">
                     Limpar filtros
                  </Link>
               </section>
            )}

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

            {/* Projects Grid */}
            {!loading && !error && (
               <section className="my-10">
                  {filteredProjects.length > 0 ? (
                     <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                           {paginatedProjects.map((project) => (
                              <ProjectCard key={project.id} project={project} />
                           ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                           <div className="flex items-center justify-center w-full mt-8 gap-2">
                              {currentPage > 1 && (
                                 <Link href={buildHref({ page: currentPage - 1 })} className="btn btn-sm btn-outline">
                                    ←
                                 </Link>
                              )}
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                 <Link
                                    key={page}
                                    href={buildHref({ page })}
                                    className={`btn btn-sm ${currentPage === page ? 'btn-active' : 'btn-outline'}`}
                                 >
                                    {page}
                                 </Link>
                              ))}
                              {currentPage < totalPages && (
                                 <Link href={buildHref({ page: currentPage + 1 })} className="btn btn-sm btn-outline">
                                    →
                                 </Link>
                              )}
                           </div>
                        )}
                     </>
                  ) : (
                     <div className="text-center py-12">
                        <p className="text-lg text-base-content/70">
                           {hasFilters ? 'Nenhum projeto encontrado para os filtros aplicados.' : 'Nenhum projeto disponível no momento.'}
                        </p>
                        {hasFilters && (
                           <Link href="/Projetos" className="btn btn-outline mt-4">
                              Ver todos os projetos
                           </Link>
                        )}
                     </div>
                  )}
               </section>
            )}
         </div>
      </main>
   )
}

export default Projects
