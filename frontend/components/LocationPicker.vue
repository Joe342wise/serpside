<template>
  <div class="relative" ref="containerRef">
    <div class="flex gap-0">
      <div class="relative flex-1">
        <Icon name="map-pin" :size="16" cls="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
        <input
          ref="inputRef"
          v-model="text"
          type="text"
          placeholder="San Francisco"
          class="input input-bordered w-full pl-10 pr-3"
          :class="[geoLoading ? 'input-disabled' : '']"
          @focus="isOpen = true"
          @input="onInput"
          @keydown.down.prevent="highlightNext"
          @keydown.up.prevent="highlightPrev"
          @keydown.esc="isOpen = false"
          @keydown.enter="onEnter"
        />
      </div>
      <button
        class="btn btn-ghost btn-square ml-1"
        :class="{ 'btn-disabled text-base-content/30': geoError, 'text-primary animate-pulse': geoLoading }"
        @click="detectLocation"
        title="Use my location"
      >
        <Icon v-if="geoLoading" name="loader" :size="18" />
        <Icon v-else name="crosshair" :size="18" :cls="geoSupported ? '' : 'opacity-20'" />
      </button>
    </div>

    <ul
      v-if="isOpen && filtered.length"
      class="absolute z-50 top-full mt-1 left-0 right-0 bg-base-100 border border-base-300 rounded-xl shadow-xl overflow-hidden"
    >
      <li
        v-for="(loc, i) in filtered"
        :key="loc"
        :class="[
          'px-4 py-2.5 text-sm cursor-pointer flex items-center gap-3 transition-colors',
          i === highlightedIdx
            ? 'bg-primary/10 text-primary'
            : 'hover:bg-base-200'
        ]"
        @mousedown.prevent="select(loc)"
        @mouseenter="highlightedIdx = i"
      >
        <Icon name="map-pin" :size="14" cls="shrink-0 text-base-content/30" />
        <span>{{ loc }}</span>
      </li>
    </ul>

    <p v-if="geoError" class="text-xs text-error mt-1">{{ geoError }}</p>
  </div>
</template>

<script setup lang="ts">
const LOCATIONS = [
  'San Francisco, CA', 'Salt Lake City, UT', 'Pittsburgh, PA',
  'Austin, TX', 'New York, NY', 'Chicago, IL', 'Seattle, WA',
  'Portland, OR', 'Los Angeles, CA', 'Denver, CO', 'Las Vegas, NV',
  'Miami, FL', 'Orlando, FL', 'Washington, DC', 'Boston, MA',
  'Nashville, TN', 'Atlanta, GA', 'Phoenix, AZ',
]

const emit = defineEmits<{ search: [] }>()

const text = defineModel<string>('location', { default: 'San Francisco' })
const isOpen = ref(false)
const highlightedIdx = ref(0)
const geoLoading = ref(false)
const geoError = ref('')
const containerRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const geoSupported = typeof navigator !== 'undefined' && 'geolocation' in navigator

const filtered = computed(() => {
  const q = text.value.toLowerCase().trim()
  if (!q) return LOCATIONS
  return LOCATIONS.filter(l => l.toLowerCase().includes(q))
})

watch(filtered, () => { highlightedIdx.value = 0 })

function onInput() {
  isOpen.value = true
  highlightedIdx.value = 0
}

function select(loc: string) {
  text.value = loc
  isOpen.value = false
  inputRef.value?.focus()
}

function onEnter() {
  if (isOpen.value && filtered.value[highlightedIdx.value]) {
    select(filtered.value[highlightedIdx.value])
  }
  emit('search')
}

function selectHighlighted() {
  if (isOpen.value && filtered.value[highlightedIdx.value]) {
    select(filtered.value[highlightedIdx.value])
  }
}

function highlightNext() {
  if (filtered.value.length) {
    highlightedIdx.value = (highlightedIdx.value + 1) % filtered.value.length
  }
}

function highlightPrev() {
  if (filtered.value.length) {
    highlightedIdx.value = (highlightedIdx.value - 1 + filtered.value.length) % filtered.value.length
  }
}

function detectLocation() {
  if (!geoSupported) {
    geoError.value = 'Geolocation not available on this device'
    return
  }
  geoLoading.value = true
  geoError.value = ''

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&zoom=10`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const data = await res.json()
        const address = data.address
        const parts = [
          address.city || address.town || address.village || address.county,
          address.state,
        ].filter(Boolean)
        if (parts.length) {
          text.value = parts.join(', ')
        } else {
          text.value = `${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`
        }
        geoError.value = ''
      } catch {
        geoError.value = 'Could not resolve location name'
      } finally {
        geoLoading.value = false
      }
    },
    (err) => {
      geoLoading.value = false
      if (err.code === err.PERMISSION_DENIED) {
        geoError.value = 'Location permission denied'
      } else if (err.code === err.TIMEOUT) {
        geoError.value = 'Location request timed out'
      } else {
        geoError.value = 'Could not detect location'
      }
    },
    { enableHighAccuracy: false, timeout: 8000 },
  )
}

function onClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))
</script>
