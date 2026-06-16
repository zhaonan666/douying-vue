import express from "express";
import { Readable } from "node:stream";
import posts from "../data/douyin/posts6.json" with { type: "json" };
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commentsDir = path.resolve(__dirname, "../data/douyin/public/comments");
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

async function readComments(req, id) {
  const filePath = path.join(commentsDir, `video_id_${id}.json`);
  const fileContent = await fs.readFile(filePath, "utf-8");

  return JSON.parse(fileContent).map((comment) => ({
    ...comment,
    avatarUrl: buildProxyUrl(req, comment.avatar),
  }));
}

function getSeed(text = "") {
  return String(text)
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
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

router.get("/comments", async (req, res) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(400).json({
        code: 400,
        message: "缺少 id 参数",
        data: [],
      });
    }

    const comments = await readComments(req, id);

    res.json({
      code: 200,
      message: "success",
      data: comments,
    });
  } catch (error) {
    res.status(404).json({
      code: 404,
      message: "评论数据不存在",
      data: [],
    });
  }
});

router.get("/comments/sub", async (req, res) => {
  try {
    const { id, commentId } = req.query;
    const count = Number(req.query.count) || 3;

    if (!id || !commentId) {
      return res.status(400).json({
        code: 400,
        message: "缺少 id 或 commentId 参数",
        data: [],
      });
    }

    const comments = await readComments(req, id);
    const parentComment = comments.find(
      (comment) => String(comment.comment_id) === String(commentId),
    );
    const source = comments.filter(
      (comment) => String(comment.comment_id) !== String(commentId),
    );

    if (source.length === 0) {
      return res.json({
        code: 200,
        message: "success",
        data: [],
      });
    }

    const start = getSeed(commentId) % source.length;
    const replies = Array.from(
      { length: Math.min(count, source.length) },
      (_, index) => {
        const comment = source[(start + index) % source.length];

        return {
          ...comment,
          comment_id: `${commentId}_${comment.comment_id}`,
          parent_comment_id: commentId,
          replay: parentComment?.nickname || "",
        };
      },
    );

    res.json({
      code: 200,
      message: "success",
      data: replies,
    });
  } catch (error) {
    res.status(404).json({
      code: 404,
      message: "子评论数据不存在",
      data: [],
    });
  }
});

export default router;
