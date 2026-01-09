let records = JSON.parse(localStorage.getItem('my2DRecords')) || [];
displayRecords();

function addData() {
    const num = document.getElementById('numInput').value;
    const amt = document.getElementById('amtInput').value;

    if (!num || !amt) {
        alert("ဂဏန်းနှင့် ပမာဏ ထည့်သွင်းပါ");
        return;
    }

    const newRecord = {
        id: Date.now(),
        number: num,
        amount: parseInt(amt),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    records.unshift(newRecord); // အသစ်ကို အပေါ်ဆုံးကပြမယ်
    saveAndRefresh();

    document.getElementById('numInput').value = '';
    document.getElementById('amtInput').value = '';
}

function deleteRow(id) {
    records = records.filter(r => r.id !== id);
    saveAndRefresh();
}

function clearAll() {
    if(confirm("စာရင်းအားလုံးကို ဖျက်မည်မှာ သေချာပါသလား?")) {
        records = [];
        saveAndRefresh();
    }
}

function saveAndRefresh() {
    localStorage.setItem('my2DRecords', JSON.stringify(records));
    displayRecords();
}

function displayRecords() {
    const listContainer = document.getElementById('recordsList');
    const emptyState = document.getElementById('emptyState');
    const totalAmtEl = document.getElementById('totalAmount');
    const totalEntriesEl = document.getElementById('totalEntries');

    listContainer.innerHTML = '';
    let total = 0;

    if (records.length === 0) {
        emptyState.classList.remove('hidden');
        listContainer.classList.add('hidden');
    } else {
        emptyState.classList.add('hidden');
        listContainer.classList.remove('hidden');
    }

    records.forEach(r => {
        total += r.amount;
        const item = document.createElement('div');
        item.className = "bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex justify-between items-center animate-fade-in";
        item.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="bg-purple-50 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl">
                    ${r.number}
                </div>
                <div>
                    <p class="font-bold text-slate-800">${r.amount} ကျပ်</p>
                    <p class="text-[10px] text-slate-400 uppercase">${r.time}</p>
                </div>
            </div>
            <button onclick="deleteRow(${r.id})" class="text-slate-300 hover:text-red-500 p-2">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        listContainer.appendChild(item);
    });

    totalAmtEl.innerText = total.toLocaleString();
    totalEntriesEl.innerText = records.length;
}
