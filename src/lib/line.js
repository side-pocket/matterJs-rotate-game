import Matter from 'matter-js'
const {
    Bodies
} = Matter
/**
 * canvas.rect(x, y, w, h)
 * @param {*} x 
 * @param {*} y 
 * @param {*} w 
 * @param {*} h 
 * @description 创建直线
 */
const line = (x, y, w, h, color="#323232") =>
    Bodies.rectangle(x, y, w, h, {
        render: {
            fillStyle: color,
        },
    })

export default line