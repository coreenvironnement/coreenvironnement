/**
 * Production helper. Host lottie_light.min.js locally (included, MIT).
 * Example:
 * import { initCorePreparation } from './animations.js';
 * const teardown = initCorePreparation(document.querySelector('.cp-section'), {
 *   assetBase:'/assets/core-preparation/',
 *   openEstimator: () => openExistingEstimator()
 * });
 * teardown() on route/component cleanup.
 */
let runtimePromise;
function loadLottie(base) {
  if (window.lottie) return Promise.resolve(window.lottie);
  if (!runtimePromise) runtimePromise = new Promise((resolve,reject) => {
    const script=document.createElement('script');
    script.src=base+'integration/lottie_light.min.js';
    script.onload=()=>resolve(window.lottie);
    script.onerror=()=>{runtimePromise=null;reject(new Error('Lottie runtime could not load'));};
    document.head.append(script);
  });
  return runtimePromise;
}
export function initCorePreparation(section, options={}) {
  if (!section) return ()=>{};
  const base=options.assetBase || '/assets/core-preparation/';
  const figures=[...section.querySelectorAll('[data-animation]')];
  const instances=new Map(); const pending=new Set();
  const abort=new AbortController(); const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let disposed=false;
  for (const button of section.querySelectorAll('[data-core-open-estimator]')) {
    button.addEventListener('click',()=>{
      if(typeof options.openEstimator==='function') options.openEstimator();
      else console.error('Connect this button to CORE’s existing estimator before shipping.');
    },{signal:abort.signal});
  }
  async function play(figure) {
    if(disposed || reduce.matches || instances.has(figure) || pending.has(figure)) return;
    pending.add(figure);
    try {
      const [lottie,data]=await Promise.all([
        loadLottie(base),fetch(base+'animations/'+figure.dataset.animation+'.json',{signal:abort.signal}).then(r=>{if(!r.ok)throw new Error('Animation unavailable');return r.json();})
      ]);
      if(disposed || reduce.matches) return;
      const instance=lottie.loadAnimation({container:figure.querySelector('.cp-lottie'),renderer:'svg',loop:false,autoplay:false,animationData:data,rendererSettings:{preserveAspectRatio:'xMidYMid meet'}});
      instances.set(figure,instance);
      instance.addEventListener('DOMLoaded',()=>{
        if(disposed || reduce.matches) return;
        figure.classList.add('is-ready'); instance.goToAndPlay(0,true);
      });
      instance.addEventListener('complete',()=>instance.goToAndStop(instance.totalFrames-1,true));
      instance.addEventListener('data_failed',()=>{figure.classList.remove('is-ready');instance.destroy();instances.delete(figure);});
    } catch { figure.classList.remove('is-ready'); }
    finally {pending.delete(figure);}
  }
  let observer;
  function observe() {
    if(reduce.matches) return;
    if(!('IntersectionObserver' in window)) {figures.forEach(play);return;}
    observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting) {observer.unobserve(entry.target);play(entry.target);}
    }),{threshold:.35});
    figures.filter(f=>!instances.has(f)).forEach(f=>observer.observe(f));
  }
  function motionChanged() {
    observer?.disconnect();
    if(reduce.matches) for(const [figure,instance] of instances) {
      instance.goToAndStop(instance.totalFrames-1,true);
      figure.classList.remove('is-ready');
    }
    else {
      // Reuse a finished animation when changing preferences, never replay it.
      for(const [figure,instance] of instances) {instance.goToAndStop(instance.totalFrames-1,true);figure.classList.add('is-ready');}
      observe();
    }
  }
  reduce.addEventListener('change',motionChanged);
  observe();
  return ()=>{
    disposed=true;abort.abort();observer?.disconnect();reduce.removeEventListener('change',motionChanged);
    for(const [figure,instance] of instances) {instance.destroy();figure.classList.remove('is-ready');}
    instances.clear();
  };
}
