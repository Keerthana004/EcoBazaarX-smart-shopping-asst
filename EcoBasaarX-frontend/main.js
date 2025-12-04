// mock products
const products = [
  { id:1, name:'Organic Coffee 250g', price:249, ecoScore:88, carbonKg:0.9, img:'' },
  { id:2, name:'Reusable Bamboo Toothbrush', price:129, ecoScore:92, carbonKg:0.12, img:'' },
  { id:3, name:'Eco Laundry Powder', price:199, ecoScore:75, carbonKg:1.8, img:'' },
  { id:4, name:'Stainless Steel Bottle', price:499, ecoScore:95, carbonKg:0.45, img:'' },
  { id:5, name:'Plant-based Soap', price:99, ecoScore:82, carbonKg:0.32, img:'' },
  { id:6, name:'Compostable Bin Bags', price:179, ecoScore:71, carbonKg:1.2, img:'' },
  { id:7, name:'Recycled Paper Towels', price:149, ecoScore:68, carbonKg:2.3, img:'' },
  { id:8, name:'Zero-waste Shampoo Bar', price:219, ecoScore:90, carbonKg:0.25, img:'' }
];

const categories = ['All','Groceries','Personal Care','Home','Bottles','Cleaning'];

// render
const productGrid = document.getElementById('productGrid');
const categoryChips = document.getElementById('categoryChips');
const ecoFilter = document.getElementById('ecoFilter');
const ecoVal = document.getElementById('ecoVal');
const searchInput = document.getElementById('searchInput');
const cartCount = document.getElementById('cartCount');

let activeCategory = 'All';
let minEco = 0;
let cart = JSON.parse(localStorage.getItem('ecob_cart')||'[]');

function updateCartCount(){ cartCount.textContent = cart.length; }
updateCartCount();

function renderCategories(){
  categoryChips.innerHTML = '';
  categories.forEach(c=>{
    const el = document.createElement('button');
    el.className = 'chip' + (c===activeCategory ? ' active' : '');
    el.textContent = c;
    el.addEventListener('click', ()=>{ activeCategory = c; renderProducts(); renderCategories(); });
    categoryChips.appendChild(el);
  });
}

function renderProducts(){
  productGrid.innerHTML = '';
  const q = (searchInput && searchInput.value || '').toLowerCase();

  const filtered = products.filter(p=>{
    if (p.ecoScore < minEco) return false;
    if (activeCategory !== 'All') {
      // mock category membership: simple mapping rule
      if (activeCategory === 'Bottles' && !p.name.toLowerCase().includes('bottle')) return false;
      if (activeCategory === 'Personal Care' && !['toothbrush','soap','shampoo'].some(k=>p.name.toLowerCase().includes(k))) return false;
      if (activeCategory === 'Groceries' && !['coffee','powder'].some(k=>p.name.toLowerCase().includes(k))) return false;
    }
    if (q && !p.name.toLowerCase().includes(q)) return false;
    return true;
  });

  filtered.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-img">${p.img ? `<img src="${p.img}" alt="${p.name}" style="max-width:100%;height:100%;object-fit:cover;border-radius:8px">` : '<div style="font-weight:700;color:#9fbfb0">Image</div>'}</div>
      <div style="flex:1">
        <div class="product-title">${p.name}</div>
        <div class="product-meta">
          <div><strong>₹${p.price}</strong></div>
          <div class="eco-badge">${p.ecoScore}</div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
          <div style="color:var(--muted);font-size:13px">${p.carbonKg} kg CO₂</div>
          <div style="display:flex;gap:8px">
            <button class="btn outline btn-sm" onclick="addToCart(${p.id})">Add to cart</button>
          </div>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });

  if (filtered.length === 0) {
    productGrid.innerHTML = `<p style="grid-column:1/-1;color:var(--muted)">No products match your search/filter.</p>`;
  }
}

function addToCart(id){
  const item = products.find(p=>p.id===id);
  if (!item) return;
  cart.push({ id:item.id, name:item.name, price:item.price });
  localStorage.setItem('ecob_cart', JSON.stringify(cart));
  updateCartCount();
  // small toast
  const prev = document.querySelector('.toast');
  if (prev) prev.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = `${item.name} added to cart`;
  Object.assign(t.style,{position:'fixed',right:'18px',bottom:'18px',background:'#0f7a4f',color:'#fff',padding:'10px 14px',borderRadius:'8px',boxShadow:'0 8px 24px rgba(3,10,6,0.2)'});
  document.body.appendChild(t);
  setTimeout(()=> t.remove(),1800);
}

// search & filter handlers
if (ecoFilter) {
  ecoFilter.addEventListener('input', e=>{ minEco = +e.target.value; ecoVal.textContent = minEco; renderProducts(); });
}
if (searchInput) {
  searchInput.addEventListener('input', ()=> renderProducts());
}

// init
renderCategories();
renderProducts();
