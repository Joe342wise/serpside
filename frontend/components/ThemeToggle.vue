<template>
  <label class="swap swap-rotate btn btn-ghost btn-circle btn-sm">
    <input type="checkbox" :checked="theme === 'light'" @change="toggle" />
    <Icon name="moon" :size="20" cls="swap-on" />
    <Icon name="sun" :size="20" cls="swap-off" />
  </label>
</template>

<script setup lang="ts">
const { theme, toggle } = useTheme()
</script>
