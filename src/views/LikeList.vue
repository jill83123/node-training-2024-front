<template>
  <PageTitle :title="'我按讚的貼文'" />

  <ul>
    <li
      v-for="post in likePosts"
      :key="post.user._id"
      class="relative mb-4 rounded-lg border-2 border-primary bg-white p-4"
      style="box-shadow: 0px 3px 0px #000400">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 md:gap-4">
          <RouterLink :to="`/user/${post.user._id}/posts`">
            <img :src="post.user.photo" alt="大頭貼" class="h-10 w-10 rounded-full object-cover" />
          </RouterLink>

          <div>
            <h3 class="font-bold hover:text-secondary hover:underline hover:underline-offset-2">
              <RouterLink :to="`/user/${post.user._id}/posts`">
                {{ post.user.name }}
              </RouterLink>
            </h3>

            <span class="text-xs text-[#9B9893] md:text-sm">
              發文時間：{{ formatDate(post.createdAt) }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-3 md:mr-10 md:gap-9">
          <button
            type="button"
            @click="cancelLikePost(post._id)"
            class="flex flex-col items-center font-bold text-secondary">
            <span class="material-symbols-outlined text-xl leading-none md:text-2xl">thumb_up</span>
            <p class="text-sm md:text-base">取消</p>
          </button>

          <RouterLink :to="`/post/${post._id}`" class="flex flex-col items-center font-bold">
            <span class="material-symbols-outlined text-xl leading-none md:text-2xl">
              arrow_circle_right
            </span>
            <p class="text-sm md:text-base">查看</p>
          </RouterLink>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import PageTitle from '@/components/PageTitle.vue';
import { formatDate } from '@/utils/format';
import { showToast, showCheck } from '@/utils/sweetAlert';

const likePosts = ref([]);
const isLoading = ref(false);

async function getLikePosts() {
  isLoading.value = true;
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/getLikePosts`);
    likePosts.value = res.data.likePosts;
  } catch (err) {
    showToast({ icon: 'error', title: err.response?.data?.message || err.message });
  }
  isLoading.value = false;
}

async function cancelLikePost(postId) {
  showCheck({
    icon: 'warning',
    title: '確定要取消按讚嗎',
    text: '注意：此操作將無法復原',
    onConfirm: async () => {
      isLoading.value = true;
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/post/${postId}/unlike`);
        getLikePosts();
      } catch (err) {
        showToast({ icon: 'error', title: err.response?.data?.message || err.message });
      }
      isLoading.value = false;
    },
  });
}

onMounted(() => {
  getLikePosts();
});
</script>
