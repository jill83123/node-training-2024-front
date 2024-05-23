<template>
  <VueLoading v-model:active="isLoading" />

  <div
    class="relative mb-5 flex rounded-lg border-2 border-primary bg-white after:absolute after:-bottom-2 after:-left-2 after:right-0 after:top-1 after:-z-10 after:rounded-lg after:border-2 after:border-primary after:bg-white">
    <img
      :src="postStore.user?.photo"
      alt="大頭貼"
      class="h-20 w-20 rounded-s-lg border-r-2 border-primary" />

    <div class="flex w-full items-center justify-between p-4">
      <div>
        <h2 class="font-bold">{{ postStore.user?.name }}</h2>
        <p>{{ postStore.user?.followers }} 人追蹤</p>
      </div>

      <button
        v-if="postStore.user?._id !== userStore.user?.id"
        type="button"
        @click="handleFollowUser"
        class="rounded-lg border-2 border-primary bg-goldenrod px-8 py-1 font-bold"
        :style="postStore.user?.isFollowed ? 'background-color:#EFECE7' : ''"
        style="box-shadow: 0px 2px 0px #000400">
        {{ postStore.user?.isFollowed ? '取消追蹤' : '追蹤' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import createPostStore from '@/stores/postStore';
import createUserStore from '@/stores/userStore';
import { showToast } from '@/utils/sweetAlert';

const postStore = createPostStore();
const userStore = createUserStore();

const isLoading = ref(false);

async function handleFollowUser() {
  // eslint-disable-next-line no-underscore-dangle
  let url = `${import.meta.env.VITE_API_URL}/user/${postStore.user._id}`;
  url += postStore.user.isFollowed ? '/unfollow' : '/follow';
  const http = postStore.user.isFollowed ? 'delete' : 'post';

  isLoading.value = true;
  try {
    await axios[http](url);
    await postStore.getPosts();
  } catch (err) {
    showToast({ icon: 'error', title: err.response?.data?.message || err.message });
  }
  isLoading.value = false;
}
</script>
