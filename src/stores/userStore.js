import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { showToast } from '@/utils/sweetAlert';

const API_URL = import.meta.env.VITE_API_URL;

const userStore = defineStore('user', () => {
  const user = ref({});

  async function handleLikePost(isLiked, postId) {
    try {
      let http = '';
      let url = `${API_URL}/post/${postId}`;

      if (isLiked) {
        http = 'delete';
        url = `${url}/unlike`;
      } else {
        http = 'post';
        url = `${url}/like`;
      }

      await axios[http](url);
    } catch (err) {
      showToast({ icon: 'error', title: err.response?.data?.message || err.message });
    }
  }

  return {
    user,
    handleLikePost,
  };
});

export default userStore;
