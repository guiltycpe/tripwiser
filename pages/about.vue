<script setup lang="ts">
const { t } = useTranslations()
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-slate-900">
    <!-- Hero -->
    <section class="section bg-slate-50 dark:bg-slate-800 text-center">
      <div class="mx-auto max-w-4xl animate-fade-in">
        <h1 class="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-5xl">
          {{ t.about.hero.title }}
        </h1>
        <p class="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
          {{ t.about.hero.subtitle }}
        </p>
      </div>
    </section>

    <!-- Mission -->
    <section class="section">
      <div class="mx-auto max-w-4xl text-center">
        <h2 class="text-3xl font-semibold text-slate-900 dark:text-slate-100">{{ t.about.mission.title }}</h2>
        <p class="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
          {{ t.about.mission.description }}
        </p>
      </div>
    </section>

    <!-- Story -->
    <section class="section section-alt">
      <div class="mx-auto max-w-6xl">
        <div class="grid gap-12 md:grid-cols-2 items-center">
          <div>
            <h2 class="text-3xl font-semibold text-slate-900 dark:text-slate-100">{{ t.about.story.title }}</h2>
            <div class="mt-6 space-y-4 text-slate-600 dark:text-slate-400">
              <p>{{ t.about.story.p1 }}</p>
              <p>{{ t.about.story.p2 }}</p>
              <p>{{ t.about.story.p3 }}</p>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
            <div class="space-y-6">
              <div class="flex items-center gap-4">
                <div class="rounded-xl bg-teal-50 dark:bg-teal-900/30 p-3">
                  <Icon name="heroicons:users-20-solid" class="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <div class="text-2xl font-semibold text-slate-900 dark:text-slate-100">10,000+</div>
                  <div class="text-sm text-slate-500 dark:text-slate-400">{{ t.about.stats.activeUsers }}</div>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div class="rounded-xl bg-indigo-50 dark:bg-indigo-900/30 p-3">
                  <Icon name="heroicons:map-pin-20-solid" class="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <div class="text-2xl font-semibold text-slate-900 dark:text-slate-100">50,000+</div>
                  <div class="text-sm text-slate-500 dark:text-slate-400">{{ t.about.stats.tripsPlanned }}</div>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div class="rounded-xl bg-amber-50 dark:bg-amber-900/30 p-3">
                  <Icon name="heroicons:globe-alt-20-solid" class="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <div class="text-2xl font-semibold text-slate-900 dark:text-slate-100">150+</div>
                  <div class="text-sm text-slate-500 dark:text-slate-400">{{ t.about.stats.countries }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="section">
      <div class="mx-auto max-w-7xl">
        <h2 class="text-center text-3xl font-semibold text-slate-900 dark:text-slate-100">{{ t.about.values.title }}</h2>

        <div class="mt-12 grid gap-6 md:grid-cols-3">
          <div class="text-center p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
            <div class="mb-4 inline-flex rounded-xl bg-teal-50 dark:bg-teal-900/30 p-3">
              <Icon name="heroicons:sparkles-20-solid" class="h-7 w-7 text-teal-600" />
            </div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">{{ t.about.values.innovation }}</h3>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{{ t.about.values.innovation_desc }}</p>
          </div>

          <div class="text-center p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
            <div class="mb-4 inline-flex rounded-xl bg-indigo-50 dark:bg-indigo-900/30 p-3">
              <Icon name="heroicons:heart-20-solid" class="h-7 w-7 text-indigo-600" />
            </div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">{{ t.about.values.quality }}</h3>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{{ t.about.values.quality_desc }}</p>
          </div>

          <div class="text-center p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
            <div class="mb-4 inline-flex rounded-xl bg-amber-50 dark:bg-amber-900/30 p-3">
              <Icon name="heroicons:user-group-20-solid" class="h-7 w-7 text-amber-600" />
            </div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">{{ t.about.values.community }}</h3>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{{ t.about.values.community_desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="section section-alt">
      <div class="mx-auto max-w-4xl text-center">
        <h2 class="text-3xl font-semibold text-slate-900 dark:text-slate-100">{{ t.about.team.title }}</h2>
        <p class="mt-4 text-slate-600 dark:text-slate-400">{{ t.about.team.description }}</p>

        <div class="mt-12 grid gap-6 sm:grid-cols-3">
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div class="mx-auto h-20 w-20 rounded-full bg-teal-100 dark:bg-teal-900/40 mb-4"></div>
            <h3 class="font-semibold text-slate-900 dark:text-slate-100">{{ t.about.team.founding }}</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ t.about.team.founding_desc }}</p>
          </div>
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div class="mx-auto h-20 w-20 rounded-full bg-indigo-100 dark:bg-indigo-900/40 mb-4"></div>
            <h3 class="font-semibold text-slate-900 dark:text-slate-100">{{ t.about.team.design }}</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ t.about.team.design_desc }}</p>
          </div>
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div class="mx-auto h-20 w-20 rounded-full bg-amber-100 dark:bg-amber-900/40 mb-4"></div>
            <h3 class="font-semibold text-slate-900 dark:text-slate-100">{{ t.about.team.support }}</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ t.about.team.support_desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section text-center">
      <div class="mx-auto max-w-3xl">
        <h2 class="text-3xl font-semibold text-slate-900 dark:text-slate-100">{{ t.home.cta.title }}</h2>
        <p class="mt-4 text-slate-600 dark:text-slate-400">{{ t.home.cta.subtitle }}</p>
        <div class="mt-8">
          <NuxtLink to="/plan" class="btn-primary px-6 py-3 text-sm">{{ t.home.cta.button }}</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
