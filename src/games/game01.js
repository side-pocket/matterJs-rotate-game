import Matter from 'matter-js'
import line from '../lib/line.js'

import {
    width,
    height,
    size,
    w,
    padding
} from '../lib/var.js'



import randomItem from '../lib/randomItem'


const {
    Engine,
    Render,
    Bodies,
    World,
    Body,
    Events
} = Matter


/** ============================================================= */

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

/** ============================================================= */


// background 周围 border 
const [borderTop, borderRight, borderBottom, borderLeft] = [
    line(width / 2, 0, width, size),
    line(width, height / 2, size, height),
    line(width / 2, height, width, size),
    line(0, height / 2, size, height)
]

// 内部border
const d = size * 1.5 + w / 2 + padding
const gate1 = line(width / 5, height - d, width / 2.5, w)
const gate2 = line(width - size * 2, height / 5, w, height / 2.5)
const gate3 = line(width - width / 6, height - d, width / 3, w)
const gate4 = line(width / 4, d, width / 2, w)
const gate5 = line(d, height / 1.5, w, height / 4)


// 在画布的角落里随意放置形状
const coordinates = [
    [size + padding / 2, size + padding / 2],
    [width - (size + padding / 2), size + padding / 2],
    [width - (size + padding / 2), height - (size + padding / 2)],
    [size + padding / 2, height - (size + padding / 2)],
]


// 目标
const goal = Bodies.rectangle(...randomItem(coordinates), size, size, {
    render: {
        fillStyle: '#d63447',
    },
    // 防止碰撞的传感器
    isSensor: true,
    // 符合形状的标签受重力影响
    label: 'match',
})

const grid = Body.create({
    parts: [
        borderTop,
        borderRight,
        borderBottom,
        borderLeft,
        gate1,
        gate2,
        gate3,
        gate4,
        gate5,
        goal,
    ],
    isStatic: true,
});

// 重力影响的球
const player = Bodies.circle(width / 2, height / 2, size / 2, {
    render: {
        fillStyle: '#00bdaa',
    },
    label: 'match',
});


let rotation = 0;
let index = 0;
const gravity = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
];

// 监听旋转事件
function rotateMaze(direction) {
    const {
        canvas
    } = render;
    if (direction === 'left') {
        rotation -= 1;
        index = index <= 0 ? gravity.length - 1 : index - 1;
    } else {
        rotation += 1;
        index = index >= gravity.length - 1 ? 0 : index + 1;
    }
    canvas.style.transform = `rotate(${rotation * 90}deg)`;

    const [x, y] = gravity[index];
    world.gravity.x = x;
    world.gravity.y = y;
}

const buttons = document.querySelectorAll('button');

function handleClick() {
    const direction = this.getAttribute('data-direction');
    rotateMaze(direction);
}


// 监听 键盘和按钮点击事件
buttons.forEach(button => button.addEventListener('click', handleClick));
document.onkeydown = function (event) {
    const e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 37) { 
        rotateMaze('left')
    }
    if (e && e.keyCode == 39) { 
        rotateMaze('right')
    }
 
};

// 检查球员和球门之间是否发生了碰撞
function handleCollision(e) {
    const {
        pairs
    } = e;
    pairs.forEach(pair => {
        const {
            label: labelA
        } = pair.bodyA;
        const {
            label: labelB
        } = pair.bodyB;
        if (labelA === labelB) {
            // 在碰撞之前暂时改变球门柱的颜色
            goal.render.fillStyle = '#ee8572';
            const timeout = setTimeout(() => {
                goal.render.fillStyle = '#d63447';

                const [x, y] = randomItem(coordinates);
                Body.setPosition(goal, {
                    x,
                    y,
                });
                Body.setPosition(player, {
                    x: width / 2,
                    y: height / 2,
                });

                clearTimeout(timeout);
            }, 500);
        }
    });
}


World.add(world, [grid, player]);

// 监听旋转按钮事件
Events.on(engine, 'collisionStart', handleCollision);

export {engine, render}