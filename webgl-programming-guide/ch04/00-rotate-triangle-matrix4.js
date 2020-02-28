import Demo from '../common/demo'
import vert from '../shaders/a_pos_u_matrix.vs'
import frag from '../shaders/red.fs'
import Matrix4 from '../common/matrix4.js'

export class RotateTriangleMatrix4 extends Demo{

  constructor(name){
    super(name,{vert,frag})

    let gl = this.ctx
    
    let vertices = new Float32Array([
      0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ])
    //定点个数
    this.count = 3

    let angle = 90

    let transMatrix = new Matrix4()
    transMatrix.setRotate(angle, 0, 0, 1)

    let u_TransMatrix = gl.getUniformLocation(gl.program, 'u_TransMatrix')
    
    //注意 WebGL没有实现矩阵转置，所以第二个参数必须是false。
    gl.uniformMatrix4fv(u_TransMatrix,false, transMatrix.elements)
    
    // Create a buffer object
    let vertexBuffer = gl.createBuffer()

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

    // Write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position')

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position)

    this.render()
  }
  render() {

    let gl = this.ctx
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.TRIANGLES, 0, this.count)
  }

}