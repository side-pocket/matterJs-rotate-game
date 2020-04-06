import Matter from 'matter-js'

import {engine, render}  from './games/game01.js'



const {
    Engine,
    Render,
} = Matter


Engine.run(engine)

Render.run(render)

