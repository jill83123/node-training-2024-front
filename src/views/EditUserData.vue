<template>
  <VueLoading v-model:active="isLoading" />

  <PageTitle :title="'修改個人資料'" />

  <div class="mt-9">
    <ul class="ml-4 flex items-center">
      <li>
        <button
          type="button"
          @click="currentEdit = 'name'"
          class="rounded-tl-lg rounded-tr-lg border-2 border-b-0 border-primary px-6 py-2"
          :class="currentEdit === 'name' ? 'bg-primary text-white' : 'bg-white'"
          :disabled="currentEdit === 'name'">
          暱稱修改
        </button>
      </li>
      <li>
        <button
          type="button"
          @click="currentEdit = 'password'"
          class="rounded-tl-lg rounded-tr-lg border-2 border-b-0 border-primary px-6 py-2"
          :class="currentEdit === 'password' ? 'bg-primary text-white' : 'bg-white'"
          :disabled="currentEdit === 'password'">
          重設密碼
        </button>
      </li>
    </ul>

    <div class="rounded-lg border-2 border-primary bg-white p-8">
      <template v-if="currentEdit === 'name'">
        <div class="mb-4">
          <img
            :src="userData.photo"
            alt="大頭貼"
            class="mx-auto mb-4 block h-[107px] w-[107px] rounded-full border-2 border-primary" />
          <label
            @keyup.enter="uploadImage"
            tabindex="0"
            class="mx-auto flex w-full max-w-32 cursor-pointer items-center justify-center bg-primary py-1 text-center text-white hover:bg-goldenrod hover:text-primary"
            :class="{ 'pointer-events-none bg-gray-500 hover:bg-auto': isUploading }">
            <SpinnerComponent
              v-if="isUploading"
              :width="'16px'"
              :height="'16px'"
              :color="'white'" />
            <span :class="{ 'ml-2': isUploading }">上傳大頭照</span>
            <input type="file" ref="imageFileInput" @change="uploadImage" class="hidden" />
          </label>
        </div>

        <VForm ref="form" v-slot="errors" @submit="updateUserData">
          <div class="mx-auto mb-4 max-w-80">
            <label for="name" class="mb-1 block">
              暱稱
              <span class="text-danger">*</span>
            </label>
            <VField
              id="name"
              name="暱稱"
              placeholder="輸入您的暱稱"
              class="block w-full border-2 border-primary px-6 py-[14px]"
              v-model="userData.name"
              rules="required|min:2" />
            <ErrorMessage name="暱稱" class="block text-sm text-danger" />
          </div>

          <div class="mx-auto mb-8 max-w-80">
            <p class="mb-1 mr-2">
              性別
              <span class="text-danger">*</span>
            </p>
            <div class="mb-[2px] flex items-center gap-6">
              <label for="male" class="flex items-center gap-1">
                <VField
                  name="性別"
                  rules=""
                  id="male"
                  type="radio"
                  value="male"
                  v-model="userData.gender" />
                男
              </label>
              <label for="female" class="flex items-center gap-1">
                <VField
                  name="性別"
                  rules=""
                  id="female"
                  type="radio"
                  value="female"
                  v-model="userData.gender" />
                女
              </label>
              <label for="intersex" class="flex items-center gap-1">
                <VField
                  name="性別"
                  rules=""
                  id="intersex"
                  type="radio"
                  value="intersex"
                  v-model="userData.gender" />
                無性別
              </label>
            </div>
            <ErrorMessage name="性別" class="block text-sm text-danger" />
          </div>

          <p class="mb-4 text-center text-sm text-danger">{{ imageUploadError }}</p>

          <button
            type="submit"
            class="mx-auto block w-full rounded-lg border-2 border-primary bg-goldenrod py-4 disabled:bg-[#A8B0B9] disabled:text-primary sm:w-auto sm:px-[130px]"
            style="box-shadow: -2px 2px 0px #000400"
            :disabled="
              Object.keys(errors.errors).length !== 0 || userData.name === '' || !isChange
            ">
            送出更新
          </button>
        </VForm>
      </template>

      <template v-else>
        <VForm ref="form" v-slot="errors" @submit="updatePassword">
          <div class="mx-auto mb-4 max-w-80">
            <label for="oldPassword" class="mb-1 block">
              目前的密碼
              <span class="text-danger">*</span>
            </label>
            <VField
              id="oldPassword"
              name="目前的密碼"
              type="password"
              placeholder="請輸入目前的密碼"
              class="block w-full border-2 border-primary px-6 py-[14px]"
              v-model="userPassword.oldPassword"
              rules="required" />
            <ErrorMessage name="目前的密碼" class="block text-sm text-danger" />
          </div>

          <div class="mx-auto mb-4 max-w-80">
            <label for="newPassword" class="mb-1 block">
              輸入新密碼
              <span class="text-danger">*</span>
            </label>
            <VField
              id="newPassword"
              name="新密碼"
              type="password"
              placeholder="請輸入新密碼"
              class="block w-full border-2 border-primary px-6 py-[14px]"
              v-model="userPassword.newPassword"
              rules="required|password" />
            <ErrorMessage name="新密碼" class="block text-sm text-danger" />
          </div>

          <div class="mx-auto mb-8 max-w-80">
            <label for="confirmNewPassword" class="mb-1 block">
              確認新密碼
              <span class="text-danger">*</span>
            </label>
            <VField
              id="confirmNewPassword"
              name="確認新密碼"
              type="password"
              placeholder="請輸入新密碼"
              class="block w-full border-2 border-primary px-6 py-[14px]"
              v-model="userPassword.confirmNewPassword"
              :rules="{ required: true, same: ['新密碼', userPassword.newPassword] }" />
            <ErrorMessage name="確認新密碼" class="block text-sm text-danger" />
          </div>

          <button
            type="submit"
            class="mx-auto block w-full rounded-lg border-2 border-primary bg-goldenrod py-4 disabled:bg-[#A8B0B9] disabled:text-primary sm:w-auto sm:px-[130px]"
            style="box-shadow: -2px 2px 0px #000400"
            :disabled="
              Object.keys(errors.errors).length !== 0
                || !userPassword.oldPassword
                || !userPassword.newPassword
                || !userPassword.confirmNewPassword
            ">
            重設密碼
          </button>
        </VForm>
      </template>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import createUserStore from '@/stores/userStore';
import PageTitle from '@/components/PageTitle.vue';
import SpinnerComponent from '@/components/SpinnerComponent.vue';
import { showToast } from '@/utils/sweetAlert';

const router = useRouter();
const userStore = createUserStore();

const currentEdit = ref('name');

const userData = ref({});
const userPassword = ref({});

const { VITE_API_URL } = import.meta.env;

const isUploading = ref(false);
const imageFileInput = ref(null);
const imageUploadError = ref('');
async function uploadImage() {
  isUploading.value = true;
  imageUploadError.value = '';
  try {
    const imageFile = imageFileInput.value.files[0];
    const formData = new FormData();
    formData.append('image', imageFile);

    const res = await axios.post(`${VITE_API_URL}/upload/image?type=avatar`, formData);
    userData.value.photo = res.data.imageUrl;
  } catch (err) {
    imageUploadError.value = err.response?.data?.message || err.message;
  }
  isUploading.value = false;
}

const isChange = ref(false);
watch(
  () => userData.value,
  () => {
    let sameNum = 0;
    const totalNum = Object.keys(userData.value).length;

    Object.keys(userData.value).forEach((data) => {
      if (userData.value[data] === userStore.user[data]) {
        sameNum += 1;
      }
    });

    isChange.value = sameNum !== totalNum;
  },
  { deep: true },
);

const isLoading = ref(false);
async function updateUserData() {
  isLoading.value = true;
  try {
    await axios.patch(`${VITE_API_URL}/user/profile`, userData.value);
    userStore.getUserProfile();
    isChange.value = false;
    showToast({ icon: 'success', title: '更新成功' });
  } catch (err) {
    showToast({ icon: 'error', title: err.response?.data?.message || err.message });
  }
  isLoading.value = false;
}

async function updatePassword() {
  isLoading.value = true;
  try {
    await axios.post(`${VITE_API_URL}/user/updatePassword`, userPassword.value);
    showToast({ icon: 'success', title: '重設成功，請重新登入' });
    router.push('/sign/in');
  } catch (err) {
    showToast({ icon: 'error', title: err.response?.data?.message || err.message });
  }
  isLoading.value = false;
}

onMounted(async () => {
  userData.value = { ...userStore.user };
});
</script>
