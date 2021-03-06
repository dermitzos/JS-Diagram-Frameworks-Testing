(function(joint, V) {

    var noElements = 100;
    var elementsPerRow = 20;
    const elementDistance = 30;
    $('#elementNumber').val(noElements);
    $('#elPerRow').val(elementsPerRow);
    // Notes:
    // - Currently, there is no support for z-indexes on HTML Elements
    // - It's not possible to export the diagram into PNG/SVG on the client-side
    // - Do not use CSS background on the root HTML element when using ports

    var graph = new joint.dia.Graph;
    var paper = new joint.dia.Paper({
        el: document.getElementById('paper'),
        width: elementsPerRow * (250+elementDistance),
        height: noElements/elementsPerRow * (228+elementDistance) + 200,
        model: graph,
        async: true,
        frozen: true,
        sorting: joint.dia.Paper.sorting.NONE,
        guard: function(evt) {
            var inputs = ['INPUT', 'SELECT', 'TEXTAREA'];
            return inputs.indexOf(evt.target.tagName.toUpperCase()) > -1;
        }
    });

    // Container for all HTML views inside paper
    var htmlContainer = document.createElement('div');
    htmlContainer.style.pointerEvents = 'none';
    htmlContainer.style.position = 'absolute';
    htmlContainer.style.inset = '0';
    paper.el.appendChild(htmlContainer);
    paper.htmlContainer = htmlContainer;

    paper.on('scale translate', function() {
        // Update the transformation of all JointJS HTML Elements
        var htmlContainer = this.htmlContainer;
        htmlContainer.style.transformOrigin = '0 0';
        htmlContainer.style.transform = V.matrixToTransformString(this.matrix());
    });

    paper.on('blank:pointerdown cell:pointerdown', function() {
        document.activeElement.blur();
    });


    var el1 = new joint.shapes.html.Element({
        position: { x: 0, y: 0 },
        fields: {
            name: 'Create Story',
            resource: 'bob',
            state: 'done'
        }
    });

    var el2 = new joint.shapes.html.Element({
        position: { x: 298, y: 150 },
        fields: {
            name: 'Promote',
            resource: 'mary'
        }
    });

    var el3 = new joint.shapes.html.Element({
        position: { x: 580, y: 150 },
        fields: {
            name: 'Measure',
            resource: 'john',
            state: 'at-risk'
        }
    });
    var portIn = {
        position: {
            name: 'left'
        },
        attrs: {
            portBody: {
                magnet: true,
                width: 16,
                height: 16,
                x: -8,
                y: -8,
                fill: '#000000'
            }
        },
        label: {
            position: {
                name: 'left',
                args: { y:6}
            },
            markup: [{
                tagName: 'text',
                selector: 'label',
                className: 'label-text'
            }],
        },
        markup: [{
            tagName: 'rect',
            selector: 'portBody'
        }]
    }
    var portOut = {
        position: {
            name: 'right'
        },
        attrs: {
            portBody: {
                magnet: true,
                width: 16,
                height: 16,
                x: -8,
                y: -8,
                fill: '#000000'
            }
        },
        label: {
            position: {
                name: 'right',
                args: { y:6}
            },
            markup: [{
                tagName: 'text',
                selector: 'label',
                className: 'label-text'
            }],
        },
        markup: [{
            tagName: 'rect',
            selector: 'portBody'
        }]
    }
    function createCells() {
        paper.freeze()
        cells = [el1];
        links = [];
        for (let i = 1; i<noElements; i++){
            let el = new joint.shapes.html.Element({
                position: { x: (i%elementsPerRow)* (250 + elementDistance), y: Math.floor(i/elementsPerRow) * (228+elementDistance)},
                fields: {
                    name: 'Create Story',
                    resource: 'bob',
                    state: 'done'
                },
                ports: {
                    items: [portIn, portOut]
                }
            })
            cells.push(el);

            let li = new joint.shapes.standard.Link({
                source: { id: cells[i-1].id },
                target: { id: cells[i].id },
                attrs: {
                    line: {
                        stroke: '#464554'
                    }
                }
            });
            links.push(li);
        }

        graph.resetCells([...cells, ...links]);

        paper.unfreeze();
    }
    createCells();

    function resizePaper() {
        paper.setDimensions(elementsPerRow * (250+elementDistance), noElements/elementsPerRow * (228+elementDistance) + 200)
    }
    // Toolbar
    var zoomLevel = 1;

    document.getElementById('zoom-in').addEventListener('click', function() {
        zoomLevel = Math.min(3, zoomLevel + 0.2);
        var size = paper.getComputedSize();
        paper.translate(0,0);
        paper.scale(zoomLevel, zoomLevel, size.width / 2, size.height / 2);
    });

    document.getElementById('zoom-out').addEventListener('click', function() {
        zoomLevel = Math.max(0.2, zoomLevel - 0.2);
        var size = paper.getComputedSize();
        paper.translate(0,0);
        paper.scale(zoomLevel, zoomLevel, size.width / 2, size.height / 2);
    });

    document.getElementById('reset').addEventListener('click', function() {
        noElements = $('#elementNumber').val();
        elementsPerRow = $('#elPerRow').val();
        createCells();
        resizePaper();
    });
})(joint, V);
