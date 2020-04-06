import Matter from 'matter-js'
import {
    width,
    height
} from './lib/var.js'

import {grid,player} from './games/game01.js'



const {
    Engine,
    Render,
    World
} = Matter


// 新建引擎对象
const engine = new Engine.create()


// 渲染renderer
const render = Render.create({
    element: document.body,
    engine,
    options: {
        wireframes: false,
        background: '#fcf8f3',
        width,
        height,
    },
});

const {
    world
} = engine;
World.add(world, [grid, player]);

export {engine, render,world}