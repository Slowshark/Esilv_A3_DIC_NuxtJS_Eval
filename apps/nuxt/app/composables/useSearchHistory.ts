/**
 * Composable pour gérer l'historique des recherches via l'API (json-server).
 * Table : searchHistory — champs : id, query, createdAt
 */

export interface SearchHistoryEntry {
  id: number
  query: string
  createdAt: string
}

export interface SearchHistoryError {
  error: string
  status?: number
}

function getBase(): string {
  const config = useRuntimeConfig()
  return (config.public.apiBase as string).replace(/\/$/, '')
}

/**
 * Récupère l'historique trié du plus récent au plus ancien.
 */
export async function getSearchHistory(): Promise<SearchHistoryEntry[]> {
  const url = `${getBase()}/searchHistory?_sort=createdAt&_order=desc`
  try {
    const data = await $fetch<SearchHistoryEntry[]>(url)
    return Array.isArray(data) ? data : []
  } catch (e: unknown) {
    const err = e as { data?: { error?: string }; statusCode?: number }
    throw {
      error: err?.data?.error ?? (e instanceof Error ? e.message : "Erreur lors du chargement de l'historique"),
      status: err?.statusCode,
    } as SearchHistoryError
  }
}

/**
 * Ajoute une entrée dans l'historique après une recherche réussie.
 * Ne doit être appelé que si la requête est non vide.
 */
export async function addSearchHistory(query: string): Promise<SearchHistoryEntry> {
  const url = `${getBase()}/searchHistory`
  try {
    return await $fetch<SearchHistoryEntry>(url, {
      method: 'POST',
      body: { query, createdAt: new Date().toISOString() },
    })
  } catch (e: unknown) {
    const err = e as { data?: { error?: string }; statusCode?: number }
    throw {
      error: err?.data?.error ?? (e instanceof Error ? e.message : "Erreur lors de l'ajout dans l'historique"),
      status: err?.statusCode,
    } as SearchHistoryError
  }
}

/**
 * Supprime une entrée de l'historique par son id.
 */
export async function deleteSearchHistory(id: number): Promise<void> {
  const url = `${getBase()}/searchHistory/${id}`
  try {
    await $fetch(url, { method: 'DELETE' })
  } catch (e: unknown) {
    const err = e as { data?: { error?: string }; statusCode?: number }
    throw {
      error: err?.data?.error ?? (e instanceof Error ? e.message : "Erreur lors de la suppression"),
      status: err?.statusCode,
    } as SearchHistoryError
  }
}
