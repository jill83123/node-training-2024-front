<template>
  <div
    class="flex h-screen flex-col bg-[length:36px_36px] sm:bg-[length:64px_64px]"
    :style="{ 'background-image': `url(${BASE_URL}images/bg.svg)` }">
    <div class="container my-auto py-[14px]">
      <main
        class="flex flex-col items-center justify-around gap-6 border-2 border-primary bg-[#EFECE7] px-6 pb-10 pt-[70px] md:flex-row md:px-12 md:py-[70px]">
        <div class="md:w-1/2">
          <img
            src="/images/metaverse.svg"
            alt="元宇宙插圖"
            class="mx-auto block w-[200px] md:w-full md:max-w-[350px]" />
        </div>
        <div class="md:w-1/2">
          <h1
            class="text-center font-Paytone-One text-5xl leading-snug text-secondary md:text-6xl md:leading-snug">
            MetaWall
          </h1>
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const BASE_URL = ref(import.meta.env.BASE_URL);
</script>
