<template>
  <nav class="border-b-[3px] border-primary py-3">
    <div class="container flex items-center justify-between">
      <h1 class="font-Paytone-One text-[26px]">
        <RouterLink to="/">MetaWall</RouterLink>
      </h1>
      <div id="userMenu" class="relative">
        <button type="button" class="flex min-w-[182px] items-center" @click="toggleUserMenu">
          <img
            :src="
              userStore.user && userStore.user.photo
                ? userStore.user.photo
                : '/images/user_default.png'
            "
            alt="大頭貼"
            class="mr-[10px] h-[30px] w-[30px] rounded-full border-2 border-primary" />
          <p
            class="border-b-2 border-primary font-bold"
            style="font-family: 'Azeret Mono', 'Noto Sans TC', sans">
            {{ userStore.user.name }}
          </p>
        </button>

        <ul
          class="after: absolute left-0 right-0 top-full z-10 mt-2 text-center transition-all after:absolute after:-bottom-2 after:-right-2 after:left-2 after:top-2 after:-z-10 after:border-2 after:border-primary after:bg-white"
          :class="{ 'pointer-events-none opacity-0 ': !isOpenedUserMenu }">
          <li>
            <button
              type="button"
              @click="toggleUserMenu"
              class="w-full border-x-2 border-t-2 border-primary bg-white py-2 hover:bg-gray-100">
              我的貼文牆
            </button>
          </li>
          <li>
            <button
              type="button"
              @click="toggleUserMenu"
              class="w-full border-x-2 border-t-2 border-primary bg-white py-2 hover:bg-gray-100">
              修改個人資料
            </button>
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
</template>

<script setup>
import { ref, onMounted } from 'vue';
import createUserStore from '@/stores/userStore';

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
</script>
