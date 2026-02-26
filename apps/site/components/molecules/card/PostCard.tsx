import Link from 'next/link'
import React from 'react'
import type { Post } from '@/data/postsData'

interface PostCardProps {
   post: Post
}

/**
 * Our PostCard is a reusable UI component used to display a post as a card format.
 *
 * @property featured image, category name, a heading, author image, author name, and publication date.
 * @param post - Post data object containing all post information
 *
 * @returns React component that can be easily integrated into any web application.
 */

const PostCard = ({ post }: PostCardProps) => {
   console.log('PostCard renderizado:', post) // Log para verificar os dados do post
   return (
      <div className="card w-fit p-4 border border-base-content/10 rounded-xl font-work">
         <figure>
            {post.image ? (
               <img
                  src={post.image}
                  alt={post.title}
                  className="rounded-xl object-cover w-[360px] h-[240px]"
               />
            ) : (
               <div className="rounded-xl bg-base-200 flex items-center justify-center" style={{ width: 360, height: 240 }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-base-content/20">
                     <rect x="3" y="3" width="18" height="18" rx="2"/>
                     <circle cx="8.5" cy="8.5" r="1.5"/>
                     <polyline points="21,15 16,10 5,21"/>
                  </svg>
               </div>
            )}
         </figure>
         <div className="card-body py-5 px-2 flex flex-col gap-3 w-[360px]">
            <span className="no-animation bg-primary/5 border-0 text-primary text-xs px-3 py-1.5 min-h-fit h-fit rounded-md w-fit capitalize font-medium">
               {post.category}
            </span>
            <h3>
               <Link
                  href={`/Posts/${post.slug}`}
                  className="text-base-content hover:text-primary transition-all duration-300 ease-in-out font-semibold text-lg md:text-xl line-clamp-2"
               >
                  {post.title}
               </Link>
            </h3>
            <div className="mt-5 border-base-content/10 flex items-center gap-28 text-base-content">
               <div className="flex items-center gap-2.5">
                  <div className="avatar">
                     <div className="w-8 rounded-full">
                        <img src={post.author.avatar} />
                     </div>
                  </div>
                  <p
                     className="text-sm font-medium text-base-content/70 hover:text-primary transition hover:duration-300"
                  >
                     {post.author.name}
                  </p>
               </div>
               <p className="text-xs text-base-content/50">{post.date}</p>
            </div>
         </div>
      </div>
   )
}

export default PostCard
