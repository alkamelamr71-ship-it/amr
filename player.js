// ============================================
// player.js - مشغل الفيديو ودوال عرض الفئات
// ============================================

// ========== دالة استخراج YouTube ID ==========
function extractYouTubeId(url) {
    if (!url) return '';
    
    url = url.toString().trim();
    
    // تنظيف الروابط
    const embedMatch = url.match(/youtube\.com\/embed\/([^&\n?#]+)/);
    if (embedMatch && embedMatch[1]) return embedMatch[1].substring(0, 11);
    
    const watchMatch = url.match(/youtube\.com\/watch\?v=([^&\n?#]+)/);
    if (watchMatch && watchMatch[1]) return watchMatch[1].substring(0, 11);
    
    const shortMatch = url.match(/youtu\.be\/([^&\n?#]+)/);
    if (shortMatch && shortMatch[1]) return shortMatch[1].substring(0, 11);
    
    const vMatch = url.match(/youtube\.com\/v\/([^&\n?#]+)/);
    if (vMatch && vMatch[1]) return vMatch[1].substring(0, 11);
    
    const idMatch = url.match(/([A-Za-z0-9_-]{11})/);
    if (idMatch && idMatch[1]) return idMatch[1];
    
    return url;
}

// ========== الحصول على اسم الفئة بالعربي ==========
function getCategoryName(category) {
    const names = {
        'business': 'الاستثمار وريادة الأعمال',
        'relationships': 'العلاقات والتواصل الإنساني',
        'development': 'التنمية البشرية وتطوير الذات',
        'health': 'الدين والروحانيات',
        'technology': 'التقنية والابتكار',
        'investment': 'قصص النجاح الملهمة',
        'awareness': 'الوعي والفهم المجتمعي',
        'palestine-history': 'القضية الفلسطينية والتاريخ',
        'fidaa-aldeen-yehya': 'فداء الدين يحيى والرؤية الحضارية',
        'political-visions': 'الرؤية السياسية والتحولات الإقليمية'
    };
    return names[category] || category;
}

// ========== الحصول على وصف الفئة ==========
function getCategoryDescription(category) {
    const descs = {
        'business': 'استراتيجيات الاستثمار وإدارة الأموال',
        'relationships': 'أسرار تكوين العلاقات وبناءها ومهارات التواصل',
        'development': 'تطوير الذات واكتشاف القدرات الكامنة وتحقيق الأهداف',
        'health': 'نصائح دينية للنجاح في الحياة',
        'technology': 'أحدث التطورات التقنية والابتكارات التكنولوجية',
        'investment': 'سير وقصص ملهمة لشخصيات ومشاريع ناجحة',
        'awareness': 'زيادة الوعي بالثقافة والمجتمع والقضايا المعاصرة',
        'palestine-history': 'تعرف على التاريخ العريق والحضارة الغنية للأرض المباركة فلسطين',
        'fidaa-aldeen-yehya': 'رحلة المؤثر اليمني فداء الدين يحيى في التأثير الاجتماعي والإعلامي',
        'political-visions': 'تحليلات سياسية واستشراف مستقبلي للشأن السياسي العربي والدولي'
    };
    return descs[category] || 'أفضل حلقات البودكاست في هذا المجال';
}

// ========== أيقونات الفئات ==========
function getCategoryIcon(category) {
    const icons = {
        'business': 'fas fa-chart-line',
        'relationships': 'fas fa-heart',
        'development': 'fas fa-brain',
        'health': 'fas fa-mosque',
        'technology': 'fas fa-laptop-code',
        'investment': 'fas fa-star',
        'awareness': 'fas fa-lightbulb',
        'palestine-history': 'fas fa-landmark',
        'fidaa-aldeen-yehya': 'fas fa-user-graduate',
        'political-visions': 'fas fa-eye'
    };
    return icons[category] || 'fas fa-podcast';
}

// ========== صور بديلة لكل فئة ==========
function getFallbackImage(category) {
    const images = {
        'business': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop',
        'relationships': 'https://images.unsplash.com/photo-1519207613136-1c1dfb628b0b?w=400&h=225&fit=crop',
        'development': 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=225&fit=crop',
        'health': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=225&fit=crop',
        'technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=225&fit=crop',
        'investment': 'https://images.unsplash.com/photo-1523287562758-73d2de9f8b2b?w=400&h=225&fit=crop',
        'awareness': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
        'palestine-history': 'https://images.unsplash.com/photo-1580541629184-2c8d2c8b04b3?w=400&h=225&fit=crop',
        'fidaa-aldeen-yehya': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=225&fit=crop',
        'political-visions': 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=225&fit=crop'
    };
    return images[category] || 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&h=225&fit=crop';
}

// ========== تقصير النص ==========
function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// ========== عرض الفئات مع أول حلقة ==========
function displayCategoriesWithFirstEpisode() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) {
        console.error('❌ العنصر #categoriesGrid غير موجود');
        return;
    }
    
    // قائمة الفئات المطلوبة (متوافقة مع بيانات episodesData)
    const categories = ['business', 'relationships', 'development', 'health', 'technology', 'investment', 'awareness', 'palestine-history', 'fidaa-aldeen-yehya', 'political-visions'];
    
    categoriesGrid.innerHTML = '';
    
    categories.forEach(category => {
        if (window.episodesData && window.episodesData[category] && window.episodesData[category].length > 0) {
            const categoryCard = createCategoryCard(category);
            categoriesGrid.appendChild(categoryCard);
        } else {
            console.warn(`⚠️ فئة ${category} غير موجودة أو فارغة`);
            // عرض فئة فارغة مع صورة بديلة
            const fallbackCard = createFallbackCard(category);
            categoriesGrid.appendChild(fallbackCard);
        }
    });
}

// ========== إنشاء كارت فئة مع أول حلقة ==========
function createCategoryCard(category) {
    const firstEpisode = window.episodesData[category][0];
    const categoryName = getCategoryName(category);
    const categoryDesc = getCategoryDescription(category);
    const episodeCount = window.episodesData[category].length;
    
    // استخراج معرف اليوتيوب النظيف
    const cleanYoutubeId = firstEpisode.youtube_id ? extractYouTubeId(firstEpisode.youtube_id) : '';
    const thumbnailUrl = cleanYoutubeId ? `https://img.youtube.com/vi/${cleanYoutubeId}/mqdefault.jpg` : getFallbackImage(category);
    const fallbackImage = getFallbackImage(category);
    
    const card = document.createElement('div');
    card.className = 'category-card';
    card.setAttribute('data-category', category);
    
    card.innerHTML = `
        <div class="category-thumbnail" style="height: 180px; overflow: hidden; border-radius: 12px; margin-bottom: 20px;">
            <img src="${thumbnailUrl}" 
                 alt="${firstEpisode.title}"
                 loading="lazy"
                 onerror="this.onerror=null; this.src='${fallbackImage}';"
                 style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="category-icon">
            <i class="${getCategoryIcon(category)}"></i>
        </div>
        <div class="category-content">
            <h3>${categoryName}</h3>
            <p>${categoryDesc}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                <span class="episode-count">${episodeCount} حلقة</span>
                <button class="play-first-btn" data-yid="${firstEpisode.youtube_id}" data-title="${firstEpisode.title.replace(/"/g, '&quot;')}">
                    <i class="fas fa-play"></i> تشغيل
                </button>
            </div>
        </div>
        <a href="category.html?cat=${category}" class="category-link"></a>
    `;
    
    // إضافة حدث لزر التشغيل
    setTimeout(() => {
        const playBtn = card.querySelector('.play-first-btn');
        if (playBtn) {
            playBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const youtubeId = this.getAttribute('data-yid');
                const title = this.getAttribute('data-title');
                playEpisodeInline(youtubeId, title);
            });
        }
    }, 0);
    
    return card;
}

// ========== إنشاء كارت بديل للفئات الفارغة ==========
function createFallbackCard(category) {
    const categoryName = getCategoryName(category);
    const fallbackImage = getFallbackImage(category);
    
    const card = document.createElement('div');
    card.className = 'category-card';
    card.setAttribute('data-category', category);
    
    card.innerHTML = `
        <div class="category-thumbnail" style="height: 180px; overflow: hidden; border-radius: 12px; margin-bottom: 20px;">
            <img src="${fallbackImage}" 
                 alt="${categoryName}"
                 style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="category-icon">
            <i class="${getCategoryIcon(category)}"></i>
        </div>
        <div class="category-content">
            <h3>${categoryName}</h3>
            <p>جاري تحميل المحتوى...</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                <span class="episode-count">0 حلقة</span>
            </div>
        </div>
        <a href="category.html?cat=${category}" class="category-link"></a>
    `;
    
    return card;
}

// ========== تشغيل الحلقة داخل مودال ==========
function playEpisodeInline(youtubeId, title) {
    if (!youtubeId) return;
    
    const cleanId = extractYouTubeId(youtubeId);
    if (!cleanId) {
        console.error('❌ لا يمكن استخراج معرف الفيديو');
        return;
    }
    
    // إنشاء المودال إذا لم يكن موجوداً
    let modal = document.getElementById('videoModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'videoModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 10000;
            display: none;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(5px);
        `;
        
        modal.innerHTML = `
            <div style="position: relative; width: 90%; max-width: 1000px;">
                <button id="closeModalBtn" style="
                    position: absolute;
                    top: -40px;
                    right: 0;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 28px;
                    cursor: pointer;
                    z-index: 10001;
                ">✕</button>
                <div id="modalVideoContainer" style="background: #000; border-radius: 12px; overflow: hidden;"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeBtn = document.getElementById('closeModalBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeVideoModal);
        }
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeVideoModal();
        });
    }
    
    const container = document.getElementById('modalVideoContainer');
    if (!container) return;
    
    // تنظيف المحتوى السابق
    container.innerHTML = '';
    
    // إنشاء iframe للمشغل
    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '500';
    iframe.src = `https://www.youtube.com/embed/${cleanId}?autoplay=1&modestbranding=1&rel=0`;
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.title = title || 'تشغيل الحلقة';
    
    container.appendChild(iframe);
    
    // عرض المودال
    modal.style.display = 'flex';
    
    // منع تمرير الخلفية
    document.body.style.overflow = 'hidden';
}

// ========== إغلاق مودال الفيديو ==========
function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.style.display = 'none';
        const container = document.getElementById('modalVideoContainer');
        if (container) container.innerHTML = '';
    }
    document.body.style.overflow = '';
}

// ========== تهيئة مشغل اليوتيوب في صفحة الحلقة ==========
function initYouTubePlayer() {
    const urlParams = new URLSearchParams(window.location.search);
    const episodeId = urlParams.get('id');
    const category = urlParams.get('cat');
    
    if (!episodeId || !category || !window.episodesData || !window.episodesData[category]) return;
    
    const episode = window.episodesData[category].find(ep => ep.id === episodeId);
    if (!episode || !episode.youtube_id) return;
    
    const playerContainer = document.getElementById('youtubePlayer');
    if (!playerContainer) return;
    
    const cleanVideoId = extractYouTubeId(episode.youtube_id);
    
    function createIframePlayer() {
        const iframe = document.createElement('iframe');
        iframe.width = '100%';
        iframe.height = '500';
        iframe.src = `https://www.youtube.com/embed/${cleanVideoId}?autoplay=1&modestbranding=1&rel=0`;
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        iframe.title = episode.title;
        
        playerContainer.innerHTML = '';
        playerContainer.appendChild(iframe);
    }
    
    // استخدام YouTube IFrame API إذا كان متاحاً
    if (window.YT && window.YT.Player) {
        try {
            new YT.Player(playerContainer, {
                height: '500',
                width: '100%',
                videoId: cleanVideoId,
                playerVars: { autoplay: 1, modestbranding: 1, rel: 0 },
                events: {
                    onError: function() {
                        createIframePlayer();
                    }
                }
            });
        } catch (e) {
            createIframePlayer();
        }
    } else {
        createIframePlayer();
        
        // انتظار تحميل API
        window.onYouTubeIframeAPIReady = function() {
            try {
                new YT.Player(playerContainer, {
                    height: '500',
                    width: '100%',
                    videoId: cleanVideoId,
                    playerVars: { autoplay: 1, modestbranding: 1, rel: 0 }
                });
            } catch (e) {
                console.warn('YouTube API error');
            }
        };
    }
}

// ========== تحميل معلومات الحلقة في صفحة الحلقة ==========
function loadEpisodePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const episodeId = urlParams.get('id');
    const category = urlParams.get('cat');
    
    if (!episodeId || !category || !window.episodesData || !window.episodesData[category]) {
        return;
    }
    
    const episode = window.episodesData[category].find(ep => ep.id === episodeId);
    if (!episode) return;
    
    // تحديث معلومات الحلقة
    const infoContainer = document.getElementById('episodeInfo');
    if (infoContainer) {
        infoContainer.innerHTML = `
            <h2>${episode.title}</h2>
            <div class="meta">
                <span><i class="fas fa-microphone"></i> ${episode.host || 'غير محدد'}</span>
                ${episode.guest ? `<span><i class="fas fa-user-friends"></i> ${episode.guest}</span>` : ''}
                <span><i class="fas fa-clock"></i> ${episode.duration || '--:--'}</span>
                <span><i class="fas fa-calendar"></i> ${episode.date || 'غير محدد'}</span>
                <span><i class="fas fa-eye"></i> ${episode.views || '0'}</span>
            </div>
        `;
    }
    
    // تحديث وصف الحلقة
    const descContainer = document.getElementById('episodeDescription');
    if (descContainer) {
        descContainer.innerHTML = `<p>${episode.description || 'لا يوجد وصف لهذه الحلقة'}</p>`;
    }
    
    // تحديث رابط العودة
    const backBtn = document.getElementById('backToCategory');
    if (backBtn) {
        backBtn.href = `category.html?cat=${category}`;
    }
    
    // تحميل حلقات مشابهة
    loadSimilarEpisodes(category, episodeId);
}

// ========== تحميل حلقات مشابهة ==========
function loadSimilarEpisodes(category, currentEpisodeId) {
    const container = document.getElementById('similarEpisodes');
    if (!container || !window.episodesData) return;
    
    const episodes = window.episodesData[category].filter(ep => ep.id !== currentEpisodeId).slice(0, 3);
    
    if (episodes.length === 0) {
        container.innerHTML = '<p>لا توجد حلقات مشابهة</p>';
        return;
    }
    
    let html = '';
    episodes.forEach(episode => {
        const cleanId = extractYouTubeId(episode.youtube_id);
        const thumbnail = cleanId ? `https://img.youtube.com/vi/${cleanId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=225&fit=crop';
        
        html += `
            <div class="similar-card" onclick="window.location.href='episode.html?id=${episode.id}&cat=${category}'" style="cursor: pointer;">
                <img src="${thumbnail}" alt="${episode.title}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px;">
                <h4 style="margin: 10px 0 5px; font-size: 14px;">${truncateText(episode.title, 50)}</h4>
                <small style="color: #888;">${episode.duration || ''}</small>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ========== تحديث إحصائيات الصفحة الرئيسية ==========
function updateMainStats() {
    if (!window.episodesData) return;
    
    let totalEpisodes = 0;
    let totalHours = 0;
    let uniqueHosts = new Set();
    
    for (const category in window.episodesData) {
        const episodes = window.episodesData[category];
        if (Array.isArray(episodes)) {
            episodes.forEach(episode => {
                totalEpisodes++;
                if (episode.host) uniqueHosts.add(episode.host);
                const minutes = parseInt(episode.duration?.split(':')[0]) || 0;
                totalHours += minutes / 60;
            });
        }
    }
    
    const episodesElement = document.getElementById('totalEpisodes');
    const hoursElement = document.getElementById('totalHours');
    const hostsElement = document.getElementById('totalHosts');
    
    if (episodesElement) episodesElement.textContent = totalEpisodes;
    if (hoursElement) hoursElement.textContent = Math.round(totalHours);
    if (hostsElement) hostsElement.textContent = uniqueHosts.size;
}

// ========== تهيئة الصفحة حسب نوعها ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ player.js تم تحميله بنجاح');
    
    const path = window.location.pathname;
    
    if (path.includes('episode.html')) {
        // صفحة الحلقة
        loadEpisodePage();
        initYouTubePlayer();
    } else if (path.includes('category.html')) {
        // صفحة الفئة - سيتم التعامل معها في category.html نفسه
        console.log('📁 صفحة الفئة - انتظار البيانات');
    } else if (path.includes('index.html') || path === '/' || path === '') {
        // الصفحة الرئيسية
        updateMainStats();
        if (typeof displayCategoriesWithFirstEpisode === 'function') {
            displayCategoriesWithFirstEpisode();
        }
    }
});