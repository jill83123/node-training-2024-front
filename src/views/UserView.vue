<template>
  <VueLoading v-model:active="isLoading" />
  <NavComponent />

  <div
    class="bg relative min-h-[calc(100vh_-_66px)] after:bg-[length:36px_36px] after:sm:bg-[length:64px_64px]">
    <div class="container flex justify-between gap-7 py-12">
      <main class="w-full lg:w-[62%]">
        <RouterView v-if="isChecked" />
      </main>

      <SecNavComponent />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import createUserStore from '@/stores/userStore';
import NavComponent from '@/components/NavComponent.vue';
import SecNavComponent from '@/components/SecNavComponent.vue';

const router = useRouter();
const userStore = createUserStore();

const isLoading = ref(false);
const isChecked = ref(false);
onMounted(async () => {
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)MetaWallToken\s*=\s*([^;]*).*$)|^.*$/,
    '$1',
  );

  if (token) {
    axios.defaults.headers.common.authorization = `Bearer ${token}`;
  } else {
    router.push('/sign/in');
  }

  isLoading.value = true;
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/user/check`);
    await userStore.getUserProfile();
    isChecked.value = true;
  } catch (err) {
    router.push('/sign/in');
  }
  isLoading.value = false;
});
</script>

<style>
.bg::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: url('/images/bg.svg');
  z-index: -100;
}
</style>
