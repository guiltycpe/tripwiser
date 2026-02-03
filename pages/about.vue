<script setup lang="ts">
const { t } = useTranslations()
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="section bg-gradient-to-br from-cyan-50 via-teal-50 to-green-50 text-center">
      <div class="mx-auto max-w-4xl animate-fade-in">
        <h1 class="text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
          {{ t.about.hero.title }}
        </h1>
        <p class="mt-6 text-xl leading-8 text-gray-600">
          {{ t.about.hero.subtitle }}
        </p>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="section">
      <div class="mx-auto max-w-4xl text-center">
        <h2 class="text-4xl font-bold text-gray-900">{{ t.about.mission.title }}</h2>
        <p class="mt-6 text-lg leading-8 text-gray-600">
          {{ t.about.mission.description }}
        </p>
      </div>
    </section>

    <!-- Story Section -->
    <section class="section section-alt">
      <div class="mx-auto max-w-6xl">
        <div class="grid gap-12 md:grid-cols-2 items-center">
          <div class="animate-slide-up">
            <h2 class="text-4xl font-bold text-gray-900">{{ t.about.story.title }}</h2>
            <div class="mt-6 space-y-4 text-gray-600">
              <p>{{ t.about.story.p1 }}</p>
              <p>{{ t.about.story.p2 }}</p>
              <p>{{ t.about.story.p3 }}</p>
            </div>
          </div>
          
          <div class="glass rounded-2xl p-8 animate-slide-up delay-200">
            <div class="space-y-6">
              <div class="flex items-center gap-4">
                <div class="rounded-full bg-teal-100 p-3">
                  <Icon name="heroicons:users-20-solid" class="h-8 w-8 text-teal-600" />
                </div>
                <div>
                  <div class="text-3xl font-bold text-gray-900">10,000+</div>
                  <div class="text-gray-600">{{ t.about.stats.activeUsers }}</div>
                </div>
              </div>
              
              <div class="flex items-center gap-4">
                <div class="rounded-full bg-purple-100 p-3">
                  <Icon name="heroicons:map-pin-20-solid" class="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <div class="text-3xl font-bold text-gray-900">50,000+</div>
                  <div class="text-gray-600">{{ t.about.stats.tripsPlanned }}</div>
                </div>
              </div>
              
              <div class="flex items-center gap-4">
                <div class="rounded-full bg-orange-100 p-3">
                  <Icon name="heroicons:globe-alt-20-solid" class="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <div class="text-3xl font-bold text-gray-900">150+</div>
                  <div class="text-gray-600">{{ t.about.stats.countries }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="section">
      <div class="mx-auto max-w-7xl">
        <h2 class="text-center text-4xl font-bold text-gray-900">{{ t.about.values.title }}</h2>
        
        <div class="mt-12 grid gap-8 md:grid-cols-3">
          <!-- Value 1 -->
          <div class="card-hover text-center animate-slide-up">
            <div class="mb-4 inline-flex rounded-xl bg-teal-50 p-4">
              <Icon name="heroicons:sparkles-20-solid" class="h-10 w-10 text-teal-600" />
            </div>
            <h3 class="text-xl font-bold text-gray-900">{{ t.about.values.innovation }}</h3>
            <p class="mt-3 text-gray-600">
              {{ t.about.values.innovation_desc }}
            </p>
          </div>

          <!-- Value 2 -->
          <div class="card-hover text-center animate-slide-up delay-100">
            <div class="mb-4 inline-flex rounded-xl bg-purple-50 p-4">
              <Icon name="heroicons:heart-20-solid" class="h-10 w-10 text-purple-600" />
            </div>
            <h3 class="text-xl font-bold text-gray-900">{{ t.about.values.quality }}</h3>
            <p class="mt-3 text-gray-600">
              {{ t.about.values.quality_desc }}
            </p>
          </div>

          <!-- Value 3 -->
          <div class="card-hover text-center animate-slide-up delay-200">
            <div class="mb-4 inline-flex rounded-xl bg-orange-50 p-4">
              <Icon name="heroicons:user-group-20-solid" class="h-10 w-10 text-orange-600" />
            </div>
            <h3 class="text-xl font-bold text-gray-900">{{ t.about.values.community }}</h3>
            <p class="mt-3 text-gray-600">
              {{ t.about.values.community_desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="section section-alt">
      <div class="mx-auto max-w-4xl text-center">
        <h2 class="text-4xl font-bold text-gray-900">{{ t.about.team.title }}</h2>
        <p class="mt-4 text-lg text-gray-600">{{ t.about.team.description }}</p>
        
        <div class="mt-12 grid gap-8 sm:grid-cols-3">
          <div class="glass rounded-xl p-6">
            <div class="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 mb-4"></div>
            <h3 class="font-bold text-gray-900">{{ t.about.team.founding }}</h3>
            <p class="text-sm text-gray-600">{{ t.about.team.founding_desc }}</p>
          </div>
          <div class="glass rounded-xl p-6">
            <div class="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 mb-4"></div>
            <h3 class="font-bold text-gray-900">{{ t.about.team.design }}</h3>
            <p class="text-sm text-gray-600">{{ t.about.team.design_desc }}</p>
          </div>
          <div class="glass rounded-xl p-6">
            <div class="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-orange-400 to-red-400 mb-4"></div>
            <h3 class="font-bold text-gray-900">{{ t.about.team.support }}</h3>
            <p class="text-sm text-gray-600">{{ t.about.team.support_desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section text-center">
      <div class="mx-auto max-w-3xl">
        <h2 class="text-4xl font-bold text-gray-900">{{ t.home.cta.title }}</h2>
        <p class="mt-4 text-lg text-gray-600">
          {{ t.home.cta.subtitle }}
        </p>
        <div class="mt-8">
          <NuxtLink to="/plan" class="btn-primary px-8 py-4 text-lg">
            {{ t.home.cta.button }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>