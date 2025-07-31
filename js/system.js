const osGroup = document.querySelectorAll('.setting-label');
osGroup.forEach(label => {
  if (label.textContent.trim() === '操作系统') {
    const options = label.nextElementSibling.querySelectorAll('.setting-option');
    options.forEach(option => {
      option.addEventListener('click', () => {
        options.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        console.log('操作系统选中:', option.dataset.value);
      });
    });
  }
});



