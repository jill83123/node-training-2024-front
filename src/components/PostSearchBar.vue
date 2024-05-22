<template>
  <div class="mb-4 flex flex-col gap-3 lg:flex-row">
    <div id="sortMenu" class="border-2 border-primary bg-white">
      <div class="relative">
        <div
          class="flex cursor-pointer items-center justify-between px-4 py-3 lg:w-[156px]"
          @click="toggleSortMenu()"
          @keyup.enter="toggleSortMenu()">
          <p>{{ postStore.sort === 'asc' ? '由舊至新' : '最新貼文' }}</p>

          <span
            class="material-symbols-outlined select-none transition-all duration-300"
            :class="isOpenedSortMenu ? 'rotate-180' : ''">
            expand_more
          </span>
        </div>

        <ul
          :class="{ 'pointer-events-none opacity-0 ': !isOpenedSortMenu }"
          class="absolute left-0 right-0 top-14 z-10 bg-white outline outline-2 outline-primary transition-all">
          <li
            class="px-4 py-3"
            :class="
              postStore.sort === 'desc'
                ? 'pointer-events-none bg-secondary text-white'
                : 'cursor-pointer hover:bg-gray-100'
            "
            @click="
              toggleSortMenu('desc');
              searchPost();
            "
            @keyup.enter="
              toggleSortMenu('desc');
              searchPost();
            ">
            最新貼文
          </li>

          <li
            class="px-4 py-3"
            :class="
              postStore.sort === 'asc'
                ? 'pointer-events-none bg-secondary text-white'
                : 'cursor-pointer hover:bg-gray-100'
            "
            @click="
              toggleSortMenu('asc');
              searchPost();
            "
            @keyup.enter="
              toggleSortMenu('asc');
              searchPost();
            ">
            由舊至新
          </li>
        </ul>
      </div>
    </div>

    <div class="flex w-full select-none items-center border-2 border-primary bg-white">
      <label for="search" class="hidden" />
      <input
        id="search"
        type="text"
        placeholder="搜尋貼文"
        class="focus-visible: block h-full w-full px-4 py-3 outline-none"
        v-model.trim="postStore.keyword"
        @keyup.enter="searchPost" />

      <button
        type="button"
        class="flex aspect-square items-center justify-center border-l-2 border-primary bg-secondary p-[13px] text-xl text-white"
        @click="searchPost">
        <span class="material-symbols-outlined h-5 w-5">search</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import createPostStore from '@/stores/postStore';

const router = useRouter();
const postStore = createPostStore();

const isOpenedSortMenu = ref(false);
function toggleSortMenu(option) {
  postStore.sort = option || postStore.sort;
  isOpenedSortMenu.value = !isOpenedSortMenu.value;
}

async function searchPost() {
  router.push(`?q=${postStore.keyword}&sort=${postStore.sort}`);
}

const handleBodyClick = (e) => {
  if (!e.target.closest('#sortMenu')) {
    isOpenedSortMenu.value = false;
  }
};
onMounted(() => {
  document.querySelector('body').addEventListener('click', handleBodyClick);
});
onBeforeUnmount(() => {
  document.querySelector('body').removeEventListener('click', handleBodyClick);
});
</script>
