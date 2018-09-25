var Calculator = new Class({
  Implements: [Options],
  options: {
    drag: true,
    anchor: null,
    digits: 14
  },
  /**
   * @summary js n-digits calculator
   * @classdesc The class creates a simple calculator which may be rendered over the document or placed inside the given anchor element.
   * @constructs Calculator
   * @param {Object} options the options object
   * @param {Boolean} options.drag whether or not to set the calculator as draggable (drag works only if no anchor is provided), default true
   * @param {String|Element} options.anchor the calculator container, if null the calculator will be rendered on an absolute layer over the document, default null
   * @param {Number} options.digits the number of digits, default 14
   */
  initialize: function(options) {
    this.setOptions(options);
    this.render();
    this.addEvents();
    this.first_term = null;
    this.new_term = true;
    this.operation = null;
  },
  /**
   * @summary Gets the viewport coordinates of the current window (width, height, left offest, top offset, coordinates of the center point).
   * @return {Object} Viewport coordinates
   * @example
   *      // returned object
   *      {'width':width, 'height':height, 'left':left, 'top':top, 'cX':cX, 'cY':cY}
   */
  getViewport: function() {
     var document_coords = document.getCoordinates();
    var document_scroll = document.getScroll();
    var width = document_coords.width;
    var height = document_coords.height;
    var left = document_scroll.x;
    var top = document_scroll.y;
    var cX = document_coords.width / 2 + document_scroll.x;
    var cY = document_coords.height / 2 + document_scroll.y;
     return {'width': width, 'height': height, 'left': left, 'top': top, 'cX': cX, 'cY': cY};
   },
  /**
   * @summary Renders the calculator
   */
  render: function() {
    var table = new Element('table')
      .adopt(
        new Element('tr').adopt(
		  new Element('td.clear').set('text', 'CE'),
          new Element('td.null').set('text', ''),
          new Element('td.equal').set('text', 'ok'),
        ),
        new Element('tr').adopt(
          new Element('td.number').set('text', '7'),
          new Element('td.number').set('text', '8'),
          new Element('td.number').set('text', '9'),
        ),
        new Element('tr').adopt(
          new Element('td.number').set('text', '4'),
          new Element('td.number').set('text', '5'),
          new Element('td.number').set('text', '6'),
        ),
        new Element('tr').adopt(
          new Element('td.number').set('text', '1'),
          new Element('td.number').set('text', '2'),
          new Element('td.number').set('text', '3'),
        ),
        new Element('tr').adopt(
		  new Element('td.dot').set('text', '#'),
          new Element('td.number').set('text', '0'),
          new Element('td.dot').set('text', '*'),
        )
      );
      if(this.options.anchor) {
        this.container = new Element('div#calculator')
          .inject(document.id(this.options.anchor))
          .adopt(this.display = new Element('div#display').set('text', 0), table);
      }
      else {
        var vp = this.getViewport();
        this.container = new Element('div#calculator')
          .inject(document.body)
          .setStyles({
            position: 'absolute',
            top: vp.cY - 150,
            left: vp.cX - 106
          })
          .adopt(this.display = new Element('div#display').set('text', 0), table);
         if(this.options.drag) {
          var doc_dimensions = document.getCoordinates();
          var drag_instance = new Drag(this.container, {
            'limit':{'x':[0, (doc_dimensions.width-this.container.getCoordinates().width)], 'y':[0, ]}
          });
        }
      }
  },
  /**
   * @summary Attaches events to the calculator
   */
  addEvents: function() {
    this.container.addEvent('click', this.click.bind(this));
  },
  /**
   * @summary Click event callback
   * @description Manages every click action over the calculator
   */
  click: function(evt) {
    var target = evt.target;
    // calculate
    if(target.get('class') == 'equal') {
      var result = this.calculate();
      if(result !== null) {
        this.display.set('text', result);
      }
    }
    // clear
    else if(target.get('class') == 'clear') {
      this.clear();
    }
   
    else if(target.get('class') == 'number' || target.get('class') == 'dot')  {
      if(this.new_term) {
        this.display.set('text', target.get('text'));
        this.new_term = false;
      }
      else {
        // only 0 or 1 dot character, max options.digits digits.
        if(this.display.get('text').length < this.options.digits && (target.get('class') != 'dot' || !/\./.test(this.display.get('text')))) {
          this.display.appendText(target.get('text'));
        }
      }
    }
  },
  /**
   * @summary Clears the calculator
   */
  clear: function() {
    this.first_term = null;
    this.operation = null;
    this.display.set('text', 0);
    this.new_term = true;
  },
  /**

  /**
   * @summary Deletes the calculator
   */
  remove: function() {
    this.container.destroy();
  },
  /**
   * @summary Hides the calculator
   */
  hide: function() {
    this.container.style.display = 'none';
  },
  /**
   * @summary Shows the calculator
   */
  show: function() {
    this.container.style.display = 'block';
  },
  /**
   * @summary Toggles the calculator visibility
   */
  toggle: function() {
    if(this.container.style.display == 'none') {
      this.show();
    }
    else {
      this.hide();
    }
  }
});