import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { showToast } from '@/utils/sweetAlert';

const { VITE_API_URL } = import.meta.env;

const userStore = defineStore('user', () => {
  const user = ref({});

  async function getUserProfile() {
    try {
      const res = await axios.get(`${VITE_API_URL}/user/profile`);
      user.value = res.data.user;
    } catch (err) {
      showToast({ icon: 'error', title: err.response?.data?.message || err.message });
    }
  }

  async function handleLikePost(isLiked, postId) {
    try {
      let http = '';
      let url = `${VITE_API_URL}/post/${postId}`;

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
    getUserProfile,
    handleLikePost,
  };
});

export default userStore;
