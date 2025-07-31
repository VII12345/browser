document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      const contents = document.querySelectorAll('.tab-content');
      contents.forEach(c => (c.style.display = 'none'));

      const targetId = this.dataset.tab;
      document.getElementById(targetId).style.display = 'block';
    });
  });

  document.querySelector('.tab-content').style.display = 'block';
});



