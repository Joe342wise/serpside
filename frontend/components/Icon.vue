<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="cls"
  >
    <component :is="iconComponent" />
  </svg>
</template>

<script setup lang="ts">
import { h, type Component } from 'vue'

const props = withDefaults(defineProps<{
  name: string
  size?: number
  cls?: string
}>(), { size: 20 })

const icons: Record<string, Component> = {
  search: h('g', null, [
    h('circle', { cx: 11, cy: 11, r: 8 }),
    h('path', { d: 'm21 21-4.35-4.35' }),
  ]),
  location: h('g', null, [
    h('path', { d: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' }),
    h('circle', { cx: 12, cy: 10, r: 3 }),
  ]),
  tag: h('g', null, [
    h('path', { d: 'M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z' }),
    h('circle', { cx: 7.5, cy: 7.5, r: 1.5, fill: 'currentColor' }),
  ]),
  star: h('g', null, [
    h('path', { d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' }),
  ]),
  'external-link': h('g', null, [
    h('path', { d: 'M15 3h6v6' }),
    h('path', { d: 'M10 14 21 3' }),
    h('path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' }),
  ]),
  x: h('g', null, [
    h('path', { d: 'M18 6 6 18' }),
    h('path', { d: 'm6 6 12 12' }),
  ]),
  check: h('g', null, [
    h('path', { d: 'M20 6 9 17l-5-5' }),
  ]),
  'shopping-bag': h('g', null, [
    h('path', { d: 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z' }),
    h('path', { d: 'M3 6h18' }),
    h('path', { d: 'M16 10a4 4 0 0 1-8 0' }),
  ]),
  'utensils-crossed': h('g', null, [
    h('path', { d: 'm16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8' }),
    h('path', { d: 'M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Z' }),
    h('path', { d: 'm10 18-5 5' }),
    h('path', { d: 'm16 2 5 5' }),
  ]),
  'arrow-left': h('g', null, [
    h('path', { d: 'm12 19-7-7 7-7' }),
    h('path', { d: 'M19 12H5' }),
  ]),
  'arrow-right': h('g', null, [
    h('path', { d: 'm5 12h14' }),
    h('path', { d: 'm12 5 7 7-7 7' }),
  ]),
  'map-pin': h('g', null, [
    h('path', { d: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' }),
    h('circle', { cx: 12, cy: 10, r: 3 }),
  ]),
  'chevron-down': h('g', null, [
    h('path', { d: 'm6 9 6 6 6-6' }),
  ]),
  'info': h('g', null, [
    h('circle', { cx: 12, cy: 12, r: 10 }),
    h('path', { d: 'M12 16v-4' }),
    h('path', { d: 'M12 8h.01' }),
  ]),
  'rotate-ccw': h('g', null, [
    h('path', { d: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' }),
    h('path', { d: 'M3 3v5h5' }),
  ]),
  'sun': h('g', null, [
    h('circle', { cx: 12, cy: 12, r: 4 }),
    h('path', { d: 'M12 2v2' }),
    h('path', { d: 'M12 20v2' }),
    h('path', { d: 'm4.93 4.93 1.41 1.41' }),
    h('path', { d: 'm17.66 17.66 1.41 1.41' }),
    h('path', { d: 'M2 12h2' }),
    h('path', { d: 'M20 12h2' }),
    h('path', { d: 'm6.34 17.66-1.41 1.41' }),
    h('path', { d: 'm19.07 4.93-1.41 1.41' }),
  ]),
  'moon': h('g', null, [
    h('path', { d: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' }),
  ]),
  'music': h('g', null, [
    h('path', { d: 'M9 18V5l12-2v13' }),
    h('circle', { cx: 6, cy: 18, r: 3 }),
    h('circle', { cx: 18, cy: 16, r: 3 }),
  ]),
  'music-off': h('g', null, [
    h('path', { d: 'M9 18V5l12-2v13' }),
    h('path', { d: 'm9 9 12-2' }),
    h('circle', { cx: 6, cy: 18, r: 3 }),
    h('circle', { cx: 18, cy: 16, r: 3 }),
    h('path', { d: 'M2 2l20 20' }),
  ]),
  'crosshair': h('g', null, [
    h('circle', { cx: 12, cy: 12, r: 10 }),
    h('circle', { cx: 12, cy: 12, r: 2, fill: 'currentColor' }),
    h('path', { d: 'M12 2v4' }),
    h('path', { d: 'M12 18v4' }),
    h('path', { d: 'M2 12h4' }),
    h('path', { d: 'M18 12h4' }),
  ]),
  'loader': h('g', null, [
    h('path', { d: 'M21 12a9 9 0 1 1-6.219-8.56' }),
  ]),
}

const iconComponent = computed(() => icons[props.name])
</script>
