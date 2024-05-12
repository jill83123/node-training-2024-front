<template>
  <NavComponent />

  <div
    class="min-h-[calc(100vh_-_66px)]"
    :style="{ 'background-image': `url(${BASE_URL}images/bg.svg)` }">
    <div class="container flex justify-between gap-7 py-12">
      <main class="w-full lg:w-[62%]">
        <RouterView />
      </main>

      <SecNavComponent />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import NavComponent from '@/components/NavComponent.vue';
import SecNavComponent from '@/components/SecNavComponent.vue';

const BASE_URL = ref(import.meta.env.BASE_URL);
</script>
