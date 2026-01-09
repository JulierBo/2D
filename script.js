// Data Storage
let records = JSON.parse(localStorage.getItem('2D_Manager_Records')) || [];
let customNames = JSON.parse(localStorage.getItem('2D_Manager_Names')) || ["Admin"];

// စစချင်းတွင် နာမည်များကို Dropdown ထဲ ထည့်မည်
updateNameDropdown();
updateUI();

// Keyboard အလုပ်လုပ်ရန်
function numPress(val) {
    const display = document.getElementById('displayNum');
    if (display.value.length < 2) {
        display.value += val;
    } else if (val === '00') {
        display.value = '00';
    } else {
        display.value = val; // ၂ လုံးကျော်ရင် အသစ်ပြန်စ
    }
}

function delPress() {
    const display = document.getElementById('displayNum');
    display.value = display.value.slice(0, -1);
}

// နာမည်အသစ်ပေါင်းထည့်ရန်
function addNewName() {
    const nameInput = document.getElementById('newNameInput');
    const name = nameInput.value.trim();
    if (name && !customNames.includes(name)) {
        customNames.push(name);
        localStorage.setItem('2D_Manager_Names', JSON.stringify(customNames));
        updateNameDropdown();
        nameInput.value = '';
        alert("နာမည်အသစ် ပေါင်းထည့်ပြီးပါပြီ");
    }
}

function updateNameDropdown() {
    const selector = document.getElementById('nameSelector');
    selector.innerHTML = '';
    customNames.forEach(n => {
        let opt = document.createElement('option');
        opt.value = n;
        opt.innerHTML = n;
        selector.appendChild(opt);
    });
}

// စာရင်းသွင်းရန်
function addCurrentEntry() {
    const num = document.getElementById('displayNum').value;
    const amt = document.getElementById('displayAmt').value;
    const name = document.getElementById('nameSelector').value;

    if (!num || !amt) return alert("ဂဏန်းနှင့် ငွေပမာဏ ဖြည့်ပါ");

    records.push({
        id: Date.now(),
        number: num.padStart(2, '0'),
        amount: parseInt(amt),
        name: name
    });
    saveAndRefresh();
    document.getElementById('displayNum').value = '';
}

// Shortcut (R, ထိပ်, နောက်, အပါ, အပူး)
function runSpecial(type) {
    const num = document.getElementById('displayNum').value;
    const amt = document.getElementById('displayAmt').value;
    const name = document.getElementById('nameSelector').value;

    if (!amt) return alert("ငွေပမာဏ အရင်ထည့်ပါ");

    if (type === 'R') {
        if (num.length < 2) return;
        let rev = num.split('').reverse().join('');
        records.push({ id: Date.now(), number: num, amount: parseInt(amt), name: name });
        if (num !== rev) records.push({ id: Date.now()+1, number: rev, amount: parseInt(amt), name: name });
    } 
    else if (type === 'အပါ') {
        if (!num) return;
        for (let i = 0; i <= 9; i++) {
            records.push({ id: Date.now()+i, number: num+i, amount: parseInt(amt), name: name });
            if (num != i) records.push({ id: Date.now()+i+20, number: i+num, amount: parseInt(amt), name: name });
        }
    }
    else if (type === 'ထိပ်') {
        for (let i = 0; i <= 9; i++) records.push({ id: Date.now()+i, number: num+i, amount: parseInt(amt), name: name });
    }
    else if (type === 'နောက်') {
        for (let i = 0; i <= 9; i++) records.push({ id: Date.now()+i, number: i+num, amount: parseInt(amt), name: name });
    }
    else if (type === 'အပူး') {
        ['00','11','22','33','44','55','66','77','88','99'].forEach((p, idx) => {
            records.push({ id: Date.now()+idx, number: p, amount: parseInt(amt), name: name });
        });
    }
    saveAndRefresh();
    document.getElementById('displayNum').value = '';
}

// ပေါက်ဂဏန်းစစ်ရန်
function checkWinner() {
    const winNum = document.getElementById('winningNumInput').value;
    if (!winNum) return alert("ပေါက်ဂဏန်း အရင်ရိုက်ထည့်ပါ");

    const winPad = winNum.padStart(2, '0');
    const winRev = winPad.split('').reverse().join('');
    
    const winners = records.filter(r => r.number === winPad || r.number === winRev);
    
    if (winners.length === 0) {
        alert("ကံထူးသူ မရှိပါ");
    } else {
        let msg = `ပေါက်ဂဏန်း: ${winPad}\n--- ပေါက်သူများ ---\n`;
        winners.forEach(w => msg += `${w.name} - ${w.number} (${w.amount} ကျပ်)\n`);
        alert(msg);
    }
}

function saveAndRefresh() {
    localStorage.setItem('2D_Manager_Records', JSON.stringify(records));
    updateUI();
}

function updateUI() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    records.slice().reverse().forEach(r => {
        tbody.innerHTML += `
            <tr class="border-b">
                <td class="p-2 text-blue-600">${r.number}</td>
                <td>${r.amount}</td>
                <td class="text-orange-600 text-xs">${r.name}</td>
                <td><button onclick="deleteRow(${r.id})" class="text-red-500">×</button></td>
            </tr>`;
    });
}

function deleteRow(id) {
    records = records.filter(r => r.id !== id);
    saveAndRefresh();
}

function clearAll() {
    if (confirm("အကုန်ဖျက်မလား?")) {
        records = [];
        saveAndRefresh();
    }
        }    tbody.innerHTML = '';
    let total = 0;

    if (records.length > 0) emptyMsg.style.display = 'none';
    else emptyMsg.style.display = 'block';

    records.slice().reverse().forEach(r => {
        total += r.amount;
        tbody.innerHTML += `
            <tr class="border-b text-sm">
                <td class="py-3 text-blue-600">${r.number}</td>
                <td>${r.amount}</td>
                <td class="text-xs text-gray-400 font-normal">${r.type}</td>
                <td class="text-xs text-orange-500">${r.name}</td>
                <td><button onclick="deleteRow(${r.id})" class="text-red-400 text-lg">×</button></td>
            </tr>`;
    });

    document.getElementById('totalAmount').innerText = total.toLocaleString();
    document.getElementById('slipCount').innerText = records.length;
                 
