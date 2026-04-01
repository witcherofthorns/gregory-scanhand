let leftHandFile = null;
let rightHandFile = null;
let selectedTheme = "general";

const leftInput = document.getElementById("leftHandInput");
const rightInput = document.getElementById("rightHandInput");
const leftPreview = document.getElementById("leftPreview");
const rightPreview = document.getElementById("rightPreview");
const predictBtn = document.getElementById("predictBtn");
const modal = document.getElementById("resultModal");
const loadingContainer = document.getElementById("loadingContainer");
const resultContainer = document.getElementById("resultContainer");
const predictionContent = document.getElementById("predictionContent");

function openModal() {
    if(modal){
        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    }
}

function closeModal() {
    if(modal){
        modal.classList.add("hidden");
        document.body.style.overflow = "";
    }
}

function compressorImage(file, options = {}) {
    return new Promise((resolve, reject) => {
        new Compressor(file, {
            ...options,
            success(result) {
                resolve(result);
            },
            error(err) {
                reject(err);
            },
        });
    });
}

function getImageDimensions(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve({ width: img.width, height: img.height });
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Не удалось загрузить изображение для определения размеров'));
        };
        img.src = url;
    });
}

async function getImageInfo(file) {
    const dimensions = await getImageDimensions(file);
    return {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: new Date(file.lastModified),
        width: dimensions.width,
        height: dimensions.height,
    };
}

async function imageCompress(file) {
    if (!file) return null;

    const info = await getImageInfo(file);
    const newWidth = Math.floor(info.width / 1.4);
    const newHeight = Math.floor(info.height / 1.4);

    return await compressorImage(file, {
        quality: 0.6,
        width: newWidth,
        height: newHeight,
        mimeType: 'image/jpeg',
    })
}

// Функция для предпросмотра изображения
function setupImageUpload(inputElement, previewElement, side) {
    inputElement.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert("Файл слишком большой! Максимальный размер - 10 МБ");
                return;
            }

            if (!file.type.match("image.*")) {
                alert(
                    "Пожалуйста, загрузите изображение в формате JPG или PNG",
                );
                return;
            }

            const imageCopressed = await imageCompress(file);

            // Сохраняем файл
            if (side === "left") leftHandFile = file;
            else rightHandFile = file;

            // Показываем превью
            const reader = new FileReader();
            reader.onload = (e) => {
                previewElement.innerHTML = `<img src="${e.target.result}" style="width: 100%; border-radius: 12px; height: 100%; object-fit: cover;" alt="${side} hand preview">`;
                previewElement.classList.remove("hidden");
            };
            reader.readAsDataURL(imageCopressed);

            // Проверяем, можно ли активировать кнопку гадания
            checkCanPredict();
        }
    });
}

// Функция проверки возможности гадания
function checkCanPredict() {
    if (leftHandFile && rightHandFile && selectedTheme) {
        predictBtn.disabled = false;
    } else {
        predictBtn.disabled = true;
    }
}

// Функция получения выбранной темы
function getSelectedTheme() {
    const selectedRadio = document.querySelector(
        'input[name="theme"]:checked',
    );
    if (selectedRadio) {
        return selectedRadio.value;
    }
    return "general";
}

function displayContent(content) {
    if(!predictionContent) return;
    predictionContent.innerHTML = "";
    predictionContent.innerHTML = `
        <div class="col gap-32">
            <div class="col gap-12">
                <h5>Обзор</h5>
                <p class="gray">${content.overview}</p>
            </div>
            <div class="col gap-12">
                <h5>Линия жизни</h5>
                <p class="gray">${content.life_line}</p>
            </div>
            <div class="col gap-12">
                <h5>Линия сердца</h5>
                <p class="gray">${content.heart_line}</p>
            </div>
            <div class="col gap-12">
                <h5>Линия личности</h5>
                <p class="gray">${content.head_line}</p>
            </div>
            <div class="col gap-12">
                <h5>Линия судьбы</h5>
                <p class="gray">${content.fate_line}</p>
            </div>
            <div class="col gap-12">
                <h5>Вывод</h5>
                <p class="gray">${content.summary}</p>
            </div>
        </div>
    `;
}

function displayReshot() {
    if(!predictionContent) return;
    predictionContent.innerHTML = "";
    predictionContent.innerHTML = `
        <div class="result-content">
            <div class="prediction-text"><p>К сожалению, ваше фото не подходит. Пожалуйста, сделайте новые фото без размытия и в хорошем качестве, с хорошим освещением, что бы ваши руки было отчётливо видно</p></div>
        </div>
    `;
}

function dispalyError(error){
    if(!predictionContent) return;
    predictionContent.innerHTML = "";
    predictionContent.innerHTML = `
        <div class="error-message">
            <p class="error-text">${error}</p>
        </div>
    `;
}

// Функция гадания
async function makePrediction() {
    // Показываем загрузку, скрываем результат
    loadingContainer.classList.remove("hidden");
    resultContainer.classList.add("hidden");

    // Открываем модальное окно
    openModal();

    try {
        const formData = new FormData();
        formData.append("leftHand", leftHandFile);
        formData.append("rightHand", rightHandFile);
        formData.append("theme", getSelectedTheme());

        const response = await fetch("/api/predict", {
            method: "POST",
            body: formData,
            headers: {
                'Origin': window.location.origin,
                'Referer': window.location.href,
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        const data = await response.json();

        // Скрываем загрузку
        loadingContainer.classList.add("hidden");
        resultContainer.classList.remove("hidden");

        // Отображаем результаты
        if(data.status == "ok" && data.content){
            displayContent(data.content);
            return
        }
        else if(data.status == "error"){
            dispalyError("Неизвестная ошибка");
            return
        }
        else if(data.status == "reshot"){
            displayReshot();
            return
        }

        // Нет результата
        // что-то пошло не так
        dispalyError("Хм, кажется, тут ничего нет");

    } catch (error) {
        loadingContainer.classList.add("hidden");
        resultContainer.classList.remove("hidden");
        dispalyError("Произошла ошибка при соединении с сервером. Пожалуйста, попробуйте позже");
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    console.log("🔧 Настройка обработчиков событий");

    // Загрузка изображений
    setupImageUpload(leftInput, leftPreview, "left");
    setupImageUpload(rightInput, rightPreview, "right");

    // Кнопки для левой руки
    const leftUploadBtn = document.getElementById("leftUploadBtn");
    if (leftUploadBtn) leftUploadBtn.addEventListener("click", () => leftInput.click());

    // Кнопки для правой руки
    const rightUploadBtn = document.getElementById("rightUploadBtn");
    if (rightUploadBtn) rightUploadBtn.addEventListener("click", () => rightInput.click());

    // Радио-кнопки темы
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    themeRadios.forEach((radio) => {
        radio.addEventListener("change", (e) => {
            selectedTheme = e.target.value;
            // console.log("📌 Выбрана тема:", selectedTheme);
            checkCanPredict();
        });
    });

    // Кнопка действия
    if (predictBtn) {
        predictBtn.addEventListener("click", makePrediction);
    }

    // Закрытие модального окна
    const closeButtons = document.querySelectorAll("[data-close-modal]");
    closeButtons.forEach((button) => {
        button.addEventListener("click", closeModal);
    });
}

// Инициализация после загрузки страницы
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupEventListeners);
} else {
    setupEventListeners();
}