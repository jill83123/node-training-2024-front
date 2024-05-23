<template>
  <VueLoading v-model:active="isLoading" />

  <UserPostWallInfo v-if="isUserWall" />
  <PostSearchBar v-if="!route.params.postId" />
  <PostComponent v-if="!isLoading" />

  <template v-if="route.params.postId">
    <div class="mb-4 flex justify-end">
      <RouterLink
        :to="previousRoute.fullPath?.match('/post/edit') ? '/' : previousRoute.fullPath"
        class="flex items-center gap-1 rounded-lg border-2 border-primary bg-secondary px-3 py-2 text-sm text-white hover:bg-goldenrod hover:text-primary"
        style="box-shadow: 0px 2px 0px #000400">
        <span class="material-symbols-outlined text-xl leading-none">undo</span>
        返回
      </RouterLink>
    </div>
  </template>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { previousRoute } from '@/router';
import createPostStore from '@/stores/postStore';
import PostSearchBar from '@/components/PostSearchBar.vue';
import PostComponent from '@/components/PostComponent.vue';
import UserPostWallInfo from '@/components/UserPostWallInfo.vue';

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
