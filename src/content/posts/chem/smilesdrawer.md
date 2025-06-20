---
title: smilesDrawer
published: 2025-06-13
description: "smiles to png/jpg/svg"
tags: [化学, SMILES, smilesDrawer, GitHubRepo, markdown扩展]
category: "Chem"
draft: false
---

::github{repo="Benzyl-titanium/smilesDrawer"}

# smiles to png/jpg/svg

<iframe src="https://smilesdrawer.benzyl-titanium.top/" style="width: 100%; height: 70vh; border: none; border-radius: 10px;margin: 10px auto"></iframe

# markdown 扩展

```smiles
C(C1=CC=CC=C1)[Ti](CC1=CC=CC=C1)(CC1=CC=CC=C1)CC1=CC=CC=C1
```

````
```smiles
C(C1=CC=CC=C1)[Ti](CC1=CC=CC=C1)(CC1=CC=CC=C1)CC1=CC=CC=C1
```
````

<div class="smiles">C(C1=CC=CC=C1)[Ti](CC1=CC=CC=C1)(CC1=CC=CC=C1)CC1=CC=CC=C1</div>

```html
<div class="smiles">C(C1=CC=CC=C1)[Ti](CC1=CC=CC=C1)(CC1=CC=CC=C1)CC1=CC=CC=C1</div>
```

## 大小

```js
// public/js/chemdraw.js
const options = { width: 150, height: 150 };
```

## add script

```html
<script>
  if (window.renderSmiles) {
    setTimeout(window.renderSmiles, 100);
  }
</script>
```

<script>
  if (window.renderSmiles) {
    setTimeout(window.renderSmiles, 100);
  }
</script>
