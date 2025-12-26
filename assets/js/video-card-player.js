// ============================================
// VIDEO CARD PLAYER - FULLSCREEN & PIP SUPPORT
// ============================================

class VideoCardPlayer {
    constructor(videoElement, options = {}) {
        this.videoElement = videoElement;
        this.container = videoElement.closest('.video-card-player');
        this.videoId = videoElement.dataset.videoId;
        this.source = videoElement.dataset.source || 'youtube';
        this.enableFullscreen = options.enableFullscreen !== false;
        this.enablePiP = options.enablePiP !== false;
        
        this.init();
    }

    init() {
        this.createControls();
        this.attachEventListeners();
    }

    createControls() {
        const controlsHTML = `
            <div class="video-controls">
                <div class="video-controls-left">
                    <button class="video-btn play-pause" title="Play/Pause">
                        <i class="fas fa-play"></i>
                    </button>
                    <div class="video-time">
                        <span class="current-time">0:00</span>
                        <span>/</span>
                        <span class="duration">0:00</span>
                    </div>
                </div>
                
                <div class="video-controls-center">
                    <div class="progress-bar">
                        <div class="progress-filled"></div>
                        <div class="progress-buffer"></div>
                    </div>
                </div>
                
                <div class="video-controls-right">
                    <button class="video-btn volume-btn" title="Mute/Unmute">
                        <i class="fas fa-volume-up"></i>
                    </button>
                    <input type="range" class="volume-slider" min="0" max="100" value="100">
                    ${this.enablePiP ? `
                    <button class="video-btn pip-btn" title="Picture-in-Picture">
                        <i class="fas fa-clone"></i>
                    </button>` : ''}
                    ${this.enableFullscreen ? `
                    <button class="video-btn fullscreen-btn" title="Fullscreen">
                        <i class="fas fa-expand"></i>
                    </button>` : ''}
                </div>
            </div>
        `;

        if (!this.container.querySelector('.video-controls')) {
            this.container.insertAdjacentHTML('beforeend', controlsHTML);
        }
    }

    attachEventListeners() {
        const playPauseBtn = this.container.querySelector('.play-pause');
        const fullscreenBtn = this.container.querySelector('.fullscreen-btn');
        const pipBtn = this.container.querySelector('.pip-btn');
        const volumeBtn = this.container.querySelector('.volume-btn');
        const volumeSlider = this.container.querySelector('.volume-slider');
        const progressBar = this.container.querySelector('.progress-bar');

        // For YouTube iframes, we need different handling
        if (this.source === 'youtube') {
            this.initYouTubePlayer();
        } else if (this.source === 'instagram') {
            this.initInstagramPlayer();
        }

        // Fullscreen
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }

        // Picture-in-Picture
        if (pipBtn) {
            pipBtn.addEventListener('click', () => this.togglePiP());
        }

        // Click on video to play/pause
        this.videoElement.addEventListener('click', () => {
            if (this.source === 'youtube' && this.player) {
                const state = this.player.getPlayerState();
                if (state === 1) { // Playing
                    this.player.pauseVideo();
                } else {
                    this.player.playVideo();
                }
            }
        });
    }

    initYouTubePlayer() {
        // Load YouTube IFrame API if not already loaded
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = () => {
                this.createYouTubePlayer();
            };
        } else {
            this.createYouTubePlayer();
        }
    }

    createYouTubePlayer() {
        const iframe = this.container.querySelector('iframe');
        if (!iframe) return;

        this.player = new YT.Player(iframe, {
            events: {
                'onReady': (event) => {
                    this.onPlayerReady(event);
                },
                'onStateChange': (event) => {
                    this.onPlayerStateChange(event);
                }
            }
        });
    }

    onPlayerReady(event) {
        console.log('YouTube player ready');
        // Update duration
        const duration = this.player.getDuration();
        const durationEl = this.container.querySelector('.duration');
        if (durationEl) {
            durationEl.textContent = this.formatTime(duration);
        }
    }

    onPlayerStateChange(event) {
        const playPauseBtn = this.container.querySelector('.play-pause i');
        if (event.data === YT.PlayerState.PLAYING) {
            playPauseBtn.className = 'fas fa-pause';
            this.startProgressUpdate();
        } else {
            playPauseBtn.className = 'fas fa-play';
            this.stopProgressUpdate();
        }
    }

    startProgressUpdate() {
        if (this.progressInterval) return;
        
        this.progressInterval = setInterval(() => {
            if (this.player && this.player.getCurrentTime) {
                const currentTime = this.player.getCurrentTime();
                const duration = this.player.getDuration();
                
                const currentTimeEl = this.container.querySelector('.current-time');
                const progressFilled = this.container.querySelector('.progress-filled');
                
                if (currentTimeEl) {
                    currentTimeEl.textContent = this.formatTime(currentTime);
                }
                
                if (progressFilled && duration) {
                    const percentage = (currentTime / duration) * 100;
                    progressFilled.style.width = percentage + '%';
                }
            }
        }, 1000);
    }

    stopProgressUpdate() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    initInstagramPlayer() {
        // Instagram embeds auto-play with sound muted
        console.log('Instagram player initialized');
    }

    toggleFullscreen() {
        if (!this.enableFullscreen) return;

        if (!document.fullscreenElement) {
            this.container.requestFullscreen().catch(err => {
                console.error('Fullscreen error:', err);
            });
            this.container.querySelector('.fullscreen-btn i').className = 'fas fa-compress';
        } else {
            document.exitFullscreen();
            this.container.querySelector('.fullscreen-btn i').className = 'fas fa-expand';
        }
    }

    async togglePiP() {
        if (!this.enablePiP) return;

        // For YouTube, we need to get the video element from iframe (not directly accessible)
        // We'll use the native PiP API which works with video elements
        
        const videoEl = this.videoElement.querySelector('video');
        if (!videoEl) {
            console.warn('Picture-in-Picture not available for this video type');
            return;
        }

        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else {
                await videoEl.requestPictureInPicture();
            }
        } catch (error) {
            console.error('PiP error:', error);
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize all video card players on page load
document.addEventListener('DOMContentLoaded', () => {
    const videoCards = document.querySelectorAll('.video-card-player');
    videoCards.forEach(card => {
        const videoElement = card.querySelector('.video-player-frame');
        if (videoElement) {
            new VideoCardPlayer(videoElement, {
                enableFullscreen: card.dataset.fullscreen !== 'false',
                enablePiP: card.dataset.pip !== 'false'
            });
        }
    });
});

// Export for use in other scripts
window.VideoCardPlayer = VideoCardPlayer;
