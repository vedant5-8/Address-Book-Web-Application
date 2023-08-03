const strRegex = /^[a-zA-Z\s]*$/;
const emailRegex = /^[0-9a-zA-Z]+[+._-]{0,1}[0-9a-zA-Z]+[@][a-zA-Z0-9]+[.][a-zA-Z]{2,3}([.][a-zA-Z]{2,3}){0,1}$/;

const phoneRegex = /^((\+91)|91|0)?[789][0-9]{9}$/;
const digitRegex = /^\d+$/;
const postalCodeRegex = /^[1-9][0-9]{2}[ ]?[0-9]{3}$/;

// ___________________________________________________________________________ //

const stateList = document.getElementById('state-list');
const fullScreenDiv = document.getElementById('fullscreen-div');
const modal = document.getElementById('modal');
const addBtn = document.getElementById('add-btn');
const closeBtn = document.getElementById('close-btn');
const modalBtns = document.getElementById('modal-btns');
const form = document.getElementById('modal');
const addressBookList = document.getElementById('#addr-book-list tbody');

// ___________________________________________________________________________ //

let firstName = lastName = email = phone = streetAddr = postCode = city = state = labels = "";

// UI class

class UI {
    static showModal() {
        modal.style.display = "block";
        fullScreenDiv.style.display = "block";
    }

    static closeModal() {
        modal.style.display = "none";
        fullScreenDiv.style.display = "none";
    }
}

// dom content loaded

window.addEventListener('DOMContentLoaded', () => {
    loadJSON();
    eventListeners();
});

// event listeners

function eventListeners() {
    
    // show add address form modal
    addBtn.addEventListener('click', () => {
        form.reset();
        document.getElementById('modal-title').innerHTML = "Add Address";
        UI.showModal();
        document.getElementById('modal-btns').innerHTML = `
            <button type="submit" id="save-btn">Save</button>
        `;
    });

    // close add address form modal
    closeBtn.addEventListener('click', UI.closeModal);

    // add an address item

    modalBtns.addEventListener('click', (event) => {
        event.preventDefault();
        if (event.target.id == "save-btn") {
            let isFormValid = getFormData();
            if (!isFormValid) {
                form.querySelectorAll('input').forEach(input => {
                    setTimeout(() => {
                        input.classList.remove('errorMsg');
                    }, 1500);
                });
            }
            else {
                // let allItems = 
            }
        }
    });

}

// load states list

function loadJSON() {
    fetch('states.json')
    .then(response => response.json())
    .then(data => {
        let html = "";
        data.forEach(state => {
            html += `
                <option> ${state.state} </option>
            `;
        });
        stateList.innerHTML = html;
    });
}

// get form data

function getFormData() {
    let inputValidStatus = [];
    // console.log(form.first_name.value, form.last_name.value, form.email.value, form.phone.value, form.street_addr.value, form.postal_code.value, form.city.value, form.state.value, form.labels.value);

    if (!strRegex.test(form.first_name.value) || form.first_name.value.trim().length == 0) {
        addErrMsg(form.first_name);
        inputValidStatus[0] = false;
    } else {
        firstName = form.first_name.value;
        inputValidStatus[0] = true;
    }

    if (!strRegex.test(form.last_name.value) || form.last_name.value.trim().length == 0) {
        addErrMsg(form.last_name);
        inputValidStatus[1] = false;
    } else {
        lastName = form.last_name.value;
        inputValidStatus[1] = true;
    }

    if (!emailRegex.test(form.email.value) || form.email.value.trim().length == 0) {
        addErrMsg(form.email);
        inputValidStatus[2] = false;
    } else {
        email = form.email.value;
        inputValidStatus[2] = true;
    }

    if (!phoneRegex.test(form.phone.value) || form.phone.value.trim().length == 0) {
        addErrMsg(form.phone);
        inputValidStatus[3] = false;
    } else {
        phone = form.phone.value;
        inputValidStatus[3] = true;
    }

    if (form.street_addr.value.trim().length == 0) {
        addErrMsg(form.street_addr);
        inputValidStatus[4] = false;
    } else {
        streetAddr = form.street_addr.value;
        inputValidStatus[4] = true;
    }

    if (!postalCodeRegex.test(form.postal_code.value) || form.postal_code.value.trim().length == 0) {
        addErrMsg(form.postal_code);
        inputValidStatus[5] = false;
    } else {
        postCode = form.postal_code.value;
        inputValidStatus[5] = true;
    }

    if (!strRegex.test(form.city.value) || form.city.value.trim().length == 0) {
        addErrMsg(form.city);
        inputValidStatus[6] = false;
    } else {
        city = form.city.value;
        inputValidStatus[6] = true;
    }

    state = form.state.value;
    labels = form.labels.value;

    return inputValidStatus.includes(false) ? false : true;

}

function addErrMsg(inputBox) {
    inputBox.classList.add('errorMsg');
}