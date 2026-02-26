import { usePosts } from './usePosts'

export const usePostCategories = () => {
   const { posts, loading, error } = usePosts()

   // Extrair categorias únicas dos posts
   const categories = posts.reduce((uniqueCategories: string[], post) => {
      if (!uniqueCategories.includes(post.category)) {
         uniqueCategories.push(post.category)
      }
      return uniqueCategories
   }, []).sort() // Ordenar alfabeticamente

   // Gerar dados do footer no formato esperado
   const footerCategoryData = categories.map(category => ({
      name: category,
      link: `/Posts?category=${encodeURIComponent(category)}`
   }))

   return {
      categories,
      footerCategoryData,
      loading,
      error
   }
}