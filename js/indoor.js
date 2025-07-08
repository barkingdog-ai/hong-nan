/* 室內展示 Image Map 響應式處理 */
(function () {
  let isInitialized = false;

  function initIndoorImageMap() {
    if (isInitialized) return;

    const img = document.querySelector('img[usemap="#image-map"]');
    const areas = document.querySelectorAll('map[name="image-map"] area');

    if (!img || !areas.length) {
      console.log("室內展示 Image map 元素未找到，稍後重試...");
      return;
    }

    // 原始圖片座標（基於 1920px 寬度）
    const originalCoords = {
      'H區': "583,488,747,653",
      'Q區': "581,405,1337,480",
      'D區': "747,822,710,824,710,800,581,799,584,660,749,658",
      'G區': "749,488,957,487,957,649,918,653,920,675,839,673,829,651,751,651",
      'F區': "966,490,1169,488,1166,651,1090,653,1085,675,1005,676,998,649,963,651",
    };

    function updateCoords() {
      if (!img.clientWidth) return; // 圖片還沒載入完成

      const scale = img.clientWidth / 1920;
      console.log("室內展示更新座標，縮放比例:", scale);

      areas.forEach((area) => {
        const originalCoord = originalCoords[area.alt];
        if (originalCoord) {
          const coords = originalCoord
            .split(",")
            .map((coord) => Math.round(parseFloat(coord) * scale))
            .join(",");
          area.coords = coords;
        }
      });
    }

    // 添加點擊事件（只添加一次）
    areas.forEach((area) => {
      area.addEventListener("click", function (e) {
        e.preventDefault(); // 阻止預設行為

        // 區域名稱對應的 ID
        const areaToId = {
          'H區': "h_area",
          'Q區': "q_area",
          'D區': "d_area",
          'G區': "g_area",
          'F區': "f_area",
        };

        const targetId = areaToId[area.alt];
        if (targetId) {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            // 平滑滾動到目標區域
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            console.log("滾動到:", area.alt);
          } else {
            console.error("找不到目標元素:", targetId);
          }
        }
      });
    });

    // 立即更新一次
    updateCoords();

    // 監聽視窗大小改變
    window.addEventListener("resize", updateCoords);

    // 監聽圖片載入完成
    if (img.complete) {
      updateCoords();
    } else {
      img.addEventListener("load", updateCoords);
    }

    isInitialized = true;
    console.log("室內展示 Image Map 初始化完成");
  }

  // DOM 載入完成後初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initIndoorImageMap);
  } else {
    initIndoorImageMap();
  }

  // 備用：延遲初始化（防止 Webflow 干擾）
  setTimeout(initIndoorImageMap, 100);
  setTimeout(initIndoorImageMap, 500);
})();