const objectList = document.getElementById("object-list");//////
let dataList = null;
let rows = 7;

function convertToSQLDate(inputDate) {
    // Tạo một đối tượng Date từ chuỗi đầu vào
    const dateParts = inputDate.split(/[\s/:\-]/); // Tách chuỗi thành mảng các phần tử ngày, tháng, năm, giờ, phút, giây
    const year = parseInt(dateParts[2]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[0]);
    const hour = parseInt(dateParts[3]);
    const minute = parseInt(dateParts[4]);
    const second = parseInt(dateParts[5]);
  
    // Tạo ngày tháng SQL từ các phần tử đã tách
    const sqlDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
  
    return sqlDate;
  }

const ulTag = document.querySelector(".pagination ul");
let totalPages = 0;

function getTotalPages(list, rows_per_page) {
    if (list.length % rows_per_page == 0) {
        totalPages = dataList.length / rows_per_page;
    }
    else {
        totalPages = Math.floor(list.length / rows_per_page) + 1;
    }

    return totalPages;
}

function DisplayList(items, rows_per_page, page) {
    // wrapper.innerHTML = "";
    objectList.innerHTML = "";
    page--;
    let start = rows_per_page * page;
    let end = start + rows_per_page;
    let paginatedItems = items.slice(start, end);


    paginatedItems.forEach(object => {

        let listItem = document.createElement("tr");

        for (let key in object) {
            // if (key != 'id') {
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



function element(totalPages, page) {
    console.log("123")
    let liTag = '';
    let activeLi;
    let beforePages = page - 1;
    let afterPages = page + 1;
    if (page > 1) {
        liTag += `<li class="btn prev" onclick="element(totalPages, ${page - 1}); DisplayList(dataList, ${rows}, ${page - 1})"><span><i class="fas fa-angle-left"></i>Trước</span></li>`;
    }
    if (page > 2) {
        liTag += `<li class="numb" onclick="element(totalPages, 1); DisplayList(dataList, ${rows}, 1)"><span>1</span></li>`;
        if (page > 3) {
            liTag += `<li class="dots"><span>...</span></li>`;
        }
    }
    for (let pageLength = beforePages; pageLength <= afterPages; pageLength++) {
        if (pageLength > totalPages) {
            continue;
        }

        if (pageLength == 0) {
            pageLength += 1;
        }

        if (page == pageLength) {
            activeLi = "active";
        }

        else {
            activeLi = "";
        }
        liTag += `<li class="numb ${activeLi}" onclick="element(totalPages, ${pageLength}); DisplayList(dataList, ${rows}, ${pageLength})"><span>${pageLength}</span></li>`;
    }

    if (page < totalPages - 1) {
        if (page < totalPages - 2) {
            liTag += `<li class="dots"><span>...</span></li>`;
        }
        liTag += `<li class="numb" onclick="element(totalPages, ${totalPages}); DisplayList(dataList, ${rows}, ${totalPages})"><span>${totalPages}</span></li>`;
    }

    if (page < totalPages) {
        liTag += `<li class="btn next" onclick="element(totalPages, ${page + 1}); DisplayList(dataList, ${rows}, ${page + 1})"><span>Tiếp<i class="fas fa-angle-right"></i></span></li>`;
    }
    ulTag.innerHTML = liTag;
}

document.addEventListener("DOMContentLoaded", function () {

    // const objectList = document.getElementById("object-list");
    // const pagination_element = document.getElementById('pagination');

    console.log(objectList)

    // Thực hiện cuộc gọi API bằng fetch
    fetch('http://localhost:8080/led/get-all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Chuyển đổi dữ liệu JSON
        })
        .then(data => {

            dataList = data;

            // pagination

            totalPages = getTotalPages(dataList, rows);

            element(totalPages, 1);
            DisplayList(dataList, rows, 1);


            const btnTimeArrowDown = document.getElementById("time-arrow-down");
            const btnTimeArrowUp = document.getElementById("time-arrow-up");

            btnTimeArrowUp.addEventListener("click", function (event) {
                event.preventDefault();
                current_page = 1;

                function convertStringToDate(dateString) {
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


            btnTimeArrowDown.addEventListener("click", function (event) {
                event.preventDefault();
                current_page = 1;
           

                function convertStringToDate(dateString) {
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


            const formSearchElement = document.getElementById("search-box");
            const selectTypeElement = document.getElementById("select-type");
            const searchTextElement = document.getElementById("search-text");

            formSearchElement.addEventListener("submit", function (event) {
                event.preventDefault();
                // vi trang  k tu refresh do bi chan -> reset             

                let type = selectTypeElement.value;
                let text = searchTextElement.value;
                let tmp = convertToSQLDate(text);
                
                console.log(tmp)

                fetch("http://localhost:8080/led/time/search?time=" + tmp)
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





            });


        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });



});
