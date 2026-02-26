import Link from 'next/link'
import React from 'react'
import type { Project } from '@/data/projectsData'

interface ProjectCardProps {
   project: Project
}

/**
 * Our ProjectCard is a reusable UI component used to display a project as a card format.
 *
 * @property featured image, category name, a heading, description, technologies used, and link.
 * @param project - Project data object containing all project information
 *
 * @returns React component that can be easily integrated into any web application.
 */

const ProjectCard = ({ project }: ProjectCardProps) => {
   return (
      <div className="card w-[392px] bg-base-200 p-4 border border-base-content/10 rounded-xl font-work overflow-hidden">
         <figure>
            {project.image ? (
               <img
                  src={project.image}
                  alt={project.title}
                  className="rounded-xl object-cover w-[360px] h-[240px]"
                  width={360}
                  height={240}
               />
            ) : (
               <div className="rounded-xl bg-base-300 flex items-center justify-center" style={{ width: 360, height: 240 }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-base-content/20">
                     <rect x="3" y="3" width="18" height="18" rx="2"/>
                     <circle cx="8.5" cy="8.5" r="1.5"/>
                     <polyline points="21,15 16,10 5,21"/>
                  </svg>
               </div>
            )}
         </figure>
         <div className="card-body py-6 px-2 flex flex-col gap-4">
            <span className=" no-animation bg-primary/5 border-0 text-primary text-sm px-3 py-2 min-h-fit h-fit rounded-md w-fit capitalize font-medium">
               {project.category}
            </span>
            <h3>
               <Link
                  href={`/Projetos/${project.slug}`}
                  className="text-base-content hover:text-primary transition-all duration-300 ease-in-out font-semibold text-lg md:text-xl lg:text-2xl line-clamp-2"
               >
                  {project.title}
               </Link>
            </h3>
            <p className="text-base-content/70 text-sm md:text-base line-clamp-2 break-words overflow-hidden">
               {project.description}
            </p>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2">
               {project.technologies.slice(0, 3).map((tech, index) => (
                  <span
                     key={index}
                     className="badge badge-sm badge-outline text-xs font-medium"
                  >
                     {tech}
                  </span>
               ))}
               {project.technologies.length > 3 && (
                  <span className="badge badge-sm badge-outline text-xs font-medium">
                     +{project.technologies.length - 3}
                  </span>
               )}
            </div>
         </div>
      </div>
   )
}

export default ProjectCard
