'use client'

import { usePosts } from '@/hooks/usePosts'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface PostDetailPageProps {
   params: {
      slug: string
   }
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
   const { posts, loading, error } = usePosts()
   
   const post = posts.find((p) => p.slug === params.slug)

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

   if (!post) {
      notFound()
   }

   // Pega 3 posts relacionados aleatoriamente (excluindo o post atual)
   const relatedPosts = posts
      .filter((p) => p.id !== post.id)
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
                     <Link href="/Posts" className="link link-hover">
                        Posts
                     </Link>
                  </li>
                  <li className="text-base-content/70">{post.title}</li>
               </ul>
            </div>

            {/* Banner Image */}
            <div className="mb-8 w-full overflow-hidden rounded-lg">
               <img
                  src={post.bannerImage || post.image}
                  alt={post.title}
                  className="h-96 w-full object-cover"
               />
            </div>

            {/* Article Header */}
            <article className="prose prose-invert max-w-4xl">
               <div className="mb-6">
                  <div className="mb-3 flex items-center gap-2">
                     <span className="badge badge-primary">{post.category}</span>
                     <span className="text-sm text-base-content/60">{post.date}</span>
                  </div>

                  <h1 className="mb-4 text-4xl font-bold text-base-content">
                     {post.title}
                  </h1>

                  {/* Author Info */}
                  <div className="flex items-center gap-3 rounded-lg bg-base-200 p-4">
                     <div className="avatar">
                        <div className="w-12 rounded-full">
                           <img src={post.author.avatar} alt={post.author.name} />
                        </div>
                     </div>
                     <div>
                        <p className="font-semibold text-base-content">
                           {post.author.name}
                        </p>
                        <p className="text-sm text-base-content/60">
                           Publicado em {post.date}
                        </p>
                     </div>
                  </div>
               </div>

               {/* Content */}
               <div className="divider"></div>
               {post.content?.blocks?.length > 0 ? (
                  post.content.blocks.map((block: any, index: number) => {
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
               ) : null}
               <div className="divider"></div>
            </article>

            {/* Related Posts */}
            <section className="mt-12">
               <h2 className="mb-6 text-2xl font-bold text-base-content">Outros Posts</h2>
               <div className="grid gap-6 md:grid-cols-3">
                  {relatedPosts.map((relatedPost) => (
                     <Link key={relatedPost.id} href={`/Posts/${relatedPost.slug}`}>
                        <div className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow">
                           <figure className="h-40 w-full overflow-hidden">
                              <img
                                 src={relatedPost.image}
                                 alt={relatedPost.title}
                                 className="h-full w-full object-cover"
                              />
                           </figure>
                           <div className="card-body p-4">
                              <span className="badge badge-sm badge-primary mb-2">
                                 {relatedPost.category}
                              </span>
                              <h3 className="card-title line-clamp-1 text-base text-base-content">
                                 {relatedPost.title}
                              </h3>
                              <p className="text-xs text-base-content/60">{relatedPost.date}</p>
                           </div>
                        </div>
                     </Link>
                  ))}
               </div>
            </section>

            {/* Back Button */}
            <div className="mt-12">
               <Link href="/Posts" className="btn btn-outline">
                  ← Voltar para Posts
               </Link>
            </div>
         </div>
      </div>
   )
}

