<template>
  <PageTitle :title="'追蹤名單'" />

  <ul>
    <li
      v-for="following in followingList"
      :key="following.user._id"
      class="follow-item relative mb-4 rounded-lg border-2 border-primary bg-white p-4"
      style="box-shadow: 0px 3px 0px #000400">
      <div class="flex justify-between">
        <div class="flex items-center gap-4">
          <img :src="following.user.photo" alt="大頭貼" class="h-10 w-10 rounded-full" />

          <div>
            <h3 class="follow-name font-bold">
              <RouterLink :to="`/user/${following.user._id}/posts`">
                {{ following.user.name }}
              </RouterLink>
            </h3>
            <span class="text-xs text-[#9B9893] md:text-sm">
              追蹤時間：{{ formatDate(following.createdAt) }}
            </span>
          </div>
        </div>

        <p class="self-end text-xs md:text-base">
          您已追蹤 {{ moment(Date.now()).diff(moment(following.createdAt), 'days') }} 天！
        </p>
      </div>

      <RouterLink :to="`/user/${following.user._id}/posts`" class="after:absolute after:inset-0" />
    </li>
  </ul>
</template>

<script setup>
import axios from 'axios';
import moment from 'moment';
import { ref, onMounted } from 'vue';
import PageTitle from '@/components/PageTitle.vue';
import { formatDate } from '@/utils/format';
import { showToast } from '@/utils/sweetAlert';

const isLoading = ref(false);
const followingList = ref([]);

onMounted(async () => {
  isLoading.value = true;
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/following`);
    followingList.value = res.data.followingList;
  } catch (err) {
    showToast({ icon: 'error', title: err.response?.data?.message || err.message });
  }
  isLoading.value = false;
});
</script>

<style lang="postcss">
.follow-item:hover {
  .follow-name {
    @apply text-secondary underline underline-offset-2;
  }
}
</style>
