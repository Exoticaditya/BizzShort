// Simple Instagram Reel Player - Clean controls with Play/Pause, Fullscreen, PIP
// Minimalist design focused on video playback

(function() {
    'use strict';

    // Simple Instagram player with iframe embed
    window.playInstagramReel = function (reelId, title) {
        if (!reelId) return;
        console.log('📸 Playing Instagram reel:', reelId);

        // Remove existing modal if any
        const existing = document.getElementById('videoModal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'videoModal';
        modal.className = 'video-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:100000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.95);';
        
        modal.innerHTML = `<div style="position:relative;width:90%;max-width:500px;">
            <div style="position:absolute;top:-55px;right:0;display:flex;gap:10px;">
                <button id="pipBtnInsta" onclick="enterInstaPIP('${reelId}', '${title}')" 
                        style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;padding:10px 20px;
                               border-radius:25px;cursor:pointer;font-size:14px;display:flex;align-items:center;gap:8px;" 
                        title="Picture-in-Picture Mode">
                    <i class="fas fa-external-link-alt"></i> PIP Mode
                </button>
                <button onclick="closeVideoModal()" 
                        style="background:#e74c3c;color:white;border:none;width:45px;height:45px;border-radius:50%;
                               cursor:pointer;font-size:24px;">×</button>
            </div>
            <div style="position:relative;padding-bottom:177.78%;height:0;background:#000;border-radius:12px;overflow:hidden;">
                <iframe id="instaIframe" 
                        src="https://www.instagram.com/reel/${reelId}/embed/" 
                        frameborder="0" 
                        scrolling="no" 
                        allowtransparency="true"
                        allowfullscreen="true"
                        allow="autoplay; fullscreen"
                        style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;"></iframe>
            </div>
            <div style="padding:15px;background:#1a1a2e;border-radius:0 0 12px 12px;color:white;">
                <h3 style="margin:0 0 8px 0;font-size:18px;">${title || 'Client Interview'}</h3>
                <p style="margin:0;opacity:0.7;font-size:14px;">
                    <i class="fab fa-instagram" style="color:#e4405f;"></i> @bizz_short | 
                    <i class="fas fa-expand"></i> Use fullscreen inside player
                </p>
            </div>
        </div>`;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Store current reel for PIP
        window.currentReelId = reelId;
        window.currentReelTitle = title;

        // Close on background click
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                window.closeVideoModal();
            }
        });
    };

    // Instagram PIP Mode
    window.enterInstaPIP = function(reelId, title) {
        if (!reelId) {
            reelId = window.currentReelId;
            title = window.currentReelTitle;
        }
        if (!reelId) return;

        // Create PIP player
        let pipPlayer = document.getElementById('pipPlayer');
        if (pipPlayer) pipPlayer.remove();

        pipPlayer = document.createElement('div');
        pipPlayer.id = 'pipPlayer';
        pipPlayer.style.cssText = 'position:fixed;bottom:20px;right:20px;width:320px;height:568px;z-index:99999;border-radius:12px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.5);background:#000;transition:all 0.3s ease;';
        pipPlayer.innerHTML = `
            <div style="position:relative;width:100%;height:100%;">
                <iframe src="https://www.instagram.com/reel/${reelId}/embed/" 
                        frameborder="0" 
                        scrolling="no" 
                        allowtransparency="true"
                        allowfullscreen="true"
                        allow="autoplay; fullscreen"
                        style="width:100%;height:100%;border:none;"></iframe>
                <div style="position:absolute;top:0;left:0;right:0;padding:8px;background:linear-gradient(to bottom,rgba(0,0,0,0.7),transparent);display:flex;justify-content:space-between;align-items:center;">
                    <span style="color:white;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:200px;">${title || 'Instagram Reel'}</span>
                    <button onclick="closePIP()" style="background:#e74c3c;color:white;border:none;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:16px;line-height:1;">×</button>
                </div>
                <button onclick="expandInstaPIP()" style="position:absolute;bottom:8px;left:8px;background:rgba(228,64,95,0.9);color:white;border:none;padding:5px 12px;border-radius:15px;cursor:pointer;font-size:11px;"><i class="fas fa-expand"></i></button>
            </div>
        `;
        document.body.appendChild(pipPlayer);

        // Close the modal
        closeVideoModal();

        console.log('📺 Instagram PIP mode activated');
    };

    window.expandInstaPIP = function() {
        if (window.currentReelId) {
            closePIP();
            playInstagramReel(window.currentReelId, window.currentReelTitle);
        }
    };

    console.log('✅ Simple Instagram Player loaded');
})();
