import React, { Component } from 'react';

import './home.css'

export class home extends Component {

    state = {
        cols: 10,
        rows: 10,
        totalMove: 0
    }

    componentDidMount() {
        const container = document.querySelector(".grid-container");

        let x = 0;
        let y = 0;

        let rows = this.state.rows;
        let cols = this.state.cols;

        container.style.minWidth = (cols * 50 + 30 * 2) + "px";

        container.style.setProperty("--grid-rows", rows);
        container.style.setProperty("--grid-cols", cols);

        for (let i = 0; i < rows * cols; i++) {
            let cell = document.createElement("div");

            y = i % cols;

            if (i > 0 && i % rows === 0) x++;

            container.appendChild(cell).className = "grid-node grid-node-" + x + '-' + y;
        }

        let robot = document.createElement("div");
        let firstGridNode = document.querySelector(".grid-node");
        let position = { x: 0, y: 0 };
        let keys = {
            space: 32,
            left: 37,
            up: 38,
            right: 39,
            down: 40
        };
        let rotate = 0;

        let move = false;

        robot.className = "item";
        robot.style.transform = "rotate(0deg)";

        firstGridNode.appendChild(robot);

        window.addEventListener("keydown", function (e) {
            switch (e.keyCode) {
                case keys.left:
                    rotate = 90;
                    break;
                case keys.up:
                    rotate = 180;
                    break;

                case keys.right:
                    rotate = -90;
                    break;

                case keys.down:
                    rotate = 0;
                    break;
                case keys.space:
                    if (rotate === 0) {
                        if (position.x < cols - 1) {
                            position.x++;

                            move = true;
                        } else {
                            move = false;
                        };
                    } else if (rotate === 90) {
                        if (position.y > 0) {
                            position.y--;

                            move = true;
                        } else {
                            move = false;
                        };
                    } else if (rotate === 180) {
                        if (position.x > 0) {
                            position.x--;

                            move = true;
                        } else {
                            move = false;
                        };
                    } else if (rotate === -90) {
                        if (position.y < rows - 1) {
                            position.y++;

                            move = true;
                        } else {
                            move = false;
                        };
                    }
                    break;
            }

            robot.style.transform = "rotate(" + rotate + "deg)";

            if (move) {
                let cell = document.querySelector(".grid-node-" + position.x + '-' + position.y);

                cell.appendChild(robot);

                move = false;
            }
        });
    }



    render() {
        return (
            <div className="overflow-auto">
                <div className="configuration">
                    <p className="fw-bold fs-4 m-0 pb-2 text-center">Configuration</p>
                    
                </div>
                <div className="content">
                    <p className="title">Robot Money Collector</p>
                    <div>
                        <div className="d-flex justify-content-end pb-2">
                            <div className="bg-danger card-item">
                                <p className="m-0 px-3 py-2">Total Move : {this.state.totalMove}</p>
                            </div>
                        </div>
                        <div className="grid-container"></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default home
