import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { showToast } from '@/utils/sweetAlert';

const API_URL = import.meta.env.VITE_API_URL;

const userStore = defineStore('user', () => {
  const user = ref({});

  async function getUserProfile() {
    try {
      const res = await axios.get(`${API_URL}/user/profile`);
      user.value = res.data.user;
    } catch (err) {
      showToast({ icon: 'error', title: err.response?.data?.message || err.message });
    }
  }

  const likingId = ref('');
  async function handleLikePost(isLiked, postId) {
    likingId.value = postId;
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
    likingId.value = '';
  }

  return {
    user,
    likingId,
    getUserProfile,
    handleLikePost,
  };
});

export default userStore;
