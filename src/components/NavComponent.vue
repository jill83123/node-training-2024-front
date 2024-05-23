<template>
  <VueLoading v-model:active="isLoading" />

  <nav class="fixed left-0 right-0 top-0 z-50 border-b-[3px] border-primary bg-white py-3">
    <div class="container flex items-center justify-between">
      <h1 class="font-Paytone-One text-[26px]">
        <RouterLink to="/">MetaWall</RouterLink>
      </h1>
      <div id="userMenu" class="relative">
        <button type="button" class="flex min-w-[182px] items-center" @click="toggleUserMenu">
          <img
            :src="userStore.user.photo"
            alt="大頭貼"
            class="mr-[10px] h-[30px] w-[30px] rounded-full border-2 border-primary" />
          <p
            class="border-b-2 border-primary font-bold"
            style="font-family: 'Azeret Mono', 'Noto Sans TC', sans">
            {{ userStore.user.name }}
          </p>
        </button>

        <ul
          class="absolute left-0 right-0 top-full z-10 mt-2 text-center transition-all after:absolute after:-bottom-2 after:-right-2 after:left-2 after:top-2 after:-z-10 after:border-2 after:border-primary after:bg-white"
          :class="{ 'pointer-events-none opacity-0 ': !isOpenedUserMenu }">
          <li>
            <RouterLink
              :to="`/user/${userStore.user.id}/posts`"
              @click="toggleUserMenu"
              class="block w-full border-x-2 border-t-2 border-primary bg-white py-2 hover:bg-gray-100">
              我的貼文牆
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/user/edit"
              @click="toggleUserMenu"
              class="block w-full border-x-2 border-t-2 border-primary bg-white py-2 hover:bg-gray-100">
              修改個人資料
            </RouterLink>
          </li>
          <li>
            <button
              type="button"
              @click="toggleUserMenu"
              class="w-full border-2 border-primary bg-white py-2 hover:bg-gray-100">
              登出
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <template v-if="!userStore.user.isVerifiedEmail">
    <p
      class="fixed left-0 right-0 top-[66px] z-10 bg-white bg-opacity-75 py-2 text-center font-bold">
      您目前尚未驗證信箱，僅能瀏覽貼文，請至信箱點擊驗證連結。沒有收到信嗎？
      <button type="button" class="text-secondary" @click="sendVerificationEmail">點我</button>
      發送驗證信
    </p>
  </template>

  <div class="h-[66px]" :class="{ 'mb-[41px]': !userStore.user.isVerifiedEmail }" />
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import createUserStore from '@/stores/userStore';
import { showToast } from '@/utils/sweetAlert';

const userStore = createUserStore();

const isOpenedUserMenu = ref(false);
function toggleUserMenu() {
  isOpenedUserMenu.value = !isOpenedUserMenu.value;
}

onMounted(() => {
  document.querySelector('body').addEventListener('click', (e) => {
    if (!e.target.closest('#userMenu')) {
      isOpenedUserMenu.value = false;
    }
  });
});

const isLoading = ref(false);

async function sendVerificationEmail() {
  isLoading.value = true;
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/user/sendVerificationMail`);
    showToast({ icon: 'success', title: '發送成功' });
  } catch (err) {
    showToast({ icon: 'error', title: err.response?.data?.message || err.message });
  }
  isLoading.value = false;
}
</script>
