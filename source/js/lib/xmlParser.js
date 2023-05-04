$NS$.xmlParser = (function () {

	function xmlLoader() {
		this.xmlDoc = null;
		this.parser = null;
		this.xml = null;
	}

	xmlLoader.prototype.load = function (txt, or_is_xml) {
		var xmlDoc;

		if (or_is_xml == undefined) {
		//clean up a bit
			txt = txt.replace(/\n/g, "")
				.replace(/[\t ]+\</g,"<")
				.replace(/\>[\t ]+\</g,"")
				.replace(/\>[\t ]+$/g, ">");

			this.xmlDoc = false;

			if (window.DOMParser) {
				this.parser = new DOMParser();
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
		return this;
	};
	xmlLoader.prototype.toJson = function (xml) {
		var obj = {},
			attribute,
			i, l, item, nodeName, old, tmp;
		xml = xml || this.xmlDoc;


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
					attribute = xml.attributes.item(j);
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

			for(i = 0, l = xml.childNodes.length; i < l; i++) {
				item = xml.childNodes.item(i);
				nodeName = item.nodeName;

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

	return {
		create : function () {return new xmlLoader();}
	};

})();
