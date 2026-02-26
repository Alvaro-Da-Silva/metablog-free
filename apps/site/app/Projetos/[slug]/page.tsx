'use client'

import { useProjects } from '@/hooks/useProjects'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface ProjectDetailPageProps {
   params: {
      slug: string
   }
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
   const { projects, loading, error } = useProjects()
   
   const project = projects.find((p) => p.slug === params.slug)

   if (loading) {
      return (
         <div className="min-h-screen bg-base-100 py-12">
            <div className="container mx-auto max-w-4xl px-4">
               <div className="flex justify-center items-center min-h-[400px]">
                  <span className="loading loading-spinner loading-lg"></span>
               </div>
            </div>
         </div>
      )
   }

   if (error) {
      return (
         <div className="min-h-screen bg-base-100 py-12">
            <div className="container mx-auto max-w-4xl px-4">
               <div className="alert alert-error">
                  <span>{error}</span>
               </div>
            </div>
         </div>
      )
   }

   if (!project) {
      notFound()
   }

   // Pega 3 projetos relacionados aleatoriamente (excluindo o projeto atual)
   const relatedProjects = projects
      .filter((p) => p.id !== project.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

   return (
      <div className="min-h-screen bg-base-100 py-12">
         <div className="container mx-auto max-w-4xl px-4">
            {/* Breadcrumb */}
            <div className="breadcrumbs mb-8 text-sm">
               <ul>
                  <li>
                     <Link href="/" className="link link-hover">
                        Home
                     </Link>
                  </li>
                  <li>
                     <Link href="/Projetos" className="link link-hover">
                        Projetos
                     </Link>
                  </li>
                  <li className="text-base-content/70">{project.title}</li>
               </ul>
            </div>

            {/* Project Image */}
            <div className="mb-8 w-full overflow-hidden rounded-lg">
               <img
                  src={project.image}
                  alt={project.title}
                  className="h-96 w-full object-cover"
               />
            </div>

            {/* Project Header */}
            <div className="mb-8">
               <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="badge badge-secondary">{project.category}</span>
               </div>

               <h1 className="mb-4 text-4xl font-bold text-base-content">{project.title}</h1>

               {/* Technologies */}
               <div className="mb-6">
                  <h3 className="mb-3 text-sm font-semibold uppercase text-base-content/70">
                     Tecnologias Utilizadas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                     {project.technologies.map((tech) => (
                        <span key={tech} className="badge badge-lg badge-outline">
                           {tech}
                        </span>
                     ))}
                  </div>
               </div>
            </div>

            {/* Project Description */}
            <article className="prose prose-invert max-w-4xl">
               <div className="divider"></div>
               {project.content?.blocks?.length > 0 ? (
                  project.content.blocks.map((block: any, index: number) => {
                     switch (block.type) {
                        case 'header': {
                           const level = block.data.level ?? 2
                           const Tag = `h${level}` as any
                           const sizeMap: Record<number, string> = {
                              1: 'text-4xl',
                              2: 'text-3xl',
                              3: 'text-2xl',
                              4: 'text-xl',
                              5: 'text-lg',
                              6: 'text-base',
                           }
                           return (
                              <Tag key={index} className={`font-bold text-base-content mt-8 mb-4 ${sizeMap[level] ?? 'text-2xl'}`}
                                 dangerouslySetInnerHTML={{ __html: block.data.text }}
                              />
                           )
                        }
                        case 'paragraph':
                           return (
                              <p key={index} className="text-lg leading-relaxed text-base-content"
                                 dangerouslySetInnerHTML={{ __html: block.data.text }}
                              />
                           )
                        case 'list':
                           const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul'
                           return (
                              <ListTag key={index} className="text-base-content pl-5">
                                 {block.data.items.map((item: string, i: number) => (
                                    <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                                 ))}
                              </ListTag>
                           )
                        default:
                           return null
                     }
                  })
               ) : (
                  project.description && (
                     <p className="text-lg leading-relaxed text-base-content">{project.description}</p>
                  )
               )}
               <div className="divider"></div>
            </article>

            {/* Related Projects */}
            <section className="mt-12">
               <h2 className="mb-6 text-2xl font-bold text-base-content">Outros Projetos</h2>
               <div className="grid gap-6 md:grid-cols-3">
                  {relatedProjects.map((relatedProject) => (
                     <Link key={relatedProject.id} href={`/Projetos/${relatedProject.slug}`}>
                        <div className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow">
                           <figure className="h-40 w-full overflow-hidden">
                              <img
                                 src={relatedProject.image}
                                 alt={relatedProject.title}
                                 className="h-full w-full object-cover"
                              />
                           </figure>
                           <div className="card-body p-4">
                              <span className="badge badge-sm badge-secondary mb-2">
                                 {relatedProject.category}
                              </span>
                              <h3 className="card-title line-clamp-1 text-base text-base-content">
                                 {relatedProject.title}
                              </h3>
                              <div className="mt-2 flex flex-wrap gap-1">
                                 {relatedProject.technologies.slice(0, 2).map((tech) => (
                                    <span key={tech} className="badge badge-xs badge-ghost">
                                       {tech}
                                    </span>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </Link>
                  ))}
               </div>
            </section>

            {/* Back Button */}
            <div className="mt-12">
               <Link href="/Projetos" className="btn btn-outline">
                  ← Voltar para Projetos
               </Link>
            </div>
         </div>
      </div>
   )
}
