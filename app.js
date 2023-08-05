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
const addressBookList = document.querySelector('#addr-book-list tbody');

// ___________________________________________________________________________ //

let firstName = lastName = email = phone = streetAddr = postCode = city = state = labels = "";

// Address class

class Address {
    constructor(id, firstName, lastName, email, phone, streetAddr, postCode, city, state, labels) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.streetAddr = streetAddr;
        this.postCode = postCode;
        this.city = city;
        this.state = state;
        this.labels = labels;
    }

    // This function returns the value of the ‘addresses’ key from the local storage as an array of objects. 
    // If the key does not exist or the value is not a valid JSON string, it returns an empty array.
    static getAddresses() {
        let addresses;

        if(localStorage.getItem('addresses') == null) {
            addresses = [];
        }
        else {
            addresses = JSON.parse(localStorage.getItem('addresses'));
        }
        return addresses;
    }

    // Add address to local storage
    static addAddress(address) {
        const addresses = Address.getAddresses();
        addresses.push(address);
        localStorage.setItem('addresses', JSON.stringify(addresses));
    }

    static deleteAddress(id) {
        const addresses = Address.getAddresses();
        addresses.forEach((address, index) => {
            if(address.id == id) {
                addresses.splice(index, 1);
            }
        });
        localStorage.setItem('addresses', JSON.stringify(addresses));
        form.reset();
        UI.closeModal();
        addressBookList.innerHTML = "";
        UI.showAddressList();
    }

    static updateAddress(item) {
        const addresses = Address.getAddresses();
        addresses.forEach(address => {
            if(address.id == item.id) {
                address.firstName = item.firstName;
                address.lastName = item.lastName;
                address.email = item.email;
                address.phone = item.phone;
                address.streetAddr = item.streetAddr;
                address.postCode = item.postCode;
                address.city = item.city;
                address.state = item.state;
                address.labels = item.labels;
            }
        });
        localStorage.setItem('addresses', JSON.stringify(addresses));
        addressBookList.innerHTML = "";
        UI.showAddressList();
    }

}

// UI class

class UI {

    static showAddressList() {
        const addresses = Address.getAddresses();
        addresses.forEach(address => UI.addToAddressList(address));
    }

    static addToAddressList(address) {
        const tableRow = document.createElement('tr');
        tableRow.setAttribute('data-id', address.id);
        tableRow.innerHTML = `
            <td>${address.id}</td>
            <td>
                <span class="address">${address.streetAddr + ", "} ${address.city + ", "} ${address.state + ", "} ${address.postCode}</span>
            </td>
            <td>
                <span>${address.labels}</span>
            </td>
            <td>${address.firstName + " " + address.lastName}</td>
            <td>${address.phone}</td>
        `;
        addressBookList.appendChild(tableRow);
    }

    static showModalData(id) {
        const addresses = Address.getAddresses();
        addresses.forEach(address => {
            if(address.id == id) {
                form.first_name.value = address.firstName;
                form.last_name.value = address.lastName;
                form.email.value = address.email;
                form.phone.value = address.phone;
                form.street_addr.value = address.streetAddr;
                form.postal_code.value = address.postCode;
                form.city.value = address.city;
                form.state.value = address.state;
                form.labels.value = address.labels;
                document.getElementById('modal-title').innerHTML = "Change Address Details";

                document.getElementById('modal-btns').innerHTML = `
                    <button type="submit" id="update-btn" data-id="${id}">Update</button>
                    <button type="button" id="delete-btn" data-id="${id}">Delete</button>
                `;
            }
        });
    }

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
    UI.showAddressList();
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
                let allItems = Address.getAddresses();
                let lastItemId = (allItems.length > 0) ? allItems[allItems.length - 1].id : 0;
                lastItemId++;

                const addressItem = new Address(lastItemId, firstName, lastName, email, phone, streetAddr, postCode, city, state, labels);
                Address.addAddress(addressItem);
                UI.closeModal();
                UI.addToAddressList(addressItem);
                form.reset();
            }
        }
    });

    addressBookList.addEventListener('click', (event) => {
        UI.showModal();
        let trElement;
        if(event.target.parentElement.tagName = "TD") {
            trElement = event.target.parentElement.parentElement;
        }
        if(event.target.parentElement.tagName == "TR") {
            trElement = event.target.parentElement;
        }
        let viewID = trElement.dataset.id;
        UI.showModalData(viewID);
    });

    // delete an address item
    modalBtns.addEventListener('click', (event) => {
        if (event.target.id == 'delete-btn') {
            Address.deleteAddress(event.target.dataset.id);
        }
    });

    // Update an address item

    modal.addEventListener('click', (event) => {
        event.preventDefault();
        if (event.target.id == 'update-btn') {
            let id = event.target.dataset.id;
            let isFormValid = getFormData();
            if (!isFormValid) {
                form.querySelectorAll('input').forEach(input => {
                    setTimeout(() => {
                        input.classList.remove('errorMsg');
                    }, 1500);
                });
            } else {
                const addressItem = new Address(id, firstName, lastName, email, phone, streetAddr, postCode, city, state, labels);
                Address.updateAddress(addressItem);
                UI.closeModal();
                form.reset();
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