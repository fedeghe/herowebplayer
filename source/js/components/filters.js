var FILTERS = {
	wid : 'filters',
	tag : "svg",
	// style : {display : 'none'},
	attrs : {version : 1.1, xmlns : "http://www.w3.org/2000/svg"},
	ns : "http://www.w3.org/2000/svg",
	data : {
		filters : {},
		add : function (name, val) {
            this.filters[name] = val;
        }
	},
	content : [{
		tag : 'defs',
		content : [{
			tag : 'filter',
			content : [{
				tag : 'feGaussianBlur',
				attrs : {'stdDeviation' : 4}
			}],
			cb : function () {
				this.root.data.vid = $NS$.util.uniqueid + ""
				var id = this.root.data.vid + 'blurEffect';
				this.node.setAttribute('id', id);
				this.parent.parent.data.add('blurEffect', id);
				this.done();
			}
		},{
			tag : 'filter',
			content : [{
				tag : 'feGaussianBlur',
				attrs : {
					stdDeviation : "10,3",
					result : "outBlur"
				}
			}],
			cb : function () {
				var id = this.root.data.vid + 'blur';
				this.node.setAttribute('id', id);
				this.parent.parent.data.add('blur', id);
				this.done();
			}
		},{
			tag : 'filter',
			content : [{
				tag : 'feComponentTransfer',
				content : [{
					tag : 'feFuncR',
					attrs : {
						type : "table",
						tableValues : "1 0"
					}
				},{
					tag : 'feFuncG',
					attrs : {
						type : "table",
						tableValues : "1 0"
					}
				},{
					tag : 'feFuncB',
					attrs : {
						type : "table",
						tableValues : "1 0"
					}
				}]
			}],
			cb : function () {
				var id = this.root.data.vid + 'inverse';
				this.node.setAttribute('id', id);
				this.parent.parent.data.add('inverse', id);
				this.done();
			}
		},{
			tag : 'filter',
			content : [{
				tag : 'feConvolveMatrix',
				attrs : {
					order : "3",
					kernelMatrix : "1 -1  1 -1 -0.01 -1 1 -1 1",
					edgeMode : "duplicate",
					result : "convo"
				}
			}],
			cb : function () {
				var id = this.root.data.vid + 'convolve';
                this.node.setAttribute('id', id);
                
				this.parent.parent.data.add('convolve', id);
				this.done();
			}
		},{
			tag : 'filter',
			content : [{
				tag : 'feColorMatrix',
				attrs : {
					values : "0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"
				}
			}],
			cb : function () {
				var id = this.root.data.vid + 'blackAndWhite';
				this.node.setAttribute('id', id);
				this.parent.parent.data.add('black & white', id);
				this.done();
			}
		},{
			tag : 'filter',
			content : [{
				tag : 'feGaussianBlur',
				attrs : {
					"in" : "SourceGraphic",
					stdDeviation : "6",
					result : "blur"
				}
			},{
				tag : 'feConvolveMatrix',
				attrs : {
					 order : "3",
					 kernelMatrix : "1 -1  1 -1 -0.01 -1 1 -1 1",
					 edgeMode : "none",
					 result : "convo"
				}
			},{
				tag : 'feMerge',
				content : [{
					tag : 'feMergeNode',
					attrs : {"in" : "blur"}
				},{
					tag : 'feMergeNode',
					attrs : {"in" : "convo"}
				}]
			}],
			cb : function () {
				var id = this.root.data.vid + 'convoblur';
				this.node.setAttribute('id', id);
				this.parent.parent.data.add('convolve & blur', id);
				this.done();
			}
		},{
			tag : 'filter',
			content : [{
				tag : 'feConvolveMatrix',
				attrs : {
					filterRes : "100 100",
					style : "color-interpolation-filters:sRGB",
					order : "3",
					kernelMatrix : "0 -1 0   -1 4 -1   0 -1 0",
					preserveAlpha : "true"
				}
			}],
			cb : function () {
				var id = this.root.data.vid + 'convolve2';
				this.node.setAttribute('id', id);
				this.parent.parent.data.add('convolve 2', id);
				this.done();
			}
		},{
			tag : 'filter',
			attrs : {
				x : "0%",
				y : "0%",
				width : "100%",
				height : "100%"
			},
			content : [{
				tag : 'feFlood',
				attrs : {
					"flood-color" : "blue",
					result : "A"
				}
			},{
				tag : 'feColorMatrix',
				attrs : {
					type : "matrix",
					"in" : "SourceGraphic",
					result : "B",
					values : "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  1 1 1 0 0"
				}
			},{
				tag : 'feMerge',
				content : [{
					tag : 'feMergeNode',
					attrs : {"in" : "A"}
				},{
					tag : 'feMergeNode',
					attrs : {"in" : "B"}
				}]
			}],
			cb : function () {
				var id = this.root.data.vid + 'bluefill';
				this.node.setAttribute('id', id);
				this.parent.parent.data.add('Blue fill', id);
				this.done();
			}
		},{
			tag : 'filter',
			attrs : {
				x : "0%",
				y : "0%",
				width : "100%",
				height : "100%"
			},
			content : [{
				tag : 'feGaussianBlur',
				attrs : {
					stdDeviation : "1.5"
				}
			},{
				tag : 'feComponentTransfer',
				content : [{
					tag : 'feFuncR',
					attrs : {type:"discrete", tableValues:"0 .5 1 1"}
				},{
					tag : 'feFuncG',
					attrs : {type:"discrete", tableValues:"0 .5 1"}
				},{
					tag : 'feFuncB',
					attrs : {type:"discrete", tableValues:"0"}
				}]
			}],
			cb : function () {
				var id = this.root.data.vid + 'noir';
				this.node.setAttribute('id', id);
				this.parent.parent.data.add('Noir', id);
				this.done();
			}
		},{
			tag : 'filter', 
			content : [{
				tag : 'feColorMatrix',
				attrs : {
					type : "matrix",
					values : "0.3333 0.3333 0.3333 0 0  0.3333 0.3333 0.3333 0 0  0.3333 0.3333 0.3333 0 0  0 0 0 1 0"
				}
			}],
			cb : function () {
				var id = this.root.data.vid + 'bw';
				this.node.setAttribute('id', id);
				this.parent.parent.data.add('Black & White', id);
				this.done();
			}
		}]
	}]
}
