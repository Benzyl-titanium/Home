import { siteConfig } from "@/config";
import rss from "@astrojs/rss";
import { getSortedPostsByUpdated } from "@utils/content-utils";
import type { APIContext } from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";

const parser = new MarkdownIt();

export async function GET(context: APIContext) {
	const posts = await getSortedPostsByUpdated();

	return rss({
		title: siteConfig.title,
		description: siteConfig.subtitle || "No description",
		site: context.site ?? "https://fuwari.vercel.app",
		items: posts.map((post) => {
			const content =
				typeof post.body === "string" ? post.body : String(post.body || "");

			return {
				title: post.data.title,
				pubDate: post.data.published,
				description: post.data.description || "",
				link: `/posts/${post.slug}/`,
				content: sanitizeHtml(parser.render(content), {
					allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
				}),
			};
		}),
		customData: `<language>${siteConfig.lang}</language>`,
	});
}
