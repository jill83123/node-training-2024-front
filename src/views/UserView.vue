<template>
  <NavComponent />

  <div
    class="min-h-[calc(100vh_-_66px)]"
    :style="{ 'background-image': `url(${BASE_URL}images/bg.svg)` }">
    <div class="container flex justify-between gap-7 py-12">
      <main class="w-8/12">
        <RouterView />
      </main>

      <aside class="w-4/12">
        <div class="border-2 border-primary bg-white px-6 py-8">
          <RouterLink
            to="create-post"
            class="w-100 mb-6 flex items-center justify-center rounded-lg border-2 border-primary bg-secondary py-4 text-white hover:bg-goldenrod hover:text-primary"
            style="box-shadow: -2px 2px 0px #000400">
            張貼動態
          </RouterLink>

          <button type="button" class="mb-4 flex w-full items-center gap-4 hover:text-secondary">
            <img
              src="/images/user_default.png"
              alt="user-photo"
              class="h-[50px] w-[50px] rounded-full border-2 border-primary object-contain" />
            <p class="font-bold">邊緣小杰</p>
          </button>

          <button
            type="button"
            class="aside-item mb-4 flex w-full items-center gap-4 hover:text-secondary">
            <div
              class="flex h-[50px] w-[50px] items-center justify-center rounded-full border-2 border-primary bg-[#E2EDFA]">
              <span class="material-symbols-outlined">notifications</span>
            </div>
            <p class="font-bold">追蹤名單</p>
          </button>

          <button
            type="button"
            class="aside-item flex w-full items-center gap-4 hover:text-secondary">
            <div
              class="flex h-[50px] w-[50px] items-center justify-center rounded-full border-2 border-primary bg-[#E2EDFA]">
              <span class="material-symbols-outlined">thumb_up</span>
            </div>
            <p class="font-bold">我按讚的文章</p>
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import NavComponent from '@/components/NavComponent.vue';

const BASE_URL = ref(import.meta.env.BASE_URL);
</script>

<style lang="postcss">
.aside-item:hover {
  div {
    @apply bg-secondary;
  }
  span {
    @apply text-white;
  }
}
</style>
