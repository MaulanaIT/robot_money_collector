import React, { Component } from 'react';

import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import axios from 'axios';

import { hashString } from 'react-hash-string';

import './home.css'

export class home extends Component {

    state = {
        cols: 5,
        rows: 5,
        totalMove: 15,
        movementHistory: [],
        currentGenerateMoneyBox: 0,
        maximalGenerateMoneyBox: 5,
        totalGenerateMoneyBox: 0,
        startMoneyBox: 500,
        endMoneyBox: 20000,
        collectedMoney: 0,
        earnedMoney: 0,
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
        move: false,
        startInterestRates: 5,
        endInterestRates: 25,
        currentInterestRates: 0,
        userID: '',

        dataScore: []
    }

    componentDidMount() {
        axios.get("http://localhost:3001/api/select/score").then(response => {
            this.setState({ dataScore: response.data });

            if (sessionStorage.getItem("SetConfiguration") != null || sessionStorage.getItem("SetConfiguration") === 1) {
                this.setState({
                    cols: sessionStorage.getItem("GridColumn"),
                    rows: sessionStorage.getItem("GridRow"),
                    totalMove: sessionStorage.getItem("MaximalMove"),
                    maximalGenerateMoneyBox: sessionStorage.getItem("MaximalGenerateMoneyBox"),
                    startMoneyBox: sessionStorage.getItem("StartMoneyBox"),
                    endMoneyBox: sessionStorage.getItem("EndMoneyBox")
                }, () => {
                    document.getElementById('input-row').value = this.state.rows;
                    document.getElementById('input-column').value = this.state.cols;
                    document.getElementById('input-maximal-move').value = this.state.totalMove;
                    document.getElementById('input-maximal-generated-money-box').value = this.state.maximalGenerateMoneyBox;
                    document.getElementById('input-start-money-box').value = this.state.startMoneyBox;
                    document.getElementById('input-end-money-box').value = this.state.endMoneyBox;

                    this.setUpGame();
                });
            } else {
                this.setUpGame();
            }

            let userAgent = navigator.userAgent;
            let browserName;

            if (userAgent.match(/chrome|chromium|crios/i)) {
                browserName = "Chrome";
            } else if (userAgent.match(/firefox|fxios/i)) {
                browserName = "Firefox";
            } else if (userAgent.match(/safari/i)) {
                browserName = "Safari";
            } else if (userAgent.match(/opr\//i)) {
                browserName = "Opera";
            } else if (userAgent.match(/edg/i)) {
                browserName = "Edge";
            } else {
                browserName = "No browser detection";
            }

            this.setState({ userID: hashString(response.data.ip_address + ' ' + browserName) });
        });
    }

    endGame = () => {
        document.querySelector(".game-over-overlay").classList.add('d-none');
    }

    inputNumber = (event) => {
        document.getElementById(event.target.id).value = parseInt(event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1'));

        if (event.target.value < 0 || event.target.value == 'NaN') {
            document.getElementById(event.target.id).value = 0;
        }
    }

    inputTotalGrid = (event) => {
        this.inputNumber(event);

        if (event.target.value > 10) {
            document.getElementById('input-row').value = "10";
            document.getElementById('input-column').value = "10";
        } else {
            document.getElementById('input-row').value = event.target.value;
            document.getElementById('input-column').value = event.target.value;
        }
    }

    playAgain = () => {
        window.location.reload(true);
    }

    reduceTotalMove() {
        this.setState({ totalMove: this.state.totalMove - 1 });
    }

    setConfiguration = () => {
        sessionStorage.setItem("SetConfiguration", 1);
        sessionStorage.setItem("GridColumn", document.getElementById('input-column').value);
        sessionStorage.setItem("GridRow", document.getElementById('input-row').value);
        sessionStorage.setItem("MaximalMove", document.getElementById('input-maximal-move').value);
        sessionStorage.setItem("MaximalGenerateMoneyBox", document.getElementById('input-maximal-generated-money-box').value);
        sessionStorage.setItem("StartMoneyBox", document.getElementById('input-start-money-box').value);
        sessionStorage.setItem("EndMoneyBox", document.getElementById('input-end-money-box').value);

        this.playAgain();
    }

    setUpGame = () => {
        const container = document.querySelector(".grid-container");

        container.innerHTML = "";

        let x = 0;
        let y = 0;

        let rows = this.state.rows;
        let cols = this.state.cols;

        container.style.minWidth = (cols * 50 + 30 * 2) + "px";

        container.style.setProperty("--grid-rows", rows);
        container.style.setProperty("--grid-cols", cols);

        this.setState({ currentInterestRates: parseInt(Math.random() * (this.state.endInterestRates - this.state.startInterestRates) + this.state.startInterestRates) })

        for (let i = 0; i < rows * cols; i++) {
            let cell = document.createElement("div");

            cell.id = 0;

            y = i % cols;

            if (i > 0 && i % rows === 0) x++;

            container.appendChild(cell).className = "grid-node grid-node-" + x + '-' + y;
        }

        let currentGenerateMoneyBox = this.state.currentGenerateMoneyBox;
        let totalGenerateMoneyBox = this.state.totalGenerateMoneyBox;

        let movementHistory = this.state.movementHistory;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let randomNode = Math.random() * ((cols - 1) - 0) + 0;

                if (j > 0 && parseInt(randomNode) === 2 && currentGenerateMoneyBox < this.state.maximalGenerateMoneyBox) {
                    let randomMoneyBox = parseInt(Math.random() * (this.state.endMoneyBox - this.state.startMoneyBox) + this.state.startMoneyBox);
                    let moneyBox = document.createElement("div");

                    moneyBox.className = "fw-bold text-center text-success";
                    moneyBox.innerHTML = "$" + randomMoneyBox;

                    document.querySelector(".grid-node-" + i + '-' + j).id = randomMoneyBox;
                    document.querySelector(".grid-node-" + i + '-' + j).appendChild(moneyBox);

                    currentGenerateMoneyBox++;
                    totalGenerateMoneyBox = totalGenerateMoneyBox + randomMoneyBox;
                }
            }
        }

        this.setState({ currentGenerateMoneyBox: currentGenerateMoneyBox, totalGenerateMoneyBox: totalGenerateMoneyBox });

        let robot = document.createElement("div");
        let firstGridNode = document.querySelector(".grid-node-0-0");

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

                movementHistory.push("{x: " + this.state.position.x + ", y: " + this.state.position.y + "}");

                if (cell.id > 0) {
                    this.setState({ collectedMoney: this.state.collectedMoney + parseInt(cell.id), currentGenerateMoneyBox: this.state.currentGenerateMoneyBox - 1 }, () => {
                        if (this.state.earnedMoney === 0) {
                            this.setState({ earnedMoney: parseInt(cell.id) }, () => {
                                cell.id = "0";
                                cell.innerHTML = "";
                            });
                        } else {
                            this.setState({ earnedMoney: parseInt((parseInt(this.state.earnedMoney) + parseInt(cell.id)) + (parseInt(this.state.earnedMoney) + parseInt(cell.id)) * parseInt(this.state.currentInterestRates) / 100) }, () => {
                                cell.id = "0";
                                cell.innerHTML = "";
                            });
                        }
                    });
                } else {
                    this.setState({ earnedMoney: parseInt(parseInt(this.state.earnedMoney) + parseInt(this.state.earnedMoney) * parseInt(this.state.currentInterestRates) / 100) });
                }

                cell.appendChild(robot);

                this.reduceTotalMove();

                this.state.move = false;
            }

            if (this.state.currentGenerateMoneyBox <= 0 || this.state.totalMove <= 0) {
                document.querySelector(".game-over-overlay").classList.remove('d-none');

                axios.get("https://ipgeolocation.abstractapi.com/v1/?api_key=676461ed1e574f40b119d5b60b45c532").then(response => {
                    const data = {
                        UserID: this.state.userID,
                        MovementHistory: movementHistory.toString(),
                        TotalMoneyAvailable: this.state.totalGenerateMoneyBox,
                        TotalMoneyFound: this.state.collectedMoney,
                        InterestRate: this.state.currentInterestRates,
                        TotalMoneyEarning: this.state.earnedMoney,
                    };

                    axios.post('http://localhost:3001/api/insert/score', data).then(responseInsert => {
                        console.log(responseInsert);
                    });
                });
            }
        });
    }

    toggleConfiguration = () => {
        if (document.getElementById("toggle-configuration").classList.contains('active')) {
            document.getElementById("toggle-configuration").classList.remove('active');
            document.getElementById("content-configuration").classList.remove('active');
        } else {
            document.getElementById("toggle-configuration").classList.add('active');
            document.getElementById("content-configuration").classList.add('active');
        }
    }

    toggleHistory = () => {
        if (document.getElementById("toggle-history").classList.contains('active')) {
            document.getElementById("toggle-history").classList.remove('active');
            document.getElementById("content-history").classList.remove('active');
        } else {
            document.getElementById("toggle-history").classList.add('active');
            document.getElementById("content-history").classList.add('active');
        }
    }

    render() {
        return (
            <div className="overflow-auto">
                <div className="game-over-overlay d-none">
                    <div className="game-over-content justify-content-center align-items-center">
                        <div className="content" style={{ width: "600px" }}>
                            <p className="fs-1 fw-bold text-white">Game Over</p>
                            <div className="gap-2 mx-0 px-0 row">
                                <p className="col-5 col-form-label fs-4 px-0 text-white">Play Again?</p>
                                <button className="btn btn-success col-3" onClick={this.playAgain}>Yes</button>
                                <button className="btn btn-danger col-3" onClick={this.endGame}>No</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="configuration">
                    <div id="title-configuration" className="active configuration">
                        <FaAngleLeft id="toggle-configuration" className="active fs-3 mt-1 position-absolute toggle" style={{ cursor: "pointer" }} onClick={this.toggleConfiguration} />
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
                            <label className="col-auto col-form-label px-0">Box</label>
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
                        <div className="pb-4 row">
                            <label htmlFor="input-start-money-box" className="col-5 col-form-label">Range Interest Rates <br /> (%)</label>
                            <div className="col-3">
                                <input type="text" id="input-start-money-box" className="form-control text-center" onInput={this.inputNumber} defaultValue={this.state.startInterestRates} />
                            </div>
                            <label htmlFor="input-column" className="col-1 col-form-label">-</label>
                            <div className="col-3">
                                <input type="text" id="input-end-money-box" className="form-control text-center" onInput={this.inputNumber} defaultValue={this.state.endInterestRates} />
                            </div>
                        </div>
                        <div className="mx-0 row">
                            <button className="btn btn-danger fw-bold" onClick={this.setConfiguration}>Set Up</button>
                        </div>
                    </div>
                </div>
                <div id="history">
                    <div id="title-history" className="active history">
                        <FaAngleRight id="toggle-history" className="active fs-3 mt-1 position-absolute toggle" style={{ cursor: "pointer", right: "10px" }} onClick={this.toggleHistory} />
                        <p className="fw-bold fs-4 m-0 text-center">History</p>
                    </div>
                    <div id="content-history" className="active history-content overflow-auto">
                        {this.state.dataScore.map(data =>
                            <div key={data.user_id} id={"score-" + data.id + "-" + data.user_id} className="d-flex p-2 text-white" style={{ fontSize: "12px", borderBottom: "solid 1px white" }}>
                                <div className="col-4 d-flex flex-column pe-4">
                                    <div style={{ flex: 1 }}>
                                        <p className="fw-bold m-0">{"User ID : " + data.user_id}</p>
                                    </div>
                                    <div>
                                        <p className="align-bottom m-0">{(new Date(data.created_at)).toLocaleDateString() + " " + (new Date(data.created_at)).toLocaleTimeString() }</p>
                                    </div>
                                </div>
                                <div className="col-8 d-flex ps-4">
                                    <div className="col d-flex flex-column pe-2 text-end">
                                        <div className="pb-1">
                                            <p className="m-0">Money Available<br />${data.total_money_available}</p>
                                        </div>
                                        <div className="pb-1">
                                            <p className="m-0">Money Found<br />${data.total_money_found}</p>
                                        </div>
                                    </div>
                                    <div className="col d-flex flex-column ps-2 text-end">
                                        <div className="pb-1">
                                            <p className="m-0">Interest Rate<br />{data.interest_rate}%</p>
                                        </div>
                                        <div className="pb-1">
                                            <p className="m-0">Money Earned<br />${data.total_money_earning}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="content">
                    <p className="title">Robot Money Collector</p>
                    <div className="d-flex gap-4">
                        <div className="me-auto pb-2">
                            <div className="card-item bg-success p-2">
                                <p className="fw-bold m-0 pb-2 text-center">Your Robot Earning</p>
                                <hr className="m-0" />
                                <div className="d-flex text-nowrap">
                                    <div className="col-4 p-2">
                                        <p className="m-0 fw-bold text-center">${this.state.collectedMoney}</p>
                                        <p className="m-0 text-size-earning-details">Money Found</p>
                                    </div>
                                    <div className="col-4 p-2">
                                        <p className="m-0 fw-bold text-center">{this.state.currentInterestRates}%</p>
                                        <p className="m-0 px-3 text-size-earning-details">Interest Rate</p>
                                    </div>
                                    <div className="col-4 p-2">
                                        <p className="m-0 fw-bold text-center">${this.state.earnedMoney}</p>
                                        <p className="m-0 text-size-earning-details">Money Earned</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="align-items-end d-flex pb-2">
                            <div className="bg-danger card-item">
                                <p className="m-0 px-3 py-2">Total Move : {this.state.totalMove}</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid-container"></div>
                    <p className="col-form-label fw-bold m-0 pb-0 text-center text-white">User ID : {this.state.userID}</p>
                </div>
            </div>
        )
    }
}

export default home
