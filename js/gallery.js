document.addEventListener('DOMContentLoaded', () => {
  
  // 1. ГЕНЕРИРУЕМ 100 ФОТО ИЗ 11 СУЩЕСТВУЮЩИХ (ДЛЯ ДЕМОНСТРАЦИИ)
  const baseImages = ['ex1.png','ex2.png','ex3.png','ex4.png','ex5.png','ex6.png','ex7.png','ex8.png','ex9.png','ex10.png','ex11.png'];
  const categories = ['salles-de-bain', 'terrasses', 'facades'];
  const galleryData = [];
  
  for (let i = 0; i < 100; i++) {
    galleryData.push({
      src: `images/${baseImages[i % baseImages.length]}`,
      // Раскидываем фотки по случайным категориям для примера
      category: categories[i % categories.length]
    });
  }

  // 2. НАСТРОЙКИ ГАЛЕРЕИ
  const itemsPerPage = 15; // Сколько фоток показывать за раз
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
      const div = document.createElement('div');
      div.className = 'gallery-item rv';
      
      const img = document.createElement('img');
      img.src = item.src;
      img.loading = 'lazy'; // Фотки грузятся только когда до них докрутят!
      
      // Клик для открытия модалки
      div.addEventListener('click', () => openLightbox(currentIndex + index));
      
      div.appendChild(img);
      grid.appendChild(div);
      
      // Запускаем анимацию появления
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
    grid.innerHTML = ''; // Очищаем старые фотки
    
    if (category === 'all') {
      filteredData = [...galleryData];
    } else {
      filteredData = galleryData.filter(item => item.category === category);
    }
    
    renderGallery();
  }

  // Клик по вкладкам
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterGallery(tab.dataset.cat);
    });
  });

  // Клик по "Показать еще"
  loadMoreBtn.addEventListener('click', () => renderGallery());

  // Инициализация при запуске
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
    document.body.style.overflow = 'hidden'; // Убираем скролл сайта
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