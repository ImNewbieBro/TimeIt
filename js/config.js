const navBtns = document.querySelectorAll('.nav-btn');
const socialMedia = document.querySelectorAll('.social-media')

document.addEventListener('DOMContentLoaded', () => {
  fetchMetadataServ();
  fetchtagList();
});

async function fetchMetadataServ () {
  const ipSpan = document.getElementById('show-ip');
  const portSpan = document.getElementById('show-port');

  // Fetch IP Address
  try {
    const response = await fetch('/api/metadata/ip');
    if (!response.ok) throw new Error("Failed to load");

    const data = await response.json();
    ipSpan.innerText = data.ip; 
  } catch (error) {
    console.error('Error fetching IP : ', error);
    ipSpan.innerText = 'Error';
  }

  // Fetch Port
    try {
    const response = await fetch('/api/metadata/port');
    if (!response.ok) throw new Error("Failed to load");

    const data = await response.json();
    portSpan.innerText = data.port; 
  } catch (error) {
    console.error('Error fetching IP : ', error);
    portSpan.innerText = 'Error';
  }
}

// Nav-button func
navBtns.forEach(button => {
    button.addEventListener('click', () => {
        const page = button.getAttribute('target')
        window.location.href = page;
    });
});

//Socia Media Link
socialMedia.forEach(button => {
    button.addEventListener('click', () => {
        const url = button.getAttribute('data-url')
        if (url) {
            window.open(url, '_blank');
        }
    });
});



// Experiment
const toggleButton = document.getElementById('darkModeToggle');

// Checks local state
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light-theme');
  toggleButton.checked = false;
}

// Button is clicked
toggleButton.addEventListener('change', () => {
  if (toggleButton.checked) {
    // turn ON & save state
    document.body.classList.remove('light-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    // turn OFF & save state
    document.body.classList.add('light-theme');
    localStorage.setItem('theme', 'light');
  }
});

// another
const dropdown = document.getElementById('langDropdown');
const selected = dropdown.querySelector('.dropdown-selected');
const options = dropdown.querySelectorAll('.dropdown-options li');
const defLang = localStorage.getItem('language')

if (defLang) {
  options.forEach(opt => opt.classList.remove('active'))
  const targetLi = dropdown.querySelector(`.dropdown-options li[data-value="${defLang}"]`)
  console.log(targetLi)
  targetLi.classList.add('active')
  console.log(targetLi.textContent)
  selected.textContent = targetLi.textContent
}

// Dropdown Open
selected.addEventListener('click', (e) => {
  e.stopPropagation();
  dropdown.classList.toggle('open');
});

options.forEach(option => {
  option.addEventListener('click', function(e) {
    e.stopPropagation();
    
    // Selected Lang
    selected.textContent = this.textContent;
    
    // Update active
    options.forEach(opt => opt.classList.remove('active'));
    this.classList.add('active');
    
    // Get -> local
    const langValue = this.getAttribute('data-value');
    localStorage.setItem('language', langValue); 
    
    // CloseIt
    dropdown.classList.remove('open');
  });
});

// Close when click outside
document.addEventListener('click', () => {
  dropdown.classList.remove('open');
});


const inputTag = document.querySelector('#input-tag');
const addBtn = document.querySelector('.add-btn');
const delBtn = document.querySelector('.del-btn');
const tableBody = document.getElementById('table-body');
const checkAll = document.getElementById('check-all');

/*
async function fetchAndRenderTags() {
  try {
    const response = await fetch('/api/data/tags');
    if (!response.ok) throw new Error("Cannot load data");

    const tags = await response.json();
    
    tableBody.innerHTML = '';
    tags.forEach((tag, index) => {

    })
  }
}*/
async function fetchtagList() {
  try {
    const response = await fetch('/api/data/tag_list');
    if (!response.ok) throw new Error ('Failed to load');

    const data = await response.json();
    const dataEntries = Object.entries(data); //obj to array
    tableBody.innerHTML = dataEntries.map(([tagKey, tagName], index) => `
      <tr>
        <td><input type="checkbox" class="tag-checkbox" data-id="${tagKey}"></td>
        <td>${index + 1}</td>
        <td>${tagName}</td>
      </tr>
      `).join('');
  } catch (error) {
    console.error("Error fetching tags: ", error);
    tableBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:red;">Can't load data</td></tr>`;
  }
}

addBtn.addEventListener('click', async () => {
  const tagValue = inputTag.value.trim();
  if (tagValue === '') return alert("Can't be empty");

  try {
    const response = await fetch('/api/data/tags', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        tagName: tagValue
      })
    });

  if (!response.ok) {
    throw new Error(`Failed: ${response.status}`);
  }

  inputTag.value = '';
  fetchtagList();

  } catch (error) {
    console.error("Something went wrong! ", error);
  }
});

if (checkAll) {
  checkAll.addEventListener('change', (e) => {
    const allCheckboxes = document.querySelectorAll('.tag-checkbox');
    allCheckboxes.forEach(checkbox => {
      checkbox.checked = e.target.checked;
    });
  });
}

delBtn.addEventListener('click', async () => {
  const checkedBoxes = document.querySelectorAll('.tag-checkbox:checked');
  const deleteKeys = Array.from(checkedBoxes).map(box => box.getAttribute('data-id'));
  
  if (deleteKeys.length === 0) {
    alert('Please select at least one tag to delete');
    return;
  }

  if (!confirm(`Are you sure you want to delete ${deleteKeys.length} tag(s)?`)) {
    return;
  }

  try {
    const response = await fetch('/api/data/tag_delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({keys: deleteKeys})
    });
    if (!response.ok) throw new Error('Failed to delete tags');

    alert('Tags deleted successfully!');
    fetchtagList();

  } catch (error) {
    console.error('Error deleting tags: ', error);
    alert('Failed to delete tags');
  }
})
