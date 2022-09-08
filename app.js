const getInputbyIdValue = id => {
    const input = document.getElementById(id);
    const inputValue = input.value;
    input.value = '';
    return inputValue;
}
const deleteContact = () => {
    const deteleNumber = event.target.parentNode.parentNode.children[0].children[1].children[0].innerText;
    const allContacts = getLs('contacts');
    const index = allContacts.findIndex(contact => contact.number === deteleNumber
    );
    allContacts.splice(index, 1);
    setLs(allContacts, 'contacts');
}

const display = (lsName) => {
    visibility('form', 'none');
    visibility('number-container', 'block');
    visibility('addNew', 'block');
    visibility('warning', 'none');
    visibility('search-body', 'flex');
    visibility('contact-heading', 'block');
    visibility('seacrh-container', 'none');
    const contacts = getLs(lsName);
    const ul = document.getElementById('number-container');
    ul.innerHTML = '';
    if (contacts) {
        for (const contact of contacts) {
            const li = document.createElement('li');
            li.classList.add('px-10', 'max-w-100');
            li.innerHTML = `
            <div class='flex items-center justify-around shadow-md my-2 p-2'>
            <div class='pr-4 uppercase w-2/3'>
            <div class='font-bold'>Name: <span class='text-accent'>${contact.name}</span></div>
            <div class='font-bold'>Number : <span class='text-info'>${contact.number}</span></div>
            </div>
            <div class="flex justify-between w-24">
            <i class="text-error mr-1 text-2xl fa-solid fa-trash-can cursor-pointer" onclick='deleteContact()'></i>
            <i class="text-warning text-2xl fa-regular fa-pen-to-square cursor-pointer" onclick='editContact()'></i>
            </div>
            </div>
    `;
            ul.appendChild(li);

        }
    }
    else { ul.innerHTML = `<li class='text-center'>No Contacts</li>` }
}

const setLs = (data, lsName) => {
    data.sort((a, b) => {
        let fa = a.name.toLowerCase(),
            fb = b.name.toLowerCase();

        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    });
    data = JSON.stringify(data);
    localStorage.setItem(lsName, data);
    display(lsName);
}
const getLs = (lsName) => {
    const contacts = localStorage.getItem(lsName);
    contactsParse = JSON.parse(contacts);
    return contactsParse;
}
const visibility = (id, value) => {
    document.getElementById(id).style.display = value;
}
const setContactToLs = () => {
    const name = getInputbyIdValue('name-field');
    const number = getInputbyIdValue('number-field');
    let contactsLS = getLs('contacts');
    let saved;
    if (contactsLS) {
        saved = contactsLS.find(contact => contact.number === number);
        if (saved) {
            console.log(contactsLS, number)
            visibility('warning', 'block');
            document.getElementById('warning').innerText = `${number} is already saved`;
        }
        else {
            console.log(contactsLS);
            contactsLS = [{ name: name, number: number }, ...contactsLS]
            setLs(contactsLS, 'contacts');
            visibility('form', 'none');
            visibility('number-container', 'block');
            visibility('addNew', 'block');
            visibility('warning', 'none');
        }
    }
    else {
        contactsLS = [{ name: name, number: number }]
        setLs(contactsLS, 'contacts');
    }
}

display('contacts');

const addNew = () => {
    document.getElementById('name-field').placeholder = 'name';
    document.getElementById('number-field').placeholder = 'number';
    visibility('form', 'block');
    visibility('submit-btn', 'block');
    visibility('number-container', 'none');
    visibility('addNew', 'none');
    visibility('search-body', 'none');
    visibility('contact-heading', 'none');
    visibility('save-btn', 'none');
}

const inputValidation = () => {
    const name = document.getElementById('name-field').value;
    const number = document.getElementById('number-field').value;
    if (name.length !== 0 && number.length !== 0) {
        document.getElementById('submit-btn').disabled = false;
    }
    else { document.getElementById('submit-btn').disabled = true; }
}
let indexEdit;
const save = () => {
    let index = indexEdit;
    const name = getInputbyIdValue('name-field');
    const number = getInputbyIdValue('number-field');
    let editedData = { name: name, number: number };
    const allContacts = getLs('contacts');
    allContacts.splice(index, 1);
    allContacts.push(editedData);
    setLs(allContacts, 'contacts');
}

const editContact = () => {
    visibility('form', 'block');
    visibility('addNew', 'none');
    visibility('submit-btn', 'none');
    visibility('save-btn', 'block');
    visibility('search-body', 'none');
    const editNumber = event.target.parentNode.parentNode.children[0].children[1].children[0].innerText;
    const allContacts = getLs('contacts');
    const index = allContacts.findIndex(contact => contact.number === editNumber
    );
    console.log(editNumber, index)
    document.getElementById('name-field').placeholder = allContacts[index].name;
    document.getElementById('number-field').placeholder = allContacts[index].number;
    indexEdit = index;
}

const search = () => {
    localStorage.removeItem('search');
    const input = getInputbyIdValue('search');
    const contacts = getLs('contacts');
    const matched = contacts.filter(contact => contact.name.includes(input));
    if (matched.length > 1) {
        setLs(matched, 'search');
    }
    else {
        visibility('number-container', 'none')
        visibility('seacrh-container', 'block')
        const cont = document.getElementById('seacrh-container');
        cont.innerHTML = `<li class='text-center'>No Contacts Found !! <i class="fa-regular fa-face-frown-open"></i></li>`;
    }

}