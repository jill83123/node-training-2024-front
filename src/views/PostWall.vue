<template>
  <VueLoading v-model:active="isLoading" />

  <template v-if="isUserWall">
    <div
      class="relative mb-5 flex rounded-lg border-2 border-primary bg-white after:absolute after:-bottom-2 after:-left-2 after:right-0 after:top-1 after:-z-10 after:rounded-lg after:border-2 after:border-primary after:bg-white">
      <img
        :src="postStore.user?.photo"
        alt="大頭貼"
        class="h-20 w-20 rounded-s-lg border-r-2 border-primary" />

      <div class="flex w-full items-center justify-between p-4">
        <div>
          <h2 class="font-bold">{{ postStore.user?.name }}</h2>
          <p>{{ postStore.user?.followers }} 人追蹤</p>
        </div>

        <button
          type="button"
          class="min-w-24 rounded-lg border-2 border-primary bg-goldenrod py-1 font-bold"
          style="box-shadow: 0px 2px 0px #000400">
          追蹤
        </button>
      </div>
    </div>
  </template>

  <PostSearchBar v-if="!route.params.postId" />
  <PostComponent v-if="!isLoading" />

  <template v-if="route.params.postId">
    <div class="mb-4 flex justify-end">
      <RouterLink
        to="/"
        class="flex items-center gap-1 rounded-lg border-2 border-primary bg-secondary px-3 py-2 text-white hover:bg-goldenrod hover:text-primary"
        style="box-shadow: 0px 2px 0px #000400">
        <span class="material-symbols-outlined">undo</span>
        返回全部貼文
      </RouterLink>
    </div>
  </template>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import createPostStore from '@/stores/postStore';
import PostSearchBar from '@/components/PostSearchBar.vue';
import PostComponent from '@/components/PostComponent.vue';

const route = useRoute();
const postStore = createPostStore();

const isLoading = ref(false);

const isUserWall = ref(false);
async function handleGetPost() {
  isUserWall.value = route.fullPath.match('/user/');

  if (isUserWall.value) {
    postStore.postsOption = 'user';
    postStore.postsUserId = route.params.userId;
  } else {
    postStore.postsOption = '';
  }

  postStore.keyword = route.query.q ? route.query.q : '';
  postStore.sort = route.query.sort ? route.query.sort : 'desc';

  isLoading.value = true;

  const { postId } = route.params;
  if (postId) {
    await postStore.getPost(postId);
  } else {
    await postStore.getPosts();
  }

  isLoading.value = false;
}
onMounted(async () => {
  handleGetPost();
});
watch(
  () => route,
  () => {
    handleGetPost();
  },
  { deep: true },
);
</script>
