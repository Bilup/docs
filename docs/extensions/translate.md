---
title: Translate
sidebar_position: 10
---

# Translate

The **Translate** extension translates text into other languages and tells you the viewer's own language. It is built in and compatible with Scratch. Translations are provided by Google.

Load it from **Add Extension** and choose **Translate**.

## Requires the internet

Translation is done by an online service, so this extension needs an internet connection every time it translates. Offline, the translate block will not return a result.

## Blocks

### translate `[words]` to `[language]`

```scratch
(translate [hello] to (Spanish v))
```

A reporter that returns the given text translated into the chosen language. Pick the target language from the dropdown.

### language

```scratch
(language)
```

A reporter for the viewer's own language (the language their browser or device is set to). Combine it with *translate ... to* to automatically show text in whatever language the person running the project uses.

## Tips

- Machine translation is approximate. Short, plain sentences translate more reliably than idioms or slang.
- Use the *language* reporter as the target of *translate ... to* to localise your project on the fly for each viewer.

## See also

- [Text to Speech](/extensions/text-to-speech)
- [Extensions Overview](/extensions/overview)
