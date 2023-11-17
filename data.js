const objectList = document.getElementById("object-list");
let dataList = null;
let rows = 7;

const ulTag = document.querySelector(".pagination ul");
let totalPages = 0;

// tính tổng số trang 
function getTotalPages(list, rows_per_page){
    if (list.length % rows_per_page == 0) {
        totalPages = dataList.length / rows_per_page;
    }
    else {
        totalPages = Math.floor(list.length / rows_per_page) + 1;
    }

    return totalPages;
}

// hiển thị ds dữ liệu lên trang web 
function DisplayList(items, rows_per_page, page) {
    
    objectList.innerHTML = ""; 
    page--;
    let start = rows_per_page * page;
    let end = start + rows_per_page;
    let paginatedItems = items.slice(start, end); // tao mảng con từ mảng item


    paginatedItems.forEach(object => {  

        let listItem = document.createElement("tr");

        for (let key in object) {
           
            let tmp = document.createElement("td");
            tmp.textContent = object[key];
            tmp.setAttribute("scope", "col");
            if (key == "time")
                tmp.classList.add("col-4");
            else
                tmp.classList.add("col-2");
            listItem.appendChild(tmp);
            // }
        }

        objectList.appendChild(listItem);

    });

}


// hàm tạo các nút điều khiển phân trang 

function element(totalPages, page){
  
    let liTag = '';
    let activeLi;
    let beforePages = page - 1;
    let afterPages = page + 1;
    if(page == 1)
        liTag += `<li class="btn prev" onclick="DisplayList(dataList, ${rows}, 1)"><span><i class="fas fa-angle-left"></i>Trước</span></li>`;

    if(page > 1){
        liTag += `<li class="btn prev" onclick="element(totalPages, ${page - 1}); DisplayList(dataList, ${rows}, ${page - 1})"><span><i class="fas fa-angle-left"></i>Trước</span></li>`;
    }
    if(page > 2){
        liTag += `<li class="numb" onclick="element(totalPages, 1); DisplayList(dataList, ${rows}, 1)"><span>1</span></li>`;
        if(page > 3){
            liTag += `<li class="dots"><span>...</span></li>`;
        }
    }
    for(let pageLength = beforePages; pageLength <= afterPages; pageLength++){
        if(pageLength > totalPages){
            continue;
        }
        
        if(pageLength == 0){
            pageLength += 1;
        }

        if(page == pageLength){
            activeLi = "active";
        }
            
        else{
            activeLi = "";
        }
        liTag += `<li class="numb ${activeLi}" onclick="element(totalPages, ${pageLength}); DisplayList(dataList, ${rows}, ${pageLength})"><span>${pageLength}</span></li>`;
    }

    if(page < totalPages - 1){
        if(page < totalPages - 2){
            liTag += `<li class="dots"><span>...</span></li>`;
        }
        liTag += `<li class="numb" onclick="element(totalPages, ${totalPages}); DisplayList(dataList, ${rows}, ${totalPages})"><span>${totalPages}</span></li>`;
    }

    if(page < totalPages){
        liTag += `<li class="btn next" onclick="element(totalPages, ${page + 1}); DisplayList(dataList, ${rows}, ${page + 1})"><span>Tiếp<i class="fas fa-angle-right"></i></span></li>`;
    }

    if(page == totalPages){
        liTag += `<li class="btn next" onclick="DisplayList(dataList, ${rows}, ${page})"><span>Tiếp<i class="fas fa-angle-right"></i></span></li>`;
    }
    ulTag.innerHTML = liTag;
}


document.addEventListener("DOMContentLoaded", function () {


    // Thực hiện cuộc gọi API bằng fetch
    fetch('http://localhost:8080/sensor/get-all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Chuyển đổi dữ liệu JSON
        })
        .then(data => {

            dataList = data;

            totalPages = getTotalPages(dataList, rows); // tình tonas tổng số trang 
            element(totalPages, 1);
            DisplayList(dataList, rows, 1);


            // xu ly tim kiem

            const formSearchElement = document.getElementById("search-box");
            const selectTypeElement = document.getElementById("select-type");
            const searchTextElement = document.getElementById("search-text");

            formSearchElement.addEventListener("submit", function (event) {
                event.preventDefault();
                // vi trang no k tu refresh do bi chan -> reset             
                
                let type = selectTypeElement.value;
                let text = searchTextElement.value;
                
                if (type == "temp") {
                    fetch("http://localhost:8080/sensor/temp/search?temp=" + text)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            // console.log(data);
                            dataList = data;
                            totalPages = getTotalPages(dataList, rows);
                            element(totalPages, 1);
                            DisplayList(dataList, rows, 1);
                        })
                        .catch(error => {
                            console.error('There was a problem with the fetch operation:', error);
                        });

                }
                else if (type == "hum") {
                    fetch("http://localhost:8080/sensor/hum/search?hum=" + text)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            dataList = data;
                            totalPages = getTotalPages(dataList, rows);
                            element(totalPages, 1);
                            DisplayList(dataList, rows, 1);
                        })
                        .catch(error => {
                            console.error('There was a problem with the fetch operation:', error);
                        });
                }
                else if (type = "light") {
                    fetch("http://localhost:8080/sensor/light/search?light=" + text)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            dataList = data;
                            totalPages = getTotalPages(dataList, rows);
                            element(totalPages, 1);
                            DisplayList(dataList, rows, 1);
                        })
                        .catch(error => {
                            console.error('There was a problem with the fetch operation:', error);
                        });
                }


            });


            // Xu ly filter
            const startElement = document.getElementById("start");
            const endElement = document.getElementById("end");
            const btnFilterElement = document.getElementById("btn-filter");

            btnFilterElement.addEventListener("click", function(event) {
                event.preventDefault();
                let startValue = startElement.value;
                let endValue = endElement.value;
                if(startValue != "" && endValue != ""){
                    // them 00:00:00 vao start
                    // them 23:59:59 vao end
                    startValue += " 00:00:00";
                    endValue += " 23:59:59";
                    console.log(startValue)
                    fetch('http://localhost:8080/sensor/filter?start=' + startValue + '&end=' + endValue)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                              }
                            return response.json();
                        })
                        .then(data =>{
                            // match o day
                            let searchText = searchTextElement.value;
                            if(searchText == ""){
                                dataList = data;
                            }
                            else{
                                let selectType = selectTypeElement.value;
                                let filterList = [];
                                if(selectType == 'temp'){
                                    data.forEach(object =>{
                                        for(let key in object){
                                            if(key == 'temp' && object[key] == searchText){
                                                filterList.push(object);
                                            }
                                        }
                                    });
                                }
                                else if(selectType == 'hum'){
                                    data.forEach(object =>{
                                        for(let key in object){
                                            if(key == 'hum' && object[key] == searchText){
                                                filterList.push(object);
                                            }
                                        }
                                    });
                                }
                                else{
                                    data.forEach(object =>{
                                        for(let key in object){
                                            if(key == 'light' && object[key] == searchText){
                                                filterList.push(object);
                                            }
                                        }
                                    });
                                }
                                dataList = filterList;
                            }
                            totalPages = getTotalPages(dataList, rows);
                            element(totalPages, 1);
                            DisplayList(dataList, rows, 1);
                            
                        })
                        .catch((error) => {
                            // Xử lý lỗi ở đây
                            console.error('There was a problem with the fetch operation:', error);
                        });
                }
                // console.log(startElement.value);
                // console.log(endElement.value);
            });



            // Xu ly sap xep

            const btnIdArrowUp = document.getElementById("id-arrow-up");
            const btnIdArrowDown = document.getElementById("id-arrow-down");
            const btnTempArrowUp = document.getElementById("temp-arrow-up");
            const btnTempArrowDown = document.getElementById("temp-arrow-down");
            const btnHumArrowUp = document.getElementById("hum-arrow-up");
            const btnHumArrowDown = document.getElementById("hum-arrow-down");
            const btnLightArrowUp = document.getElementById("light-arrow-up");
            const btnLightArrowDown = document.getElementById("light-arrow-down");
            const btnTimeArrowUp = document.getElementById("time-arrow-up");
            const btnTimeArrowDown = document.getElementById("time-arrow-down");

            btnIdArrowUp.addEventListener("click", function(event){
                event.preventDefault();
                
                let idList = dataList.sort((a, b) => a.id - b.id);

                totalPages = getTotalPages(idList, rows);
                element(totalPages, 1);
                DisplayList(idList, rows, 1);
            });

            btnIdArrowDown.addEventListener("click", function(event){
                event.preventDefault();
                
                let idList = dataList.sort((a, b) => b.id - a.id);
                totalPages = getTotalPages(idList, rows);
                element(totalPages, 1);
                DisplayList(idList, rows, 1);
            });

            btnTempArrowUp.addEventListener("click", function(event){
                event.preventDefault();
                let idList = dataList.sort((a, b) => a.temp - b.temp);
                totalPages = getTotalPages(idList, rows);
                element(totalPages, 1);
                DisplayList(idList, rows, 1);
            });

            btnTempArrowDown.addEventListener("click", function(event){
                event.preventDefault();
                
                let idList = dataList.sort((a, b) => b.temp - a.temp);
                totalPages = getTotalPages(idList, rows);
                element(totalPages, 1);
                DisplayList(idList, rows, 1);
            });

            btnHumArrowUp.addEventListener("click", function(event){
                event.preventDefault();
                
                let idList = dataList.sort((a, b) => a.hum - b.hum);
                totalPages = getTotalPages(idList, rows);
                element(totalPages, 1);
                DisplayList(idList, rows, 1);
            });

            btnHumArrowDown.addEventListener("click", function(event){
                event.preventDefault();
                
                let idList = dataList.sort((a, b) => b.hum - a.hum);
                totalPages = getTotalPages(idList, rows);
                element(totalPages, 1);
                DisplayList(idList, rows, 1);
            });

            btnLightArrowUp.addEventListener("click", function(event){
                event.preventDefault();
                
                let idList = dataList.sort((a, b) => a.light - b.light);
                totalPages = getTotalPages(idList, rows);
                element(totalPages, 1);
                DisplayList(idList, rows, 1);
            });

            btnLightArrowDown.addEventListener("click", function(event){
                event.preventDefault();
                
                let idList = dataList.sort((a, b) => b.light - a.light);
                totalPages = getTotalPages(idList, rows);
                element(totalPages, 1);
                DisplayList(idList, rows, 1);
            });

            btnTimeArrowUp.addEventListener("click", function(event){
                event.preventDefault();
                
                function convertStringToDate(dateString){
                    let tmp = dateString.split(/[\s/:]/);
                    console.log(tmp);
                    const [day, month, year, hours, minutes, seconds] = tmp.map(Number);
                    console.log(day, month - 1, year, hours, minutes, seconds);
                    return new Date(year, month - 1, day, hours, minutes, seconds);
                }
                // console.log(listTime[0]);
                // console.log(convertStringToDate(listTime[0]));
                
                let listTime = dataList.sort((a, b) => {
                    let dateA = convertStringToDate(a.time);
                    let dateB = convertStringToDate(b.time);
                    return dateA - dateB;
                });
                totalPages = getTotalPages(listTime, rows);
                element(totalPages, 1);
                DisplayList(listTime, rows, 1);
            });


            btnTimeArrowDown.addEventListener("click", function(event){
                event.preventDefault();

                function convertStringToDate(dateString){
                    let tmp = dateString.split(/[\s/:]/);
                    console.log(tmp);
                    const [day, month, year, hours, minutes, seconds] = tmp.map(Number);
                    console.log(day, month - 1, year, hours, minutes, seconds);
                    return new Date(year, month - 1, day, hours, minutes, seconds);
                }
                // console.log(listTime[0]);
                // console.log(convertStringToDate(listTime[0]));
                
                let listTime = dataList.sort((a, b) => {
                    let dateA = convertStringToDate(a.time);
                    let dateB = convertStringToDate(b.time);
                    return dateB - dateA;
                });
                totalPages = getTotalPages(listTime, rows);
                element(totalPages, 1);
                DisplayList(listTime, rows, 1);
            });


        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });




});