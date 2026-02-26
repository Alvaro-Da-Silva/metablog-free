'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { headerData } from '@/staticData/headerData'
import useMode from '@/utils/themeMode'
import MobileNav from './MobileNav'
import Logo from '@/public/logo-labtec-sem-texto.png'
import SearchBar from '../../molecules/search/SearchBar'


/**
 * Our Header is a reusable UI component that used to represent top navbar section of any website.
 *
 * @property website logo, all page title with navigation link, search field  and a theme changing button.
 *
 * @returns React component that can be easily integrated into any web application.
 */
const Header = () => {
   const { theme, setTheme, themes, hydrationError } = useMode()

   const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false)

   return (
      <header className="py-5">
         <div className="container mx-auto font-work">
            <div className="navbar grid grid-cols-12">
               <div className="col-span-3 xl:col-span-3 flex items-center gap-2">
                  <Link className='flex items-center gap-2 ' href={`/`}>
                     <Image
                      src={Logo}
                      alt='logo'
                      width={50}
                      height={50}
                     />
                     <p className='text-3xl'>Labtec</p>
                  </Link>
               </div>
               <nav className="hidden xl:block col-span-6">
                  <div className=" w-full flex items-center justify-center gap-10">
                     {headerData.map((item: any, index: number) => (
                        <div key={index}>
                           <Link
                              href={item.link}
                              className="link link-hover text-base text-base-content/80 hover:text-primary transition hover:duration-300"
                           >
                              {item.name}
                           </Link>
                        </div>
                     ))}
                  </div>
               </nav>
               <div className="flex items-center justify-end xl:justify-center gap-10 col-span-9 xl:col-span-3">
                  {/* Search Block */}
                  <SearchBar className="hidden sm:flex" />

                  {/* Theme toggle */}
                  <button
                     onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                     className="btn btn-ghost btn-circle"
                     aria-label="Alternar tema"
                  >
                     {theme === 'light' ? (
                        /* Sol — tema light */
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-base-content">
                           <circle cx="12" cy="12" r="4"/>
                           <line x1="12" y1="2" x2="12" y2="4"/>
                           <line x1="12" y1="20" x2="12" y2="22"/>
                           <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                           <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                           <line x1="2" y1="12" x2="4" y2="12"/>
                           <line x1="20" y1="12" x2="22" y2="12"/>
                           <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                           <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                        </svg>
                     ) : (
                        /* Lua — tema dark */
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-base-content">
                           <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        </svg>
                     )}
                  </button>

                  {/* Responsive Sidebar Menu */}
                  <svg
                     onClick={() => setSidebarOpen(!sidebarOpen)}
                     className="cursor-pointer w-8 h-8 xl:hidden text-base-content"
                     width="20"
                     height="20"
                     viewBox="0 0 20 20"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg"
                  >
                     <path
                        d="M3.33301 5H16.6663M3.33301 10H16.6663M3.33301 15H16.6663"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                     />
                  </svg>
               </div>
            </div>
            {/* Responsive Sidebar Layout */}
            <MobileNav
               sidebarOpen={sidebarOpen}
               setSidebarOpen={setSidebarOpen}
            />
         </div>
      </header>
   )
}

export default Header
