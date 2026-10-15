const products = [
 {id:1,name:"Fresh Pechay",category:"Vegetables",price:35,unit:"bunch",farmer:"Juan Dela Cruz",origin:"Calapan, Oriental Mindoro",tag:"Freshly picked",emoji:"🥬",image:"https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=700&q=85"},
 {id:2,name:"Sweet Carabao Mangoes",category:"Fruits",price:120,unit:"kg",farmer:"Maria Santos",origin:"Victoria, Oriental Mindoro",tag:"Seasonal favorite",emoji:"🥭",image:"https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=700&q=85"},
 {id:3,name:"Organic Tomatoes",category:"Vegetables",price:65,unit:"kg",farmer:"Pedro Ramos",origin:"Naujan, Oriental Mindoro",tag:"Farm fresh",emoji:"🍅",image:"https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=700&q=85"},
 {id:4,name:"Brown Rice",category:"Rice & Grains",price:58,unit:"kg",farmer:"Juan Dela Cruz",origin:"Calapan, Oriental Mindoro",tag:"Locally milled",emoji:"🌾",image:"https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=85"},
 {id:5,name:"Sweet Lakatan Banana",category:"Fruits",price:75,unit:"saba bundle",farmer:"Maria Santos",origin:"Victoria, Oriental Mindoro",tag:"Naturally sweet",emoji:"🍌",image:"https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=700&q=85"},
 {id:6,name:"Fresh Eggplant",category:"Vegetables",price:48,unit:"kg",farmer:"Pedro Ramos",origin:"Naujan, Oriental Mindoro",tag:"Harvest today",emoji:"🍆",image:"https://images.unsplash.com/photo-1659261200845-bf9b2d70a6b0?auto=format&fit=crop&w=700&q=85"},
 {id:7,name:"Red Onions",category:"Vegetables",price:95,unit:"kg",farmer:"Juan Dela Cruz",origin:"Calapan, Oriental Mindoro",tag:"Kitchen essential",emoji:"🧅",image:"https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=700&q=85"},
 {id:8,name:"Fresh Pineapple",category:"Fruits",price:85,unit:"piece",farmer:"Maria Santos",origin:"Victoria, Oriental Mindoro",tag:"Sweet & juicy",emoji:"🍍",image:"https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=700&q=85"}
];
let cart = {};
let selectedCategory = "All";
let searchText = "";
const peso = n => "₱" + Number(n).toLocaleString("en-PH",{maximumFractionDigits:2});
const grid = document.getElementById("productGrid");
const toast = document.getElementById("toast");
let toastTimer;
function notify(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2400)}
function renderProducts(){
 const filtered=products.filter(p=>(selectedCategory==="All"||p.category===selectedCategory)&&`${p.name} ${p.category} ${p.farmer} ${p.origin}`.toLowerCase().includes(searchText.toLowerCase()));
 document.getElementById("resultsLabel").textContent=searchText?`${filtered.length} result${filtered.length===1?"":"s"} found`:selectedCategory==="All"?"Fresh picks for you":selectedCategory;
 grid.innerHTML=filtered.length?filtered.map(p=>`<article class="product-card"><div class="product-photo"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.parentElement.style.background='#e8eee3';this.parentElement.insertAdjacentHTML('beforeend','<span style=&quot;display:grid;place-items:center;height:100%;font-size:55px&quot;>${p.emoji}</span>')"><span class="product-tag">${p.tag}</span></div><div class="product-body"><div class="product-farmer"><span>♧</span> ${p.farmer}</div><h3 class="product-name">${p.name}</h3><div class="product-origin">⌖ ${p.origin}</div><div class="product-bottom"><div class="product-price">${peso(p.price)} <small>/ ${p.unit}</small></div><button class="add-button" aria-label="Add ${p.name} to basket" data-add="${p.id}">+</button></div></div></article>`).join(""):`<div class="empty-state"><strong>No produce found just yet.</strong>Try another search or category.</div>`;
 grid.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>addToCart(Number(b.dataset.add))));
}
function addToCart(id){cart[id]=(cart[id]||0)+1;updateCartCount();notify(`${products.find(p=>p.id===id).name} added to your basket`)}
function updateCartCount(){document.getElementById("cartCount").textContent=Object.values(cart).reduce((a,b)=>a+b,0)}
function renderCart(){
 const items=Object.entries(cart).filter(([,q])=>q>0).map(([id,q])=>({product:products.find(p=>p.id===Number(id)),q:Number(q)}));
 const holder=document.getElementById("cartItems");
 holder.innerHTML=items.length?items.map(({product:p,q})=>`<div class="cart-item"><img src="${p.image}" alt="" onerror="this.style.visibility='hidden'"><div><strong>${p.name}</strong><small>${peso(p.price)} / ${p.unit}</small></div><div class="quantity-control"><button data-qty="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button><b>${q}</b><button data-qty="${p.id}" data-delta="1" aria-label="Increase quantity">+</button></div></div>`).join(""):`<div class="cart-empty">Your basket is ready for something fresh. 🥬<br><br>Add produce from the marketplace to get started.</div>`;
 holder.querySelectorAll("[data-qty]").forEach(b=>b.addEventListener("click",()=>{const id=Number(b.dataset.qty);cart[id]=(cart[id]||0)+Number(b.dataset.delta);if(cart[id]<=0)delete cart[id];updateCartCount();renderCart()}));
 const subtotal=items.reduce((sum,{product:p,q})=>sum+p.price*q,0);
 document.getElementById("cartSubtotal").textContent=peso(subtotal);
 document.getElementById("cartTotal").textContent=peso(subtotal);
 document.getElementById("cartFarmerShare").textContent=peso(subtotal*.9);
}
document.getElementById("searchInput").addEventListener("input",e=>{searchText=e.target.value;renderProducts()});
document.querySelectorAll(".category").forEach(b=>b.addEventListener("click",()=>{selectedCategory=b.dataset.category;document.querySelectorAll(".category").forEach(x=>x.classList.toggle("active",x===b));renderProducts()}));
document.getElementById("cartButton").addEventListener("click",()=>{renderCart();document.getElementById("cartDialog").showModal()});
document.getElementById("checkoutButton").addEventListener("click",()=>{if(!Object.keys(cart).length){notify("Your basket is empty.");return}notify("Demo checkout only — connect a secure backend to accept orders.");document.getElementById("cartDialog").close()});
document.getElementById("farmerInfoButton").addEventListener("click",()=>document.getElementById("farmerDialog").showModal());
document.getElementById("applyButton").addEventListener("click",()=>{document.getElementById("farmerDialog").close();notify("Farmer registration will be connected in the full version.")});
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>document.getElementById(b.dataset.close).close()));
const buyer=document.getElementById("buyerView"),admin=document.getElementById("adminView");
function showAdmin(on){buyer.classList.toggle("hidden",on);admin.classList.toggle("hidden",!on);document.getElementById("adminSwitch").innerHTML=on?"🛍 View marketplace":"▦ Admin dashboard";window.scrollTo({top:0,behavior:"smooth"})}
document.getElementById("adminSwitch").addEventListener("click",()=>showAdmin(buyer.classList.contains("hidden")));
document.getElementById("backToShop").addEventListener("click",()=>showAdmin(false));
const orders=[
 {id:"#AN-1048",customer:"Angela M.",items:"3 items",total:385,status:"Delivered"},
 {id:"#AN-1047",customer:"Mark R.",items:"2 items",total:178,status:"Processing"},
 {id:"#AN-1046",customer:"Jessa L.",items:"5 items",total:520,status:"Delivered"},
 {id:"#AN-1045",customer:"Paolo D.",items:"1 item",total:120,status:"Pending"},
 {id:"#AN-1044",customer:"Mika S.",items:"4 items",total:295,status:"Processing"}
];
function statusClass(s){return s.toLowerCase()}
function orderRows(all=false){return orders.slice(0,all?orders.length:4).map(o=>`<tr><td class="order-id">${o.id}</td><td>${o.customer}</td>${all?`<td>${o.items}</td>`:""}<td>${peso(o.total)}</td><td><span class="status ${statusClass(o.status)}">${o.status}</span></td></tr>`).join("")}
document.getElementById("recentOrders").innerHTML=orderRows();
document.getElementById("ordersTable").innerHTML=orderRows(true);
document.getElementById("productsTable").innerHTML=products.map(p=>`<tr><td><strong>${p.emoji} ${p.name}</strong></td><td>${p.category}</td><td>${peso(p.price)} / ${p.unit}</td><td>${p.farmer}</td><td><span class="status approved">In stock</span></td></tr>`).join("");
const topItems=[["🥭","Carabao Mangoes","34 orders","₱4,080"],["🥬","Fresh Pechay","29 orders","₱1,015"],["🌾","Brown Rice","24 orders","₱1,392"],["🍅","Organic Tomatoes","21 orders","₱1,365"]];
document.getElementById("topProducts").innerHTML=topItems.map(([emoji,name,orders,amount])=>`<div class="top-product"><div class="top-product-emoji">${emoji}</div><div><strong>${name}</strong><small>${orders}</small></div><b>${amount}</b></div>`).join("");
function activatePanel(panel){document.querySelectorAll(".admin-tab").forEach(b=>b.classList.toggle("active",b.dataset.panel===panel));document.querySelectorAll(".admin-panel").forEach(p=>p.classList.add("hidden"));document.getElementById("admin"+panel[0].toUpperCase()+panel.slice(1)).classList.remove("hidden")}
document.querySelectorAll(".admin-tab").forEach(b=>b.addEventListener("click",()=>activatePanel(b.dataset.panel)));
document.querySelectorAll("[data-open-panel]").forEach(b=>b.addEventListener("click",()=>activatePanel(b.dataset.openPanel)));
document.getElementById("addProductButton").addEventListener("click",()=>notify("Product creation form can be connected to the backend next."));
renderProducts();