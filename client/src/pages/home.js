import React, { Component } from 'react';

import { FaAngleLeft } from 'react-icons/fa';

import './home.css'

export class home extends Component {

    state = {
        cols: 5,
        rows: 5,
        totalMove: 15,
        currentGenerateMoneyBox: 0,
        maximalGenerateMoneyBox: 5,
        startMoneyBox: 500,
        endMoneyBox: 20000,
        collectedMoney: 0,
        position: { x: 0, y: 0 },
        keys: {
            escape: 27,
            space: 32,
            left: 37,
            up: 38,
            right: 39,
            down: 40
        },
        rotate: 0,
        move: false
    }

    componentDidMount() {
        this.setUpGame();
    }

    endGame = () => {
        document.querySelector(".game-over-overlay").classList.add('d-none');
    }

    inputNumber = (event) => {
        document.getElementById(event.target.id).value = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
    }

    inputTotalGrid = (event) => {
        this.inputNumber(event);

        if (event.target.value > 10) {
            document.getElementById(event.target.id).value = "10";
        }
    }

    playAgain = () => {
        this.endGame();
        this.setUpGame();
    }

    reduceTotalMove() {
        this.setState({ totalMove: this.state.totalMove - 1 });
    }

    setUpGame = () => {
        this.setState({
            cols: document.getElementById('input-column').value,
            rows: document.getElementById('input-row').value,
            totalMove: document.getElementById('input-maximal-move').value,
            currentGenerateMoneyBox: 0,
            maximalGenerateMoneyBox: document.getElementById('input-maximal-generated-money-box').value,
            startMoneyBox: document.getElementById('input-start-money-box').value,
            endMoneyBox: document.getElementById('input-end-money-box').value,
            collectedMoney: 0,
            position: { x: 0, y: 0 },
            rotate: 0,
            move: false
        }, () => {

            const container = document.querySelector(".grid-container");

            container.innerHTML = "";

            let x = 0;
            let y = 0;

            let rows = this.state.rows;
            let cols = this.state.cols;

            container.style.minWidth = (cols * 50 + 30 * 2) + "px";

            container.style.setProperty("--grid-rows", rows);
            container.style.setProperty("--grid-cols", cols);

            for (let i = 0; i < rows * cols; i++) {
                let cell = document.createElement("div");

                cell.id = 0;

                y = i % cols;

                if (i > 0 && i % rows === 0) x++;

                container.appendChild(cell).className = "grid-node grid-node-" + x + '-' + y;
            }

            let currentGenerateMoneyBox = this.state.currentGenerateMoneyBox;

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    let randomNode = Math.random() * (4 - 0) + 0;

                    if (j > 0 && parseInt(randomNode) === 2 && currentGenerateMoneyBox < this.state.maximalGenerateMoneyBox) {
                        let randomMoneyBox = parseInt(Math.random() * (this.state.endMoneyBox - this.state.startMoneyBox) + this.state.startMoneyBox);
                        let moneyBox = document.createElement("div");

                        moneyBox.className = "fw-bold text-center text-success";
                        moneyBox.innerHTML = "$" + randomMoneyBox;

                        document.querySelector(".grid-node-" + i + '-' + j).id = randomMoneyBox;
                        document.querySelector(".grid-node-" + i + '-' + j).appendChild(moneyBox);

                        currentGenerateMoneyBox++;

                        console.log(randomMoneyBox);
                    }
                }
            }

            this.setState({ currentGenerateMoneyBox: currentGenerateMoneyBox });

            let robot = document.createElement("div");
            let firstGridNode = document.querySelector(".grid-node");

            robot.className = "item";
            robot.style.transform = "rotate(0deg)";

            firstGridNode.appendChild(robot);
            
            window.addEventListener("keydown", (e) => {
                switch (e.keyCode) {
                    case this.state.keys.escape:
                        if (!document.querySelector('.game-over-overlay').classList.contains('d-none')) {
                            document.querySelector('.game-over-overlay').classList.add('d-none');
                        }
                        break;
                    case this.state.keys.left:
                        this.setState({ rotate: 90 });
                        break;
                    case this.state.keys.up:
                        this.setState({ rotate: 180 });
                        break;

                    case this.state.keys.right:
                        this.setState({ rotate: -90 });
                        break;

                    case this.state.keys.down:
                        this.setState({ rotate: 0 });
                        break;
                    case this.state.keys.space:
                        if (this.state.totalMove > 0) {
                            if (this.state.rotate === 0) {
                                if (this.state.position.x < cols - 1) {
                                    this.state.position.x++;

                                    this.state.move = true;
                                } else {
                                    this.state.move = false;
                                };
                            } else if (this.state.rotate === 90) {
                                if (this.state.position.y > 0) {
                                    this.state.position.y--;

                                    this.state.move = true;
                                } else {
                                    this.state.move = false;
                                };
                            } else if (this.state.rotate === 180) {
                                if (this.state.position.x > 0) {
                                    this.state.position.x--;

                                    this.state.move = true;
                                } else {
                                    this.state.move = false;
                                };
                            } else if (this.state.rotate === -90) {
                                if (this.state.position.y < rows - 1) {
                                    this.state.position.y++;

                                    this.state.move = true;
                                } else {
                                    this.state.move = false;
                                };
                            }
                            break;
                        } else {
                            break;
                        }
                }

                robot.style.transform = "rotate(" + this.state.rotate + "deg)";

                if (this.state.move) {
                    let cell = document.querySelector(".grid-node-" + this.state.position.x + '-' + this.state.position.y);

                    if (cell.id > 0) {
                        this.setState({ collectedMoney: this.state.collectedMoney + parseInt(cell.id), currentGenerateMoneyBox: this.state.currentGenerateMoneyBox - 1 }, () => {
                            cell.id = "0";
                            cell.innerHTML = "";

                            console.log(this.state.collectedMoney);
                        });
                    }

                    cell.appendChild(robot);

                    this.reduceTotalMove();

                    this.state.move = false;
                }

                if (this.state.currentGenerateMoneyBox <= 0 || this.state.totalMove <= 0) {
                    document.querySelector(".game-over-overlay").classList.remove('d-none');
                }
            });
        });
    }

    toggleConfiguration = () => {
        if (document.getElementById("toggle").classList.contains('active')) {
            document.getElementById("toggle").classList.remove('active');
            document.getElementById("content-configuration").classList.remove('active');
        } else {
            document.getElementById("toggle").classList.add('active');
            document.getElementById("content-configuration").classList.add('active');
        }
    }

    render() {
        return (
            <div className="overflow-auto">
                <div className="game-over-overlay d-none">
                    <div className="game-over-content justify-content-center align-items-center">
                        <div className="content" style={{width: "600px"}}>
                            <p className="fs-1 fw-bold text-white">Game Over</p>
                            <div className="gap-2 mx-0 px-0 row">
                                <p className="col-5 col-form-label fs-4 px-0 text-white">Play Again?</p>
                                <button className="btn btn-success col-3" onClick={this.playAgain}>Yes</button>
                                <button className="btn btn-danger col-3" onClick={this.endGame}>No</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="title-configuration" className="active configuration">
                    <FaAngleLeft id="toggle" className="active fs-3 mt-1 position-absolute toggle" style={{ cursor: "pointer" }} onClick={this.toggleConfiguration} />
                    <p className="fw-bold fs-4 m-0 text-center">Configuration</p>
                </div>
                <div id="content-configuration" className="active configuration-content">
                    <div className="pb-3 row">
                        <label htmlFor="input-row" className="col-5 col-form-label">Grid</label>
                        <div className="col-3">
                            <input type="text" id="input-row" className="form-control text-center" onInput={this.inputTotalGrid} defaultValue={this.state.rows} />
                        </div>
                        <label htmlFor="input-column" className="col-1 col-form-label">x</label>
                        <div className="col-3">
                            <input type="text" id="input-column" className="form-control text-center" onInput={this.inputTotalGrid} defaultValue={this.state.cols} />
                        </div>
                    </div>
                    <div className="pb-3 row">
                        <label htmlFor="input-row" className="col-5 col-form-label">Maximal Move</label>
                        <div className="col-3">
                            <input type="text" id="input-maximal-move" className="form-control text-center" onInput={this.inputNumber} defaultValue={this.state.totalMove} />
                        </div>
                    </div>
                    <p className="col-form-label fw-bold fs-5">Money</p>
                    <div className="pb-4 row">
                        <label htmlFor="input-maximal-generated-money-box" className="col-5 col-form-label">Maximal Generated</label>
                        <div className="col-3">
                            <input type="text" id="input-maximal-generated-money-box" className="form-control text-center" onInput={this.inputNumber} defaultValue={this.state.maximalGenerateMoneyBox} />
                        </div>
                        <label className="col-auto col-form-label">Box</label>
                    </div>
                    <div className="pb-4 row">
                        <label htmlFor="input-start-money-box" className="col-5 col-form-label">Range Money</label>
                        <div className="col-3">
                            <input type="text" id="input-start-money-box" className="form-control text-center" onInput={this.inputNumber} defaultValue={this.state.startMoneyBox} />
                        </div>
                        <label htmlFor="input-column" className="col-1 col-form-label">-</label>
                        <div className="col-3">
                            <input type="text" id="input-end-money-box" className="form-control text-center" onInput={this.inputNumber} defaultValue={this.state.endMoneyBox} />
                        </div>
                    </div>
                    <div className="mx-0 row">
                        <button className="btn btn-danger fw-bold" onClick={this.setUpGame}>Set Up</button>
                    </div>
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
