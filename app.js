function toggleProc(id,btn){
  const el=document.getElementById(id);
  if(!el) return;
  const o=el.classList.toggle('open');
  btn.innerHTML=o?'Masquer la procédure −':'Voir la procédure <span>→</span>';
}
function fmt(n){return (+n).toLocaleString('fr-FR')+' €';}
function sim(){
  const mEl=document.getElementById('simMontant');
  if(!mEl) return;
  const m=+mEl.value;
  const t=document.getElementById('simType').value;
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  set('simVal',fmt(m)); set('heroAmount',fmt(m)); set('heroType',t);
  let d=(t.includes('Prêt')||t.includes('Crédit'))?'Taux 0% / préférentiel · Déblocage 24–48h ouvrées':(t.includes('Don')?'Remboursement : 0 € · Acte de don + paiement immédiat':(t.includes('Invest')?'Apport en capital · Comité Élan · Injection directe':'Remboursement : 0 € · Délai 24–48h'));
  set('simOut',fmt(m)); set('simDetail',d);
}
/* Pré-sélection inter-pages : offres -> demande.html?type=... */
function prefill(t){
  try{localStorage.setItem('vc_type',t);}catch(e){}
  location.href='demande.html?type='+encodeURIComponent(t);
}
function useSim(){
  const m=document.getElementById('simMontant').value;
  const t=document.getElementById('simType').value;
  const b=document.getElementById('simBank').value;
  try{localStorage.setItem('vc_sim',JSON.stringify({m,t,b}));}catch(e){}
  location.href='demande.html?montant='+encodeURIComponent(m)+'&type='+encodeURIComponent(t)+'&banque='+encodeURIComponent(b);
}
function toast(m){const t=document.getElementById('toast');if(!t)return;t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600);}
function submitForm(e){
  e.preventDefault();
  if(document.getElementById('fIban').value.replace(/\s/g,'').length<15){toast('Vérifiez votre IBAN / RIB');return false;}
  const ref='VC-2026-'+Math.floor(1000+Math.random()*9000);
  document.getElementById('refNum').textContent='N° Dossier : '+ref;
  document.getElementById('recap').textContent=document.getElementById('fPrenom').value+' '+document.getElementById('fNom').value+' · '+document.getElementById('fType').value+' · '+fmt(+document.getElementById('fMontant').value)+' · Réponse au '+document.getElementById('fTel').value;
  document.getElementById('formWrap').style.display='none';
  document.getElementById('successBox').classList.add('show');
  document.getElementById('successBox').scrollIntoView({behavior:'smooth',block:'center'});
  toast('Dossier '+ref+' transmis');
  return false;
}
/* Reprise auto des choix sur demande.html */
(function(){
  if(!location.pathname.endsWith('demande.html')) return;
  const q=new URLSearchParams(location.search);
  let type=q.get('type'), montant=q.get('montant'), banque=q.get('banque');
  try{
    if(!type) type=localStorage.getItem('vc_type');
    const s=JSON.parse(localStorage.getItem('vc_sim')||'null');
    if(s){montant=montant||s.m;type=type||s.t;banque=banque||s.b;}
  }catch(e){}
  addEventListener('DOMContentLoaded',()=>{
    if(type){const e=document.getElementById('fType');if(e)e.value=type;}
    if(montant){const e=document.getElementById('fMontant');if(e)e.value=montant;}
    if(banque){const e=document.getElementById('fBank');if(e)e.value=banque;}
    if(type||montant) toast('Choix repris depuis la page précédente');
  });
})();
/* Reveal on scroll + header + menu */
document.addEventListener('DOMContentLoaded',()=>{
  sim();
  const els=document.querySelectorAll('.card, .s, .tcard, .fi, .panel, .cta, section h2, section .sub');
  els.forEach((el,i)=>{el.classList.add('reveal');if(i%3===1)el.classList.add('reveal-d1');if(i%3===2)el.classList.add('reveal-d2');});
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  els.forEach(el=>io.observe(el));
  const hd=document.querySelector('header');
  addEventListener('scroll',()=>hd.classList.toggle('scrolled',scrollY>8),{passive:true});
  const links=document.getElementById('links');
  if(links) links.addEventListener('click',e=>{if(e.target.tagName==='A')links.classList.remove('open');});
  /* lien actif */
  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  document.querySelectorAll('.links a').forEach(a=>{
    if(a.getAttribute('href')===page) {a.style.color='var(--blue)';a.style.fontWeight='700';}
  });
});
function toggleMenu(){document.getElementById('links').classList.toggle('open');}
