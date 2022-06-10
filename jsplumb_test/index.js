var instance = jsPlumbBrowserUI.newInstance({
  container: document.getElementById('plumb'),
  // connectionsDetachable: true,
});


for(i=0; i<2000; i++){
  e = document.createElement('div');
  e.classList.add("element");
  e.id = 'el-'+ i;
  e.style = 'top: '+ i*3 + 'px; right';
  document.getElementById('plumb').append(e);
  instance.addEndpoint(e, {source: true, target:true, endpoint: "Dot"});
}