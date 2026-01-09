let records = JSON.parse(localStorage.getItem('my2DProData')) || [];
displayRecords();

function addData() {
    const name = document.getElementById('cusName').value || "Unknown";
    const num = document.getElementById('numInput').value;
    const amt = document.getElementById('amtInput').value;

    if (!num || !amt) return alert("ဖြည့်စွက်ရန်လိုအပ်သည်");

    saveEntry(name, num, amt);
    clearInputs();
}

function saveEntry(name, num, amt) {
    records.unshift({
        id: Date.now(),
        name: name,
        number: num.toString().padStart(2, '0'),
        amount: parseInt(amt),
        time: new Date().toLocaleTimeString()
    });
    saveAndRefresh();
}

function addSpecial(type) {
    const name = document.getElementById('cusName').value || "Unknown";
    const val = document.getElementById('numInput').value;
    const amt = document.getElementById('amtInput').value;

    if (!amt) return alert("ပမာဏ အရင်ထည့်ပါ");

    if (type === 'R') {
        if (!val || val.length !== 2) return alert("ဂဏန်း ၂ လုံးဖြစ်ရမည်");
        let rev = val.split('').reverse().join('');
        saveEntry(name, val, amt);
        if (val !== rev) saveEntry(name, rev, amt);
    } 
    else if (type === 'အပါ') {
        for(let i=0; i<=9; i++) {
            saveEntry(name, val + i, amt);
            if(val != i) saveEntry(name, i + val, amt);
        }
    }
    else if (type === 'ထိပ်') {
        for(let i=0; i<=9; i++) saveEntry(name, val + i, amt);
    }
    else if (type === 'နောက်') {
        for(let i=0; i<=9; i++) saveEntry(name, i + val, amt);
    }
    else if (type === 'အပူး') {
        const pairs = ['00','11','22','33','44','55','66','77','88','99'];
        pairs.forEach(p => saveEntry(name, p, amt));
    }
    clearInputs();
}

function checkWinners() {
    const win = document.getElementById('winNum').value;
    if(!win) return;
    
    // ပေါက်ဂဏန်းနဲ့ သူ့ရဲ့ R ကိုပါ စစ်ပေးမယ်
    let winRev = win.split('').reverse().join('');
    
    const winners = records.filter(r => r.number === win || r.number === winRev);
    
    if (winners.length === 0) {
        alert("ပေါက်သူမရှိပါ");
    } else {
        let msg = "ပေါက်သူများစာရင်း:\n";
        winners.forEach(w => msg += `${w.name}: ${w.number} (${w.amount} ကျပ်)\n`);
        alert(msg);
    }
}

function clearInputs() {
    document.getElementById('numInput').value = '';
}

function saveAndRefresh() {
    localStorage.setItem('my2DProData', JSON.stringify(records));
    displayRecords();
}

function displayRecords() {
    const list = document.getElementById('recordsList');
    list.innerHTML = '';
    let total = 0;

    records.forEach(r => {
        total += r.amount;
        list.innerHTML += `
            <div class="bg-gray-50 p-3 rounded-xl flex justify-between items-center border border-gray-100">
                <div>
                    <span class="font-bold text-purple-600">${r.number}</span> 
                    <span class="text-xs text-gray-400 ml-2">(${r.name})</span>
                </div>
                <div class="flex items-center gap-4">
                    <span class="font-bold">${r.amount}</span>
                    <button onclick="deleteRow(${r.id})" class="text-red-300 text-xs">ဖျက်</button>
                </div>
            </div>`;
    });
    document.getElementById('totalAmount').innerText = total.toLocaleString();
}

function deleteRow(id) {
    records = records.filter(r => r.id !== id);
    saveAndRefresh();
}
