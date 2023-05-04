var SETTINGS = {
	wid : 'settings',
	data : {
		speed : "#PARAM{speed}",
		filters : "#PARAM{filters}"
	},
	attrs : {
		"class" : "settings round round4"
	},
	content : [{
		tag : 'ul',
		content : [{
			tag : 'li',
			html : 'Speed',
			content : [{
				tag : 'input',
				style:{width:'50px'},
				attrs : {
					type : 'range',
					min : 0.5,
					max : 2,
					step : 0.5,
					value : 1
				},
				cb : function () {
					var self = this,
						$elf = self.node,
						video = self.getNode('mainvideo').node;
					$NS$.events.on($elf, 'input', function () {
						self.parent.descendant(1).node.innerHTML = this.value;
						video.playbackRate = this.value;
					});
					self.done();
				}
			},{
				tag : 'span',
				style:{
					width : "20px"
				},
				text : 1
			}],
			cb : function () {
				var self = this,
					$elf = self.node;
				if (!self.climb(2).data.speed) 
					$NS$.dom.remove($elf);
				self.done();
			}
		},{
			tag : 'li',
			
			style : {
				color : 'yellow'
			},
			content : [{
				tag : 'label',
				html : '&bull; filters',
			}, {
                tag: 'span',
				cb : function () {
					var self = this,
						$elf = self.node,
						video = self.getNode('mainvideo').node,
						filters = self.getNode('filters').data.filters,
						dfilters = [],
						newFilter = function (v, label) {
							return {tag : 'option', attrs : {value:v}, html : label};
						},
						i;
					
					// render filters
					//
					// add no filter
					dfilters.push(newFilter('', 'none'));

					for (i in filters) {
						dfilters.push(newFilter(i, i))
					}
					$NS$.Widgzard.render({
                        target : $elf,
                        tag : 'select',
                        attrs : {name : 'filters'},
                        content : dfilters,
                        onChange: function (e) {
                            var val = e.target.value;
                            console.log(video, val)
                            if (val !== '') {
                                video.style['webkitFilter']='url(#'+filters[val]+')';
                                video.style['mozFilter']='url(#'+filters[val]+')';
                                video.style['filter']='url(#'+filters[val]+')';
                            } else {
                                video.style['webkitFilter']='';
                                video.style['mozFilter']='';
                                video.style['filter']='';
                            }
                            $NS$.events.kill(e)
                        }
                    });
					$NS$.events.on($elf, 'click', function (e) {
						$NS$.events.kill(e)
					})
					self.done();
				}
			}],
			cb : function () {
				var self = this,
                    $elf = self.node,
                    filters = self.getNode('filters');

				if (!filters.data.filters) 
					$NS$.dom.remove($elf);
				
				self.done();
			}
		}]
	}],
	cb : function () {
		var self = this,
			$elf = self.node,
			video = self.getNode('mainvideo');
		
		$NS$.events.on($elf, 'mouseleave', function (e) {
			console.log('TARGET : ', e, this)
			$NS$.css.style($elf, 'display', 'none');
			self.data.visible = false;
			video.data.trigger('onsettingsoff', [e]);
			
		});
		
		self.done();
	}
}
