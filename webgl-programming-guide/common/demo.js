import { Loader } from 'resource-loader'

/**
 * 加载shader
 * @param {JsonObject} res 
 *  {name:'vert',url:'shaders/origin.vs'}
 * or Array of that
 */
export function load(res){
  let promise = new Promise((resovle,reject)=>{
    const loader = new Loader()

    if(Array.isArray(res)){
      res.forEach(item => loader.add(item))
    }else{
      loader.add(res)
    }

    loader.onError.add((err) => {
      console.warn(err)
      loader.reset()
      reject(res.url)
    })
    loader.onLoad.add((res) => {
      console.log(`load ${res.url}`)
    }) 

    loader.load((loader, res) => {
      resovle(res)
      // loader.reset()
    })
  })
  return promise
}

export function initShader(gl,vshader,fshader){
  let program = createProgram(gl, vshader, fshader)
  if (!program) {
    console.log('Failed to create program')
    return false
  }

  gl.useProgram(program)
  gl.program = program

  return true
}

function createProgram(gl, vshader, fshader) {

  let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader)
  let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader)
  if (!vertexShader || !fragmentShader) {
    return null
  }

  let program = gl.createProgram()
  if (!program) {
    return null
  }

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  gl.linkProgram(program)

  let linked = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!linked) {
    let error = gl.getProgramInfoLog(program)
    console.log('Failed to link program: ' + error)
    gl.deleteProgram(program)
    gl.deleteShader(fragmentShader)
    gl.deleteShader(vertexShader)
    return null
  }
  return program
}

function loadShader(gl, type, source) {

  let shader = gl.createShader(type)
  if (shader == null) {
    console.log('unable to create shader')
    return null
  }

  gl.shaderSource(shader, source)

  gl.compileShader(shader)

  let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!compiled) {
    let error = gl.getShaderInfoLog(shader)
    console.log('Failed to compile shader: ' + error)
    gl.deleteShader(shader)
    return null
  }

  return shader
}

export class Demo{
  constructor(name,context='webgl'){
    this.name = name

    let $container = document.querySelector('#container')

    let $div = document.createElement('div')
    $div.className='demo'

    let $button = document.createElement('button')
    $button.textContent=name
    $button.onclick = ()=>{
      this.render()
    }
    
    let $canvas = document.createElement('canvas')
    $canvas.id = name
    $canvas.textContent='你的浏览器不支持 WebGL.'
    $canvas.addEventListener('webglcontextcreationerror', event => {
      console.log('WebGL Error:',event.statusMessage)
    }, false)

    $div.appendChild($button)
    $div.appendChild($canvas)
    $container.appendChild($div)
    
    this.$canvas = $canvas
    this.ctx = this.$canvas.getContext(context)

    $canvas.width =$canvas.clientWidth
    $canvas.height =$canvas.clientHeight

    if(context.includes('webgl')){
      this.ctx.viewport(0,0,this.ctx.drawingBufferWidth,this.ctx.drawingBufferHeight)
    }
  }

  render(){
    throw '没有实现render方法'
  }

}