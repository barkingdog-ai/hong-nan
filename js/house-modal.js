/* Modal 功能和 Image Map 響應式處理 */
(function () {
  let isHouseMapInitialized = false;

  // Modal 內容配置
  const modalContent = {
    '屋架': {
      image: 'images/網頁-屋架.JPG'
    },
    '軸組': {
      image: 'images/網頁-軸組.JPG'
    },
    '床組': {
      image: 'images/網頁-床組.JPG'
    },
    '布基礎': {
      image: 'images/網頁-布基礎.webp'
    }
  };

  // Modal 功能
  function initModal() {
    const modal = document.getElementById('houseModal');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = document.querySelector('.modal-close');

    if (!modal || !modalBody || !closeBtn) {
      console.log('Modal 元素未找到，稍後重試...');
      return false;
    }

    // 開啟 modal
    function openModal(area) {
      const content = modalContent[area];
      if (content) {
        // 更新標題
        const modalTitle = document.querySelector('.modal-title');
        if (modalTitle) {
          modalTitle.textContent = area;
        }
        
        // 顯示圖片
        modalBody.innerHTML = `<img src="${content.image}" alt="${area}">`;
        
        modal.style.display = 'flex';
        setTimeout(() => {
          modal.classList.add('show');
        }, 10);
        
        // 禁止背景滾動
        document.body.style.overflow = 'hidden';
      }
    }

    // 關閉 modal
    function closeModal() {
      modal.classList.add('closing');
      modal.classList.remove('show');
      setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('closing');
        document.body.style.overflow = 'auto';
      }, 400);
    }

    // 事件監聽
    closeBtn.addEventListener('click', closeModal);
    
    // 點擊背景關閉
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    // ESC 鍵關閉
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
      }
    });

    return { openModal };
  }

  // Image Map 響應式處理
  function initHouseImageMap() {
    if (isHouseMapInitialized) return;

    const img = document.querySelector('img[usemap="#image-map-house"]');
    const areas = document.querySelectorAll('map[name="image-map-house"] area');

    if (!img || !areas.length) {
      console.log('House Image map 元素未找到，稍後重試...');
      return;
    }

    // 原始圖片座標（基於 1920px 寬度）
    const originalCoords = {
      '屋架': "1535,188,1660,237",
      '軸組': "1535,580,1662,621", 
      '床組': "1533,819,1662,872",
      '布基礎': "1532,946,1662,996"
    };

    function updateCoords() {
      if (!img.clientWidth) return;

      const scale = img.clientWidth / 1920;
      console.log('House Map 更新座標，縮放比例:', scale);

      areas.forEach((area) => {
        const originalCoord = originalCoords[area.alt];
        if (originalCoord) {
          const coords = originalCoord
            .split(',')
            .map((coord) => Math.round(parseFloat(coord) * scale))
            .join(',');
          area.coords = coords;
        }
      });
    }

    // 初始化 Modal
    const modalControls = initModal();
    if (!modalControls) {
      setTimeout(initHouseImageMap, 100);
      return;
    }

    // 添加點擊事件
    areas.forEach((area) => {
      area.addEventListener('click', function (e) {
        e.preventDefault();
        modalControls.openModal(area.alt);
        console.log('開啟 Modal:', area.alt);
      });
    });

    // 立即更新一次
    updateCoords();

    // 監聽視窗大小改變
    window.addEventListener('resize', updateCoords);

    // 監聽圖片載入完成
    if (img.complete) {
      updateCoords();
    } else {
      img.addEventListener('load', updateCoords);
    }

    isHouseMapInitialized = true;
    console.log('House Image Map 初始化完成');
  }

  // DOM 載入完成後初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHouseImageMap);
  } else {
    initHouseImageMap();
  }

  // 備用：延遲初始化（防止 Webflow 干擾）
  setTimeout(initHouseImageMap, 100);
  setTimeout(initHouseImageMap, 500);
})();