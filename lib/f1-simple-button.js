'use strict';
var btnParser = require('./ui-simple-button/dom-parser');
var f1 = require('f1');
var f1Dom = require('f1-dom');
var eases = require('eases');
var SimpleButtonUI = require('./ui-simple-button');
var SimpleSlotMachineUI = require('./ui-simple-slotmachine');


// button background defaults
var backgroundColor = '#2ecc71';
var borderRadius = 50;
var borderStyle = 'solid';
var borderColor = '#fff';
var borderWidth = 3;
var buttonHeight = 71;

// button text defaults
var textColor = "#fff";
var copy = 'CONTINUE';
var fontSize = 16;
var padding = '25px 80px';
var margin = '25px 25px';

// button arrow defaults
var arrowColor = '#fff';
var arrowFontSize = '300%';


function SimpleButton(opts){

    if(!(this instanceof SimpleButton)) {
        return new SimpleButton(opts);
    }

    opts = opts || {};

    this.isSelected = false;

    this.background = this.getBtnBackground(opts);
    this.text = this.getBtnText(opts);
    this.icon = this.getBtnArrow(opts);

    this.background.appendChild(this.text);
    this.background.appendChild(this.icon);

    var targets = {
        button: this.background,
        background: this.background,
        border: this.background,
        text: this.text,
        icon: this.icon
    };

    // dom-parser is not done.
    var defaultStates = btnParser(targets, {
        type: 'simple', // maybe other type of slotMachine is 'double'. So background and text and icon get cloned and states set up for them.
        slotMachine: true,
        iconPosition: 'right',
        iconDirection: 'left'
    });

    var UISettings = (opts.slotMachine) ? SimpleSlotMachineUI : SimpleButtonUI;

    this.ui = f1(UISettings({
        targets: targets
    }, opts)).
        parsers(f1Dom).
        parsers({
            update: [require('./borderColor')]
        }).
        init('off');

}

SimpleButton.prototype.getBtnBackground = function(opts){

    var el = document.createElement('button');
    el.style.boxSizing = 'border-box';
    el.style.display = 'inline-block';
    el.style.height = (opts.buttonHeight || buttonHeight) + 'px';
    el.style.padding = opts.padding || padding;
    el.style.margin = opts.margin || margin;
    el.style.backgroundColor = opts.backgroundColor || backgroundColor;
    el.style.borderRadius = (opts.borderRadius || borderRadius) + 'px';
    el.style.borderStyle = opts.borderStyle || borderStyle;
    el.style.borderColor = opts.borderColor || borderColor;
    el.style.borderWidth = (opts.borderWidth || borderWidth) + 'px';
    el.style.overflow = opts.overflow || 'hidden';
    el.style.outline = 'none';
    el.style.position = 'relative';
    el.style.cursor = 'pointer';
    el.setAttribute('id','background');

    el.addEventListener('mouseenter', this.onOver.bind(this));
    el.addEventListener('mouseleave', this.onOff.bind(this));
    el.addEventListener('mousedown', this.onDown.bind(this));
    el.addEventListener('mouseup', this.onUp.bind(this));
    el.addEventListener('touchstart', this.onTouchstart);
    el.addEventListener('touchend', this.onTouchend);
    //el.addEventListener('click', this.onClick);

    return el;
};

SimpleButton.prototype.getBtnText = function(opts){

    opts = opts || {};

    var el = document.createElement('div');
    el.style.fontSize = (opts.fontSize || fontSize) + 'px';
    el.style.color = opts.textColor || textColor;
    el.innerHTML = opts.copy || copy;
    el.setAttribute('id','text');

    return el;
};

SimpleButton.prototype.getBtnArrow = function(opts){

    opts = opts || {};

    var iconCode = opts.iconCode || '&#8594;';
    var el = document.createElement('div');
    el.style.fontSize = opts.arrowFontSize || arrowFontSize;
    el.style.color = opts.arrowColor || arrowColor;
    el.style.width = '33px';
    el.style.height = '16px';
    el.style.position = 'absolute';
    el.innerHTML = iconCode;
    el.style.lineHeight = '.5em';
    el.style.top = '50%';
    if(!opts.slotMachine && !opts.offIconPosition && !opts.overIconPosition && !opts.downIconPosition)    el.style.marginTop = '-8px';
    //el.style.left = '130%';
    el.style.left = '76%';
    el.setAttribute('id','arrow');

    return el;
};


SimpleButton.prototype.onOff = function(e){

    if(!this.isSelected){
        //console.log('onOff(), from: ',this.ui.state,', to: ','off');
        this.ui.go('off');
    }
};

SimpleButton.prototype.onOver = function(e){
    if(!this.isSelected){
        //console.log('onOver(), from: ',this.ui.state,', to: ','over');
        this.ui.go('over');
    }
};

SimpleButton.prototype.onDown = function(e){
    //console.log('onDown(), from: ',this.ui.state,', to: ','down');
    //isSelected = !isSelected;
    this.ui.go('down');
};

SimpleButton.prototype.onUp = function(e){

    if(!this.isSelected){
        console.log('onUp(), from: ',this.ui.state,', to: ','over');
        this.ui.go('over');
    }

};

SimpleButton.prototype.onTouchstart = function(e){

    console.log('onTouchstart(), from: ',this.ui.state,', to: ','touchstart');
    this.ui.go('touchstart');

};

SimpleButton.prototype.onTouchend = function(e){

    console.log('onTouchend(), from: ',this.ui.state,', to: ','touchend');
    this.ui.go('touchend');

};

module.exports = SimpleButton;