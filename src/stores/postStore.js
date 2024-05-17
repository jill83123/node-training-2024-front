import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { defineStore } from 'pinia';
import axios from 'axios';
import { showToast } from '@/utils/sweetAlert';

const postStore = defineStore('post', () => {
  const router = useRouter();

  const posts = ref([]);
  const editingPostData = ref({});

  function goToEditPost(post) {
    editingPostData.value = { ...post };
    // eslint-disable-next-line no-underscore-dangle
    router.push(`/post/edit/${post._id}`);
  }

  const API_URL = import.meta.env.VITE_API_URL;

  async function getPosts({ sort = 'desc', keywords = '' }) {
    try {
      const res = await axios.get(`${API_URL}/posts?sort=${sort}&q=${keywords}`);
      posts.value = res.data.posts;
    } catch (err) {
      showToast({ icon: 'error', title: err.response?.data?.message || err.message });
    }
  }

  async function submitPost({
    form, postId, postData, isNewPost,
  }) {
    let http = 'post';
    let url = `${API_URL}/post`;
    let message = '新增成功';
    let pushRoute = '/';

    if (!isNewPost) {
      http = 'patch';
      url += `/${postId}`;
      message = '編輯成功';
      pushRoute = `/post/${postId}`;
    }

    try {
      await axios[http](url, postData.value);
      form.value.resetForm();
      showToast({ icon: 'success', title: message });
      router.push(pushRoute);
    } catch (err) {
      showToast({ icon: 'error', title: err.response?.data?.message || err.message });
    }
  }

  async function deletePost(postId) {
    try {
      await axios.delete(`${API_URL}/post/${postId}`);
      await getPosts({});
    } catch (err) {
      showToast({ icon: 'error', title: err.response?.data?.message || err.message });
    }
  }

  return {
    posts,
    getPosts,
    submitPost,
    deletePost,
    goToEditPost,
    editingPostData,
  };
});

export default postStore;
