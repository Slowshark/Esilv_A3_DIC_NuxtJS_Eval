<template>
  <main class="max-w-4xl mx-auto px-4 py-8">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Historique de recherche</h1>
      <p class="text-gray-600">Retrouvez toutes vos recherches précédentes et relancez-les en un clic.</p>
    </header>

    <div class="flex flex-col gap-4">
      
      <div v-if="mockHistory.length === 0" class="bg-gray-50 border border-gray-200 rounded-lg p-10 text-center">
        <p class="text-gray-500 text-lg">Vous n'avez effectué aucune recherche pour le moment.</p>
      </div>

      <div 
        v-for="search in mockHistory" 
        :key="search.id" 
        class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow"
      >
        <div>
          <h2 class="text-xl font-semibold text-gray-800">"{{ search.query }}"</h2>
          <span class="text-sm text-gray-500">Recherché le {{ search.date }}</span>
        </div>
        
        <div class="flex items-center gap-3">
          <NuxtLink 
            :to="{ path: '/offers', query: { q: search.query } }" 
            class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          >
            Relancer
          </NuxtLink>
          
          <button 
            class="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors shadow-sm"
          >
            Supprimer
          </button>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'

const mockHistory = ref([
  { id: 1, query: 'Développeur Front-end Vue.js', date: '09/04/2026' },
  { id: 2, query: 'Stage Data Analyst', date: '08/04/2026' },
  { id: 3, query: 'Alternance UX/UI Design', date: '05/04/2026' }
])
</script>