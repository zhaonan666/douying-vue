import dayjs from "dayjs";

export const formatNumber = (num) => {
  if (num < 10000) {
    return num;
  }
  return Math.floor(num / 10000).toFixed(1) + "万";
};

export const formatTime = (timestamp) => {
  return dayjs(timestamp).format("YYYY-MM-DD");
};
