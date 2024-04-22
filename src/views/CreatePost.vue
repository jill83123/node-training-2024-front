<template>
  <VueLoading v-model:active="isLoading" />

  <div class="relative mb-3 h-[64px]">
    <h2
      class="absolute bottom-0 left-0 right-0 top-0 z-10 border-2 border-primary bg-white py-[18px] text-center text-xl font-bold">
      張貼動態
    </h2>
    <div
      class="absolute bottom-[-4px] left-[-4px] right-1 top-1 z-0 border-2 border-primary bg-white py-[18px] text-center text-xl font-bold" />
  </div>

  <VForm
    ref="form"
    v-slot="errors"
    @submit="createPost"
    class="border-2 border-primary bg-white p-8">
    <div class="mb-4">
      <label for="content" class="mb-1 block">
        貼文內容
        <span class="text-danger">*</span>
      </label>
      <VField
        id="content"
        name="貼文內容"
        placeholder="輸入您的貼文內容"
        class="min-h-[169px] w-full border-2 border-primary px-3 py-4"
        v-model="postData.content"
        style="resize: none"
        rules="required"
        as="textarea" />
      <ErrorMessage name="貼文內容" class="block text-sm text-danger" />
    </div>

    <div class="mb-4">
      <p class="mb-1 mr-2">
        類型
        <span class="text-danger">*</span>
      </p>
      <div class="mb-[2px] flex items-center gap-2">
        <label for="friend" class="flex items-center gap-1">
          <VField
            name="類型"
            rules="required"
            id="friend"
            type="radio"
            value="friend"
            v-model="postData.type" />
          好友
        </label>
        <label for="public" class="flex items-center gap-1">
          <VField
            name="類型"
            rules="required"
            id="public"
            type="radio"
            value="public"
            v-model="postData.type" />
          公開
        </label>
      </div>
      <ErrorMessage name="類型" class="block text-sm text-danger" />
    </div>

    <div class="mb-6">
      <label for="tags" class="mb-1 block">標籤（選填）</label>
      <div class="mr-2 flex select-none flex-wrap items-center gap-2">
        <div
          v-for="(tag, index) in postData.tags"
          :key="index"
          class="relative flex max-w-fit items-center rounded border-2 border-primary">
          <span class="material-symbols-outlined ml-2 select-none">tag</span>
          <VField
            rules="required"
            type="text"
            :id="`tag${index}`"
            :name="`標籤 ${index}`"
            v-model="postData.tags[index]"
            :value="tag"
            placeholder="標籤內容"
            class="w-[100px] py-1 pl-1 pr-3" />
          <button
            type="button"
            class="material-symbols-outlined absolute right-1 ml-1"
            @click="postData.tags.splice(index, 1)">
            close
          </button>
        </div>

        <button
          type="button"
          class="material-symbols-outlined h-8 w-8 rounded-full bg-primary p-1 text-base text-white hover:bg-goldenrod hover:text-primary"
          @click="addTag()">
          add
        </button>
      </div>
      <p
        v-if="errors.errors && Object.keys(errors.errors).find((key) => /標籤/i.test(key))"
        class="mt-1 flex items-center text-sm text-danger">
        標籤欄位不得為空
      </p>
    </div>

    <div class="mb-8">
      <button
        type="button"
        class="rounded bg-primary px-8 py-1 text-center text-white hover:bg-goldenrod hover:text-primary">
        上傳圖片
      </button>
      <span class="mx-3">或是</span>
      <button
        type="button"
        class="border-b-2 border-primary hover:border-secondary hover:text-secondary"
        @click="toggleUrlInput('open')">
        輸入網址
      </button>

      <div v-show="isShowImageInput" class="mt-3 flex border-2 border-primary px-4 py-2">
        <VField
          name="圖片網址"
          rules="url"
          v-model="postData.image"
          type="text"
          placeholder="請輸入圖片網址"
          class="block w-full" />
        <button
          type="button"
          class="material-symbols-outlined ml-1"
          @click="toggleUrlInput('close')">
          close
        </button>
      </div>
      <ErrorMessage name="圖片網址" class="mt-1 block text-sm text-danger" />

      <div v-show="postData.image && !errors.errors['圖片網址']" class="relative">
        <img :src="postData.image" alt="post-image" class="mb-8 object-contain" />
        <button
          v-show="!isShowImageInput"
          type="button"
          class="material-symbols-outlined absolute right-0 top-0 p-4"
          @click="toggleUrlInput('close')">
          close
        </button>
      </div>
    </div>

    <button
      type="submit"
      class="mx-auto block w-full rounded-lg border-2 border-primary bg-goldenrod py-4 disabled:bg-[#A8B0B9] disabled:text-primary sm:w-auto sm:px-[130px]"
      style="box-shadow: -2px 2px 0px #000400"
      :disabled="
        Object.keys(errors.errors).length !== 0
          || postData.content === ''
          || postData.type === ''
          || postData.tags.find((tag) => tag === '')
      ">
      送出貼文
    </button>
  </VForm>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import axios from 'axios';
import { showToast, showCheck } from '@/utils/sweetalert';

const isLoading = ref(false);

const postData = ref({
  user: '6608ed1d2846fccc562fcde1',
  content: '',
  type: '',
  tags: [],
  image: '',
});

const isShowImageInput = ref(false);
function toggleUrlInput(option) {
  if (option === 'open') {
    isShowImageInput.value = true;
  } else if (postData.value.image === '') {
    isShowImageInput.value = false;
  } else {
    showCheck({
      icon: 'warning',
      title: '確定要刪除圖片嗎',
      text: '此操作將無法復原',
      onConfirm() {
        postData.value.image = '';
        isShowImageInput.value = false;
      },
    });
  }
}

const form = ref(null);
async function createPost() {
  isLoading.value = true;
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/post `, postData.value);
    form.value.resetForm();
    showToast({ icon: 'success', title: '新增貼文成功' });
  } catch (err) {
    showToast({ icon: 'error', title: err.response?.data?.message ?? err.message ?? '發生錯誤' });
  }
  isLoading.value = false;
}

async function addTag() {
  postData.value.tags.push('');
  const lastIndex = postData.value.tags.length - 1;
  await nextTick;
  document.querySelector(`#tag${lastIndex}`).focus();
}
</script>
