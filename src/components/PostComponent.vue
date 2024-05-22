<template>
  <VueLoading v-model:active="isLoading" />

  <template v-if="postStore.posts?.length">
    <div
      v-for="(post, index) in postStore.posts"
      :key="post._id"
      class="mb-4 rounded-lg border-2 border-primary bg-white p-6"
      style="box-shadow: 0px 3px 0px #000400">
      <div class="mb-3">
        <div class="relative bottom-0 mb-4 flex">
          <div class="flex w-full gap-4">
            <RouterLink :to="`/user/${post.user._id}/posts`">
              <img
                :src="post.user.photo"
                alt="大頭貼"
                class="h-[45px] w-[45px] rounded-full border-2 border-primary" />
            </RouterLink>

            <div>
              <RouterLink
                :to="`/user/${post.user._id}/posts`"
                class="block self-start font-bold hover:text-secondary hover:underline hover:decoration-secondary hover:underline-offset-2">
                {{ post.user?.name }}
              </RouterLink>

              <div class="flex items-center">
                <div class="text-[12px] text-[#9B9893]">
                  <time>{{ formatDate(post.createdAt) }}</time>
                  <span
                    class="ml-1"
                    :title="formatDate(post.updatedAt)"
                    v-if="post.updatedAt !== post.createdAt && post.updatedAt">
                    ( 已編輯 )
                  </span>
                </div>

                <span class="material-symbols-outlined ml-2 text-lg leading-none text-[#707070]">
                  {{ post.type === 'friend' ? 'group' : 'public' }}
                </span>
              </div>
            </div>
          </div>

          <div id="postMenu" v-if="userStore.user.id === post.user._id" class="self-start">
            <button
              type="button"
              @click="togglePostMenu(post._id)"
              class="material-symbols-outlined text-primary opacity-70 hover:opacity-100"
              :class="{ 'opacity-100': openedPostMenuId === post._id }">
              more_horiz
            </button>

            <ul
              class="absolute right-0 top-8 z-10 w-32 text-center transition-all after:absolute after:-bottom-2 after:-right-2 after:left-2 after:top-2 after:-z-10 after:border-2 after:border-primary after:bg-white"
              :class="{
                'pointer-events-none opacity-0 ': openedPostMenuId !== post._id,
              }">
              <li>
                <button
                  type="button"
                  @click="
                    togglePostMenu();
                    postStore.goToEditPost(post);
                  "
                  class="flex w-full items-center gap-2 border-x-2 border-t-2 border-primary bg-white px-3 py-2 hover:bg-gray-100">
                  <span class="material-symbols-outlined text-xl leading-none">edit</span>
                  編輯
                </button>
              </li>

              <li>
                <button
                  type="button"
                  @click="
                    togglePostMenu();
                    handleDeletePost(post._id);
                  "
                  class="flex w-full items-center gap-2 border-2 border-primary bg-white px-3 py-2 hover:bg-gray-100">
                  <span class="material-symbols-outlined text-xl leading-none">delete</span>
                  刪除
                </button>
              </li>
            </ul>
          </div>
        </div>

        <p class="mb-1">{{ post.content }}</p>

        <template v-if="post.tags.length">
          <ul class="flex flex-wrap items-center gap-1 text-sm text-secondary">
            <li v-for="(tag, index) in post.tags" :key="`${tag}${index}`" class="flex items-center">
              <span class="material-symbols-outlined select-none text-lg">tag</span>
              {{ tag }}
            </li>
          </ul>
        </template>

        <img
          v-if="post.image"
          :src="post.image"
          alt="貼文圖片"
          class="mt-4 max-w-full rounded-lg border-2 border-primary object-contain" />
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="handleLikePost(post.isLiked, post._id)"
          :disabled="likingId === post._id"
          class="-ml-2 flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-gray-100"
          :class="post.likes ? 'text-secondary' : 'text-[#9B9893] hover:text-secondary'">
          <span
            class="material-symbols-outlined mt-[2px] text-xl"
            :style="post.isLiked ? 'font-variation-settings: \'FILL\' 1;' : ''">
            thumb_up
          </span>

          <span>{{ post.likes ? post.likes : '成為第一個按讚的朋友' }}</span>

          <SpinnerComponent
            v-if="likingId === post._id"
            :width="'16px'"
            :height="'16px'"
            :color="'secondary'" />
        </button>

        <button
          type="button"
          class="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-gray-100"
          @click="toggleCommentList(post._id, index)">
          <span class="material-symbols-outlined mt-[2px] text-xl">chat</span>
          <span>{{ post.comments.length }}</span>
          <span
            class="material-symbols-outlined select-none transition-all duration-300"
            :class="{ 'rotate-180': isShowCommentList[post._id] }">
            expand_more
          </span>
        </button>
      </div>

      <PostComment v-if="isShowCommentList[post._id]" :post="post" :postIndex="index" />
    </div>
  </template>

  <template v-else>
    <div
      class="rounded-lg border-2 border-primary bg-white"
      style="box-shadow: 0px 3px 0px #000400">
      <div class="flex items-center gap-[6px] border-b-2 border-primary p-4">
        <span
          v-for="color in ['#DE4B63', '#FAA722', '#83C51D']"
          :key="color"
          class="select-none rounded-full border"
          :style="`background-color: ${color}; border-color: #707070; height: 10px; width: 10px;`" />
      </div>

      <div class="py-8">
        <p v-if="postStore.keyword === ''" class="text-center text-[#9B9893]">
          目前尚無動態，新增一則貼文吧！
        </p>

        <template v-else>
          <p class="mb-1 text-center text-[#9B9893]">查無相關貼文</p>

          <div class="flex">
            <RouterLink
              :to="`${route.path}`"
              class="mx-auto flex items-center gap-1 text-secondary hover:opacity-80">
              <span class="material-symbols-outlined">undo</span>
              <span class="mr-2">返回</span>
            </RouterLink>
          </div>
        </template>
      </div>
    </div>
  </template>
</template>

<script setup>
import {
  ref, nextTick, onMounted, onBeforeUnmount,
} from 'vue';
import { useRoute } from 'vue-router';
import createUserStore from '@/stores/userStore';
import createPostStore from '@/stores/postStore';
import PostComment from '@/components/PostComment.vue';
import SpinnerComponent from '@/components/SpinnerComponent.vue';
import { formatDate } from '@/utils/format';
import { showCheck } from '@/utils/sweetAlert';

const route = useRoute();

const userStore = createUserStore();
const postStore = createPostStore();

const isLoading = ref(false);

onMounted(async () => {
  isLoading.value = true;
  await postStore.getPosts();
  isLoading.value = false;
});

const likingId = ref('');
async function handleLikePost(isLiked, postId) {
  likingId.value = postId;
  await userStore.handleLikePost(isLiked, postId);
  postStore.getPosts();
  likingId.value = '';
}

const isShowCommentList = ref({});
async function toggleCommentList(postId, postIndex) {
  isShowCommentList.value[postId] = !isShowCommentList.value[postId];
  await nextTick;
  const commentInput = document.querySelector(`#commentInput-${postIndex}`);
  if (commentInput) {
    commentInput.focus();
  }
}

async function handleDeletePost(postId) {
  showCheck({
    icon: 'warning',
    title: '確定要刪除貼文嗎',
    text: '注意：此操作將無法復原',
    onConfirm: async () => {
      isLoading.value = true;
      await postStore.deletePost(postId);
      isLoading.value = false;
    },
  });
}

const openedPostMenuId = ref('');
function togglePostMenu(id) {
  if (openedPostMenuId.value === id) {
    openedPostMenuId.value = '';
  } else {
    openedPostMenuId.value = id;
  }
}

const handleBodyClick = (e) => {
  if (!e.target.closest('#postMenu')) {
    openedPostMenuId.value = '';
  }
};
onMounted(async () => {
  document.querySelector('body').addEventListener('click', handleBodyClick);
});
onBeforeUnmount(() => {
  document.querySelector('body').removeEventListener('click', handleBodyClick);
});
</script>
