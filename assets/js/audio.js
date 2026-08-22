document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('ambient-audio');
    const toggle = document.getElementById('audio-toggle');
    if (!audio || !toggle) return;

    const STORAGE_KEY = 'cegs-audio-muted';
    let isPlaying = false;
    let interactionFired = false;
    let fadeInterval = null;

    // Check user preference
    const userMuted = localStorage.getItem(STORAGE_KEY) === 'true';

    // Helper: Fade Audio
    const fadeAudio = (targetVolume, durationMs, onComplete) => {
        if (fadeInterval) clearInterval(fadeInterval);
        const startVolume = audio.volume;
        const change = targetVolume - startVolume;
        const steps = 30;
        const stepTime = Math.max(16, durationMs / steps); // Roughly 60fps
        let currentStep = 0;

        fadeInterval = setInterval(() => {
            currentStep++;
            let newVol = startVolume + (change * (currentStep / steps));
            // Clamp volume
            if (newVol < 0) newVol = 0;
            if (newVol > 1) newVol = 1;
            
            audio.volume = newVol;

            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                audio.volume = targetVolume;
                if (onComplete) onComplete();
            }
        }, stepTime);
    };

    const setPlayingState = (play) => {
        isPlaying = play;
        toggle.dataset.state = play ? "playing" : "muted";
        toggle.setAttribute('aria-label', play ? 'Mute ambient forest sound' : 'Unmute ambient forest sound');
        
        // Remove hint pulse once interacted with
        toggle.classList.remove('hint-active');
    };

    // 1. Attempt silent autoplay on load for buffering
    if (!userMuted) {
        audio.volume = 0;
        audio.play().catch(e => {
            console.log('Autoplay prevented, buffering deferred until interaction.', e);
        });
        
        // Add micro-hint pulse since it's the first time they might hear it
        toggle.classList.add('hint-active');
    }

    // 2. First Interaction logic
    const onFirstInteraction = () => {
        if (interactionFired || userMuted) return;
        interactionFired = true;

        // Try playing if it hasn't started yet
        audio.play().then(() => {
            setPlayingState(true);
            fadeAudio(1.0, 1500); // Smooth 1.5s fade up
        }).catch(e => {
            console.warn('Audio play failed on interaction:', e);
            // Fail silently as requested
        });

        // Cleanup listeners
        removeInteractionListeners();
    };

    const interactionEvents = ['scroll', 'click', 'touchstart', 'keydown'];
    
    const removeInteractionListeners = () => {
        interactionEvents.forEach(evt => {
            window.removeEventListener(evt, onFirstInteraction, { capture: true });
        });
    };

    if (!userMuted) {
        interactionEvents.forEach(evt => {
            window.addEventListener(evt, onFirstInteraction, { capture: true, once: true });
        });
    }

    // 3. Manual Toggle Handler
    toggle.addEventListener('click', (e) => {
        // Prevent click from immediately triggering the interaction listener and undoing the pause
        e.stopPropagation();
        interactionFired = true; 
        removeInteractionListeners();

        if (isPlaying) {
            // Mute it
            fadeAudio(0, 500, () => {
                audio.pause();
            });
            setPlayingState(false);
            localStorage.setItem(STORAGE_KEY, 'true');
        } else {
            // Unmute it
            localStorage.setItem(STORAGE_KEY, 'false');
            audio.play().then(() => {
                setPlayingState(true);
                fadeAudio(1.0, 1000);
            }).catch(e => {
                console.warn('Audio play failed on manual toggle:', e);
            });
        }
    });
});
