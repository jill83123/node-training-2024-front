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
          <span
            class="material-symbols-outlined select-none transition-all duration-300"
            :class="isOpenedSortMenu ? 'rotate-180' : ''">
            expand_more
          </span>
        </div>

        <ul
          :class="{ 'pointer-events-none opacity-0 ': !isOpenedSortMenu }"
          class="absolute left-0 right-0 top-14 bg-white outline outline-2 outline-primary transition-all">
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
      class="mb-4 rounded-lg border-2 border-primary bg-white p-6 pb-4"
      style="box-shadow: 0px 3px 0px #000400"
      v-for="post in posts"
      :key="post._id">
      <div class="mb-3">
        <div class="mb-4 flex gap-4">
          <img
            :src="
              post.user && post.user.photo !== '' ? post.user.photo : '/images/user_default.png'
            "
            alt="大頭貼"
            class="h-[45px] w-[45px] rounded-full border-2 border-primary" />

          <div class="flex flex-col justify-center">
            <button
              type="button"
              class="self-start font-bold hover:text-secondary hover:underline hover:decoration-secondary hover:underline-offset-2">
              {{ post.user?.name }}
            </button>

            <div class="flex items-center">
              <time class="text-[12px] text-[#9B9893]">{{ formatDate(post.createdAt) }}</time>
              <span class="material-symbols-outlined ml-2 text-lg leading-none text-[#707070]">
                {{ post.type === 'friend' ? 'group' : 'public' }}
              </span>
            </div>
          </div>
        </div>

        <div>
          <p class="mb-1">{{ post.content }}</p>
          <template v-if="post.tags.length">
            <div class="flex flex-wrap items-center gap-1 text-sm text-secondary">
              <ul>
                <li
                  v-for="(tag, index) in post.tags"
                  :key="`${tag}${index}`"
                  class="flex items-center">
                  <span class="material-symbols-outlined select-none text-lg">tag</span>
                  {{ tag }}
                </li>
              </ul>
            </div>
          </template>
        </div>

        <img
          v-if="post.image"
          :src="post.image"
          alt="貼文圖片"
          class="mt-4 max-w-full rounded-lg border-2 border-primary object-contain" />
      </div>

      <button
        type="button"
        @click="
          async () => {
            await userStore.handleLikePost(post.isLiked, post._id);
            getPosts();
          }
        "
        class="-ml-2 flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-gray-100"
        :class="post.likes ? 'text-secondary' : 'text-[#9B9893] hover:text-secondary'">
        <span
          class="material-symbols-outlined text-xl"
          :style="
            post.isLiked
              ? 'font-variation-settings: \'FILL\' 1, \'wght\' 400, \'GRAD\' 0, \'opsz\' 24;'
              : ''
          ">
          thumb_up
        </span>
        <span>{{ post.likes ? post.likes : '成為第一個按讚的朋友' }}</span>
      </button>
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
import createUserStore from '@/stores/userStore';
import axios from 'axios';
import { showToast } from '@/utils/sweetAlert';
import { formatDate } from '@/utils/format';

const userStore = createUserStore();

const sort = ref('desc');
const keywords = ref('');

const isOpenedSortMenu = ref(false);
function toggleSortMenu(option) {
  sort.value = option ?? sort.value;
  isOpenedSortMenu.value = !isOpenedSortMenu.value;
}

const isLoading = ref(false);

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

onMounted(() => {
  getPosts();

  document.querySelector('body').addEventListener('click', (e) => {
    if (!e.target.closest('#sortMenu')) {
      isOpenedSortMenu.value = false;
    }
  });
});
</script>
