<template>
  <div class="relative mb-4 h-[64px]">
    <div
      class="absolute bottom-0 left-0 right-0 top-0 border-2 border-primary bg-white text-center text-xl font-bold after:absolute after:-bottom-2 after:-left-2 after:right-1 after:top-1 after:-z-10 after:border-2 after:border-primary after:bg-white">
      <h2 class="py-[18px]">{{ props.title }}</h2>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['title']);
</script>
