org.xiha.html5.util = {
	getTrueOffsetLeft : function(ele) {
		var n = 0;
		while (ele) {
			n += ele.offsetLeft + ele.clientLeft || 0;
			ele = ele.offsetParent;
		}

		return n;
	},
	getTrueOffsetTop : function(ele) {
		var n = 0;
		while (ele) {
			n += ele.offsetTop + ele.clientTop || 0;
			ele = ele.offsetParent;
		}
		return n;
	},

	getMouse : function(e, canvas) {
		var width = canvas.width;
		var height = canvas.height;
		var x = e.clientX - this.getTrueOffsetLeft(canvas) + window.pageXOffset;
		var y = e.clientY - this.getTrueOffsetTop(canvas) + window.pageYOffset;

		// 控制边界
		return [ Math.min(width - 3, Math.max(3, x)),
				Math.min(height - 3, Math.max(3, y)) ];

	},

	extend : function(child, parent) {

		var tmp = function() {

		};
		tmp.prototype = parent.prototype;
		child.prototype = new tmp();
		child.prototype.constructor = child;

	}
};


org.xiha.html5.util.imageResourceLoader={
		onComplete: function(){} // Fires when all finished loading
		,onLoaded: function(){} // Fires when an image finishes loading
		,current: null // Last loaded image (Image Object)
		,qLength : 0 // the queue length before process_queue
		,images: [] // Loaded images (array of Image Object)
		,inProcess : false // a flag to indicate if in process_queue
		,queue:[] // Waiting to be processed (array of strings (urls for Image
					// SRC))
		,queue_images: function(){ // gets multiple arguments each can be
									// either an image src or an array of image
									// src (you can mix).
			var arg=arguments;
			for (var i=0;i<arg.length;i++){
				if (arg[i].constructor === Array){
					this.queue= this.queue.concat(arg[i]); // add to queue, do
															// not empty it!
				}else if(typeof arg[i]==='string'){
					this.queue.push(arg[i]);
				}
			}				
		}
		,process_queue: function() { // start loading images from the queue
			this.inProcess = true;
			this.qLength += this.queue.length;
			while(this.queue.length >0){
				this.load_image(this.queue.shift()); // pull the next image
														// off the top and load
														// it
			}
			this.inProcess = false;
		}
		,load_image: function(imageSrc){ // load a single by a url and
											// continue to process the queue
			var th = this;
			var im = new Image;
			im .onload = function(){ // After user agent has the image
				th.current = im ; // set the current
				th.images.push(im ); // add the image to the stack
				(th.onLoaded)(); // fire the onloaded
				if(th.queue.length > 0 && !th.inProcess){
					th.process_queue(); // make sure other items are loaded!
				}
				if(th.qLength == th.images.length){ // all images loaded?
					(th.onComplete)(); // call callback
				}// else{// if queue is not empty
				 //	
				// }
			};
			im .src = imageSrc; // Tell the User Agent to GET the image
		}
};