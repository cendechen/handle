import Mouse from './src/mouse'

function setStyle (dom, style) {
  for(var i in style) {
    dom.style[i] = style[i]
  }
}

var dom = document.querySelector('.draggable')

var divX
var divY

new Mouse(dom, {
  mousedown(e) {
    var offsetX = dom.offsetLeft
    var offsetY = dom.offsetTop
    var x = e.clientX
    var y = e.clientY
    divX = x - offsetX
    divY = y - offsetY
  },
  mousedrag(e) {
    var x = e.clientX
    var y = e.clientY
    var left = x - divX
    var top = y - divY
    setStyle(dom ,{left, top})
  }
})
