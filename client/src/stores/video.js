import { defineStore } from "pinia";
import { ref, computed } from "vue";
import request from "@/request/request.js";

export const useVideoStore = defineStore("video", () => {
  const videoInfoList = ref([]);
  const activeIndex = ref(0);
  const loading = ref(false);

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
  return {
    videoInfoList,
    loading,
    getVideoList,
    activeIndex,
    currentVideoInfo,
  };
});
