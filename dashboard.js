let tempValue = 0;
let humValue = 0;
let lightValue = 0;


let gasValue = 0;

let tempArray = new Array(10).fill(0);
let humArray = new Array(10).fill(0);
let lightArray = new Array(10).fill(0);
let gasArray = new Array(10).fill(0);


// let rainArray = new Array(10).fill(0)

// mảng chứa các mức độ ánh sáng 

let tempLevel = [
    "#FFFFFF",
    "#FFD700",
    "#FFA500",
    "#FFA07A",
    "#ffc500",
    "#c21500"
];

const humidLevel = [
    "#87CEEB",
    "#00BFFF",
    "#4682B4",
    "#A5FECB",
    "#20BDFF",
    "#2B32B2"
];

const lightLevel = [
    "#bdc3c7",
    "#2c3e50",
    "#003973",
    "#E5E5BE",
    "#fbc7d4",
    "#FFFF00"
];

function turnLed() {
    
}


document.addEventListener("DOMContentLoaded", function () {
    // gọi dữ liệu máy chủ 
    // Input for highchart
    function getDHT() {
        fetch("http://localhost:8080/sensor/get-top-1-sensor")// gửi yêu cầu  HTTP   tới một địa chỉ url 
            .then(response => response.json()) // chuyển đổi thành Json
            .then(data => { // data chứa dữ liệu từ máy chủ 
                console.log(data);
                for (let key in data) {
                    if (key == 'temp') {
                        tempValue = data[key];
                    }
                    else if (key == 'hum') {
                        humValue = data[key];
                    }
                    else if (key == 'light') {
                        lightValue = data[key];
                    }
                    else if (key == 'gas') {
                        gasValue = data[key];
                    }
                }
       
                //------------------------------------------------------------------
                // random background temp

                let backgroundTemp = document.getElementById("background-temp");
                let numberInputTemp = document.getElementById("numberInputTemp");
                let numberTemp = document.getElementById("numberTemp");

                numberInputTemp.value = tempValue; //  gán giá trị cho numberInputterm

                let inputValue = parseInt(numberInputTemp.value); // de sau co input dau vao
                // console.log("Giá trị mới của input 2: " + inputValue);

                if (inputValue <= 10) {
                    // numberTemp.style.color = "#FFFFFF";
                    backgroundTemp.style.background = `linear-gradient(to right, ${tempLevel[2]}, ${tempLevel[1]})`;
                }
                else if (inputValue <= 20) {
                    // numberTemp.style.color = "#99FF33";
                    backgroundTemp.style.background = `linear-gradient(to right, ${tempLevel[3]}, ${tempLevel[2]})`;
                }
                else {
                    // numberTemp.style.color = "red";
                    backgroundTemp.style.background = `linear-gradient(to right, ${tempLevel[5]}, ${tempLevel[4]})`;
                }
              
                numberTemp.textContent = inputValue + "°C";


                //------------------------------------------------------------------
                // random background hum

                let backgroundHum = document.getElementById("background-hum");
                let numberInputHum = document.getElementById("numberInputHum");
                let numberHum = document.getElementById("numberHum");
                numberInputHum.value = humValue;

                inputValue = parseInt(numberInputHum.value);

                if (inputValue <= 60) {
                    // numberHum.style.color = "#FFFFFF";
                    backgroundHum.style.background = `linear-gradient(to right, ${humidLevel[2]}, ${humidLevel[1]})`;
                }
                else if (inputValue <= 80) {
                    // numberHum.style.color = "#33FFFF"; // cyan
                    backgroundHum.style.background = `linear-gradient(to right, ${humidLevel[4]}, ${humidLevel[3]})`;
                }
                else {
                    // numberHum.style.color = "#0000FF"; // xanh dam
                    backgroundHum.style.background = `linear-gradient(to right, ${humidLevel[5]}, ${humidLevel[4]}, ${humidLevel[3]})`;
                }

                numberHum.textContent = inputValue + "%";


                //------------------------------------------------------------------
                // random background light

                let backgroundLight = document.getElementById("background-light");
                let numberInputLight = document.getElementById("numberInputLight");
                let numberLight = document.getElementById("numberLight");
                numberInputLight.value = lightValue;

                inputValue = parseInt(numberInputLight.value);

                if (inputValue <= 150) {
                    
                }
                else if (inputValue <= 1000) {
                    // numberLight.style.color = "orrange";
                    backgroundLight.style.background = `linear-gradient(to right, ${lightLevel[2]}, ${lightLevel[3]})`;
                   
                }
                else {
                    // numberLight.style.color = "blue";
                    backgroundLight.style.background = `linear-gradient(to right, ${lightLevel[4]}, ${lightLevel[5]})`;
                    
                   

                    

                }

                numberLight.textContent = inputValue + " Lux";


                let backgroundGas = document.getElementById("background-gas");
                let numberInputGas = document.getElementById("numberInputGas");
                let numberGas = document.getElementById("numberGas");
                numberInputGas.value = gasValue;


                inputValue = parseInt(numberInputGas.value);

                if (inputValue <= 30) {
                    // numberLight.style.color = "#FFFFFF";
                    backgroundGas.style.background = `linear-gradient(to right, ${lightLevel[0]}, ${lightLevel[1]})`;
                }
                else if (inputValue <= 60) {
                    // numberLight.style.color = "orrange";
                    backgroundGas.style.background = `linear-gradient(to right, ${tempLevel[2]}, ${tempLevel[3]})`;
                }
                else {
                    // numberLight.style.color = "blue";
                    backgroundGas.style.background = `linear-gradient(to right, ${humidLevel[4]}, ${humidLevel[5]})`;
                }

                numberGas.textContent = inputValue + " Gas";
            });
    }

    setInterval(getDHT, 2000);
});


// ------------------------------------------------------------------------
// Highchart

document.addEventListener("DOMContentLoaded", function () {



    function updateChart() {

        //--------------------------------------------------------------------
        // tao Highchart

        tempArray.push(tempValue);
        tempArray.shift();
        humArray.push(humValue);
        humArray.shift();
        lightArray.push(lightValue);
        lightArray.shift();
        gasArray.push(gasValue);
        gasArray.shift();
        // rainArray.push(rainValue);
        // rainArray.shift();
        const chart = Highcharts.chart('dashboard1', {
            // Các tùy chọn của biểu đồ
            title: {
                text: 'Dashboard'
            },
            xAxis: {
                title: {
                    text: 't (s)'
                },
                categories: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
            },
            yAxis: {
                title: {
                    text: 'Đơn vị'
                }
            },
            series: [
                {
                    name: 'Temperature',
                    data: tempArray
                },
                {
                    name: 'Humidity',
                    data: humArray
                }
            ]
        });

        const chart2 = Highcharts.chart('dashboard2', {
            // Các tùy chọn của biểu đồ
            title: {
                text: 'Dashboard'
            },
            xAxis: {
                title: {
                    text: 't (s)'
                },
                categories: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
            },
            yAxis: {
                title: {
                    text: 'Đơn vị'
                }
            },
            series: [
                {
                    name: 'Light',
                    data: lightArray
                }
            
                ,
                {
                    name: 'Gas',
                    data: gasArray
                }
            ]
        });

    }
    setInterval(updateChart, 3000);
});


// bat tat den led

document.addEventListener("DOMContentLoaded", function () {
    let led1 = false;
    let led2 = false;
    let led3 = false;

    const led1Checkbox = document.getElementById("led1");
    const led2Checkbox = document.getElementById("led2");
    const led3Checkbox = document.getElementById("led3");


    // Khi led1checkbox thay đoiỉ , thực thi 
    led1Checkbox.addEventListener("change", function () {
        console.log("led 1 duoc chon");
        led1 = !led1;

        // tạo đối tượng với các thuộc tính l1, l2 , l3 
        const dataToSend = {
            l1: led1 ? "1" : "0",
            l2: led2 ? "1" : "0",
            l3: led3 ? "1" : "0"
        };

        // gửi dữ liệu datatosend đi
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend) // chuyển thành json
        };


        const url = 'http://localhost:8080/led/pub';


        fetch(url, requestOptions)
            .then(response => { // gọi sau khi server phản hồi
                if (!response.ok) {
                    throw new Error('Kết nối không ổn !');
                }

                return response.json();
            })
            .catch(error => {
                console.error('Có lỗi xảy ra:', error);

            });

        // delay 3s

        setTimeout(function () {
            fetch('http://localhost:8080/led/check')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Kết nối không ổn !');
                    }
                    return response.text();
                })
                .then(data => {
                    console.log(data);
                  
                    if (data == "OK") {

                        if (led1) {
                            let bulbElement = document.querySelector(".bulb");
                            bulbElement.style.background = 'url(../images/bulb_on.jpg)';
                            bulbElement.style.backgroundSize = 'cover';
                        }
                        else {
                            let bulbElement = document.querySelector(".bulb");
                            bulbElement.style.background = 'url(../images/bulb_off.jpg)';
                            bulbElement.style.backgroundSize = 'cover';
                        }

                        // sang o day
                    }
                });

        }, 3000);

    })

    led2Checkbox.addEventListener("change", function () {
        console.log("led 2 duoc chon");
        led2 = !led2;

        // tạo đối tượng
        const dataToSend = {
            l1: led1 ? "1" : "0",
            l2: led2 ? "1" : "0",
            l3: led3 ? "1" : "0"
        };


        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        };


        const url = 'http://localhost:8080/led/pub';


        fetch(url, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Kết nối không ổn !');
                }

                return response.json();
            })
            .catch(error => {
                console.error('Có lỗi xảy ra:', error);

            });

        // delay 3s -> sau do se bat den o day
        setTimeout(function () {
            fetch('http://localhost:8080/led/check')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Kết nối không ổn !');
                    }
                    return response.text();
                })
                .then(data => {
                    console.log(data);
                    if (data == "OK") {

                        if (led2) {
                            let fanElement = document.querySelector(".fan");
                            fanElement.style.animation = 'spin 2s linear infinite';
                        }
                        else {
                            let fanElement = document.querySelector(".fan");
                            fanElement.style.animation = 'none';
                        }

                        // sang o day
                    }
                });

        }, 3000);

    });


    led3Checkbox.addEventListener("change", function () {
        console.log("led 3 duoc chon");
        led3 = !led3;

        // tạo đối tượng
        const dataToSend = {
            l1: led1 ? "1" : "0",
            l2: led2 ? "1" : "0",
            l3: led3 ? "1" : "0"
        };


        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        };


        const url = 'http://localhost:8080/led/pub';


        fetch(url, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Kết nối không ổn !');
                }

                return response.json();
            })
            .catch(error => {
                console.error('Có lỗi xảy ra:', error);

            });

        // delay 3s -> sau do se bat den o day
        setTimeout(function () {
            fetch('http://localhost:8080/led/check')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Kết nối không ổn !');
                    }
                    return response.text();
                })
                .then(data => {

                    console.log(data);
                    if (data == "OK") {

                        if (led3) {
                            let bulbElement = document.querySelector(".bulb-3");
                            bulbElement.style.background = 'url(../images/bulb_on.jpg)';
                            bulbElement.style.backgroundSize = 'cover';
                        }
                        else {
                            let bulbElement = document.querySelector(".bulb-3");
                            bulbElement.style.background = 'url(../images/bulb_off.jpg)';
                            bulbElement.style.backgroundSize = 'cover';
                        }

                        // sang o day
                    }
                });

        }, 3000);

    })
});