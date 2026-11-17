import { stylize } from "@mdit/plugin-stylize";

const ruleBadgeTypes = {
  "【强制】": "danger",
  "【推荐】": "warning",
  "【参考】": "info",
};

export default function ruleBadges(md) {
  md.use(stylize, {
    config: Object.entries(ruleBadgeTypes).map(([matcher, type]) => ({
      matcher,
      replacer: ({ tag, content }) => {
        if (tag !== "strong") return null;

        return {
          tag: "Badge",
          attrs: { type },
          content: content.slice(1, -1),
        };
      },
    })),
  });
}
