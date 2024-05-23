<template>
  <!-- PC -->
  <aside class="hidden w-[36%] lg:block">
    <nav class="top-24 border-2 border-primary bg-white px-6 py-8 lg:sticky">
      <RouterLink
        to="/post/create"
        class="w-100 mb-6 flex items-center justify-center rounded-lg border-2 border-primary bg-secondary py-4 font-bold text-white hover:bg-goldenrod hover:text-primary"
        style="box-shadow: -2px 2px 0px #000400">
        張貼動態
      </RouterLink>

      <RouterLink
        :to="`/user/${userStore.user.id}/posts`"
        class="mb-4 flex w-full items-center gap-4 hover:text-secondary">
        <img
          :src="userStore.user.photo"
          alt="user-photo"
          class="h-[50px] w-[50px] rounded-full border-2 border-primary object-contain" />
        <p class="font-bold">{{ userStore.user.name }}</p>
      </RouterLink>

      <RouterLink
        to="/user/following"
        class="aside-item mb-4 flex w-full items-center gap-4 hover:text-secondary">
        <div
          class="flex h-[50px] w-[50px] items-center justify-center rounded-full border-2 border-primary bg-[#E2EDFA]">
          <span class="material-symbols-outlined">notifications</span>
        </div>
        <p class="font-bold">追蹤名單</p>
      </RouterLink>

      <RouterLink
        to="/user/likes"
        class="aside-item flex w-full items-center gap-4 hover:text-secondary">
        <div
          class="flex h-[50px] w-[50px] items-center justify-center rounded-full border-2 border-primary bg-[#E2EDFA]">
          <span class="material-symbols-outlined">thumb_up</span>
        </div>
        <p class="font-bold">我按讚的文章</p>
      </RouterLink>
    </nav>
  </aside>

  <!-- mobile -->
  <nav class="fixed bottom-3 left-0 right-0 mx-2 lg:hidden">
    <div
      class="container flex justify-center gap-6 rounded-[32px] border-[3px] border-primary bg-[#EFECE7] py-[6px]">
      <RouterLink
        to="/"
        class="flex h-[48px] w-[48px] items-center justify-center rounded-full border-[3px] border-primary bg-white">
        <span class="material-symbols-outlined font-medium text-primary">home</span>
      </RouterLink>

      <RouterLink
        to="/user/following"
        class="flex h-[48px] w-[48px] items-center justify-center rounded-full border-[3px] border-primary bg-white">
        <span class="material-symbols-outlined font-medium text-primary">notifications</span>
      </RouterLink>

      <RouterLink
        to="/user/likes"
        class="flex h-[48px] w-[48px] items-center justify-center rounded-full border-[3px] border-primary bg-white">
        <span class="material-symbols-outlined font-medium text-primary">thumb_up</span>
      </RouterLink>

      <RouterLink
        to="/post/create"
        class="flex h-[48px] w-[48px] items-center justify-center rounded-full border-[3px] border-primary bg-secondary">
        <span class="material-symbols-outlined font-medium text-white">add</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import createUserStore from '@/stores/userStore';

const userStore = createUserStore();
</script>

<style lang="postcss">
.aside-item:hover {
  div {
    @apply bg-secondary;
  }
  span {
    @apply text-white;
  }
}
</style>
