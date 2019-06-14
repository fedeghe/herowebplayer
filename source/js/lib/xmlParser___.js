$NS$.xmlParser = (function () {
	return {
		getCdataContent : function (n) {
			var ch = n.childNodes,
				l = ch.length,
				i = 0;
				
			for (null; i < l; i++) {
				if (ch[i].nodeType == 4 || ch[i].nodeName == '#cdata-section') {
					return 'data' in ch[i] ?
						ch[i].data
						:
						ch[i].nodeValue;
				}
			}
			return ch[0].nodeValue;
		},

		// takes the content of
		// the xml to be parsed
		//
		load : function (txt, or_is_xml) {

			var that = this,
				xmlDoc,
				parser;

			if (or_is_xml == undefined) {
			//clean up a bit
				txt = txt.replace(/\n/g, "")
					.replace(/[\t ]+\</g,"<")
					.replace(/\>[\t ]+\</g,"")
					.replace(/\>[\t ]+$/g, ">");

				this.xmlDoc = false;

				if (window.DOMParser) {
					parser = new DOMParser();
					xmlDoc = parser.parseFromString(txt, "text/xml");

				} else { // IE
					xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
					xmlDoc.async=false;
					xmlDoc.loadXML(txt);
				}
				this.xmlDoc = xmlDoc;
			} else {
				this.xmlDoc = txt;
			}
			
			this.nodeExtractor = function (t) {return t; };

			//set the extractor function or get the fTH node
			this.extractor = function (f, reset_extractor) {
				if (typeof f === 'number') {
					return this.pointerNode.childNodes.length > f ?
						this.nodeExtractor(this.pointerNode.childNodes[f])
						:
						false;
				}
				if (typeof f === 'function' && (!this.nodeExtractor || reset_extractor)) {
					this.nodeExtractor = f;
					this.pointerNode = this.xmlDoc.documentElement;
					return true;
				}
				return false;
			};

			this.extractall = function () {
				var ret = [],
					len = this.pointerNode.childNodes.length,
					i = 0;
				while (len) {
					len -= 1;
					ret.push(this.extractor(i));
					i += 1;
				}
				return ret;
			};
			
			this.pointer = function(node){
				if (node) {
					this.pointerNode = node;
				}
				return this.pointerNode;
			}
			
			this.root = function(){
				return this.xmlDoc;
				// return this.xmlDoc.childNodes[0];
			};
			
			this.toJson = function (xml) {
				var obj = {};
				xml = xml ||that.pointerNode;

				/*
				1 	ELEMENT_NODE
				2 	ATTRIBUTE_NODE
				3 	TEXT_NODE
				4 	CDATA_SECTION_NODE
				5 	ENTITY_REFERENCE_NODE
				6 	ENTITY_NODE
				7 	PROCESSING_INSTRUCTION_NODE
				8 	COMMENT_NODE
				9 	DOCUMENT_NODE
				10 	DOCUMENT_TYPE_NODE
				11 	DOCUMENT_FRAGMENT_NODE
				12 	NOTATION_NODE
				*/

				// ELEMENT_NODE 1
				// 
				// dig for attributes
				if (xml.nodeType == 1) {
					if (xml.attributes.length > 0) {
					obj["@attributes"] = {};
						for (var j = 0; j < xml.attributes.length; j++) {
							var attribute = xml.attributes.item(j);
							obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
						}
					}
				}
				// TEXT_NODE 3
				// node that 2 has been skipped since they are attributes
				else if (xml.nodeType == 3) {
					//obj = xml.nodeValue;
					obj = xml.nodeValue.replace(/\n/g, '').replace(/^\s*/, '').replace(/\s*$/, '');
					if (obj == '') obj = undefined;

				// CDATA_SECTION_NODE 4
				// 
				} else if (xml.nodeType == 4) {
					obj = xml.nodeValue;

				// COMMENT_NODE 8
				} else if (xml.nodeType == 8) {
					// debugger;
					obj = xml.data;
				}

				if (xml.hasChildNodes()) {

					for(var i = 0, l = xml.childNodes.length; i < l; i++) {
						var item = xml.childNodes.item(i),
							nodeName = item.nodeName,
							old, tmp;

						tmp = this.toJson(item);

						if (typeof(obj[nodeName]) == "undefined") {
							!!tmp && (obj[nodeName] = tmp);
						} else {

							if (typeof(obj[nodeName].push) == "undefined") {
								old = obj[nodeName];
								obj[nodeName] = [];
								obj[nodeName].push(old);
							}
							
							!!tmp && obj[nodeName].push(tmp);
						}
					}
				}
				return obj;
			};
			// by default is the root
			that.pointerNode = that.root();

			return that;
		},
	
		/**
		 * 
		 * 
		 * SOME UTILITY FUNCTIONS
		 */
		_text : function(node){
			return node.childNodes[0].nodeValue;
		},
		_attribute : function(node, attribute){
			var r = node.attributes.getNamedItem(attribute);
			return r == null ? '' : r.nodeValue;
		},
		_tag : function(node, tag, n){
			var nodes = node.getElementsByTagName(tag);
			return n < nodes.length ? nodes[n] : false;
		}
	};
})();
