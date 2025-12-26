// Fetch real YouTube videos from @bizz_short channel
async function loadRealYouTubeVideos() {
    const videoGrid = document.querySelector('.videos-grid');
    if (!videoGrid) return;

    try {
        // Fetch from backend API first
        const response = await fetch('https://bizzshort.onrender.com/api/videos?source=youtube&limit=12');
        
        if (response.ok) {
            const videos = await response.json();
            renderYouTubeVideos(videos);
        } else {
            // Use fallback videos if API fails
            useFallbackVideos();
        }
    } catch (error) {
        console.error('Loading YouTube videos failed:', error);
        useFallbackVideos();
    }
}

function renderYouTubeVideos(videos) {
    const videoGrid = document.querySelector('.videos-grid');
    if (!videoGrid || !videos || videos.length === 0) return;

    videoGrid.innerHTML = videos.map(video => `
        <article class="video-card">
            <div class="video-wrapper">
                <a href="${video.url || `https://youtube.com/watch?v=${video.videoId}`}" target="_blank">
                    <img src="${video.thumbnail || video.image || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}" 
                         alt="${video.title}"
                         onerror="this.src='https://placehold.co/800x450/ff0000/ffffff?text=BizzShort+Video'">
                    <div class="play-button"><i class="fab fa-youtube"></i></div>
                </a>
            </div>
            <div class="video-content">
                <span class="video-badge">${video.category || 'BUSINESS NEWS'}</span>
                <h3>${video.title}</h3>
                <p>${video.excerpt || video.description || video.summary || 'Watch the latest business news and updates'}</p>
                <div class="video-meta">
                    <span><i class="fab fa-youtube"></i> @bizz_short</span>
                    <span><i class="far fa-eye"></i> ${video.views || '1.2K'} views</span>
                </div>
            </div>
        </article>
    `).join('');
}

function useFallbackVideos() {
    // Keep existing static videos as fallback
    console.log('Using fallback video content');
}

// Load videos when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadRealYouTubeVideos);
} else {
    loadRealYouTubeVideos();
}
