<template>
  <div class="video-tools-container">
    <div class="avatar-container">
      <van-image
        fit="cover"
        position="left"
        :src="avatarUrl"
        round
        width="50"
        height="50"
      />
    </div>

    <div class="like-container flex flex-col">
      <van-icon
        name="like"
        size="35"
        :color="isLike ? 'red' : 'white'"
        @click="isLike = !isLike"
      />
      <span class="count text-white">{{ formatNumber(diggCount) }}</span>
    </div>

    <div
      class="comment-container flex flex-col"
      @click.stop="showCommentPopup = true"
    >
      <van-icon name="comment" size="35" color="white" />
      <span class="count text-white">{{ formatNumber(commentCount) }}</span>
    </div>

    <div class="collect-container flex flex-col">
      <van-icon
        name="star"
        size="35"
        :color="isCollect ? 'yellow' : 'white'"
        @click="isCollect = !isCollect"
      />
      <span class="count text-white">{{ formatNumber(collectCount) }}</span>
    </div>

    <div class="share-container flex flex-col">
      <van-icon name="share" size="35" color="white" />
      <span class="count text-white">{{ formatNumber(shareCount) }}</span>
    </div>

    <div
      class="w-10 h-10 rounded-full bg-white flex items-center justify-center"
      @click.stop="isMuted = true"
    >
      <Icon
        v-if="isMuted"
        icon="mdi:volume-off"
        class="text-black text-[24px]"
      />
      <van-image
        v-else
        fit="cover"
        position="left"
        :src="avatarUrl"
        round
        width="35"
        height="35"
        class="animate-spin slow-spin"
      />
    </div>
    <van-popup
      v-model:show="showCommentPopup"
      position="bottom"
      close-on-click-overlay
      @click-overlay="showCommentPopup = false"
      :style="{ height: '70%', 'border-radius': '16px 16px 0 0' }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useVideoStore } from "@/stores/video.js";
import { storeToRefs } from "pinia";
import { formatNumber } from "@/utils/index.js";
import { Icon } from "@iconify/vue";

const videoStore = useVideoStore();
const { currentVideoInfo, isMuted, showCommentPopup } = storeToRefs(videoStore);
const isLike = ref(false);
const isCollect = ref(false);

const avatarUrl = computed(() => currentVideoInfo.value?.avatarUrl || "");
const diggCount = computed(
  () => currentVideoInfo.value?.statistics?.digg_count || 0,
);

const commentCount = computed(
  () => currentVideoInfo.value?.statistics?.comment_count || 0,
);
const collectCount = computed(
  () => currentVideoInfo.value?.statistics?.collect_count || 0,
);
const shareCount = computed(
  () => currentVideoInfo.value?.statistics?.share_count || 0,
);
</script>

<style scoped>
.video-tools-container {
  position: absolute;
  right: 20px;
  bottom: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  .avatar-container {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .slow-spin {
    animation: spin 5s linear infinite;
  }
}
</style>
