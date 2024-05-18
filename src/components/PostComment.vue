<template>
  <div class="mb-[18px] mt-5 flex">
    <img
      :src="userStore.user.photo"
      alt="大頭貼"
      class="mr-2 h-[40px] w-[40px] rounded-full border-2 border-primary" />

    <div class="w-full border-2 border-primary px-4 py-1">
      <label :for="`commentInput-${props.postIndex}`">
        <input
          :id="`commentInput-${props.postIndex}`"
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
      <SpinnerComponent
        v-if="commentingId === post._id"
        :width="'14px'"
        :height="'14px'"
        :color="'primary'" />
    </button>
  </div>

  <template v-if="props.post.comments.length > 0">
    <div
      v-for="(comment, index) in props.post.comments"
      :key="comment.id"
      class="flex items-center rounded-xl bg-[#EFECE7] bg-opacity-30 px-4 py-[18px]"
      :class="index === props.post.comments.length - 1 ? 'mb-0' : 'mb-4'">
      <div class="flex w-full">
        <img
          :src="comment.user.photo"
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

          <div v-if="isShowEditCommentInput && comment._id === editingCommentId" class="mt-2">
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
                <SpinnerComponent
                  v-if="commentingId === comment._id"
                  :width="'16px'"
                  :height="'16px'"
                  :color="'white'" />
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
          class="absolute right-10 top-0 z-10 w-32 text-center transition-all after:absolute after:-bottom-2 after:-right-2 after:left-2 after:top-2 after:-z-10 after:border-2 after:border-primary after:bg-white"
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
              class="flex w-full items-center gap-2 border-2 border-primary bg-white px-3 py-2 hover:bg-gray-100"
              :disabled="deletingCommentId === comment._id">
              <span class="material-symbols-outlined text-xl leading-none">delete</span>
              刪除
            </button>
          </li>
        </ul>
      </div>
    </div>
  </template>
</template>

<script setup>
import {
  ref, nextTick, onMounted, onBeforeUnmount,
} from 'vue';
import axios from 'axios';
import createUserStore from '@/stores/userStore';
import createPostStore from '@/stores/postStore';
import SpinnerComponent from '@/components/SpinnerComponent.vue';
import { formatDate } from '@/utils/format';
import { showToast, showCheck } from '@/utils/sweetAlert';

const props = defineProps(['post', 'postIndex']);

const userStore = createUserStore();
const postStore = createPostStore();

const { VITE_API_URL } = import.meta.env;

const openedCommentMenuId = ref('');
function toggleCommentMenu(id) {
  if (openedCommentMenuId.value === id) {
    openedCommentMenuId.value = '';
  } else {
    openedCommentMenuId.value = id;
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
    await axios.post(`${VITE_API_URL}/post/${postId}/comment`, data);
    tempComment.value[postId] = '';
    await postStore.getPosts();
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
      await axios.patch(`${VITE_API_URL}/post/comment/${commentId}`, data);
      await postStore.getPosts();
    } catch (err) {
      showToast({ icon: 'error', title: err.response?.data?.message || err.message });
    }
  }

  commentingId.value = '';
  editingCommentId.value = '';
  isShowEditCommentInput.value = false;
}

const deletingCommentId = ref('');
function deleteComment(commentId) {
  showCheck({
    icon: 'warning',
    title: '確定要刪除留言嗎',
    text: '注意：此操作將無法復原',
    onConfirm: async () => {
      deletingCommentId.value = commentId;
      try {
        await axios.delete(`${VITE_API_URL}/post/comment/${commentId}`);
        await postStore.getPosts();
      } catch (err) {
        showToast({ icon: 'error', title: err.response?.data?.message || err.message });
      }
      deletingCommentId.value = '';
    },
  });
}

const handleBodyClick = (e) => {
  if (!e.target.closest('#commentMenu')) {
    openedCommentMenuId.value = '';
  }
};
onMounted(() => {
  document.querySelector('body').addEventListener('click', handleBodyClick);
});
onBeforeUnmount(() => {
  document.querySelector('body').removeEventListener('click', handleBodyClick);
});
</script>
