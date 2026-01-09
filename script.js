let records = JSON.parse(localStorage.getItem('2D_Pro_Data')) || [];
updateUI();

// Keyboard Functions
function press(val) {
    let input = document.getElementById('numIn');
    if (input.value.length < 2 || val === '00') {
        input.value += val;
        if (input.value.length > 2) input.value = input.value.slice(-2);
    }
}

function backspace() {
    let input = document.getElementById('numIn');
    input.value = input.value.slice(0, -1);
}

// Logic for Special Keys
function special(type) {
    const name = document.getElementById('adminSelect').value;
    const num = document.getElementById('numIn').value;
    const amt = document.getElementById('amtIn').value;

    if (!amt) return alert("ငွေပမာဏ အရင်ထည့်ပါ");

    if (type === 'R') {
        if (num.length < 2) return alert("ဂဏန်း ၂ လုံး ရိုက်ပါ");
        let rev = num.split('').reverse().join('');
        addEntry(name, num, amt, 'ရိုးရိုး');
        if (num !== rev) addEntry(name, rev, amt, 'အလှည့် (R)');
    } 
    else if (type === 'အပါ') {
        if (!num) return alert("ဂဏန်း ၁ လုံး အရင်နှိပ်ပါ");
        for (let i = 0; i <= 9; i++) {
            addEntry(name, num + i, amt, 'အပါ');
            if (num != i) addEntry(name, i + num, amt, 'အပါ');
        }
    } 
    else if (type === 'ထိပ်') {
        if (!num) return alert("ထိပ်ဂဏန်း ၁ လုံး အရင်နှိပ်ပါ");
        for (let i = 0; i <= 9; i++) addEntry(name, num + i, amt, 'ထိပ်');
    } 
    else if (type === 'နောက်') {
        if (!num) return alert("နောက်ဂဏန်း ၁ လုံး အရင်နှိပ်ပါ");
        for (let i = 0; i <= 9; i++) addEntry(name, i + num, amt, 'နောက်');
    } 
    else if (type === 'အပူး') {
        const pairs = ['00','11','22','33','44','55','66','77','88','99'];
        pairs.forEach(p => addEntry(name, p, amt, 'အပူး'));
    }
    document.getElementById('numIn').value = '';
}

function addData() {
    const name = document.getElementById('adminSelect').value;
    const num = document.getElementById('numIn').value;
    const amt = document.getElementById('amtIn').value;
    if (!num || !amt) return;
    addEntry(name, num.padStart(2, '0'), amt, 'ရိုးရိုး');
    document.getElementById('numIn').value = '';
}

function addEntry(name, num, amt, type) {
    records.push({
        id: Date.now() + Math.random(),
        name: name,
        number: num.toString().padStart(2, '0'),
        amount: parseInt(amt),
        type: type
    });
    save();
}

// Check Winner Logic
function checkWinner() {
    let winNum = prompt("ယနေ့ ပေါက်ဂဏန်း ရိုက်ထည့်ပါ (ဥပမာ- 56):");
    if (!winNum) return;
    
    winNum = winNum.padStart(2, '0');
    let winRev = winNum.split('').reverse().join('');
    
    let winners = records.filter(r => r.number === winNum || r.number === winRev);
    
    if (winners.length === 0) {
        alert("ကံထူးသူ မရှိပါ");
    } else {
        let report = `ပေါက်ဂဏန်း: ${winNum}\n--- ပေါက်သူများစာရင်း ---\n`;
        winners.forEach(w => {
            report += `${w.name}: ${w.number} [${w.amount} ကျပ်]\n`;
        });
        alert(report);
    }
}

function save() {
    localStorage.setItem('2D_Pro_Data', JSON.stringify(records));
    updateUI();
}

function deleteRow(id) {
    records = records.filter(r => r.id !== id);
    save();
}

function clearAll() {
    if (confirm("စာရင်းအားလုံး ဖျက်မှာ သေချာလား?")) {
        records = [];
        save();
    }
}

function updateUI() {
    const tbody = document.getElementById('tableBody');
    const emptyMsg = document.getElementById('emptyMsg');
    tbody.innerHTML = '';
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
                 
