import api from './api'

export const Requests = {

    GetCollaborators : async () => {
        try {
            const response = await api.get('/collaborators');
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },

    GetImageCollaborators : async (id: string) => {
        try {
            const response = await api.get(`/collaborators/${id}/image`, {
                responseType: 'blob',
            });
 
            if (response.data && response.data.size > 0) {
                // Converter blob para base64 data URL
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result as string);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(response.data);
                });
            }
            return null;
        }catch (error: any) {
            throw error;
        }
    },

    // Busca imagem do colaborador pelo nome do arquivo (GET /collaborators/image/{name})
    GetCollaboratorImage: async (imageName: string): Promise<string | null> => {
        try {
            if (!imageName) return null;
            const response = await api.get(`/collaborators/image/${imageName}`, {
                responseType: 'blob',
            });
            if (response.data && response.data.size > 0) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(response.data);
                });
            }
            return null;
        } catch (error: any) {
            if (error?.response?.status === 404) return null;
            return null;
        }
    },

    GetCollaboratorById: async (id: string) => {
        try {
            const response = await api.get(`/collaborators/${id}`);
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },

    GetPosts : async () => {
        try {
            const response = await api.get('/posts');
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },

    GetPostById: async (id: string) => {
        try {
            const response = await api.get(`/posts/${id}`);
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },

    GetPostImage: async (imageName: string) => {
        try {
            if (!imageName) {
                return null;
            }
            
            const response = await api.get(`/posts/image/${imageName}`, {
                responseType: 'blob',
            });

            if (response.data && response.data.size > 0) {
                // Converter blob para base64 data URL
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result as string);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(response.data);
                });
            }
            return null;
        } catch (error: any) {
            return null;
        }
    },

    GetProjectImage: async (imageName: string): Promise<string | null> => {
        try {
            if (!imageName) return null;
            const response = await api.get(`/projects/image/${imageName}`, {
                responseType: 'blob',
            });
            if (response.data && response.data.size > 0) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(response.data);
                });
            }
            return null;
        } catch {
            return null;
        }
    },

    GetProjects : async () => {
        try {
            const response = await api.get('/projects');
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },

    // Busca foto de perfil de um autor pelo username via API de usuários
    GetAuthorAvatar: async (username: string): Promise<string | null> => {
        try {
            const basePath = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_BASE_URL || '') : ''
            // Step 1: busca dados do usuário para obter o nome do arquivo da foto
            const userRes = await fetch(`${basePath}/api/users/${encodeURIComponent(username)}`)
            if (!userRes.ok) return null
            const userData = await userRes.json()
            const picUrl: string | null = userData?.profilePictureUrl ?? null
            if (!picUrl) return null

            // Se já for URL completa, retorna diretamente
            if (picUrl.startsWith('http') || picUrl.startsWith('data:')) return picUrl

            // Step 2: busca o blob da foto pelo nome do arquivo
            const imgRes = await fetch(`${basePath}/api/users/profile-pic/${encodeURIComponent(picUrl)}`)
            if (!imgRes.ok) return null
            const blob = await imgRes.blob()
            if (!blob.size) return null
            return new Promise((resolve) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result as string)
                reader.onerror = () => resolve(null)
                reader.readAsDataURL(blob)
            })
        } catch {
            return null
        }
    },

}