'use client'
import CollaboratorCard from '@/components/molecules/card/CollaboratorCard'
import PageInfo from '@/components/organism/pageInfo/PageInfo'
import Link from 'next/link'
import React from 'react'
import { useCollaborators } from '@/hooks/useCollaborators'

const Collaborators = ({ searchParams }: { searchParams: { search?: string; page?: string } }) => {
   const { collaborators, loading, error } = useCollaborators()
   const searchTerm = searchParams.search || ''
   const currentPage = parseInt(searchParams.page || '1', 10)
   const itemsPerPage = 9
   
   // Ordena colaboradores por nome
   const sortedCollaborators = [...collaborators].sort((a, b) => 
      a.name.localeCompare(b.name)
   )
   
   const filteredCollaborators = searchTerm
      ? sortedCollaborators.filter(
           (collaborator) =>
              collaborator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              collaborator.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
              collaborator.expertise.some((skill) =>
                 skill.toLowerCase().includes(searchTerm.toLowerCase())
              )
        )
      : sortedCollaborators

   // Calcular paginação
   const totalPages = Math.ceil(filteredCollaborators.length / itemsPerPage)
   const startIndex = (currentPage - 1) * itemsPerPage
   const paginatedCollaborators = filteredCollaborators.slice(startIndex, startIndex + itemsPerPage)

   return (
      <main>
         <div className="container mx-auto px-5 md:px-0">
            {/* Page title info */}
            <section>
               <PageInfo 
                  title={searchTerm ? `Resultados para: "${searchTerm}"` : 'Colaboradores'} 
                  breadcrumbLabel="Colaboradores"
               />
            </section>

            {/* Search info with clear button */}
            {searchTerm && (
               <section className="my-6 flex items-center justify-between">
                  <p className="text-base-content/70">
                     {filteredCollaborators.length} resultado{filteredCollaborators.length !== 1 ? 's' : ''} encontrado{filteredCollaborators.length !== 1 ? 's' : ''}
                  </p>
                  <Link
                     href="/Colaboradores"
                     className="btn btn-sm btn-outline"
                  >
                     Limpar Busca
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

            {/* Collaborators Grid */}
            {!loading && !error && (
               <section className="my-20">
                  {filteredCollaborators.length > 0 ? (
                     <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                           {paginatedCollaborators.map((collaborator) => (
                              <CollaboratorCard key={collaborator.id} collaborator={collaborator} />
                           ))}
                        </div>
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                           <div className="flex items-center justify-center w-full mt-8 gap-2">
                              {currentPage > 1 && (
                                 <Link
                                    href={`/Colaboradores?${searchTerm ? `search=${searchTerm}&` : ''}page=${currentPage - 1}`}
                                    className="btn btn-sm btn-outline"
                                 >
                                    ←
                                 </Link>
                              )}
                              
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                 <Link
                                    key={page}
                                    href={`/Colaboradores?${searchTerm ? `search=${searchTerm}&` : ''}page=${page}`}
                                    className={`btn btn-sm ${currentPage === page ? 'btn-active' : 'btn-outline'}`}
                                 >
                                    {page}
                                 </Link>
                              ))}
                              
                              {currentPage < totalPages && (
                                 <Link
                                    href={`/Colaboradores?${searchTerm ? `search=${searchTerm}&` : ''}page=${currentPage + 1}`}
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
                           {searchTerm ? 'Nenhum colaborador encontrado para sua busca.' : 'Nenhum colaborador disponível no momento.'}
                        </p>
                        {searchTerm && (
                           <Link
                              href="/Colaboradores"
                              className="btn btn-outline mt-4"
                           >
                              Ver todos os colaboradores
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

export default Collaborators


