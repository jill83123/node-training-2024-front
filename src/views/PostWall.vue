<template>
  <VueLoading v-model:active="isLoading" />

  <div class="mb-4 flex flex-col gap-3 lg:flex-row">
    <div id="sortMenu" class="border-2 border-primary bg-white">
      <div class="relative">
        <div
          class="flex cursor-pointer items-center justify-between px-4 py-3 lg:w-[156px]"
          @click="toggleSortMenu()"
          @keyup.enter="toggleSortMenu()">
          <p>{{ sort === 'asc' ? '由舊至新' : '最新貼文' }}</p>
          <span
            class="material-symbols-outlined select-none transition-all duration-300"
            :class="isOpenedSortMenu ? 'rotate-180' : ''">
            expand_more
          </span>
        </div>

        <ul
          :class="{ 'pointer-events-none opacity-0 ': !isOpenedSortMenu }"
          class="absolute left-0 right-0 top-14 z-10 bg-white outline outline-2 outline-primary transition-all">
          <li
            class="px-4 py-3"
            :class="
              sort === 'desc'
                ? 'pointer-events-none bg-secondary text-white'
                : 'cursor-pointer hover:bg-gray-100'
            "
            @click="
              toggleSortMenu('desc');
              handleGetPosts();
            "
            @keyup.enter="
              toggleSortMenu('desc');
              handleGetPosts();
            ">
            最新貼文
          </li>
          <li
            class="px-4 py-3"
            :class="
              sort === 'asc'
                ? 'pointer-events-none bg-secondary text-white'
                : 'cursor-pointer hover:bg-gray-100'
            "
            @click="
              toggleSortMenu('asc');
              handleGetPosts();
            "
            @keyup.enter="
              toggleSortMenu('asc');
              handleGetPosts();
            ">
            由舊至新
          </li>
        </ul>
      </div>
    </div>

    <div class="flex w-full select-none items-center border-2 border-primary bg-white">
      <label for="search" class="hidden" />
      <input
        id="search"
        type="text"
        placeholder="搜尋貼文"
        class="focus-visible: block h-full w-full px-4 py-3 outline-none"
        v-model.trim="keywords"
        @keyup.enter="handleGetPosts()" />
      <button
        type="button"
        class="flex aspect-square items-center justify-center border-l-2 border-primary bg-secondary p-[13px] text-xl text-white"
        @click="handleGetPosts()">
        <span class="material-symbols-outlined h-5 w-5">search</span>
      </button>
    </div>
  </div>

  <template v-if="postStore.posts?.length > 0">
    <div class="post">
      <div
        class="mb-4 rounded-lg border-2 border-primary bg-white p-6"
        style="box-shadow: 0px 3px 0px #000400"
        v-for="(post, index) in postStore.posts"
        :key="post._id">
        <div class="mb-3">
          <div class="relative bottom-0 mb-4 flex">
            <div class="flex w-full gap-4">
              <img
                :src="
                  post.user && post.user.photo !== '' ? post.user.photo : '/images/user_default.png'
                "
                alt="大頭貼"
                class="h-[45px] w-[45px] rounded-full border-2 border-primary" />

              <div>
                <button
                  type="button"
                  class="self-start font-bold hover:text-secondary hover:underline hover:decoration-secondary hover:underline-offset-2">
                  {{ post.user?.name }}
                </button>

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
              <li
                v-for="(tag, index) in post.tags"
                :key="`${tag}${index}`"
                class="flex items-center">
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
            @click="
              async () => {
                await userStore.handleLikePost(post.isLiked, post._id);
                handleGetPosts();
              }
            "
            :disabled="userStore.likingId === post._id"
            class="-ml-2 flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-gray-100"
            :class="post.likes ? 'text-secondary' : 'text-[#9B9893] hover:text-secondary'">
            <span
              class="material-symbols-outlined mt-[2px] text-xl"
              :style="
                post.isLiked
                  ? 'font-variation-settings: \'FILL\' 1, \'wght\' 400, \'GRAD\' 0, \'opsz\' 24;'
                  : ''
              ">
              thumb_up
            </span>
            <span>{{ post.likes ? post.likes : '成為第一個按讚的朋友' }}</span>
            <svg
              v-if="userStore.likingId === post._id"
              class="h-4 w-4 animate-spin text-secondary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4" />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
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

        <template v-if="isShowCommentList[post._id]">
          <div class="mb-[18px] mt-5 flex">
            <img
              :src="
                createUserStore.user && createUserStore.user.photo !== ''
                  ? createUserStore.user.photo
                  : '/images/user_default.png'
              "
              alt="大頭貼"
              class="mr-2 h-[40px] w-[40px] rounded-full border-2 border-primary" />
            <div class="w-full border-2 border-primary px-4 py-1">
              <label :for="`commentInput-${index}`">
                <input
                  :id="`commentInput-${index}`"
                  type="text"
                  class="h-full w-full"
                  placeholder="留言..."
                  v-model="tempComment[post._id]"
                  @keyup.enter="postComment(post._id)" />
              </label>
            </div>
            <button
              type="button"
              class="flex min-w-24 items-center justify-center gap-2 border-2 border-l-0 border-primary bg-secondary text-white hover:bg-goldenrod hover:text-primary disabled:bg-gray-300 disabled:text-primary md:min-w-32"
              @click="postComment(post._id)"
              :disabled="
                !tempComment[post._id]?.length
                  || !tempComment[post._id]?.trim()
                  || commentingId === post._id
              ">
              留言
              <svg
                v-if="commentingId === post._id"
                class="h-[14px] w-[14px] animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4" />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </button>
          </div>

          <template v-if="post.comments.length > 0">
            <div>
              <div
                v-for="(comment, index) in post.comments"
                :key="comment.id"
                class="flex items-center rounded-xl bg-[#EFECE7] bg-opacity-30 px-4 py-[18px]"
                :class="index === post.comments.length - 1 ? 'mb-0' : 'mb-4'">
                <div class="flex w-full">
                  <img
                    :src="
                      comment.user && comment.user.photo !== ''
                        ? comment.user.photo
                        : '/images/user_default.png'
                    "
                    alt="大頭貼"
                    class="mr-3 h-[40px] w-[40px] self-start rounded-full border-2 border-primary" />
                  <div class="w-full">
                    <div class="mb-1">
                      <button
                        type="button"
                        class="self-start font-bold hover:text-secondary hover:underline hover:decoration-secondary hover:underline-offset-2">
                        {{ comment.user.name }}
                      </button>
                      <div class="text-[12px] text-[#9B9893]">
                        <time>{{ formatDate(comment.createdAt) }}</time>
                        <span
                          :title="formatDate(comment.updatedAt)"
                          v-if="comment.updatedAt !== comment.createdAt && comment.updatedAt">
                          ( 已編輯 )
                        </span>
                      </div>
                    </div>

                    <div
                      v-if="isShowEditCommentInput && comment._id === editingCommentId"
                      class="mt-2">
                      <label
                        for="editCommentInput"
                        class="mb-2 block w-full border-2 border-primary px-2 py-1">
                        <input type="text" id="editCommentInput" v-model="tempEditComment" />
                      </label>
                      <div class="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          @click="
                            isShowEditCommentInput = false;
                            editingCommentId = '';
                          "
                          class="border-2 border-primary bg-gray-50 px-4 py-1">
                          取消
                        </button>
                        <button
                          type="button"
                          @click="editComment(comment._id)"
                          class="flex items-center gap-2 border-2 border-primary bg-secondary px-4 py-1 text-white">
                          確定
                          <svg
                            v-if="commentingId === comment._id"
                            class="h-4 w-4 animate-spin text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24">
                            <circle
                              class="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              stroke-width="4" />
                            <path
                              class="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p v-else>{{ comment.comment }}</p>
                  </div>
                </div>

                <div
                  id="commentMenu"
                  v-if="comment.user._id === userStore.user.id"
                  class="relative self-start">
                  <button
                    type="button"
                    @click="toggleCommentMenu(comment._id)"
                    class="material-symbols-outlined text-primary opacity-70 hover:opacity-100"
                    :class="{ 'opacity-100': openedCommentMenuId === comment._id }">
                    more_horiz
                  </button>

                  <ul
                    class="absolute right-0 top-8 z-10 w-32 text-center transition-all after:absolute after:-bottom-2 after:-right-2 after:left-2 after:top-2 after:-z-10 after:border-2 after:border-primary after:bg-white"
                    :class="{
                      'pointer-events-none opacity-0 ': openedCommentMenuId !== comment._id,
                    }">
                    <li>
                      <button
                        type="button"
                        @click="
                          toggleCommentMenu();
                          openEditCommentInput(comment._id, comment.comment);
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
                          toggleCommentMenu();
                          deleteComment(comment._id);
                        "
                        class="flex w-full items-center gap-2 border-2 border-primary bg-white px-3 py-2 hover:bg-gray-100">
                        <span class="material-symbols-outlined text-xl leading-none">delete</span>
                        刪除
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </template>

  <template v-else>
    <div
      class="rounded-lg border-2 border-primary bg-white"
      style="box-shadow: 0px 3px 0px #000400">
      <div class="flex items-center gap-[6px] border-b-2 border-primary p-4">
        <div
          class="h-[10px] w-[10px] select-none rounded-full border border-[#707070] bg-[#DE4B63]" />
        <div
          class="h-[10px] w-[10px] select-none rounded-full border border-[#707070] bg-[#FAA722]" />
        <div
          class="h-[10px] w-[10px] select-none rounded-full border border-[#707070] bg-[#83C51D]" />
      </div>
      <p class="py-8 text-center text-[#9B9893]">目前尚無動態，新增一則貼文吧！</p>
    </div>
  </template>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import createUserStore from '@/stores/userStore';
import createPostStore from '@/stores/postStore';
import axios from 'axios';
import { showToast, showCheck } from '@/utils/sweetAlert';
import { formatDate } from '@/utils/format';

const userStore = createUserStore();
const postStore = createPostStore();

const API_URL = import.meta.env.VITE_API_URL;

const sort = ref('desc');
const keywords = ref('');

const isOpenedSortMenu = ref(false);
function toggleSortMenu(option) {
  sort.value = option ?? sort.value;
  isOpenedSortMenu.value = !isOpenedSortMenu.value;
}

const isLoading = ref(false);

async function handleGetPosts() {
  await postStore.getPosts({ sort: sort.value, keywords: keywords.value });
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

const openedCommentMenuId = ref('');
function toggleCommentMenu(id) {
  if (openedCommentMenuId.value === id) {
    openedCommentMenuId.value = '';
  } else {
    openedCommentMenuId.value = id;
  }
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

const tempComment = ref({});
const commentingId = ref('');
async function postComment(postId) {
  commentingId.value = postId;
  try {
    const data = {
      comment: tempComment.value[postId],
    };
    await axios.post(`${API_URL}/post/${postId}/comment`, data);
    tempComment.value[postId] = '';
    await handleGetPosts();
  } catch (err) {
    showToast({ icon: 'error', title: err.response?.data?.message || err.message });
  }
  commentingId.value = '';
}

const preEditComment = ref('');
const tempEditComment = ref('');
const editingCommentId = ref('');
const isShowEditCommentInput = ref(false);

async function openEditCommentInput(commentId, comment) {
  preEditComment.value = comment;
  tempEditComment.value = comment;
  editingCommentId.value = commentId;
  isShowEditCommentInput.value = true;
  await nextTick;
  document.querySelector('#editCommentInput').focus();
}

async function editComment(commentId) {
  commentingId.value = commentId;

  if (preEditComment.value !== tempEditComment.value) {
    try {
      const data = {
        comment: tempEditComment.value,
      };
      await axios.patch(`${API_URL}/post/comment/${commentId}`, data);
      await handleGetPosts();
    } catch (err) {
      showToast({ icon: 'error', title: err.response?.data?.message || err.message });
    }
  }

  commentingId.value = '';
  editingCommentId.value = '';
  isShowEditCommentInput.value = false;
}

const isDeletingComment = ref('');
function deleteComment(commentId) {
  showCheck({
    icon: 'warning',
    title: '確定要刪除留言嗎',
    text: '注意：此操作將無法復原',
    onConfirm: async () => {
      isDeletingComment.value = commentId;
      try {
        await axios.delete(`${API_URL}/post/comment/${commentId}`);
        await handleGetPosts();
      } catch (err) {
        showToast({ icon: 'error', title: err.response?.data?.message || err.message });
      }
      isDeletingComment.value = '';
    },
  });
}

onMounted(async () => {
  isLoading.value = true;
  await handleGetPosts();
  isLoading.value = false;

  document.querySelector('body').addEventListener('click', (e) => {
    if (!e.target.closest('#sortMenu')) {
      isOpenedSortMenu.value = false;
    }
    if (!e.target.closest('#postMenu')) {
      openedPostMenuId.value = '';
    }
    if (!e.target.closest('#commentMenu')) {
      openedCommentMenuId.value = '';
    }
  });
});
</script>
