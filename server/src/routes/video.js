import express from "express";
import { Readable } from "node:stream";
import posts from "../data/douyin/posts6.json" with { type: "json" };

const router = express.Router();

async function resolvePlayUrl(url) {
  const response = await fetch(url, {
    method: "GET",
    redirect: "manual",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      Referer: "https://www.douyin.com/",
    },
  });

  const location = response.headers.get("location");

  if (location) {
    return new URL(location, url).toString();
  }

  return url;
}

function buildProxyUrl(req, url) {
  if (!url) {
    return "";
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}/video/proxy?url=${encodeURIComponent(url)}`;
}

router.get("/", async (req, res) => {
  try {
    const list = await Promise.all(
      posts.map(async (item) => {
        const rawUrl = item.video?.play_addr?.url_list?.[0];
        const playUrl = rawUrl ? await resolvePlayUrl(rawUrl) : "";
        const avatarRawUrl =
          item.author?.avatar_168x168?.url_list?.[0] ||
          item.author?.avatar_thumb?.url_list?.[0] ||
          "";

        return {
          ...item,
          videoUrl: buildProxyUrl(req, playUrl),
          avatarUrl: buildProxyUrl(req, avatarRawUrl),
          video: {
            ...item.video,
            playUrl,
          },
        };
      }),
    );

    res.json({
      code: 200,
      message: "success",
      data: list,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message || "获取视频列表失败",
      data: [],
    });
  }
});

router.get("/proxy", async (req, res) => {
  try {
    const targetUrl = req.query.url;

    if (!targetUrl) {
      return res.status(400).json({
        code: 400,
        message: "缺少 url 参数",
      });
    }

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Referer: "https://www.douyin.com/",
        Range: req.headers.range || "bytes=0-",
      },
    });

    if (!response.ok && response.status !== 206) {
      return res.status(response.status).send("视频代理请求失败");
    }

    res.status(response.status);

    const proxyHeaders = [
      "content-type",
      "content-length",
      "content-range",
      "accept-ranges",
      "cache-control",
    ];

    proxyHeaders.forEach((key) => {
      const value = response.headers.get(key);
      if (value) {
        res.setHeader(key, value);
      }
    });

    Readable.fromWeb(response.body).pipe(res);
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message || "视频代理失败",
    });
  }
});

export default router;
