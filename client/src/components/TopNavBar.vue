<template>
  <div class="top-nav-bar-container">
    <MenuPopup />

    <div class="nav-items">
      <span
        v-for="(item, index) in tabs"
        :key="item"
        class="nav-item"
        :class="{ active: activeIndex === index }"
        @click="activeIndex = index"
      >
        {{ item }}
      </span>
    </div>

    <SearchPopup />
  </div>
</template>

<script setup lang="ts">
import MenuPopup from "./MenuPopup.vue";
import SearchPopup from "./SearchPopup.vue";
import { ref } from "vue";

const tabs = ["热点", "长视频", "关注", "经验", "推荐"];
const activeIndex = ref(0);
</script>

<style scoped>
.top-nav-bar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background-color: black;
  color: white;
}
.nav-items {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex: 1;
}
.nav-item {
  cursor: pointer;
}
.nav-item.active {
  font-weight: bold;
  padding-bottom: 4px;
  border-bottom: 1px solid white;
}
</style>
