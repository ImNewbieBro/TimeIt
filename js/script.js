const portElement = document.getElementById('show-port')
if (portElement) {
  const port = window.location.port
  document.getElementById('show-port').innerText = port;
}

const navBtns = document.querySelectorAll('.nav-btn');
const socialMedia = document.querySelectorAll('.social-media')

// Nav-button func
navBtns.forEach(button => {
    button.addEventListener('click', () => {
        const page = button.getAttribute('target')
        console.log(page)
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