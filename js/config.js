const navBtns = document.querySelectorAll('.nav-btn');
const socialMedia = document.querySelectorAll('.social-media')

document.addEventListener('DOMContentLoaded', async() => {
  fetchMetadataServ();
  await fetchtagList();
  await fetchsubTagList();
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
const rootHtml = document.documentElement;

// Checks local state
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  rootHtml.style.colorScheme = 'light';
  toggleButton.checked = false;
} else if (savedTheme == 'dark') {
  rootHtml.style.colorScheme = 'dark';
  toggleButton.checked = true;
} else {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  toggleButton.checked = prefersDark;
}

// Button is clicked
toggleButton.addEventListener('change', () => {
  if (toggleButton.checked) {
    // turn ON & save state
    rootHtml.style.colorScheme = 'dark';
    localStorage.setItem('theme', 'dark');
  } else {
    // turn OFF & save state
    rootHtml.style.colorScheme = 'light';
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
  targetLi.classList.add('active')
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
        <td>${tagName.name}</td>
      </tr>
      `).join('');

    //==== For tag selection in sub-tag ====//
    showTags.innerHTML = dataEntries.map(([tagKey, tagName]) => `
      <li data-value="${tagKey}">${tagName.name}</li>
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
    const allCheckboxes = tableBody.querySelectorAll('.tag-checkbox');
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
    fetchsubTagList();
    const subTags = document.querySelector('#subTagDropdown');
    const resetDropdown = subTags.querySelector('#tagSelected');
    resetDropdown.innerHTML = "-";
    checkAll.checked = false;

  } catch (error) {
    console.error('Error deleting tags: ', error);
    alert('Failed to delete tags');
  }
})


/* =======
Sub-Tags Section
====== */

const subTagTable = document.querySelector('.sub-tag');
const subTagInput = subTagTable.querySelector('#input-sub-tag');
const subTagDropdown = document.getElementById('subTagDropdown');
const tagSelected = subTagDropdown.querySelector('.dropdown-tag-selected');
const showTags = subTagDropdown.querySelector('.dropdown-tag');
const subTagShow = subTagTable.querySelector('.tags-table');
const subTagBody = subTagShow.querySelector('#table-sub-body');

// Dropdown Open
tagSelected.addEventListener('click', (e) => {
  e.stopPropagation();
  subTagDropdown.classList.toggle('open');
  
  const tagOptions = subTagDropdown.querySelectorAll('.dropdown-tag li');
  tagOptions.forEach(option => {
  option.addEventListener('click', function(e) {
    e.stopPropagation();
    
    // Selected Lang
    tagSelected.textContent = this.textContent;
    
    // Update active
    tagOptions.forEach(opt => opt.classList.remove('active'));
    this.classList.add('active');

    const dataVal = this.getAttribute('data-value');
    tagSelected.setAttribute('data-value', dataVal);
    
    // CloseIt
    fetchsubTagList();
    subTagDropdown.classList.remove('open');
    });
  });
});

// Close when click outside
document.addEventListener('click', () => {
  subTagDropdown.classList.remove('open');
});

const subTagAddBtn = subTagTable.querySelector('.add-btn')

subTagAddBtn.addEventListener('click', async () => {
  const tagValue = subTagInput.value.trim();
  if (tagValue === '') return alert("Can't be empty");

  const mainTag = tagSelected.getAttribute('data-value');

  try {
    const response = await fetch(`/api/data/tags/${mainTag}/subtags`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        subTagName: tagValue
      })
    });

  if (!response.ok) {
    throw new Error(`Failed: ${response.status}`);
  }

  subTagInput.value = '';
  fetchsubTagList();

  } catch (error) {
    console.error("Something went wrong! ", error);
  }
});

async function fetchsubTagList() {
  try {
    const response = await fetch('/api/data/tag_list');
    if (!response.ok) throw new Error ('Failed to load');

    const data = await response.json();
    const key = tagSelected.getAttribute('data-value');
    const targetTag = data[key];

    if(targetTag?.['sub-tags']?.length > 0) {
      subTagBody.innerHTML = targetTag['sub-tags'].map((subTagName, index) => `
      <tr>
        <td><input type="checkbox" class="sub-tag-checkbox" main-tag-id="${key}" value="${subTagName}"></td>
        <td>${index + 1}</td>
        <td>${subTagName}</td>
      </tr>
      `).join('');
    } else {
      subTagBody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align: center;"> There's no sub-tag registered. </td>
      </tr>
      `;
    }

  } catch (error) {
    console.error("Error fetching tags: ", error);
    tableBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:red;">Can't load data</td></tr>`;
  }
}

const subCheckAll = subTagShow.querySelector('#check-all')

if (subCheckAll) {
  subCheckAll.addEventListener('change', (e) => {
    const allCheckboxes = subTagBody.querySelectorAll('.sub-tag-checkbox');
    allCheckboxes.forEach(checkbox => {
      checkbox.checked = e.target.checked;
    });
  });
}

const subTagDelBtn = subTagTable.querySelector('.del-btn')

subTagDelBtn.addEventListener('click', async () => {
  const checkedBoxes = subTagBody.querySelectorAll('.sub-tag-checkbox:checked');
  const deleteValues = Array.from(checkedBoxes).map(box => box.getAttribute('value'));
  const deleteCheckbox = subTagBody.querySelector('.sub-tag-checkbox:checked');
  const deleteMainTag = deleteCheckbox.getAttribute('main-tag-id')
  console.log(deleteValues);
  console.log(deleteMainTag);
  
  if (deleteValues.length === 0) {
    alert('Please select at least one tag to delete');
    return;
  }

  if (!confirm(`Are you sure you want to delete ${deleteValues.length} tag(s)?`)) {
    return;
  }

  try {
    const response = await fetch(`/api/data/tags/${deleteMainTag}/subtags`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "subTags": deleteValues
      })
    });
    if (!response.ok) throw new Error('Failed to delete tags');

    alert('Tags deleted successfully!');
    fetchtagList();
    fetchsubTagList();
    subCheckAll.checked = false;

  } catch (error) {
    console.error('Error deleting tags: ', error);
    alert('Failed to delete tags');
  }
})