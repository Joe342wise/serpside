<template>
  <div>
    <div class="card card-glass mb-8">
      <div class="card-body p-4 sm:p-6">
        <div class="flex flex-col xs:flex-row gap-3">
          <div class="relative flex-1">
            <Icon name="search" :size="16" cls="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              v-model="query"
              type="text"
              placeholder="e.g. PyCon hoodie, RTX 5090, AirPods Pro"
              class="input input-bordered w-full pl-10"
              @keydown.enter="search"
            />
          </div>
          <button :class="['btn btn-secondary', { 'btn-disabled': loading }]" @click="search">
            <Icon v-if="!loading" name="search" />
            <span v-else class="loading loading-spinner loading-sm" />
            Search
          </button>
        </div>
        <p v-if="error" class="text-error mt-1 text-sm">{{ error }}</p>
      </div>
    </div>

    <div v-if="!searched" class="text-center mt-16 text-base-content/30">
      <Icon name="shopping-bag" :size="64" cls="mx-auto mb-4 opacity-30" />
      <p class="text-lg">Search any product to start swiping</p>
    </div>

    <div
      v-if="searched && !results.length && !loading && !smashed.length"
      class="text-center mt-16 text-base-content/30"
    >
      <Icon name="shopping-bag" :size="64" cls="mx-auto mb-4 opacity-30" />
      <p class="text-lg">No results found</p>
    </div>

    <div v-if="searched && !results.length && smashed.length" class="text-center">
      <Icon name="check" :size="64" cls="mx-auto mb-4 text-success" />
      <h2 class="text-2xl font-bold mb-1">Roundup</h2>
      <p class="text-base-content/50 mb-6">
        You smashed <span class="font-semibold text-success">{{ smashed.length }}</span>
        {{ smashed.length === 1 ? 'item' : 'items' }}
      </p>

      <div class="space-y-3 max-w-md mx-auto text-left">
        <a
          v-for="(item, i) in smashed"
          :key="item.title + i"
          :href="item.link || '#'"
          target="_blank"
          rel="noopener noreferrer"
          class="card card-glass-solid block hover:translate-x-1 transition-transform duration-150 cursor-pointer"
        >
          <div class="card-body flex-row items-center gap-4 p-4">
            <div v-if="item.thumbnail" class="shrink-0">
              <img
                :src="item.thumbnail"
                :alt="item.title"
                class="w-14 h-14 object-contain rounded-lg bg-base-200"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-sm truncate">{{ item.title }}</p>
              <p class="text-xs text-base-content/50">{{ item.source }}</p>
            </div>
            <div class="text-right shrink-0">
              <p class="font-bold text-primary">{{ item.price || '—' }}</p>
              <span class="text-xs text-primary/60 font-medium">Open →</span>
            </div>
          </div>
        </a>
      </div>

      <button class="btn btn-primary mt-8" @click="reset">
        <Icon name="rotate-ccw" :size="16" />
        Search Again
      </button>
    </div>

    <div v-if="results.length" class="flex flex-col items-center">
      <p class="text-sm text-base-content/50 mb-2">{{ results.length }} results</p>

      <div class="card-stack relative w-full max-w-sm mx-auto h-[500px] sm:h-[520px] mb-6">
        <template v-for="(item, i) in visibleStack" :key="item.title + i">
          <div
            v-show="i >= currentIndex && i < currentIndex + stackDepth"
            :ref="(el) => cardRefs[i] = el as HTMLElement"
            :class="[
              'card bg-base-100 shadow-xl absolute inset-0 transition-all duration-300 cursor-grab select-none',
              i === currentIndex
                ? 'z-20 scale-100 opacity-100 rotate-0 translate-y-0'
                : 'z-10 scale-[0.97] opacity-80',
            ]"
            :style="i > currentIndex ? getStackStyle(i - currentIndex) : {}"
            @mousedown="i === currentIndex && startDrag($event, i)"
            @touchstart.passive="i === currentIndex && startDrag($event, i)"
          >
            <figure v-if="item.thumbnail" class="px-4 pt-4 sm:px-5 sm:pt-5">
              <img
                :src="item.thumbnail"
                :alt="item.title"
                class="w-full h-44 sm:h-52 object-contain rounded-xl bg-base-200"
              />
            </figure>
            <div v-else class="px-4 pt-4 sm:px-5 sm:pt-5">
              <div class="w-full h-44 sm:h-52 rounded-xl bg-base-200 flex items-center justify-center">
                <Icon name="shopping-bag" :size="48" cls="opacity-20" />
              </div>
            </div>

            <div class="card-body gap-1 px-4 sm:px-5">
              <h3 class="card-title text-sm sm:text-base leading-tight line-clamp-2">{{ item.title }}</h3>

              <div class="flex items-center justify-between flex-wrap gap-1">
                <p class="text-xl sm:text-2xl font-bold text-primary">{{ item.price || '—' }}</p>
                <span v-if="item.rating" class="badge badge-ghost badge-sm gap-1">
                  <Icon name="star" :size="12" cls="text-warning" />
                  {{ item.rating }}
                  <span v-if="item.reviews" class="text-base-content/50 hidden sm:inline">({{ item.reviews }})</span>
                </span>
              </div>

              <p v-if="item.source" class="text-xs sm:text-sm text-base-content/50 truncate">{{ item.source }}</p>

              <div v-if="selectedItem === item" class="mt-2 pt-2 border-t border-base-300 text-sm text-base-content/60">
                <p v-if="item.link" class="truncate">
                  <a :href="item.link" target="_blank" class="link link-primary gap-1 inline-flex items-center">
                    <Icon name="external-link" :size="14" />View product
                  </a>
                </p>
              </div>
            </div>

            <div
              v-if="i === currentIndex"
              class="absolute top-4 left-4 sm:top-6 sm:left-6 bg-success text-success-content px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-bold text-sm sm:text-lg rotate-[-15deg] shadow-lg z-30 opacity-0 transition-opacity duration-200 pointer-events-none"
              :class="{ 'opacity-100': swipeDir === 'right' }"
            >
              SMASH
            </div>
            <div
              v-if="i === currentIndex"
              class="absolute top-4 right-4 sm:top-6 sm:right-6 bg-error text-error-content px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-bold text-sm sm:text-lg rotate-[15deg] shadow-lg z-30 opacity-0 transition-opacity duration-200 pointer-events-none"
              :class="{ 'opacity-100': swipeDir === 'left' }"
            >
              PASS
            </div>
          </div>
        </template>
      </div>

      <div class="flex gap-4 sm:gap-6 items-center">
        <button class="btn btn-circle btn-outline btn-error btn-md sm:btn-lg" @click="pass">
          <Icon name="x" :size="24" cls="sm:w-7 sm:h-7" />
        </button>

        <button
          class="btn btn-circle btn-ghost btn-sm"
          :class="{ 'btn-active': selectedItem === results[currentIndex] }"
          @click="toggleDetails"
        >
          <Icon name="info" :size="18" cls="sm:w-5 sm:h-5" />
        </button>

        <button class="btn btn-circle btn-outline btn-success btn-md sm:btn-lg" @click="smash">
          <Icon name="check" :size="24" cls="sm:w-7 sm:h-7" />
        </button>
      </div>

      <p class="text-xs text-base-content/30 mt-3">
        {{ currentIndex + 1 }} / {{ results.length }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const query = ref('')
const results = ref<any[]>([])
const smashed = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const searched = ref(false)
const currentIndex = ref(0)
const selectedItem = ref<any | null>(null)
const stackDepth = 3
const swipeDir = ref<'left' | 'right' | null>(null)

const cardRefs = ref<(HTMLElement | null)[]>([])

const visibleStack = computed(() => results.value)

let dragStartX = 0
let dragCurrentX = 0
let isDragging = false
let currentDragIdx = -1

function getStackStyle(offset: number) {
  const rot = offset % 2 === 1 ? 2 : -2
  const ty = offset * 6
  const tx = offset * 4
  return {
    transform: `translateX(${tx}px) translateY(${ty}px) rotate(${rot}deg)`,
  }
}

async function search() {
  if (!query.value.trim()) return
  loading.value = true
  error.value = ''
  results.value = []
  smashed.value = []
  currentIndex.value = 0
  selectedItem.value = null
  searched.value = true

  try {
    const res = await $fetch('/api/products', {
      params: { q: query.value },
    })
    results.value = (res as any).results || []
    cardRefs.value = []
  } catch {
    error.value = 'Search failed. Check your API key.'
  } finally {
    loading.value = false
  }
}

function smash() {
  smashed.value.push(results.value[currentIndex.value])
  advance()
}

function pass() {
  advance()
}

function advance() {
  selectedItem.value = null
  if (currentIndex.value < results.value.length - 1) {
    currentIndex.value++
  } else {
    results.value = []
  }
}

function toggleDetails() {
  const item = results.value[currentIndex.value]
  selectedItem.value = selectedItem.value === item ? null : item
}

function reset() {
  results.value = []
  smashed.value = []
  currentIndex.value = 0
  selectedItem.value = null
  searched.value = false
  query.value = ''
}

function startDrag(e: MouseEvent | TouchEvent, idx: number) {
  isDragging = true
  currentDragIdx = idx
  const pos = 'touches' in e ? e.touches[0] : e
  dragStartX = pos.clientX
  dragCurrentX = pos.clientX

  const onMove = (ev: MouseEvent | TouchEvent) => {
    if (!isDragging) return
    const p = 'touches' in ev ? ev.touches[0] : ev
    dragCurrentX = p.clientX
    const dx = dragCurrentX - dragStartX
    const card = cardRefs.value[currentDragIdx]
    if (card) {
      const rot = dx * 0.1
      card.style.transform = `translateX(${dx}px) rotate(${rot}deg)`
      card.style.transition = 'none'
    }
    swipeDir.value = dx > 30 ? 'right' : dx < -30 ? 'left' : null
  }

  const onEnd = () => {
    if (!isDragging) return
    isDragging = false
    const dx = dragCurrentX - dragStartX
    swipeDir.value = null
    if (dx > 100) {
      smash()
    } else if (dx < -100) {
      pass()
    } else {
      const card = cardRefs.value[currentDragIdx]
      if (card) {
        card.style.transform = ''
        card.style.transition = ''
      }
    }
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onEnd)
    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('touchend', onEnd)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onEnd)
  document.addEventListener('touchmove', onEnd as EventListener, { passive: true })
  document.addEventListener('touchend', onEnd as EventListener)
}
</script>
