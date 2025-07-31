document.addEventListener("DOMContentLoaded", () => {
  const select = document.querySelector(".collapsible-select");
  const trigger = select.querySelector(".collapsible-trigger");
  const options = select.querySelector(".collapsible-options");
  const selected = select.querySelector(".selected-gpu");
  const items = options.querySelectorAll(".option-item");

  // 展开/收起
  trigger.addEventListener("click", () => {
    options.classList.toggle("expanded");
  });

  // 点击选项
  items.forEach(item => {
    item.addEventListener("click", () => {
      selected.textContent = item.textContent;

      items.forEach(opt => opt.classList.remove("active"));
      item.classList.add("active");

      options.classList.remove("expanded");
    });
  });
});
