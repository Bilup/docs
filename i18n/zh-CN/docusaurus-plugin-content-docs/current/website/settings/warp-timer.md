---
slug: /warp-timer
hide_table_of_contents: true
---

# Warp Timer

Warp Timer 使脚本检查它们是否陷入长时间或无限循环，并以低帧率运行，而不是卡在循环中直到完成。这修复了大多数崩溃问题，但会对性能产生重大影响，因此默认仅在编辑器中启用。

作为演示，请参见项目 https://editor.bilup.org/446742201?stuck 。该项目在「运行时不刷新屏幕」积木内有一个无限循环。启用 Warp Timer 后，项目将以大约每秒两帧的速度运行。但是，如果禁用 Warp Timer，脚本将永远不会结束。

Warp Timer 以前称为"Stuck Checking"。