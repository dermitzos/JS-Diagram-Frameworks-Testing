var container = document.getElementById('plumb');

var instance = jsPlumbBrowserUI.newInstance({
  container: container,
  // connectionsDetachable: true,
});

var element_template = `
<div class="html-element" data-state="done">
  <label data-attribute="header" class="html-element-header">Task</label>
  <label class="html-element-label">
    Name
    <input data-attribute="name" placeholder="Name" class="html-element-field" style="pointer-events: auto;">
  </label>
  <label class="html-element-label">
    Resource
    <select data-attribute="resource" class="html-element-field" style="pointer-events: auto;">
      <option value="" disabled="disabled">Resource</option>
      <option value="john">John</option>
      <option value="mary">Mary</option>
      <option value="bob">Bob</option>
    </select>
  </label>
</div>
`

function htmlToElement(html) {
  var template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

let e = htmlToElement(element_template);
e.id = 'el-0';
e.style = 'position: absolute; top: 0px; left: 0px;';
container.append(e);
instance.addEndpoint(e, {source: true, target: true, endpoint: "Dot"});

elements = [e]

for(i=1; i<2000; i++){
  e = htmlToElement(element_template);
  e.id = 'el-'+ i;
  var top_style = Math.floor(i/220) * 280;
  var left_style = (i%220)*282;
  e.style = 'position: absolute; top: '+ top_style + 'px; left: ' + left_style + 'px';
  container.append(e);
  elements.push(e);
  instance.addEndpoint(e, {source: true, target:true, endpoint: "Dot"});
  instance.connect({
    source: elements[i-1],
    target: elements[i],
    connector: 'Straight'
  });
}