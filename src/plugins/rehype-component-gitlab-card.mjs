/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * Creates a GitLab Card component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.repo - The GitLab repository in the format "namespace/project".
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created GitLab Card component.
 */
export function GitlabCardComponent(properties, children) {
	if (Array.isArray(children) && children.length !== 0)
		return h("div", { class: "hidden" }, [
			'Invalid directive. ("gitlab" directive must be leaf type "::gitlab{repo="namespace/project"}")',
		]);

	if (!properties.repo || !properties.repo.includes("/"))
		return h(
			"div",
			{ class: "hidden" },
			'Invalid repository. ("repo" attributte must be in the format "namespace/project")',
		);

	const repo = properties.repo;
	const cardUuid = `GLC${Math.random().toString(36).slice(-6)}`;

	const nAvatar = h(`div#${cardUuid}-avatar`, { class: "gc-avatar" });
	const nStars = h(`div#${cardUuid}-stars`, { class: "gc-stars" }, "0");
	const nForks = h(`div#${cardUuid}-forks`, { class: "gc-forks" }, "0");
	const nLicense = h(
		`div#${cardUuid}-license`,
		{ class: "gc-license" },
		"no-license",
	);

	const nLanguage = h(
		`span#${cardUuid}-language`,
		{ class: "gc-language" },
		"Waiting...",
	);

	const nInfobar = h("div", { class: "gc-infobar" }, [
		nLanguage,
		nStars,
		nForks,
		nLicense,
	]);

	const nTitle = h("div", { class: "gc-titlebar" }, [
		h("div", { class: "gc-titlebar-left" }, [
			h("div", { class: "gc-owner" }, [
				nAvatar,
				h("div", { class: "gc-user" }, repo.split("/")[0]),
			]),
			h("div", { class: "gc-divider" }, "/"),
			h("div", { class: "gc-repo" }, repo.split("/")[1]),
		]),
		h("div", { class: "gitlab-logo" }),
	]);

	const nDescription = h(
		`div#${cardUuid}-description`,
		{ class: "gc-description" },
		"Waiting for gitlab.com API...",
	);

	const nScript = h(
		`script#${cardUuid}-script`,
		{ type: "text/javascript", defer: true },
		`
      fetch('https://gitlab.com/api/v4/projects/' + encodeURIComponent('${repo}'))
        .then(function(response) { return response.json(); })
        .then(function(data) {
          document.getElementById('${cardUuid}-description').innerText = data.description || "Description not set";
          document.getElementById('${cardUuid}-forks').innerText = Intl.NumberFormat('en-us', { notation: "compact", maximumFractionDigits: 1 }).format(data.forks_count || 0).replaceAll("\u202f", '');
          document.getElementById('${cardUuid}-stars').innerText = Intl.NumberFormat('en-us', { notation: "compact", maximumFractionDigits: 1 }).format(data.star_count || 0).replaceAll("\u202f", '');
          document.getElementById('${cardUuid}-license').innerText = (data.license && (data.license.name || data.license.key)) || "no-license";
          const avatarEl = document.getElementById('${cardUuid}-avatar');
          if (avatarEl && data.avatar_url) {
            avatarEl.style.backgroundImage = 'url(' + data.avatar_url + ')';
            avatarEl.style.backgroundColor = 'transparent';
          } else if (avatarEl && data.owner && data.owner.avatar_url) {
            avatarEl.style.backgroundImage = 'url(' + data.owner.avatar_url + ')';
            avatarEl.style.backgroundColor = 'transparent';
          }
          fetch('https://gitlab.com/api/v4/projects/' + data.id + '/languages')
            .then(function(resp) { return resp.json(); })
            .then(function(langs) {
              const langEl = document.getElementById('${cardUuid}-language');
              const entries = Object.entries(langs);
              if (entries.length > 0) {
                // 取占比最大的语言
                const mainLang = entries.sort((a, b) => b[1] - a[1])[0][0];
                langEl.innerText = mainLang;
              } else {
                langEl.parentNode.removeChild(langEl);
              }
            })
            .catch(function() {
              const langEl = document.getElementById('${cardUuid}-language');
              langEl.parentNode.removeChild(langEl);
            });
          document.getElementById('${cardUuid}-card').classList.remove("fetch-waiting");
          console.log("[GITLAB-CARD] Loaded card for ${repo} | ${cardUuid}.");
        })
        .catch(function(err) {
          const c = document.getElementById('${cardUuid}-card');
          c?.classList.add("fetch-error");
          console.warn("[GITLAB-CARD] (Error) Loading card for ${repo} | ${cardUuid}.");
        });
    `,
	);

	return h(
		`a#${cardUuid}-card`,
		{
			class: "card-gitlab fetch-waiting no-styling",
			href: `https://gitlab.com/${repo}`,
			target: "_blank",
			repo,
		},
		[nTitle, nDescription, nInfobar, nScript],
	);
}
