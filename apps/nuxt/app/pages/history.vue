<script setup lang="ts">
import type { SearchHistoryEntry } from '~/composables/useSearchHistory'
import { TrashIcon, ClockIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

useSeoMeta({
  title: 'Historique des recherches',
  description: 'Consultez et gérez vos recherches passées.',
})

const router = useRouter()
const history = ref<SearchHistoryEntry[]>([])
const isLoading = ref(true)
const isError = ref(false)
const errorMessage = ref('')

async function loadHistory() {
  isLoading.value = true
  isError.value = false
  errorMessage.value = ''
  try {
    history.value = await getSearchHistory()
  } catch (e: unknown) {
    const err = e as { error?: string }
    isError.value = true
    errorMessage.value = err?.error ?? "Erreur lors du chargement de l'historique"
  } finally {
    isLoading.value = false
  }
}

async function handleDelete(id: number) {
  try {
    await deleteSearchHistory(id)
    history.value = history.value.filter((entry) => entry.id !== id)
  } catch (e: unknown) {
    const err = e as { error?: string }
    errorMessage.value = err?.error ?? 'Erreur lors de la suppression'
  }
}

function relaunchSearch(query: string) {
  router.push({ path: '/results', query: { q: query } })
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(loadHistory)
</script>

<template>
  <div class="min-h-[calc(100vh-200px)] bg-linear-to-b from-blue-50 to-white">
    <div class="container mx-auto px-4 py-12">
      <div class="text-center mb-10">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Historique des recherches</h1>
        <p class="text-lg text-gray-600">Retrouvez et relancez vos recherches passées.</p>
      </div>

      <!-- Spinner -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Erreur -->
      <div v-else-if="isError" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p class="text-red-800 font-medium">{{ errorMessage }}</p>
        <button
          type="button"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          @click="loadHistory"
        >
          Réessayer
        </button>
      </div>

      <!-- Aucun historique -->
      <div v-else-if="history.length === 0" class="text-center py-20">
        <ClockIcon class="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500 text-lg">Aucune recherche enregistrée pour le moment.</p>
        <NuxtLink to="/results" class="mt-4 inline-block text-blue-600 hover:text-blue-700 underline">
          Lancer une première recherche
        </NuxtLink>
      </div>

      <!-- Liste -->
      <ul v-else class="max-w-2xl mx-auto space-y-3">
        <li
          v-for="entry in history"
          :key="entry.id"
          class="flex items-center justify-between gap-4 bg-white border border-gray-200 rounded-lg px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="flex items-center gap-3 min-w-0">
            <ClockIcon class="h-5 w-5 text-gray-400 shrink-0" />
            <div class="min-w-0">
              <p class="font-medium text-gray-900 truncate">"{{ entry.query }}"</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ formatDate(entry.createdAt) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              class="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              title="Relancer cette recherche"
              @click="relaunchSearch(entry.query)"
            >
              <MagnifyingGlassIcon class="h-4 w-4" />
              Relancer
            </button>
            <button
              type="button"
              class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Supprimer cette entrée"
              @click="handleDelete(entry.id)"
            >
              <TrashIcon class="h-4 w-4" />
            </button>
          </div>
        </li>
      </ul>

      <!-- Message d'erreur inline (suppression) -->
      <p v-if="errorMessage && !isError" class="text-center text-red-600 mt-6 text-sm">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>
