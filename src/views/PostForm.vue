<template>
  <VueLoading v-model:active="isLoading" />

  <PageTitle :title="route.fullPath === '/post/create' ? '張貼動態' : '編輯貼文'" />

  <VForm
    ref="form"
    v-slot="errors"
    @submit="submitPost"
    class="border-2 border-primary bg-white p-5 md:p-8">
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
            class="w-[100px] py-1 pl-1 pr-8" />
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
      <div class="flex items-center">
        <label
          @keyup.enter="uploadImage"
          tabindex="0"
          class="flex w-full max-w-32 cursor-pointer items-center justify-center rounded bg-primary py-1 text-center text-white hover:bg-goldenrod hover:text-primary">
          <SpinnerComponent v-if="isUploading" :width="'16px'" :height="'16px'" :color="'white'" />
          <span class="ml-2">上傳圖片</span>
          <input type="file" ref="imageFileInput" @change="uploadImage" class="hidden" />
        </label>

        <span class="mx-3">或是</span>

        <button
          type="button"
          class="border-b-2 border-primary hover:border-secondary hover:text-secondary disabled:border-gray-400 disabled:text-gray-400"
          @click="handleUrlInput('open')"
          :disabled="postData.image.length > 0 || isShowImageInput">
          輸入網址
        </button>
      </div>

      <div v-show="isShowImageInput" class="mt-3 flex border-2 border-primary px-4 py-2">
        <VField
          id="imageUrlInput"
          name="圖片網址"
          rules="url"
          v-model="postData.image"
          type="text"
          placeholder="請輸入圖片網址"
          class="block w-full" />
        <button
          type="button"
          class="material-symbols-outlined ml-1 disabled:text-gray-300"
          @click="handleUrlInput('clear')"
          :disabled="!postData.image">
          close
        </button>
      </div>
      <ErrorMessage name="圖片網址" class="mt-1 block text-sm text-danger" />

      <p v-if="!errors.errors['圖片網址'] && isCheckingImage" class="mt-1 text-sm">檢查中...</p>
      <p
        v-if="!errors.errors['圖片網址'] && !isValidImage && !isCheckingImage"
        class="mt-1 text-sm text-danger">
        無效的網址，請確認網址是否正確
      </p>

      <div v-show="postData.image && !errors.errors['圖片網址']" class="relative">
        <img
          v-show="isValidImage && !isCheckingImage"
          :src="postData.image"
          alt="貼文圖片"
          class="mx-auto mt-2 h-auto rounded-lg border-2 border-primary object-contain" />
        <button
          v-show="!isShowImageInput"
          type="button"
          class="material-symbols-outlined absolute right-0 top-0 p-4"
          @click="deleteImage">
          close
        </button>
      </div>

      <p class="mt-2 block text-sm text-danger">{{ imageUploadError }}</p>
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
          || !isValidImage
          || isCheckingImage
      ">
      送出貼文
    </button>
  </VForm>
</template>

<script setup>
import axios from 'axios';
import { debounce } from 'lodash';
import {
  ref, nextTick, watch, onMounted,
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import createPostStore from '@/stores/postStore';
import PageTitle from '@/components/PageTitle.vue';
import SpinnerComponent from '@/components/SpinnerComponent.vue';
import { showCheck } from '@/utils/sweetAlert';
import { checkUrlValid } from '@/utils/formValidate';

const route = useRoute();
const router = useRouter();

const postStore = createPostStore();

const postData = ref({
  content: '',
  type: '',
  tags: [],
  image: '',
});

const isShowImageInput = ref(false);
async function handleUrlInput(option) {
  if (option === 'open' && !isShowImageInput.value) {
    isShowImageInput.value = true;
    await nextTick;
    document.querySelector('#imageUrlInput').focus();
  } else if (option === 'clear' && postData.value.image.trim()) {
    showCheck({
      icon: 'warning',
      title: '確定要清除網址嗎',
      text: '注意：此操作將無法復原',
      onConfirm() {
        postData.value.image = '';
      },
    });
  }
}

function deleteImage() {
  showCheck({
    icon: 'warning',
    title: '確定要刪除圖片嗎',
    text: '注意：此操作將無法復原',
    onConfirm() {
      postData.value.image = '';
    },
  });
}

const isValidImage = ref(true);
const isCheckingImage = ref(false);
const debouncedCheckImage = debounce(async (url) => {
  isValidImage.value = await checkUrlValid(url);
  isCheckingImage.value = false;
}, 500);
watch(
  () => postData.value.image,
  async (newUrl) => {
    if (newUrl.trim() === '') {
      isValidImage.value = true;
      isCheckingImage.value = false;
      return;
    }
    isCheckingImage.value = true;
    await debouncedCheckImage(newUrl);
  },
);

const API_URL = import.meta.env.VITE_API_URL;
const isLoading = ref(false);

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

    const res = await axios.post(`${API_URL}/upload/image?type=post `, formData);

    postData.value.image = res.data.imageUrl;
    isShowImageInput.value = false;
  } catch (err) {
    imageUploadError.value = err.response?.data?.message || err.message;
  }
  isUploading.value = false;
}

async function addTag() {
  postData.value.tags.push('');
  const lastIndex = postData.value.tags.length - 1;
  await nextTick;
  document.querySelector(`#tag${lastIndex}`).focus();
}

let isNewPost = null;
const form = ref(null);
async function submitPost() {
  const { postId } = route.params;

  isLoading.value = true;
  await postStore.submitPost({
    form,
    postId,
    postData,
    isNewPost,
  });
  isLoading.value = false;
}

function handlePostInitData() {
  if (route.fullPath === '/post/create') {
    isNewPost = true;
    form.value.resetForm();
  } else if (!postStore.editingPostData.content) {
    router.push('/');
  } else if (route.fullPath.match('/post/edit/')) {
    isNewPost = false;
    postData.value = { ...postStore.editingPostData };
  }
}
watch(route, () => {
  handlePostInitData();
});
onMounted(() => {
  handlePostInitData();
});
</script>
