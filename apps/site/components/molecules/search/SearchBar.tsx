'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface SearchBarProps {
   placeholder?: string
   className?: string
}

const SearchBar = ({ placeholder = 'Buscar', className = '' }: SearchBarProps) => {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const [searchValue, setSearchValue] = useState(searchParams.get('search') ?? '')
   const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
   const isTypingRef = useRef(false)

   // Sincroniza o input quando a URL muda externamente (ex: "Limpar busca")
   useEffect(() => {
      if (!isTypingRef.current) {
         setSearchValue(searchParams.get('search') ?? '')
      }
   }, [searchParams])

   const getSearchPage = (path: string) => {
      if (path.includes('/Projetos')) return '/Projetos'
      if (path.includes('/Colaboradores')) return '/Colaboradores'
      return '/Posts'
   }

   useEffect(() => {
      if (!isTypingRef.current) return
      if (debounceRef.current) clearTimeout(debounceRef.current)

      debounceRef.current = setTimeout(() => {
         isTypingRef.current = false
         const searchPage = getSearchPage(pathname)
         if (searchValue.trim()) {
            router.push(`${searchPage}?search=${encodeURIComponent(searchValue.trim())}`)
         } else {
            router.push(searchPage)
         }
      }, 400)

      return () => {
         if (debounceRef.current) clearTimeout(debounceRef.current)
      }
   }, [searchValue])

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (debounceRef.current) clearTimeout(debounceRef.current)
      const searchPage = getSearchPage(pathname)
      if (searchValue.trim()) {
         router.push(`${searchPage}?search=${encodeURIComponent(searchValue.trim())}`)
      } else {
         router.push(searchPage)
      }
   }

   return (
      <form onSubmit={handleSubmit} className={`bg-base-200 pl-4 pr-3 py-2 rounded-md flex items-center gap-4 ${className}`}>
         <input
            type="text"
            value={searchValue}
            onChange={(e) => { isTypingRef.current = true; setSearchValue(e.target.value) }}
            className="outline-none text-base-content bg-base-200 w-28 placeholder:font-work"
            placeholder={placeholder}
         />
         <button type="submit" className="cursor-pointer" aria-label="Buscar">
            <svg
               width="16"
               height="16"
               viewBox="0 0 16 16"
               fill="none"
               xmlns="http://www.w3.org/2000/svg"
            >
               <path
                  d="M6.90906 2C5.93814 2 4.98903 2.28791 4.18174 2.82733C3.37444 3.36674 2.74524 4.13343 2.37368 5.03045C2.00213 5.92746 1.90491 6.91451 2.09433 7.86677C2.28375 8.81904 2.75129 9.69375 3.43783 10.3803C4.12438 11.0668 4.99909 11.5344 5.95135 11.7238C6.90362 11.9132 7.89067 11.816 8.78768 11.4444C9.6847 11.0729 10.4514 10.4437 10.9908 9.63639C11.5302 8.8291 11.8181 7.87998 11.8181 6.90906C11.818 5.60712 11.3008 4.35853 10.3802 3.43792C9.45959 2.51731 8.211 2.00008 6.90906 2Z"
                  stroke="#52525B"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
               />
               <path
                  d="M10.5715 10.5716L14 14"
                  stroke="#52525B"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
               />
            </svg>
         </button>
      </form>
   )
}

export default SearchBar
