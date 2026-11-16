(() => {
const products=[
  {id:'vista',name:'Vista 16 Studio',label:'Laptop · Phần cứng',groups:['hardware'],price:23990000,image:0,specs:'Core i7 · 16GB · SSD 512GB',inStock:true,desc:'Laptop 16 inch dành cho công việc đa nhiệm. Cấu hình minh họa gồm bộ nhớ 16 GB và SSD 512 GB.'},
  {id:'pulse',name:'Pulse 75',label:'Bàn phím · Phụ kiện',groups:['peripherals'],price:1890000,image:2,specs:'Cỡ 75% · Hot-swap',inStock:true,desc:'Bàn phím cơ bố cục 75%, giữ lại hàng phím chức năng và cụm phím điều hướng trong một thân máy gọn.'},
  {id:'hush',name:'Hush H1',label:'Tai nghe · Âm thanh',groups:['peripherals','audio'],price:1590000,image:1,specs:'Bluetooth chụp tai',inStock:false,desc:'Tai nghe chụp tai với đệm mềm và kết nối Bluetooth, dùng để nghe nhạc hoặc tham gia các cuộc họp.'},
  {id:'desk',name:'DeskSuite Pro',label:'Bản quyền · Phần mềm',groups:['software'],price:1290000,specs:'12 tháng · 1 thiết bị',inStock:true,desc:'Gói phần mềm văn phòng minh họa cho công việc với tài liệu, bảng tính và bản trình chiếu.'},
  {"id":"vista14","name":"Vista 14 Air","label":"Laptop · Phần cứng","groups":["hardware"],"price":16990000,"specs":"Core i5 · 16GB · SSD 512GB","inStock":true,"artIcon":"laptop"},
  {"id":"pixel24","name":"PixelView 24","label":"Màn hình · Phần cứng","groups":["hardware"],"price":3290000,"specs":"24 inch · IPS · 100Hz","inStock":true,"artIcon":"monitor"},
  {"id":"pixel27","name":"PixelView 27 QHD","label":"Màn hình · Phần cứng","groups":["hardware"],"price":5690000,"specs":"27 inch · QHD · 165Hz","inStock":true,"artIcon":"monitor"},
  {"id":"swift1","name":"SwiftDrive 1TB","label":"Lưu trữ · Phần cứng","groups":["hardware"],"price":1890000,"specs":"SSD NVMe · PCIe 4.0","inStock":true,"artIcon":"storage"},
  {"id":"mesh6","name":"LinkMesh AX1800","label":"Thiết bị mạng · Phần cứng","groups":["hardware"],"price":1490000,"specs":"Wi-Fi 6 · Hai băng tần","inStock":true,"artIcon":"router"},
  {"id":"pulse98","name":"Pulse 98","label":"Bàn phím · Phụ kiện","groups":["peripherals"],"price":2190000,"specs":"Cỡ 98% · Hot-swap","inStock":true,"artIcon":"keyboard"},
  {"id":"glide","name":"Glide M2","label":"Chuột · Phụ kiện","groups":["peripherals"],"price":590000,"specs":"Không dây · 2.4 GHz","inStock":true,"artIcon":"mouse"},
  {"id":"dock7","name":"DockLink 7","label":"Hub · Phụ kiện","groups":["peripherals"],"price":890000,"specs":"USB-C · HDMI · 7 cổng","inStock":false,"artIcon":"router"},
  {"id":"hushmini","name":"Hush Mini","label":"Tai nghe · Âm thanh","groups":["audio"],"price":790000,"specs":"Bluetooth · Tai nghe nhét tai","inStock":true,"artIcon":"audio"},
  {"id":"echo","name":"Echo Bar S","label":"Loa · Âm thanh","groups":["audio"],"price":1390000,"specs":"Loa 2.0 · Bluetooth","inStock":true,"artIcon":"audio"},
  {"id":"deskhome","name":"DeskSuite Home","label":"Bản quyền · Phần mềm","groups":["software"],"price":690000,"specs":"12 tháng · Dùng cá nhân","inStock":true,"artIcon":"code"},
  {"id":"safework","name":"SafeWork Endpoint","label":"Bản quyền · Phần mềm","groups":["software"],"price":990000,"specs":"Bảo mật thiết bị · 12 tháng","inStock":true,"artIcon":"shield"}
];
const extraVariants = {
  vista: [
    {id:'vista-32',sku:'FN-VISTA16-32-1TB',specs:'Core i7 · 32 GB RAM · SSD 1 TB',price:26990000,limit:4},
    {id:'vista-32-silver',sku:'FN-VISTA16-32-SLV',specs:'Core i7 · 32 GB RAM · SSD 1 TB · Bạc',price:27490000,limit:0}
  ]
};

function variantsFor(item){
  const base = {id:item.id,sku:item.id === 'vista' ? 'FN-VISTA16-16-512' : 'FN-' + item.id.toUpperCase(),
    specs:item.specs,price:item.price,limit:item.inStock ? 8 : 0};
  return [base,...(extraVariants[item.id] || [])];
}

function cartItem(id){
  const parent = products.find(item=>item.id === id || extraVariants[item.id]?.some(variant=>variant.id === id));
  if(!parent) return null;
  const variant = variantsFor(parent).find(variant=>variant.id === id);
  return {...parent,...variant,productId:parent.id};
}

const cancelKey = 'flowfn.orders.cancelled.v1';
const checkoutPrefix = 'flowfn.checkout.demo.';
const at = (d)=>new Date(d + 'T10:00:00+07:00').getTime();
const sampleOrders = [
  {number:'FN-261105-0042',createdAt:at('2026-11-05'),status:'Chờ xác nhận',payment:'paid',lines:[{id:'vista',price:23990000,quantity:1},{id:'pulse',price:1890000,quantity:2}]},
  {number:'FN-261102-0038',createdAt:at('2026-11-02'),status:'Đã xác nhận',payment:'paid',lines:[{id:'pulse',price:1890000,quantity:1}]},
  {number:'FN-261030-0033',createdAt:at('2026-10-30'),status:'Đang giao',payment:'paid',lines:[{id:'desk',price:1290000,quantity:1}]},
  {number:'FN-261028-0031',createdAt:at('2026-10-28'),status:'Hoàn tất',payment:'paid',lines:[{id:'hush',price:1590000,quantity:1}]},
  {number:'FN-261003-0009',createdAt:at('2026-10-03'),status:'Đã hủy',payment:'refunded',lines:[{id:'desk',price:1290000,quantity:1}]},
  {number:'FN-261010-0012',createdAt:at('2026-10-10'),status:'Hoàn tất',payment:'paid',lines:[{id:'pulse',price:1890000,quantity:1}]},
  {number:'FN-261008-0010',createdAt:at('2026-10-08'),status:'Hoàn tất',payment:'paid',lines:[{id:'vista',price:23990000,quantity:1}]},
  {number:'FN-260915-0003',createdAt:at('2026-09-15'),status:'Hoàn tất',payment:'paid',lines:[{id:'desk',price:1290000,quantity:1}]}
];
function markCancelled(number){
  const order = allOrders().find(item=>item.number === number);
  if(order?.status !== 'Chờ xác nhận') return false;
  const list = FlowFN.cancelledOrders();
  if(list.includes(number)) return false;
  try{
    window.sessionStorage.setItem(cancelKey,JSON.stringify([...list,number]));
    return true;
  }catch{return false;}
}
function checkoutOrders(){
  const found = [];
  try{
    for(let i = 0; i < window.sessionStorage.length; i++){
      const key = window.sessionStorage.key(i);
      if(!key || !key.startsWith(checkoutPrefix)) continue;
      const saved = JSON.parse(window.sessionStorage.getItem(key) || 'null');
      if(!saved || !/^FN-DEMO-[A-Z0-9]{1,13}$/.test(saved.number) || !Array.isArray(saved.lines) || !saved.lines.length) continue;
      const createdAt = saved.createdAt ?? parseInt(saved.number.slice(8),36);
      if(!Number.isSafeInteger(createdAt) || createdAt < 1) continue;
      const payments = Array.isArray(saved.payments) ? saved.payments : [];
      const paid = payments.includes('Thành công');
      const expired = !paid && Date.now() >= createdAt + FlowFN.paymentWindowMs;
      const last = payments[payments.length - 1];
      const payment = paid ? 'paid' : expired ? 'expired' : last === 'Thất bại' ? 'failed' : last === 'Đã hủy' ? 'cancelled' : 'pending';
      found.push({number:saved.number,createdAt,status:expired ? 'Đã hủy' : 'Chờ xác nhận',payment,attempt:key.slice(checkoutPrefix.length),lines:saved.lines,delivery:saved.delivery});
    }
  }catch{}
  return found;
}
function allOrders(){
  const done = FlowFN.cancelledOrders();
  return [...checkoutOrders(),...sampleOrders.map(order=>({...order}))].map(order=>{
    const lines = order.lines.map(line=>{
      if(!line || !Number.isSafeInteger(line.price) || line.price < 0 || !Number.isSafeInteger(line.quantity) || line.quantity < 1) return null;
      const item = cartItem(line.id);
      if(!item) return null;
      return {id:item.id,name:line.name || item.name,sku:line.sku || item.sku,price:line.price,quantity:line.quantity};
    }).filter(Boolean);
    const next = {...order,lines};
    next.total = lines.reduce((sum,line)=>sum + line.price * line.quantity,0);
    if(done.includes(order.number) && order.status === 'Chờ xác nhận'){
      next.status = 'Đã hủy';
      next.payment = order.payment === 'paid' ? 'refunded' : 'cancelled';
    }
    return next;
  }).filter(order=>order.lines.length).sort((a,b)=>b.createdAt - a.createdAt);
}

window.FlowFNOrders = { allOrders, markCancelled, cartItem };
})();
