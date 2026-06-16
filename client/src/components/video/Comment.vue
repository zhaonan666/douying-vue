<template>
  <div>
    <van-popup
      v-model:show="showCommentPopup"
      position="bottom"
      close-on-click-overlay
      @click-overlay="showCommentPopup = false"
      round
      :style="{ height: '70%' }"
      closeable
    >
      <div
        class="comment-container"
        v-if="commentData && commentData.length > 0"
      >
        <div class="text-[16px] mt-4">{{ commentData.length }}条评论</div>
        <div class="comment-list">
          <div
            v-for="comment in commentData"
            :key="comment.comment_id"
            class="comment-item"
          >
            <CommentItem :comment-info="comment" />
          </div>
        </div>
      </div>
      <van-empty v-else description="暂无评论" />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { useVideoStore } from "@/stores/video.js";
import { storeToRefs } from "pinia";
import CommentItem from "./CommentItem.vue";

const videoStore = useVideoStore();
const { showCommentPopup, commentData } = storeToRefs(videoStore);
</script>

<style scoped></style>
