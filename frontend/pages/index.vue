<template>
  <div class="max-w-6xl mx-auto px-4 py-6 sm:py-8">
    <header class="flex items-center justify-between mb-6 sm:mb-8">
      <div class="flex-1 flex">
        <ThemeToggle />
      </div>
      <div class="flex-1 flex justify-center">
        <h1 class="text-3xl sm:text-5xl font-black tracking-tight">
          <span class="text-primary">Serp</span><span class="text-secondary">Side</span>
        </h1>
      </div>
      <div class="flex-1 flex justify-end gap-1">
        <button
          class="btn btn-ghost btn-circle btn-sm"
          :class="{ 'text-primary': music.isPlaying.value }"
          @click="music.toggle"
          :title="music.isPlaying.value ? 'Mute' : 'Play music'"
        >
          <Icon v-if="music.isPlaying.value" name="music" :size="18" />
          <Icon v-else name="music-off" :size="18" cls="opacity-40" />
        </button>
      </div>
    </header>

    <div class="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:grid sm:grid-cols-2 mb-8 p-1 bg-base-200/50 backdrop-blur-xl rounded-2xl">
      <button
        :class="[
          'flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200',
          tab === 'food'
            ? 'bg-primary text-primary-content shadow-lg shadow-primary/30 scale-100'
            : 'text-base-content/50 hover:text-base-content hover:bg-base-300/50 scale-95'
        ]"
        @click="tab = 'food'"
      >
        <Icon name="utensils-crossed" :size="20" />
        <span>Food Explorer</span>
      </button>
      <button
        :class="[
          'flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200',
          tab === 'swag'
            ? 'bg-secondary text-secondary-content shadow-lg shadow-secondary/30 scale-100'
            : 'text-base-content/50 hover:text-base-content hover:bg-base-300/50 scale-95'
        ]"
        @click="tab = 'swag'"
      >
        <Icon name="shopping-bag" :size="20" />
        <span>Swag or Pass</span>
      </button>
    </div>

    <transition name="slide" mode="out-in">
      <FoodExplorer v-if="tab === 'food'" key="food" />
      <SwagOrPass v-else key="swag" />
    </transition>

    <transition name="overlay">
      <div v-if="showLanding" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-base-300/95 backdrop-blur-2xl landing-glow" @click="dismiss" />
        <div class="relative z-10 max-w-lg mx-auto text-center">
          <div class="flex justify-center gap-4 mb-8">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Icon name="utensils-crossed" :size="36" cls="text-primary" />
            </div>
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-secondary/10 flex items-center justify-center">
              <Icon name="shopping-bag" :size="36" cls="text-secondary" />
            </div>
          </div>

          <h2 class="text-2xl sm:text-3xl font-bold mb-3">
            Find food. Find deals.
          </h2>
          <p class="text-base-content/60 mb-8 text-sm sm:text-base leading-relaxed">
            SerpSide helps you discover restaurants near any conference venue
            and compare product prices across the web — powered by SerpApi.
          </p>

          <button class="btn btn-primary btn-lg gap-2" @click="dismiss">
            <Icon name="search" :size="18" />
            Get Started
          </button>

          <div class="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div class="card card-glass">
              <div class="card-body p-4 sm:p-5">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon name="utensils-crossed" :size="20" cls="text-primary" />
                  </div>
                  <h3 class="font-semibold">Food Explorer</h3>
                </div>
                <p class="text-xs sm:text-sm text-base-content/50 leading-relaxed">
                  Search restaurants near any venue. See ratings, price levels, and types at a glance.
                </p>
              </div>
            </div>
            <div class="card card-glass">
              <div class="card-body p-4 sm:p-5">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Icon name="shopping-bag" :size="20" cls="text-secondary" />
                  </div>
                  <h3 class="font-semibold">Swag or Pass</h3>
                </div>
                <p class="text-xs sm:text-sm text-base-content/50 leading-relaxed">
                  Swipe through products sorted by price. Smash the best deals, pass on the rest.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
const tab = ref<'food' | 'swag'>('food')
const music = useMusic()

const showLanding = ref(false)

onMounted(() => {
  if (!localStorage.getItem('serpside-seen-landing')) {
    showLanding.value = true
  }
})

function dismiss() {
  showLanding.value = false
  localStorage.setItem('serpside-seen-landing', '1')
}
</script>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
.overlay-enter-active,
.overlay-leave-active {
  transition: all 0.35s ease;
}
.overlay-enter-from {
  opacity: 0;
}
.overlay-leave-to {
  opacity: 0;
}

.landing-glow {
  background:
    radial-gradient(600px circle at 20% 20%, hsl(var(--p) / 0.10), transparent 60%),
    radial-gradient(500px circle at 80% 80%, hsl(var(--s) / 0.08), transparent 60%),
    radial-gradient(400px circle at 50% 50%, hsl(var(--a) / 0.06), transparent 60%);
}
</style>
