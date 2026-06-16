import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import request from "@/request/request.js";

export const useVideoStore = defineStore("video", () => {
  const videoInfoList = ref([]);
  const activeIndex = ref(0);
  const loading = ref(false);
  const commentLoading = ref(false);
  const isMuted = ref(true);
  const showCommentPopup = ref(false);
  const commentData = ref(null);

  const getVideoList = async () => {
    loading.value = true;

    try {
      const res = await request.get("/video");
      videoInfoList.value = res;
    } finally {
      loading.value = false;
    }
  };

  const currentVideoInfo = computed(() => {
    if (videoInfoList.value.length <= 0) {
      return null;
    }
    return videoInfoList.value[activeIndex.value] || null;
  });

  const getCurrentVideoComment = async () => {
    const id = currentVideoInfo.value?.aweme_id;
    if (!id) return;
    commentLoading.value = true;

    try {
      const res = await request.get("/video/comments", {
        params: { id },
      });
      commentData.value = res;
    } finally {
      commentLoading.value = false;
    }
  };

  watch(showCommentPopup, async (visible) => {
    if (visible && !commentData.value) {
      await getCurrentVideoComment();
    }
  });

  return {
    showCommentPopup,
    isMuted,
    videoInfoList,
    loading,
    getVideoList,
    activeIndex,
    currentVideoInfo,
    commentLoading,
    commentData,
  };
});
