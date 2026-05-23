---
slug: /unshared-projects
hide_table_of_contents: true
---

# 未分享的项目不再可见

由于 Scratch API 的变化，未分享的项目无法再在 Bilup、forkphorus 和其他第三方网站上打开。

此页面回答了大多数人的问题并列出了一些解决方案。在与他人讨论这些变化之前，请完整阅读以避免错误信息。

:::warning
除了 scratch.mit.edu 之外的任何要求你提供 Scratch 密码的网站都是诈骗，即使它声称可以让你与他人分享你的未分享项目。你的账户将被盗，项目将被删除。这条规则没有例外。
:::

## 发生了什么 {#what-happened}

我们想明确一点：这些变化是由 Scratch 团队做出的。Bilup 是一个与 Scratch 团队无关的第三方网站；我们没有做出这些变化。

现在从 Scratch API 下载项目需要一个「项目令牌」，对于未分享的项目，只能由项目所有者访问。即使你在同一个浏览器中登录了 Scratch 账户，Bilup 也无法访问它。这些令牌是临时的，会在几分钟后过期，所以所有者不能仅仅提供一次令牌就能使其永久可见。

未分享的项目一直是一种巧合，而不是 Bilup 的预期主要用途。诸如编译器和插件之类的功能一直是重点，并将继续为分享的项目、从文件加载的项目和桌面应用工作。

## 解决方案 {#workarounds}

**用于测试你自己的项目：** 你可以使用 Scratch 编辑器中的「文件 > 保存到电脑」和「文件 > 从电脑加载」菜单来在 Bilup 中加载你未分享的 Scratch 项目，或将在 Bilup 中制作的项目上传到 Scratch。另外，许多人已经成功地在 Bilup(使用网站或 [桌面应用](https://desktop.bilup.org/))上主要进行项目工作，然后在完成时将项目上传到 Scratch(请记住在此过程中进行常规备份)。

**用于协作：** 与他人分享项目的最佳方式是在 Scratch 网站上分享。Scratch 社区非常友好。这是 Scratch 希望你做的。分享未完成的项目是可以的。Scratch 已经 17 岁了，而 Bilup 连 1 岁都没到。在没有 Bilup 的 17 年里，协作顺利进行，今后也会继续顺利进行。

**用于嵌入其他网站：** 要将未分享的项目嵌入其他网站，可以在 Scratch 上分享项目，或使用 Scratch 编辑器中的「文件 > 保存到电脑」菜单将项目下载到你的电脑，然后使用 [Bilup 打包器](https://packager.bilup.org/) 将该项目转换为可以嵌入的独立文件。

## 这是一件好事 {#good-thing}

保护未分享的项目早就应该做了。

不要假装没有人因为不知道未分享的项目实际上不是私密的(尽管 Scratch 网站说「只有你可以看到它」)而被盗项目。许多未分享的项目包含在未分享的项目实际上是私密的前提下拍摄的孩子、他们的朋友、家人和其他人的照片和视频。

在大多数其他大型网站上，「未分享」或「私密」的内容实际上是公开的，这被认为是关键的安全漏洞，通常有资格获得大量漏洞赏金。例如，YouTube 向报告漏洞的研究人员支付了 5000 美元，因为他们发现的漏洞允许他们查看任何私密视频的低分辨率图像。

我们一直坚持这样的立场：如果人们希望未分享的项目实际上是私密的，他们应该联系 Scratch 团队。也许有足够多的人这样做了，以至于 Scratch 团队愿意倾听。

<!-- 令人印象深刻的是，Scratch 没有因为无数隐私侵犯而被告上法庭 -->

## 给开发者 {#developers}

本节适用于开发第三方 Scratch 相关工具的人。

下载项目的新程序是首先从 `https://api.scratch.mit.edu/projects/ID` 获取「project_token」字段，然后使用它生成 URL `https://projects.scratch.mit.edu/ID?token=TOKEN`

如果你使用 JavaScript，以下是一些入门示例代码，可以在网页浏览器中工作。如果你的代码在服务器端运行(例如 Node.js)，你应该将 `https://trampoline.turbowarp.org/api/projects/` 替换为 `https://api.scratch.mit.edu/projects/`，因为服务器不受 [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) 影响。我们对 trampoline.turbowarp.org 的运行时间不作任何保证；使用风险自负。你可能也有兴趣了解 [sb-downloader](https://github.com/forkphorus/sb-downloader)(包含简单的 API)作为一个完整的项目下载器。

```javascript
const getProjectMetadata = async (projectId) => {
    // 如果在网页浏览器中，你需要使用像 trampoline.turbowarp.org 这样的服务来访问 Scratch API。
    // 如果在 NODE.JS 中，你应该直接使用 https://api.scratch.mit.edu/projects/${projectId}。
    const response = await fetch(`https://trampoline.turbowarp.org/api/projects/${projectId}`);
    if (response.status === 404) {
        throw new Error('The project is unshared or does not exist');
    }
    if (!response.ok) {
        throw new Error(`HTTP error ${response.status} fetching project metadata`);
    }
    const json = await response.json();
    return json;
};

const getProjectData = async (projectId) => {
    const metadata = await getProjectMetadata(projectId);
    const token = metadata.project_token;
    const response = await fetch(`https://projects.scratch.mit.edu/${projectId}?token=${token}`);
    if (!response.ok) {
        throw new Error(`HTTP error ${response.status} fetching project data`);
    }
    const data = await response.arrayBuffer();
    return data;
};

getProjectData('60917032').then((data) => {
    console.log(data);
}).catch((error) => {
    console.error(error);
});
```

我们根据 [Unlicense](https://unlicense.org/) 发布此代码段。
