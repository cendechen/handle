# mouse
> 主要处理mousedown mousemove mouseup 处理拖拽问题

1. 优化了mousedown 事件的触发，延迟在mousemove移动一定距离后触发
2. 延迟mousedown的执行，可以设置mousedown事件是在mousemove后来判断延迟是否已经触发，如果触发了，支持mousedown事件，开始支持拖拽
3. mouseup事件，必须鼠标左键一直按下才会持续触发mousemove，否则立即执行mouseup事件，发生回调

# 用法
```
 import Mouse from 'ce-eventfix/mouse'

 new Mouse(Element, {
   cancel: '', // 子选择器
   distance: 1, // 默认移动一像素才触发mousedown
   delay: 0, // 默认不延迟触发 mousedown
   mousedown() {}
   mousedrag() {}
   mouseup() {}
 })
```
