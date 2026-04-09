<script setup lang="ts">
import type { SearchHistoryEntry } from '~/composables/useSearchHistory'
import { TrashIcon, ClockIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{ entry: SearchHistoryEntry }>()
const emit = defineEmits<{
  relance: [query: string]
  delete: [id: number]
}>()

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <li
    class="flex items-center justify-between gap-4 bg-white border border-gray-200 rounded-lg px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
  >
    <div class="flex items-center gap-3 min-w-0">
      <ClockIcon class="h-5 w-5 text-gray-400 shrink-0" />
      <div class="min-w-0">
        <p class="font-medium text-gray-900 truncate">"{{ props.entry.query }}"</p>
        <p class="text-xs text-gray-400 mt-0.5">{{ formatDate(props.entry.createdAt) }}</p>
      </div>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <button
        type="button"
        class="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
        title="Relancer cette recherche"
        @click="emit('relance', props.entry.query)"
      >
        <MagnifyingGlassIcon class="h-4 w-4" />
        Relancer
      </button>
      <button
        type="button"
        class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        title="Supprimer cette entrée"
        @click="emit('delete', props.entry.id)"
      >
        <TrashIcon class="h-4 w-4" />
      </button>
    </div>
  </li>
</template>
