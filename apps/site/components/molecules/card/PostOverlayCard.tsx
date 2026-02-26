import React from 'react'
import Link from 'next/link'
import type { Post } from '@/data/postsData'

interface PostOverlayCardProps {
   post: Post
}

/**
 * Our PostOverlayCard is a reusable UI component used to display a post as a card format with overlay.
 *
 * @property featured image, category name, a heading, author image, author name, and publication date.
 * @param post - Post data object containing all post information
 *
 * @returns React component that can be easily integrated into any web application.
 */

const PostOverlayCard = ({ post }: PostOverlayCardProps) => {
   const imageSrc = post.bannerImage || post.image
   return (
      <div className="card relative font-work overflow-hidden rounded-xl" style={{ maxHeight: '320px' }}>
         {/* Card Image */}
         <figure className="w-full h-[320px] overflow-hidden">
            {imageSrc ? (
               <img
                  alt={post.title}
                  src={imageSrc}
                  className="w-full h-full object-cover"
               />
            ) : (
               <div className="w-full h-full bg-base-200 flex items-center justify-center">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-base-content/20">
                     <rect x="3" y="3" width="18" height="18" rx="2"/>
                     <circle cx="8.5" cy="8.5" r="1.5"/>
                     <polyline points="21,15 16,10 5,21"/>
                  </svg>
               </div>
            )}
         </figure>
         <div className="card-body p-4 md:p-8 absolute bottom-0 w-full md:w-8/12 z-20">
            <div className="w-fit text-white px-2.5 py-1 bg-primary text-xs md:text-sm rounded-md mb-2 md:mb-4 font-medium">
               {post.category}
            </div>
            <h3>
               <Link
                  href={`/Posts/${post.slug}`}
                  className="text-neutral-content font-semibold text-xl md:text-2xl lg:text-4xl leading-5 md:leading-10 hover:text-primary transition hover:duration-500"
               >
                  {post.title}
               </Link>
            </h3>
            <div className="mt-3 md:mt-6 flex justify-evenly items-center gap-5 text-neutral-content ">
               <div className=" flex items-center gap-3">
                  <div className="avatar">
                     <div className="w-9 rounded-full">
                        <img src={post.author.avatar} alt={post.author.name} />
                     </div>
                  </div>
                  <h5>
                     <Link
                        href="/"
                        className="text-xs md:text-base font-medium hover:text-primary transition hover:duration-300"
                     >
                        {post.author.name}
                     </Link>
                  </h5>
               </div>
               <p className=" text-xs md:text-base">{post.date}</p>
            </div>
         </div>

         {/*  overlay */}
         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
      </div>
   )
}

export default PostOverlayCard
