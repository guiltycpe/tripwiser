<template>
  <!--
    On ajoute un conteneur principal pour la page d'accueil.
    - `pt-24` (padding-top) est la clé : il crée l'espace nécessaire en haut
      pour que le contenu ne soit pas caché par la barre de navigation et le logo qui dépasse.
    - `text-center` centre tout le contenu.
  -->
  <div class="px-6 py-24 text-center">

    <!-- Titre principal -->
    <h1 class="text-5xl font-bold tracking-tight text-gray-900">
      Plan your trip wisely
    </h1>

    <!-- Sous-titre -->
    <p class="mt-6 text-lg leading-8 text-gray-600">
      Discover places and activities, and <br>
      create smart itineraries for your travels
    </p>

    <!-- Formulaire de départ -->
    <div class="mx-auto mt-10 max-w-md">
      <div class="rounded-xl border bg-white p-6 shadow-sm">
        <p class="text-left font-semibold text-gray-900">Departure city</p>
        <div class="mt-2 flex items-center gap-4">
          <!-- Champ de saisie -->
          <div class="relative flex-1">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <!-- Icône de maison (similaire à l'image) -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5 text-gray-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
              </svg>
            </div>
            <input
                type="text"
                placeholder="Paris"
                class="w-full rounded-full border-gray-300 py-3 pl-10 pr-4 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-teal-500"
            />
          </div>
          <!-- Bouton -->
          <button class="flex-shrink-0 rounded-full bg-teal-500 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-600">
            Start planning
          </button>
        </div>
      </div>
    </div>
  </div>
</template>