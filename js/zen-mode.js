// zen-mode.js
// -------------------------------------------------------------------------------------------
// Toggle the sidebar navs via the { } button.
//
// Two things need JS instead of a plain CSS transition:
//
// 1. .main-section's width. It's flex:1 (flex-basis:0%), and a flex item's `width` is
//    ignored by the layout algorithm whenever flex-basis is a definite value like that -
//    the rendered size comes purely from flex-grow/shrink vs. available space, which keeps
//    being live-recomputed as nav's own flex-basis transitions. So merely setting an inline
//    `width` controls nothing on its own. The fix: measure the true first/last width
//    (below), then for the duration of the tween only, switch main-section to flex:none
//    and max-width:none so our explicit width is actually authoritative - restoring both
//    once the tween completes, at which point the measured target already matches what
//    flex:1 + max-width would compute anyway, so nothing jumps on handoff.
//
//    To find the true "last" width without it visibly jumping there first, we briefly
//    disable transitions on main-section/leftNav/rightNav, apply the real target classes,
//    measure the now-instant result, then roll the classes back off before anyone sees it,
//    and re-enable transitions - so the *real* toggle right after is what actually fires
//    nav's own flex-basis/opacity/transform transitions.
//
// 2. #side-links' collapse height. scrollHeight reports an element's full content height
//    even while it's clipped by overflow:hidden, so unlike main-section's width, no
//    measure-and-roll-back dance is needed here to find the *open* target - it's always
//    available and always current, which is what makes it robust to links being
//    added/removed later (a hardcoded max-height guess isn't). The *collapsed* target (0)
//    needs no measuring at all - it's a static invariant in CSS (#side-links.hiding), true
//    the moment the class is present even if this code never ran (e.g. zen mode entered at
//    desktop width, where #side-links is display:none, then the viewport resized down).
//
// Both tweens read their duration from --zen-collapse-duration (main-styles.css) rather
// than hardcoding one, so JS and CSS can't drift out of sync.
// -------------------------------------------------------------------------------------------

function getZenCollapseDuration() {
    const raw = getComputedStyle(document.documentElement)
        .getPropertyValue('--zen-collapse-duration')
        .trim();
    const value = parseFloat(raw);
    if (Number.isNaN(value)) return 300; // fallback if the custom property is ever missing
    return raw.endsWith('ms') ? value : value * 1000;
}

// Tweens a single CSS property (e.g. 'width', 'max-height') on `el` from `from` to `to`
// (px) over `duration` ms. `extraTransition`, if given, is appended so e.g. opacity can
// ride along; `onComplete`, if given, runs after cleanup. Uses setProperty/removeProperty
// rather than el.style[prop] so kebab-case property names (max-height) work the same as
// camelCase-matching ones (width).
function animateSize(el, prop, from, to, duration, extraTransition, onComplete) {
    // Cancel any tween already in flight on this element/property so rapid re-toggling
    // can't leave a stale transitionend listener around or clobber the new target.
    if (el._zenCleanup) {
        el.removeEventListener('transitionend', el._zenCleanup);
        el._zenCleanup = null;
    }

    el.style.transition = 'none';
    el.style.setProperty(prop, from + 'px');
    void el.offsetWidth; // force the from-value to register before animating
    el.style.transition = extraTransition
        ? `${prop} ${duration}ms ease, ${extraTransition}`
        : `${prop} ${duration}ms ease`;
    el.style.setProperty(prop, to + 'px');

    const cleanup = (e) => {
        if (e.propertyName !== prop) return;
        el.style.transition = '';
        // Leave a collapsed element pinned at 0 rather than releasing it back to auto -
        // that's what keeps it collapsed across a resize. Only release the inline size
        // once we've actually opened back up.
        if (to !== 0) el.style.removeProperty(prop);
        el.removeEventListener('transitionend', cleanup);
        el._zenCleanup = null;
        if (onComplete) onComplete();
    };
    el._zenCleanup = cleanup;
    el.addEventListener('transitionend', cleanup);
}

function toggleSidebars() {
    const button = document.getElementById('toggle-sidebars');
    const container = document.querySelector('.container');
    const mainSection = document.querySelector('.main-section');
    const leftNav = document.getElementById('leftNav');
    const rightNav = document.getElementById('rightNav');
    const sideLinks = document.getElementById('side-links');

    // Defensively clear any inline overrides an interrupted previous tween might have left
    // on main-section, so the measurement below reflects normal CSS-driven sizing rather
    // than a stale flex:none/max-width:none/width from a rapid re-click mid-animation.
    if (mainSection._zenCleanup) {
        mainSection.removeEventListener('transitionend', mainSection._zenCleanup);
        mainSection._zenCleanup = null;
    }
    mainSection.style.transition = '';
    mainSection.style.flex = '';
    mainSection.style.maxWidth = '';
    mainSection.style.width = '';

    const currentlyHidden = leftNav.classList.contains('hiding');
    const entering = !currentlyHidden; // true == about to collapse into zen mode
    const duration = getZenCollapseDuration();

    // ---- .main-section width: measure true first/last, then animate directly ----------
    const firstWidth = mainSection.getBoundingClientRect().width;
    const flipEls = [mainSection, leftNav, rightNav];

    flipEls.forEach(el => { el.style.transition = 'none'; });

    container.classList.toggle('zen', entering);
    leftNav.classList.toggle('hiding', entering);
    rightNav.classList.toggle('hiding', entering);
    void mainSection.offsetWidth; // commit the (instant, transition-free) target layout
    const lastWidth = mainSection.getBoundingClientRect().width;

    container.classList.toggle('zen', !entering);
    leftNav.classList.toggle('hiding', !entering);
    rightNav.classList.toggle('hiding', !entering);
    void mainSection.offsetWidth; // commit the rollback before transitions come back
    flipEls.forEach(el => { el.style.transition = ''; });
    void mainSection.offsetWidth; // commit "transitions live again, still rolled back"

    // Real toggle - nav's own opacity/transform/flex-basis transitions run normally here.
    container.classList.toggle('zen', entering);
    leftNav.classList.toggle('hiding', entering);
    rightNav.classList.toggle('hiding', entering);

    // main-section is flex:1 (flex-basis:0%), and a flex item's `width` is ignored by the
    // layout algorithm whenever flex-basis is a definite value like this - the rendered
    // size comes purely from flex-grow/shrink vs. available space, live-recomputed every
    // frame as nav's own flex-basis transitions. So our width tween below controls nothing
    // unless flex-grow/shrink are switched off for its duration. max-width needs the same
    // treatment: it's an instant (untransitioned) class-based clamp, so if it's still
    // active it would clip our tween's own start value before the first frame. Both get
    // handed back to CSS once the tween completes, at which point lastWidth already
    // matches what flex:1 + max-width would compute anyway, so nothing jumps.
    mainSection.style.flex = 'none';
    mainSection.style.maxWidth = 'none';
    animateSize(mainSection, 'width', firstWidth, lastWidth, duration, undefined, () => {
        mainSection.style.flex = '';
        mainSection.style.maxWidth = '';
    });

    // ---- #side-links max-height: scrollHeight is always the real "open" target --------
    const sideLinksVisible = getComputedStyle(sideLinks).display !== 'none';
    const fromHeight = sideLinksVisible ? sideLinks.getBoundingClientRect().height : 0;

    sideLinks.classList.toggle('hiding', entering);

    if (sideLinksVisible) {
        const toHeight = entering ? 0 : sideLinks.scrollHeight;
        animateSize(sideLinks, 'max-height', fromHeight, toHeight, duration, 'opacity 0.25s ease');
    }

    // Button flip animation
    button.classList.add('flipping');
    setTimeout(() => {
        button.textContent = entering ? '}{' : '{ }';
        button.classList.remove('flipping');
    }, 150);
}

document.addEventListener('DOMContentLoaded', function () {
    // -------------------------------------------------------------------------------------------
    // Wire up the { } sidebar toggle button.
    // -------------------------------------------------------------------------------------------
    document
        .getElementById("toggle-sidebars")
        .addEventListener('click', toggleSidebars);
});