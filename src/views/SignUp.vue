<template>
  <VueLoading v-model:active="isLoading" />

  <h2 class="mb-9 text-center text-2xl font-bold leading-tight text-primary">註冊</h2>

  <VForm ref="form" v-slot="errors" @submit="registerAccount">
    <div class="mb-4">
      <div class="flex border-2 border-primary bg-white px-4 py-3">
        <VField
          name="暱稱"
          rules="required|min:2"
          v-model="user.name"
          type="text"
          placeholder="請輸入暱稱"
          class="block w-full" />
      </div>
      <ErrorMessage name="暱稱" class="mt-1 block text-sm text-danger" />
    </div>

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

      <span v-if="!errors.errors.Email && isRegistered" class="mt-1 block text-sm text-danger">
        帳號已被註冊，請替換新的 Email！
      </span>
    </div>

    <div class="mb-4">
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

    <div class="mb-8">
      <div class="flex border-2 border-primary bg-white px-4 py-3">
        <VField
          name="確認密碼"
          :rules="{ required: true, same: ['密碼', user.password] }"
          v-model="user.confirmPassword"
          type="password"
          placeholder="確認密碼"
          class="block w-full" />
      </div>
      <ErrorMessage name="確認密碼" class="mt-1 block text-sm text-danger" />
    </div>

    <button
      type="submit"
      class="block w-full rounded-lg border-2 border-primary bg-secondary py-4 text-white shadow-[-2px_2px_0px_#000400] disabled:border-[#808080] disabled:bg-[#A8B0B9] disabled:shadow-none sm:px-[130px]"
      :disabled="
        Object.keys(errors.errors).length !== 0
          || !user.name
          || !user.email
          || !user.password
          || !user.confirmPassword
          || isRegistered
      ">
      註冊
    </button>

    <RouterLink
      to="/sign/in"
      class="hover: block py-4 text-center underline-offset-8 hover:underline">
      登入
    </RouterLink>
  </VForm>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { showToast } from '@/utils/sweetAlert';

const router = useRouter();
const isLoading = ref(false);

const user = ref({});

let registeredEmail = '';
const isRegistered = ref(false);
watch(
  () => user.value.email,
  (newEmail) => {
    if (newEmail === registeredEmail) {
      isRegistered.value = true;
    } else {
      isRegistered.value = false;
    }
  },
);

async function registerAccount() {
  isLoading.value = true;
  isRegistered.value = false;
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/sign_up`, user.value);
    const { token, expires } = res.data;
    document.cookie = `MetaWallToken=${token}; expires=${new Date(expires)}`;
    showToast({ icon: 'success', title: '註冊成功' });
    router.push('/');
  } catch (err) {
    if (err.response.data.message === '該 email 已被使用過') {
      isRegistered.value = true;
      registeredEmail = `${user.value.email}`;
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
