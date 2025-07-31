document.getElementById('helpButton_index').addEventListener('click', function () {
    document.getElementById('popupWindow_index').style.display = 'flex';
});

// 关闭弹窗
document.getElementById('closeButton_index').addEventListener('click', function () {
    document.getElementById('popupWindow_index').style.display = 'none';
});

// 点击背景关闭弹窗
document.getElementById('popupWindow_index').addEventListener('click', function (event) {
    if (event.target === this) {
        this.style.display = 'none';
    }
});

document.getElementById('helpButton_create').addEventListener('click', function () {
    document.getElementById('popupWindow_create').style.display = 'flex';
});

// 关闭弹窗
document.getElementById('closeButton_create').addEventListener('click', function () {
    document.getElementById('popupWindow_create').style.display = 'none';
});

// 点击背景关闭弹窗
document.getElementById('popupWindow_create').addEventListener('click', function (event) {
    if (event.target === this) {
        this.style.display = 'none';
    }
});
