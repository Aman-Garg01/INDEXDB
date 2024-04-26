import productdb, { bulkcreate, getData, createEle } from "./module.js";

let db = productdb('Productdb', {
    products: `++id,name,seller,price`
});

// input tags
const UserId = document.getElementById('userid');
const ProName = document.getElementById('proname');
const Seller = document.getElementById('seller');
const Price = document.getElementById('price');

// buttons
const BtnCreate = document.getElementById('btn-create');
const BtnRead = document.getElementById('btn-read');
const BtnUpdate = document.getElementById('btn-update');
const BtnDelete = document.getElementById('btn-delete');
const NotFound = document.getElementById("notfound");

// insert value using create button
BtnCreate.onclick = (event) => {
    let flag = bulkcreate(db.products, {
        name: ProName.value,
        seller: Seller.value,
        price: Price.value
    })
    //  console.log(flag);
    //  ProName.value = "";
    //  Seller.value = "";
    //  Price.value = "";

    ProName.value = Seller.value = Price.value = "";
    getData(db.products, (data) => {
        // console.log(data.id);
        UserId.value = data.id + 1 || 1;
    });
    table();

    let InsertMsg = document.querySelector(".insertmsg");
    getMsg(flag, InsertMsg);
}

//  create event on read btn
BtnRead.onclick = table;

// update event 
BtnUpdate.onclick = () => {
    const id = parseInt(UserId.value || 0);
    if (id) {
        db.products.update(id, {
            name: ProName.value,
            seller: Seller.value,
            price: Price.value,
        }).then((updated) => {
            // let get = updated ? `data Updated`: `Couldn't Updated Data`;
            // console.log(get);
            let get = updated ? true : false;
            let UpdateMsg = document.querySelector(".updatemsg");
            getMsg(get, UpdateMsg);
            ProName.value = Seller.value = Price.value = "";
        })
    }
}

//  delete records
BtnDelete.onclick = () => {
    db.delete();
    db = productdb('Productdb', {
        products: `++id,name,seller,price`
    });
    db.open();
    table();
    textID(UserId);

    let DeleteMsg = document.querySelector(".deletemsg");
    getMsg(true, DeleteMsg);
}

// window onload event
window.onload = () => {
    textID(UserId);
}

function textID(textboxid) {
    getData(db.products, data => {
        textboxid.value = data.id + 1 || 1;
    });
}
function table() {
    const tbody = document.getElementById("tbody")
    while (tbody.hasChildNodes()) {
        tbody.removeChild(tbody.firstChild);
    }
    getData(db.products, (data) => {
        // console.log(data);
        if (data) {
            createEle("tr", tbody, tr => {
                for (const value in data) {
                    createEle("td", tr, td => {
                        td.textContent = data.price === data[value] ? `$ ${data[value]}` : data[value];
                    })
                }
                createEle("td", tr, td => {
                    createEle("i", td, i => {
                        i.className += "fa-solid fa-pen-to-square btnedit";
                        i.setAttribute(`data-id`, data.id);
                        i.onclick = editbtn;
                    })
                })
                createEle("td", tr, td => {
                    createEle("i", td, i => {
                        i.className += "fa-solid fa-trash-can btndelete";
                        i.setAttribute(`data-id`, data.id);
                        i.onclick = deletebtn;
                    })
                })
            })
        } else {
            NotFound.textContent = "No record found in the database...!"
        }
    })
}

function editbtn(event) {
    // console.log(event.target);
    // console.log(event.target.dataset.id);
    let id = parseInt(event.target.dataset.id);
    db.products.get(id, data => {
        // console.log(data);
        UserId.value = data.id || 0;
        ProName.value = data.name || "";
        Seller.value = data.seller || "";
        Price.value = data.price || "";
    })
}

function deletebtn(event) {
    let id = parseInt(event.target.dataset.id);
    db.products.delete(id);
    table();
}

function getMsg(flag, element) {
    if (flag) {
        // call msg 
        element.className += " movedown";

        setTimeout(() => {
            element.classList.forEach(classname => {
                classname == "movedown" ? undefined : element.classList.remove('movedown');
            })
        }, 4000);
    }
}