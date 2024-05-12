<template>
  <VueLoading v-model:active="isLoading" />

  <h2 class="mb-9 text-center text-2xl font-bold leading-tight text-primary">
    到元宇宙展開全新社交圈
  </h2>

  <VForm ref="form" v-slot="errors" @submit="login">
    <div class="mb-4">
      <div class="flex border-2 border-primary bg-white px-4 py-3">
        <VField
          name="Email"
          rules="required|email"
          v-model="user.email"
          type="email"
          placeholder="請輸入 Email"
          class="block w-full" />
      </div>
      <ErrorMessage name="Email" class="mt-1 block text-sm text-danger" />

      <span v-if="!errors.errors.Email && !isRegistered" class="mt-1 block text-sm text-danger">
        此 Email 帳號尚未註冊
      </span>
    </div>

    <div class="mb-8">
      <div class="flex border-2 border-primary bg-white px-4 py-3">
        <VField
          name="密碼"
          rules="required|password"
          v-model="user.password"
          type="password"
          placeholder="請輸入密碼"
          class="block w-full" />
      </div>
      <ErrorMessage name="密碼" class="mt-1 block text-sm text-danger" />
    </div>

    <span v-if="isLoginError" class="mb-4 mt-1 block text-center text-sm text-danger">
      帳號或密碼錯誤，請重新輸入！
    </span>

    <button
      type="submit"
      class="block w-full rounded-lg border-2 border-primary bg-secondary py-4 text-white shadow-[-2px_2px_0px_#000400] disabled:border-[#808080] disabled:bg-[#A8B0B9] disabled:shadow-none sm:px-[130px]"
      :disabled="
        Object.keys(errors.errors).length !== 0 || !user.email || !user.password || !isRegistered
      ">
      登入
    </button>

    <RouterLink
      to="/sign/up"
      class="hover: block py-4 text-center underline-offset-8 hover:underline">
      註冊帳號
    </RouterLink>
  </VForm>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { showToast } from '@/utils/sweetalert';

const router = useRouter();
const isLoading = ref(false);

const user = ref({});

let unRegisteredEmail = '';
const isRegistered = ref(true);
watch(
  () => user.value.email,
  (newEmail) => {
    if (newEmail === unRegisteredEmail) {
      isRegistered.value = false;
    } else {
      isRegistered.value = true;
    }
  },
);

const isLoginError = ref(false);
async function login() {
  isLoading.value = true;
  isRegistered.value = true;
  isLoginError.value = false;
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/sign_in`, user.value);
    const { token, expires } = res.data;
    document.cookie = `MetaWallToken=${token}; expires=${new Date(expires)}`;
    router.push('/');
  } catch (err) {
    if (err.response.data.message === '此帳號尚未註冊') {
      isRegistered.value = false;
      unRegisteredEmail = `${user.value.email}`;
    } else if (err.response.data.message === '密碼不正確') {
      isLoginError.value = true;
    } else {
      showToast({
        icon: 'error',
        title: err.response?.data?.message || err.message,
      });
    }
  }
  isLoading.value = false;
}
</script>
