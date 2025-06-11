<template>
  <!-- L'en-tête principal. On ajoute h-16 pour lui donner une hauteur fixe et on retire la bordure d'ici. -->
  <header class="relative bg-white">
    <!--
      Conteneur principal. On ajoute position: relative pour que le logo (en position absolute)
      se positionne par rapport à lui.
    -->
    <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

      <!--
        On utilise flex-1 pour que ces deux conteneurs prennent une part égale de l'espace,
        laissant le milieu "visuellement" vide pour le logo.
      -->

      <!-- 1. Section de Navigation (Gauche) -->
      <div class="flex-1">
        <nav class="hidden gap-6 md:flex">
          <NuxtLink to="/" class="nav-link">Home</NuxtLink>
          <NuxtLink to="/features" class="nav-link">Features</NuxtLink>
          <NuxtLink to="/pricing" class="nav-link">Pricing</NuxtLink>
          <NuxtLink to="/about" class="nav-link">About</NuxtLink>
        </nav>
      </div>

      <!-- 2. Logo (Centre, positionné absolument) -->
      <!--
        - `absolute`: Sort l'élément du flux normal.
        - `left-1/2 -translate-x-1/2`: Le centre horizontalement.
        - `top-4`: Le pousse vers le bas pour qu'il dépasse.
        - `bg-white rounded-full p-2 shadow-lg`: Crée le cercle blanc, le padding et l'ombre pour le faire ressortir.
        - `z-10`: S'assure qu'il est au-dessus de la bordure et des autres éléments.
      -->
      <NuxtLink
          to="/"
          class="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-white p-2 shadow-lg"
      >
        <img src="~/assets/images/logo.png" alt="TripWiser Logo" class="h-14 w-14">
      </NuxtLink>

      <!-- 3. Contrôles Utilisateur (Droite) -->
      <!-- On justifie le contenu à la fin (droite) de ce conteneur flex-1 -->
      <div class="flex-1">
        <div class="flex items-center justify-end gap-4">
          <select v-model="lang" class="border-0 bg-transparent text-sm text-gray-600 focus:ring-0">
            <option value="en-US">English (United States)</option>
            <option value="fr-FR">Français</option>
          </select>
          <button class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50">
            Log in
          </button>
          <button class="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600">
            Sign up
          </button>
        </div>
      </div>
    </div>
    <!-- On met la bordure sur un élément séparé pour que le logo puisse passer "par-dessus" -->
    <div class="w-full border-b border-gray-200"></div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const lang = ref('en-US')
</script>

<style scoped>
.nav-link {
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease-in-out;
}

.nav-link:hover {
  color: #111827;
}

.router-link-exact-active {
  color: #000000;
  font-weight: 600;
}
</style>