<template>
  <VueLoading v-model:active="isLoading" />

  <div class="mb-4 flex flex-col gap-3 lg:flex-row">
    <div id="sortMenu" class="border-2 border-primary bg-white">
      <div class="relative">
        <div
          class="flex cursor-pointer items-center justify-between px-4 py-3 lg:w-[156px]"
          @click="toggleSortMenu()"
          @keyup.enter="toggleSortMenu()">
          <p>{{ sort === 'asc' ? '由舊至新' : '最新貼文' }}</p>
          <span class="material-symbols-outlined select-none">expand_more</span>
        </div>

        <ul
          :class="{ hidden: !isOpenedSortMenu }"
          class="absolute left-0 right-0 top-14 bg-white outline outline-2 outline-primary">
          <li
            class="px-4 py-3"
            :class="
              sort === 'desc'
                ? 'pointer-events-none bg-secondary text-white'
                : 'cursor-pointer hover:bg-gray-100'
            "
            @click="
              toggleSortMenu('desc');
              getPosts();
            "
            @keyup.enter="
              toggleSortMenu('desc');
              getPosts();
            ">
            最新貼文
          </li>
          <li
            class="px-4 py-3"
            :class="
              sort === 'asc'
                ? 'pointer-events-none bg-secondary text-white'
                : 'cursor-pointer hover:bg-gray-100'
            "
            @click="
              toggleSortMenu('asc');
              getPosts();
            "
            @keyup.enter="
              toggleSortMenu('asc');
              getPosts();
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
        v-model.trim="keywords"
        @keyup.enter="getPosts()" />
      <button
        type="button"
        class="flex aspect-square items-center justify-center border-l-2 border-primary bg-secondary p-[13px] text-xl text-white"
        @click="getPosts()">
        <span class="material-symbols-outlined h-5 w-5">search</span>
      </button>
    </div>
  </div>

  <template v-if="posts.length > 0">
    <div
      class="mb-4 rounded-lg border-2 border-primary bg-white p-6"
      style="box-shadow: 0px 3px 0px #000400"
      v-for="post in posts"
      :key="post._id">
      <div class="flex gap-4">
        <img
          :src="post.user && post.user.photo !== '' ? post.user.photo : '/images/user_default.png'"
          alt="user-photo"
          class="h-[45px] w-[45px] rounded-full border-2 border-primary" />

        <div class="flex flex-col justify-center">
          <p class="font-bold hover:text-secondary hover:underline hover:decoration-secondary">
            {{ post.user?.name }}
          </p>

          <div class="flex items-center">
            <time class="text-[12px] text-[#9B9893]">{{ formatDate(post.createdAt) }}</time>
            <span class="material-symbols-outlined ml-2 text-lg text-[#707070]">
              {{ post.type === 'friend' ? 'group' : 'public' }}
            </span>
          </div>
        </div>
      </div>

      <div class="my-4">
        <p class="mb-1">{{ post.content }}</p>
        <div class="flex flex-wrap items-center gap-1 text-secondary">
          <p v-for="(tag, index) in post.tags" :key="`${tag}${index}`" class="flex items-center">
            <span class="material-symbols-outlined select-none text-lg">tag</span>
            {{ tag }}
          </p>
        </div>
      </div>

      <img
        v-if="post.image"
        :src="post.image"
        alt="post-image"
        class="max-w-full rounded-lg border-2 border-primary object-contain" />
    </div>
  </template>

  <template v-else>
    <div
      class="rounded-lg border-2 border-primary bg-white"
      style="box-shadow: 0px 3px 0px #000400">
      <div class="flex items-center gap-[6px] border-b-2 border-primary p-4">
        <div
          class="h-[10px] w-[10px] select-none rounded-full border border-[#707070] bg-[#DE4B63]" />
        <div
          class="h-[10px] w-[10px] select-none rounded-full border border-[#707070] bg-[#FAA722]" />
        <div
          class="h-[10px] w-[10px] select-none rounded-full border border-[#707070] bg-[#83C51D]" />
      </div>
      <p class="py-8 text-center text-[#9B9893]">目前尚無動態，新增一則貼文吧！</p>
    </div>
  </template>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { showToast } from '@/utils/sweetalert';

const isLoading = ref(false);

const sort = ref('desc');
const keywords = ref('');

const isOpenedSortMenu = ref(false);
function toggleSortMenu(option) {
  sort.value = option ?? sort.value;
  isOpenedSortMenu.value = !isOpenedSortMenu.value;
}

const posts = ref([]);
async function getPosts() {
  isLoading.value = true;
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/posts?sort=${sort.value}&q=${keywords.value}`,
    );
    posts.value = res.data.posts;
  } catch (err) {
    showToast({ icon: 'error', title: err.response?.data?.message || err.message });
  }
  isLoading.value = false;
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${year}/${month < 10 ? `0${month}` : month}/${day < 10 ? `0${day}` : day} ${hours}:${minutes}`;
}

onMounted(() => {
  getPosts();

  document.querySelector('body').addEventListener('click', (e) => {
    if (!e.target.closest('#sortMenu')) {
      isOpenedSortMenu.value = false;
    }
  });
});
</script>
