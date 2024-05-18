import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { defineStore } from 'pinia';
import axios from 'axios';
import { showToast } from '@/utils/sweetAlert';

const { VITE_API_URL, BASE_URL } = import.meta.env;

const postStore = defineStore('post', () => {
  const router = useRouter();

  const editingPostData = ref({});
  function goToEditPost(post) {
    editingPostData.value = { ...post };
    // eslint-disable-next-line no-underscore-dangle
    router.push(`/post/edit/${post._id}`);
  }

  const posts = ref([]);
  const sort = ref('desc');
  const keyword = ref('');
  async function getPosts(options) {
    try {
      if (options === 'all') {
        keyword.value = '';
      }

      const res = await axios.get(`${VITE_API_URL}/posts?sort=${sort.value}&q=${keyword.value}`);
      posts.value = res.data.posts;

      posts.value.forEach((post, index) => {
        if (!post.user.photo) {
          posts.value[index].user.photo = `${BASE_URL}images/user_default.png`;
        }
        post.comments.forEach((comment, commentIndex) => {
          if (!comment.user.photo) {
            posts.value[index].comments[commentIndex].user.photo = `${BASE_URL}images/user_default.png`;
          }
        });
      });
    } catch (err) {
      if (err.response?.data?.message === '找不到相關貼文') {
        posts.value = [];
      } else {
        showToast({ icon: 'error', title: err.response?.data?.message || err.message });
      }
    }
  }

  async function submitPost({
    form, postId, postData, isNewPost,
  }) {
    let http = 'post';
    let url = `${VITE_API_URL}/post`;
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
      await axios.delete(`${VITE_API_URL}/post/${postId}`);
      await getPosts();
    } catch (err) {
      showToast({ icon: 'error', title: err.response?.data?.message || err.message });
    }
  }

  return {
    posts,
    sort,
    keyword,
    getPosts,
    submitPost,
    deletePost,
    goToEditPost,
    editingPostData,
  };
});

export default postStore;
