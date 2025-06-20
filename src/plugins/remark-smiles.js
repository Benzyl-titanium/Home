import { visit } from "unist-util-visit";

export default function remarkSmiles() {
	return (tree) => {
		visit(tree, "code", (node, index, parent) => {
			if (node.lang === "smiles") {
				parent.children[index] = {
					type: "html",
					value: `<div class="smiles">${node.value}</div>`,
				};
			}
		});
	};
}
