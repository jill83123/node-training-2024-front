<template>
  <VueLoading v-model:active="isLoading" />

  <div class="bg relative min-h-screen after:bg-[length:36px_36px] after:sm:bg-[length:64px_64px]">
    <NavComponent />

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
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import createUserStore from '@/stores/userStore';
import NavComponent from '@/components/NavComponent.vue';
import SecNavComponent from '@/components/SecNavComponent.vue';
import { showToast } from '@/utils/sweetAlert';

const route = useRoute();
const router = useRouter();
const userStore = createUserStore();

const isLoading = ref(false);
const isChecked = ref(false);

async function verifyMail() {
  try {
    const { token } = route.query;
    await axios.post(`${import.meta.env.VITE_API_URL}/user/verifyMail`, { token });
    showToast({ icon: 'success', title: '驗證成功' });
    router.push('/');
  } catch (err) {
    showToast({ icon: 'error', title: err.response?.data?.message || err.message });
  }
}

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

  const { token: verificationMailToken } = route.query;
  if (verificationMailToken) {
    verifyMail();
  }

  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/user/check`);
    await userStore.getUserProfile();
    isChecked.value = true;
  } catch (err) {
    if (err.response.status === 429) {
      showToast({ icon: 'error', title: err.response?.data?.message || err.message });
      return;
    }
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
