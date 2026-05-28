const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('upload');

function getMaxCanvasSize() {
    const containerWidth = canvas.parentElement.clientWidth;
    const headerHeight = document.querySelector('.header').offsetHeight;
    const pagePadding = 80;

    return {
        width: containerWidth,
        height: window.innerHeight - headerHeight - pagePadding
    };
}

function drawDefaultScreen() {
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.strokeRect(
        canvas.width / 2 - 80,
        canvas.height / 2 - 60,
        160,
        120
    );
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
        "Upload an Image",
        canvas.width / 2,
        canvas.height / 2 + 100
    );
}

let originalImage = null;

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                originalImage = img;
                const maxSize = getMaxCanvasSize();
                const scale = Math.min(
                    1,
                    maxSize.width / img.naturalWidth,
                    maxSize.height / img.naturalHeight
                );
                canvas.width = Math.round(img.naturalWidth * scale);
                canvas.height = Math.round(img.naturalHeight * scale);
                applyFilters();
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(file);
    }
});

const resetBtn = document.querySelector('.reset-btn');
resetBtn.addEventListener('click', () => {
    if (originalImage) {
        filter_inputs.forEach(input => {
            if (input.type === 'range') {
                input.value = input.defaultValue;
            }
        });
        applyFilters();
    }
});

const downloadBtn = document.querySelector('.download-btn');
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL();
    link.click();
});

const filter_inputs = document.querySelectorAll('.filter input');
function applyFilters() {
    const brightness = filter_inputs[0].value;
    const contrast = filter_inputs[1].value;
    const saturate = filter_inputs[2].value;
    const hue = filter_inputs[3].value;
    const blur = filter_inputs[4].value;
    const grayscale = filter_inputs[5].value;
    const sepia = filter_inputs[6].value;
    const opacity = filter_inputs[7].value;
    const invert = filter_inputs[8].value;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.filter = `
    brightness(${brightness}%)
    contrast(${contrast}%)
    saturate(${saturate}%)
    hue-rotate(${hue}deg)
    blur(${blur}px)
    grayscale(${grayscale}%)
    sepia(${sepia}%)
    opacity(${opacity}%)
    invert(${invert}%)
     `;

    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
}

function updateFilterValues() {
    filter_inputs.forEach(input => {
        const filter = input.closest('.filter');
        const valueTag = filter.querySelector('.filter-value');
        const filterType = filter.dataset.filter;
        let value = input.value;
        if(filterType === 'hue-rotation') {
            valueTag.textContent = `${value}°`;
        }
        else if(filterType === 'blur') {
            valueTag.textContent = `${value}px`;
        }
        else {
            valueTag.textContent = `${value}%`;
        }
    });
}

const filters = document.querySelector('.filters');
filters.addEventListener('input', (e) => {
    console.log(e);
    if (e.target.matches('input')) {
        applyFilters();
        updateFilterValues();
    }
});

drawDefaultScreen();