<template>
  <div class="comment-item flex flex-row p-4 w-full">
    <div class="avatar">
      <van-image
        :src="commentInfo.avatarUrl"
        alt="avatar"
        round
        width="36"
        height="36"
      />
    </div>
    <div class="flex flex-col ml-4 items-start text-left flex-1">
      <div class="">{{ commentInfo.nickname }}</div>
      <div class="">{{ commentInfo.content }}</div>
      <div class="flex flex-row justify-between w-full mt-1">
        <div>
          <span class="text-gray-500 text-sm">{{
            formatTime(commentInfo.last_modify_ts)
          }}</span>
          <span class="text-gray-500 text-sm ml-4">
            {{ commentInfo.ip_location }}</span
          >
          <span class="text-gray-500 text-sm ml-4"> 回复</span>
        </div>
        <div class="flex flex-row mx-4 items-center">
          <Icon
            v-if="commentInfo.is_author_digged"
            icon="flat-color-icons:like"
          />
          <Icon v-else icon="lucide:heart" />

          <span class="text-gray-500 text-sm mr-4">
            {{ commentInfo.digg_count }}</span
          >
          <Icon icon="lucide:heart-x" />
        </div>
      </div>
      <SubComment v-if="commentInfo.sub_comment_count > 0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatTime } from "@/utils/index.js";
import { Icon } from "@iconify/vue";

const props = defineProps({
  commentInfo: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped></style>
