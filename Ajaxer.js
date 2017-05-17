var Ajaxer = {
	forms: [],
	allFormData: [],
	convertAll: function(callback){
		var hasMultipleCallback = Array.isArray(callback)?true:false;
		var forms = document.getElementsByTagName("form");
		var i;
		for(i = 0; i < forms.length; i++){
			this.convert(forms[i], hasMultipleCallback?callback[i]:callback);
		}
	},
	convert: function(form, callback){
		if(typeof form !== "object" || form.tagName !== "FORM"){
			throw "Convert method expects parameter 1 to be an array of DOM elements of type \"form\"";
			return;
		}
		var i;
		this.forms.push(form);
		var params = {};
		params.url = form.getAttribute("action")!=null?form.getAttribute("action"):"";
		params.method = form.getAttribute("method")!=null?form.getAttribute("method"):"GET";
		params.contentType = form.getAttribute("enctype")!=null?form.getAttribute("enctype"):null;
		if(typeof this.onPre !== "function") throw "onPre is not a function";
		if(typeof this.onPost !== "function") throw "onPost is not a function";
		var self = this;
		params.callback = callback!=null?function(status, http){callback.bind(form)(status, http);self.onPost.bind(form)();}:function(http){console.log(http)};
		form.addEventListener("submit", function(e){
			params.data = self._formConverter(form);
			self.onPre.bind(form)();
			e.preventDefault();
			self._send(params, form);
			return false;
		});
	},
	onPre: function(){

	},
	onPost: function(){

	},
	onProgress: function(){

	},
	_formConverter: function(form){
		var fd = new FormData();
		var file_data = form.elements; // for multiple files
	    for(var i = 0;i<file_data.length;i++){
	    	if(file_data[i].getAttribute("type") !== "file") continue;
	    	var allFiles = file_data[i].files;
	    	if(allFiles.length == 1) fd.append(file_data[i].getAttribute("name"), allFiles[0]);
		    else{
		    	for(var j = 0; j < allFiles.length; j++){
					fd.append(file_data[i].getAttribute("name")+'[]', allFiles[j]);	
		    	}
		    }
	    }
	    var other_data = this._serialize(form).split("&");
	    other_data.forEach(function(data){
	    	data = data.split("=");
	    	fd.append(data[0], data[1]);
	    });
	    this.allFormData.push(fd);
		return this.allFormData[this.allFormData.length-1];
	},
	_send: function(params, form){
		var self = this;
		var http = new XMLHttpRequest();
		http.open(params.method, params.url, true);
		if(params.contentType) http.setRequestHeader("Content-type", params.contentType);
		http.onreadystatechange = function() {
		    if(http.readyState == 4) {
		    	params.callback(http.status===200, http);
		    }
		}
		http.upload.onprogress = function(e){
			var percentComplete = (e.loaded / e.total) * 100;
			self.onProgress.bind(form)(percentComplete.toFixed(2));
		};
		http.send(params.data);
	},
	_serialize: function(form) {
		if (!form || form.nodeName !== "FORM") {
			return;
		}
		var i, j, q = [];
		for (i = form.elements.length - 1; i >= 0; i = i - 1) {
			if (form.elements[i].name === "") {
				continue;
			}
			switch (form.elements[i].nodeName) {
			case 'INPUT':
				switch (form.elements[i].type) {
				case 'text':
				case 'hidden':
				case 'password':
				case 'button':
				case 'reset':
				case 'submit':
				case 'date':
					q.push(form.elements[i].name + "=" + (form.elements[i].value));
					break;
				case 'checkbox':
				case 'radio':
					if (form.elements[i].checked) {
						q.push(form.elements[i].name + "=" + (form.elements[i].value));
					}						
					break;
				case 'file':
					break;
				}
				break;			 
			case 'TEXTAREA':
				q.push(form.elements[i].name + "=" + (form.elements[i].value));
				break;
			case 'SELECT':
				switch (form.elements[i].type) {
				case 'select-one':
					q.push(form.elements[i].name + "=" + (form.elements[i].value));
					break;
				case 'select-multiple':
					for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
						if (form.elements[i].options[j].selected) {
							q.push(form.elements[i].name + "=" + (form.elements[i].options[j].value));
						}
					}
					break;
				}
				break;
			case 'BUTTON':
				switch (form.elements[i].type) {
				case 'reset':
				case 'submit':
				case 'button':
					q.push(form.elements[i].name + "=" + (form.elements[i].value));
					break;
				}
				break;
			}
		}
		return q.join("&");
	}
}