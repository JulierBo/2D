let records = JSON.parse(localStorage.getItem('2D_Manager_Records')) || [];
let customNames = JSON.parse(localStorage.getItem('2D_Manager_Names')) || ["Admin"];

updateNameDropdown();
updateUI();

// Keyboard Logic
function numPress(val) {
    const d = document.getElementById('displayNum');
    if (d.value.length < 2) d.value += val;
    else if (val === '00') d.value = '00';
    else d.value = val;
}
function delPress() { document.getElementById('displayNum').value = ''; }

// နာမည်စီမံခန့်ခွဲမှု
function addNewName() {
    const input = document.getElementById('newNameInput');
    const name = input.value.trim();
    if (name && !customNames.includes(name)) {
        customNames.push(name);
        saveNames();
        input.value = '';
    }
}

function deleteName(name) {
    if (name === "Admin") return alert("Admin ကို ဖျက်၍မရပါ");
    if (confirm(`${name} ကို ဖျက်မှာ သေချာပါသလား?`)) {
        customNames = customNames.filter(n => n !== name);
        saveNames();
    }
}

function saveNames() {
    localStorage.setItem('2D_Manager_Names', JSON.stringify(customNames));
    updateNameDropdown();
}

function updateNameDropdown() {
    const selector = document.getElementById('nameSelector');
    const listCont = document.getElementById('nameListContainer');
    selector.innerHTML = '';
    listCont.innerHTML = '';

    customNames.forEach(n => {
        // Dropdown အတွက်
        let opt = document.createElement('option');
        opt.value = n; opt.innerHTML = n;
        selector.appendChild(opt);

        // ဖျက်ရန် ခလုတ်လေးများအတွက်
        let badge = document.createElement('div');
        badge.className = "bg-slate-600 px-2 py-1 rounded text-xs flex items-center gap-2";
        badge.innerHTML = `${n} <button onclick="deleteName('${n}')" class="text-red-400 font-bold">×</button>`;
        listCont.appendChild(badge);
    });
}

// ပေါက်သူစာရင်း Page ပြသခြင်း
function checkWinner() {
    const winNum = document.getElementById('winningNumInput').value;
    if (!winNum) return alert("ပေါက်ဂဏန်း အရင်ရိုက်ပါ");

    const winPad = winNum.padStart(2, '0');
    const winRev = winPad.split('').reverse().join('');
    const winners = records.filter(r => r.number === winPad || r.number === winRev);

    // Page ပြောင်းလဲခြင်း
    document.getElementById('winNumDisplay').innerText = winPad;
    const cont = document.getElementById('winnerListContainer');
    cont.innerHTML = '';

    if (winners.length === 0) {
        cont.innerHTML = '<p class="text-center text-gray-400 py-10 italic">ကံထူးသူ မရှိပါ</p>';
    } else {
        winners.forEach(w => {
            cont.innerHTML += `
                <div class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-600 flex justify-between items-center">
                    <div>
                        <p class="font-bold text-gray-800 text-lg">${w.name}</p>
                        <p class="text-sm text-gray-400">ဂဏန်း: ${w.number}</p>
                    </div>
                    <p class="text-xl font-black text-purple-600">${w.amount.toLocaleString()} ကျပ်</p>
                </div>`;
        });
    }
    document.getElementById('winnerPage').classList.remove('page-hidden');
}

function closeWinnerPage() {
    document.getElementById('winnerPage').classList.add('page-hidden');
}

// စာရင်းသွင်းခြင်းနှင့် UI Update
function addCurrentEntry() {
    const num = document.getElementById('displayNum').value;
    const amt = document.getElementById('displayAmt').value;
    const name = document.getElementById('nameSelector').value;
    if (!num || !amt) return;

    records.push({ id: Date.now(), number: num.padStart(2, '0'), amount: parseInt(amt), name: name });
    saveRecords();
    document.getElementById('displayNum').value = '';
}

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
    } else if (type === 'အပါ') {
        for (let i = 0; i <= 9; i++) {
            records.push({ id: Date.now()+i, number: num+i, amount: parseInt(amt), name: name });
            if (num != i) records.push({ id: Date.now()+i+20, number: i+num, amount: parseInt(amt), name: name });
        }
    } else if (type === 'ထိပ်') {
        for (let i = 0; i <= 9; i++) records.push({ id: Date.now()+i, number: num+i, amount: parseInt(amt), name: name });
    } else if (type === 'နောက်') {
        for (let i = 0; i <= 9; i++) records.push({ id: Date.now()+i, number: i+num, amount: parseInt(amt), name: name });
    } else if (type === 'အပူး') {
        ['00','11','22','33','44','55','66','77','88','99'].forEach((p, idx) => {
            records.push({ id: Date.now()+idx, number: p, amount: parseInt(amt), name: name });
        });
    }
    saveRecords();
    document.getElementById('displayNum').value = '';
}

function saveRecords() {
    localStorage.setItem('2D_Manager_Records', JSON.stringify(records));
    updateUI();
}

function updateUI() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    let total = 0;
    records.slice().reverse().forEach(r => {
        total += r.amount;
        tbody.innerHTML += `
            <tr class="border-b">
                <td class="p-2 text-blue-600">${r.number}</td>
                <td>${r.amount.toLocaleString()}</td>
                <td class="text-orange-600 text-xs">${r.name}</td>
                <td><button onclick="deleteRow(${r.id})" class="text-red-500">×</button></td>
            </tr>`;
    });
    document.getElementById('totalAmountDisplay').innerText = total.toLocaleString();
}

function deleteRow(id) {
    records = records.filter(r => r.id !== id);
    saveRecords();
}}

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
                 
