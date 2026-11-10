document.addEventListener('DOMContentLoaded', () => {
  
  // 1. ЗАГРУЖАЕМ НАШИ 45 ФОТОГРАФИЙ ИЗ ПАПОК
  const galleryData = [];
  
  // Carrelage - 19 фото
  for (let i = 1; i <= 19; i++) {
    galleryData.push({ src: `images/carrelage/${i}.webp`, category: 'carrelage' });
  }
  
  // Parquet - 10 фото
  for (let i = 1; i <= 10; i++) {
    galleryData.push({ src: `images/parquet/${i}.webp`, category: 'parquet' });
  }
  
  // Terasses - 16 фото
  for (let i = 1; i <= 16; i++) {
    galleryData.push({ src: `images/terasses/${i}.webp`, category: 'terasses' });
  }

  // 2. НАСТРОЙКИ ГАЛЕРЕИ
  const itemsPerPage = 15; // Сколько фоток подгружать за один клик "Показать еще"
  let currentCategory = 'all';
  let currentIndex = 0;
  let filteredData = [...galleryData];

  const grid = document.getElementById('galleryGrid');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const tabs = document.querySelectorAll('.tab-btn');

  // 3. ОТРИСОВКА ФОТО В СЕТКЕ
  function renderGallery() {
    const toRender = filteredData.slice(currentIndex, currentIndex + itemsPerPage);
    
    toRender.forEach((item, index) => {
      // ИСПРАВЛЕНИЕ ОШИБКИ: Запоминаем точный индекс конкретно этой фотографии до обновления currentIndex
      const absoluteIndex = currentIndex + index; 
      
      const div = document.createElement('div');
      div.className = 'gallery-item rv';
      
      const img = document.createElement('img');
      img.src = item.src;
      img.loading = 'lazy'; 
      
      // Передаем правильный абсолютный индекс в модалку
      div.addEventListener('click', () => openLightbox(absoluteIndex));
      
      div.appendChild(img);
      grid.appendChild(div);
      
      setTimeout(() => div.classList.add('on'), 50);
    });

    currentIndex += itemsPerPage;

    if (currentIndex >= filteredData.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'inline-flex';
    }
  }

  // 4. ФИЛЬТРАЦИЯ (ВКЛАДКИ)
  function filterGallery(category) {
    currentCategory = category;
    currentIndex = 0;
    grid.innerHTML = ''; 
    
    if (category === 'all') {
      filteredData = [...galleryData];
    } else {
      filteredData = galleryData.filter(item => item.category === category);
    }
    
    renderGallery();
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterGallery(tab.dataset.cat);
    });
  });

  loadMoreBtn.addEventListener('click', () => renderGallery());

  // Запуск при открытии сайта
  filterGallery('all');


  // 5. ЛОГИКА ВСПЛЫВАЮЩЕГО ОКНА (LIGHTBOX)
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  
  let currentLbIndex = 0;

  function openLightbox(index) {
    currentLbIndex = index;
    updateLightboxImg();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden'; 
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateLightboxImg() {
    lbImg.src = filteredData[currentLbIndex].src;
  }

  function prevImg() {
    currentLbIndex = (currentLbIndex > 0) ? currentLbIndex - 1 : filteredData.length - 1;
    updateLightboxImg();
  }

  function nextImg() {
    currentLbIndex = (currentLbIndex < filteredData.length - 1) ? currentLbIndex + 1 : 0;
    updateLightboxImg();
  }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', prevImg);
  lbNext.addEventListener('click', nextImg);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
});