<template>
  <div>
    <div class="card card-glass mb-8">
      <div class="card-body p-4 sm:p-6">
        <div class="flex flex-col gap-3">
          <div class="relative">
            <Icon name="search" :size="16" cls="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              v-model="query"
              type="text"
              placeholder="e.g. restaurants near Moscone Center"
              class="input input-bordered w-full pl-10"
              @keydown.enter="search"
            />
          </div>
          <div class="flex flex-col xs:flex-row gap-3">
            <LocationPicker v-model:location="location" @search="search" />
            <button :class="['btn btn-primary', { 'btn-disabled': loading }]" @click="search">
              <Icon v-if="!loading" name="search" />
              <span v-else class="loading loading-spinner loading-sm" />
              Search
            </button>
          </div>
        </div>
        <p v-if="error" class="text-error mt-1 text-sm">{{ error }}</p>
      </div>
    </div>

    <div v-if="results.length" class="mt-4">
      <p class="text-sm text-base-content/50 mb-4">{{ results.length }} places found</p>
      <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="place in results"
          :key="place.name"
          class="card card-glass-solid hover:-translate-y-1 transition-all duration-200"
        >
          <div v-if="place.thumbnail" class="px-4 pt-4">
            <img
              :src="place.thumbnail"
              :alt="place.name"
              class="w-full h-40 object-cover rounded-xl"
            />
          </div>
          <div v-else class="px-4 pt-4">
            <div class="w-full h-40 rounded-xl bg-base-200 flex items-center justify-center">
              <Icon name="utensils-crossed" :size="40" cls="opacity-20" />
            </div>
          </div>
          <div class="card-body gap-1">
            <h3 class="card-title text-base leading-tight">{{ place.name }}</h3>

            <div class="flex items-center gap-2 text-sm flex-wrap">
              <span v-if="place.rating" class="badge badge-accent badge-sm gap-1">
                <Icon name="star" :size="10" /> {{ place.rating }}
              </span>
              <span v-if="place.reviews" class="text-base-content/50 text-xs">
                ({{ place.reviews }})
              </span>
              <span v-if="place.price_level" class="badge badge-ghost badge-sm">
                {{ place.price_level }}
              </span>
            </div>

            <p v-if="place.types" class="text-xs text-base-content/60 leading-relaxed">
              {{ place.types.join(' · ') }}
            </p>

            <p v-if="place.address" class="text-xs text-base-content/50 truncate flex items-center gap-1">
              <Icon name="map-pin" :size="12" /> {{ place.address }}
            </p>

            <a
              v-if="place.website"
              :href="place.website"
              target="_blank"
              class="btn btn-outline btn-xs gap-1 mt-1 w-fit"
            >
              <Icon name="external-link" :size="12" />
              Website
            </a>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!results.length && !loading && !error" class="text-center mt-16 text-base-content/30">
      <Icon name="utensils-crossed" :size="64" cls="mx-auto mb-4 opacity-30" />
      <p class="text-lg">Search for restaurants near your venue</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const query = ref('restaurants near Moscone Center')
const location = ref('San Francisco')
const results = ref<any[]>([])
const loading = ref(false)
const error = ref('')

async function search() {
  if (!query.value.trim()) return
  loading.value = true
  error.value = ''
  results.value = []

  try {
    const res = await $fetch('/api/restaurants', {
      params: { q: query.value, location: location.value },
    })
    const data = res as any
    if (data.error) {
      error.value = data.error
    } else {
      results.value = data.results || []
    }
  } catch {
    error.value = 'Search failed. Check your API key.'
  } finally {
    loading.value = false
  }
}
</script>
