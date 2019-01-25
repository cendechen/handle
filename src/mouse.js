const defaultOptions = {
  cancel: '', // selector 表示当用户点击了，元素下面的谋一些元素，不发生mousedown事件
  delay: 0, // 表示按下事件后，多久发生mousemove事件
  distance: 1, // 表示移动了多少距离后才，发生mousestart事件
  mousedown () {}, // mousedown事件
  mouseup () {}, // mouseup事件
  mousedrag () {} // 拖拽事件
}
/**
 * 表示选择单个元素
 * @param {*} selector
 */
function $(selector) {
  return document.querySelector(selector)
}
/**
 * 事件绑定
 * @param {*} dom
 * @param {*} event
 * @param {*} fn
 */
function on(dom, event, fn) {
  dom.addEventListener(event, fn, false)
}
/**
 * 事件去掉
 * @param {*} dom
 * @param {*} event
 * @param {*} fn
 */
function off(dom, event, fn) {
  dom.removeEventListener(event, fn, false)
}
/**
 * mouse类，处理点击和拖拽事件，兼容移动端和pc端
 * @param {*} element
 * @param {*} options
 */
function Mouse (element, options = {}) {
  this.element = element
  this.options = Object.assign(defaultOptions, options)
  this._mouseMoved = false // 是否已经开始滚动
  this._mouseStarted = false // 鼠标开始滚动
  this.mouseDelayMet = false // 按下延迟多少毫秒执行
  // 初始化mouse事件绑定
  this._mouseInit()
}

Mouse.prototype = {
  _mouseInit () {
    on(this.element, 'mousedown', (e) => {
      // 处理事件
      this._mouseDown(e)
    })
  },
  _mouseDown(e) {
    // 鼠标点击事件
    this._mouseMoved = false
    // 修复一个bug，鼠标移出窗口，可能还没有发生mouseup事件
    this._mouseStarted && this._mouseUp(e) // 修复鼠标事件
    this._mouseDownEvent = e
    // 判断是左键还是右键
    // 鼠标的按键
    // 0 鼠标的左键
    // 1 鼠标的滚轮
    // 2 鼠标的右键
    // 3 通常指浏览器的后退按钮
    // 4 通常指浏览器的前进按钮
    if (e.button !== 0) {
      return false // 默认不是左键，不处理后续逻辑
    }
    // 判断delay事件
    this.mouseDelayMet = !this.options.delay
    if (!this.mouseDelayMet) {
      this._mouseDelayTimer = setTimeout(() => {
        this.mouseDelayMet = true
      }, this.options.delay)
    }

    if (this._mouseDistanceMet(e) && this._mouseDelayMet(e)) {
      this._mouseStarted = (this.options.mousedown(e) !== false)
      if (!this._mouseStarted) {
        event.preventDefault()
        return true
      }
    }
    this._mouseMoveDelegate = (e) => {
      return this._mouseMove(e)
    }
    this._mouseUpDelegate = (e) => {
      return this._mouseUp(e)
    }
    on(document, 'mousemove', this._mouseMoveDelegate)
    on(document, 'mouseup', this._mouseUpDelegate)
    // 绑定事件
    e.preventDefault()
    return true
  },
  _mouseMove (e) {
    if (this._mouseMoved) {
      // 没有点击左键的mousemove 应该不生效
      if (e.button !== 0) {
        this._mouseUp(e)
      }
    }
    // 表示用户点击了左键
    if (e.button === 0) {
      this._mouseMoved = true
    }
    if (this._mouseStarted) {
      this.options.mousedrag(e)
      return e.preventDefault()
    }
    if (this._mouseDistanceMet(e) && this._mouseDelayMet(e)) {
      this._mouseStarted = (this.options.mousedown(e) !== false)
      if (this._mouseStarted) {
        this.options.mousedrag(e)
      } else {
        this._mouseUp(e)
      }
    }
    return !this._mouseStarted
  },
  _mouseUp(e) {
    off(document, 'mousemove', this._mouseMoveDelegate)
    off(document, 'mouseup', this._mouseUpDelegate)
    if (this._mouseStarted) {
      this._mouseStarted = false // 关闭锁子
      this.options.mouseup(e)
    }
    if (this._mouseDelayTimer) {
      clearTimeout(this._mouseDelayTimer)
    }
  },
  // 返回延迟属性
  _mouseDelayMet (e) {
    return this.mouseDelayMet
  },
  _mouseDistanceMet (e) {
    // 判断当前距离
    return Math.max(
      Math.abs(this._mouseDownEvent.pageX - e.pageX),
      Math.abs(this._mouseDownEvent.pageY - e.pageY)
    ) > this.options.distance
  }
}


export default Mouse
