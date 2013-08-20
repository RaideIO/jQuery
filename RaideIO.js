/**
 * RaideJS
 *
 * @funcs	clearAllHttpData()
 *		clearHttpData(method)
 *		log(type, data)
 *		sendAjaxRequest(url, parameters)
 *		setExtras(parameters)
 *		setHttpData(method, type, data)
 *		setInputValuesElement(element)
 *		setLocation(section, breadcrumbs)
 *		setOnClickElement(element)
 *		setSubmitData(data)
 *		setSubmitFunction(callback)
 *		setSubmitURL(url)
 */	

function RaideJS() {
	this._Breadcrumbs = []; 		// Where is this client located? Eg: ['User', 'Edit']
	this._Extras = {}; 			// Extra information to log.
	this._InputValuesElement = null;	// DOM Element.
	this._Log = {};				// A log.
	this._OnClickElement = null;		// The DOM Element that will call the SubmitFunction when pressed.
	this._Section = '';			// What section is the client using in the site? Eg: Dialog, HTML Report, Search
	this._SessionStartTime = 0;		// What UNIX time did the client first load the website?
	this._SubmitData = {};			// What data should we send along with the collected information?
	this._SubmitFunction = null;		// The function to run when runSubmitFunction() is executed.
	this._SubmitURL = null;			// Which URL should we submit the data to?
	
	/**
	 * What GET & POST Request will we be sending?
	 */
	 
	this._HttpData = {
		'GET': {
			'http':		{},
			'received':	{},
			'sent':		{}
		},
		'POST': {
			'http':		{},
			'received':	{},
			'sent':		{}
		}
	};
	
	/**
	 * Re-bind this Bug Report button.
	 *
	 * @return	void
	 */
	
	this._bindElement = function() {
		// If a DOM element and on click callback have been set.
		if (this._OnClickElement !== null && this._SubmitURL !== null && this._SubmitFunction !== null) {
			var _this = this;
			
			this._OnClickElement
				.unbind('click')
				.bind('click', function() {
					// What DOM Element will we open so that they can enter their subject and description?
					var DOM = $('div#RaideSubmit');
					
					// If the DOM element doesn't exist.
					if (DOM.length == 0) {
						$('body')
							.append('<div id="RaideSubmit" class="Visible">' +
										'<div id="RaideOverlay"></div>' +
										'<div id="RaideModalDialog">' +
											'<div id="RaideModalHeader">Submit Support Ticket</div>' +
											'<div id="RaideModalStatus"></div>' +
											'<div id="RaideModalContent">' +
												'<table cellpadding="0" cellspacing="0">' +
													'<tr>' +
														'<th>Subject</th>' +
														'<td><input type="text" id="subject"></td>' +
													'</tr>' +
													'<tr>' +
														'<th>Description</th>' +
														'<td><textarea id="description"></textarea></td>' +
													'</tr>' +
												'</table>' +
											'</div>' +
											'<div id="RaideModalFooter">' +
												'<button id="Submit">Submit</button>' +
												'<button id="Close">Close</button>' +
											'</div>' +
										'</div>' +
									'</div>');
									
						// Fetch the newly-appended Raide DIV.
						var DOM = $('div#RaideSubmit');
									
						// Bind the Close button.
						$(':button#Close', DOM)
							.unbind('click')
							.bind('click', function() {
								DOM.removeClass('Visible');
							});
									
						// Bind the Submit button.
						$(':button#Submit', DOM)
							.unbind('click')
							.bind('click', function() {
								// What information should we be submitting?
								var pushing = {
									'description':	$('textarea#description', DOM).val(),
									'subject':	$(':text#subject', DOM).val(),
									'summary':	_this._getBase64Summary()
								};
								
								// Merge the above data with the custom Submit Data they want to append.
								var merged = $.extend(pushing, _this._SubmitData);
								
								// Disable all buttons.
								$(':button', DOM).prop('disabled', true);
								
								// Set the Status Text as "Loading...".
								$('#RaideModalStatus', DOM)
									.removeClass('Error')
									.addClass('Visible')
									.text('Loading...');
								
								// Submit the Support Ticket to the back-end.
								$.ajax(_this._SubmitURL, {
									'complete': function() {
										// Re-enable all buttons.
										$(':button', DOM).prop('disabled', false);
									},
									'data': merged,
									'dataType': 'JSON',
									'error': function() {
										$('#RaideModalStatus', DOM)
											.addClass('Error')
											.addClass('Visible')
											.text('An error has occurred,');	
									},
									'success': function(json) {
										try {
											_this._SubmitFunction(json);
											
											// Hide the Modal Dialog.
											DOM.removeClass('Visible');
										}
										// If an error was fetched.
										catch (e) {
											$('#RaideModalStatus', DOM)
												.addClass('Error')
												.addClass('Visible')
												.text(e);
										}
									},
									'type': 'POST'
								});
							});
					}
					else {
						// Hide Raide.
						DOM.addClass('Visible');
						
						// Enable all buttons.
						$(':button', DOM).prop('disabled', false);
						
						// Clear all input values.
						$(':text, textarea', DOM).val('');
						
						// Remove the Error and Visible classes from the modal dialog.
						$('#RaideModalStatus', DOM)
							.removeClass('Error')
							.removeClass('Visible');
					}
					
					return false;
				});
		}
	};
	
	/**
	 * Format the object to send to the server.
	 *
	 * @param	object	object
	 * @return	string
	 */
	
	this._formatSummaryObject = function(object) {
		// Convert our object to a string.
		var string = $.param(object);
		
		// Base64-encode this string.
		var base64 = window.btoa(string);
		
		return base64;
	};
	
	/**
	 * Get a summary of all of the information this Bug Report has assembled.
	 *
	 * @return	string		A base64-encoded string
	 */
	
	this._getBase64Summary = function() {
		var clientData = this._getClientData();
		
		return this._formatSummaryObject({
			'breadcrumbs':	this._Breadcrumbs,
			'client':	clientData.client,
			'extras':	this._Extras,
			'inputs':	this._getInputValues(),
			'log':		this._Log,
			'requests':	this._HttpData,
			'resources':	clientData.resources,
			'section':	this._Section
		});
	};
	
	/**
	 * Fetch information about our Client.
	 *
	 * @return	object	{client, files}
	 */
	
	this._getClientData = function() {
		var cookies = false;
			
		// If cookies are enabled.
		if (typeof navigator == 'object') {
			cookies = navigator.cookieEnabled;
		}
		
		var resources = {
			'css': [],
			'javascript': {
				'body': [],
				'head': []
			}
		};
		
		var css = $('link[type="text/css"]', 'head');
		
		// Find all of the CSS files.
		$.each(css, function(index, link) {
			// If there is a CSS URL.
			if (typeof link.href == 'string' && link.href.length > 0) {
				resources.css.push(link.href);
			}
		});
		
		// Find all JavaScript files in the HTTP Body and Head.
		$.each(['body', 'head'], function(index, area) {
			var javascript = $('script[src!=""]', area);
		
			$.each(javascript, function(_index, js) {
				// If there is a JavaScript URL.
				if (typeof js.src == 'string' && js.src.length > 0) {
					resources.javascript[area].push(js.src);
				}
			});
		});
		
		var returning = {
			'client': {
				'browser': {
					'cookies': (cookies == true || cookies == 'true' ? true : false)
				},
				'machine': {
					'resolution': {
						'height':	screen.height,
						'width':	screen.width
					}
				},
				'window': {
					'elapsed':	(Math.round(new Date().getTime() / 1000) - this._SessionStartTime),
					'height':	$(window).height(),
					'title':	document.title,
					'width':	$(window).width()
				}
			},
			'resources': resources
		};
		
		return returning;
	};
	
	/**
	 * Return a URLencoded string containing all current input fields.
	 *
	 * @return	string
	 */
	
	this._getInputValues = function() {
		var returning = [];
		
		// If a Get Input Values DOM Element has been set.
		if (this._InputValuesElement !== null) {
			returning = $(':input[name][type!="password"]', this._InputValuesElement).serialize();
		}
		
		return returning;
	};
	
	/**
	 * When this instance is initialized for the first time.
	 *
	 * @return	void
	 */
	
	this._initialize = function() {
		this._SessionStartTime = Math.round(new Date().getTime() / 1000);
	};
	
	/**
	 * Clear all values.
	 *
	 * @return	void
	 */
	
	this.clearAllHttpData = function() {
		// Clear the stored GET and POST results.
		this.clearHttpData('GET');
		this.clearHttpData('POST');
	};
	
	/**
	 * Clear the stored HTTP Data.
	 *
	 * @param	string	method	[GET|POST]
	 * @return	void
	 */
	
	this.clearHttpData = function(method) {
		this._HttpData[method] = {
			'http':		{},
			'received':	{},
			'sent':		{}
		};
	};
	
	/**
	 * Log an event.
	 *
	 * @param	string	type	The type of log, Eg: [Asynchronous_Request, Javascript_Error]
	 * @param	mixed	data	The data to log.
	 * @return	void
	 */
	
	this.log = function(type, data) {
		// If no logs using this type have been used yet.
		if (!this._Log[type] || typeof this._Log[type] != 'object') {
			this._Log[type] = [];
		}
		
		this._Log[type].push(data);
	};
	
	/**
	 * Sends an asynchronous request.
	 *
	 * @param	string	url			
	 * @param	object	parameters
	 * @return	void
	 */
	
	this.sendAjaxRequest = function(url, parameters) {
		var _this = this;
		
		var complete	= (!parameters.complete	? function() {}	: parameters.complete),
			data	= (!parameters.data	? {}		: parameters.data),
			error	= (!parameters.error	? function() {}	: parameters.error),
			success	= (!parameters.success	? function() {}	: parameters.success),
			type	= (!parameters.type	? 'GET'		: parameters.type.toUpperCase());
			
		// Create a variable containing basic HTTP data concerning this request.
		var http = {
			'code': 	0,
			'elapsed': 	'',
			'method':	type,
			'url':		url
		};
		
		// Log the sent data.
		_this.setHttpData(type, 'sent', data);
		
		// A function to be called when we receive a response from the server.
		var _complete = function(x, t) {
			// Override the HTTP code and execution time.
			http.code = x.status;
			http.elapsed = Math.round(new Date().getTime()) - execution_start;
			
			// Log the HTTP data.
			_this.setHttpData(type, 'http', http);
			
			complete(x, t);
		};
		
		// A function to be called if any errors have occurred.
		var _error = function(x, s, thrown) {
			// If a valid status code was retrieved.
			if (x.status > 0) {
				// Log this Error.
				_this.log('Asynchronous Requests', http);
			}
				
			error(x, s, thrown);
		};
		
		// A function to call if the request was completed successfully.
		var _success = function(data, status, xhr) {
			// Log the received data.
			_this.setHttpData(type, 'received', data);
			
			success(data, status, xhr);
		};
		
		// What time are we starting to send this Ajax request?
		var execution_start = Math.round(new Date().getTime());
		
		// What will we pass through to our Asynchronous request?
		var pass_ajax = {
			'complete':	_complete,
			'data': 	data,
			'error': 	_error,
			'success': 	_success,
			'type': 	type,
			'url': 		url
		};
		
		// Append any extra parameters to our object to pass to the $.ajax() function.
		$.each(parameters, function(key, value) {
			// If this key hasn't been set already.
			if (!pass_ajax[key]) {
				pass_ajax[key] = value;
			}
		});
		
		// Send the Asynchronous request.
		$.ajax(pass_ajax);
	};
		
	/**
	 * Send an array of extra information, potentially concerning the user, or their browsing session.
	 *
	 * @param	object	extras
	 * @return	void
	 */
	
	this.setExtras = function(extras) {
		this._Extras = extras;
	};
	
	/**
	 * Set HTTP Data.
	 *
	 * @param	string	method	[GET|POST]
	 * @param	string	type	[http|received|sent]
	 *							If type is "http", it accepts {code, elapsed, method, url} - code = HTTP Code, elapsed = MS from start to finish, method = [GET|POST]
	 *							If type is "sent" or "received", it accepts an object.
	 * @param	object	data
	 */
	
	this.setHttpData = function(method, type, data) {
		this._HttpData[method][type] = data;
	};
	
	/**
	 * Set the DOM Element that contains all of the input (input, select) values that you want to save.
	 *
	 * @param	selector	element
	 * @return	void
	 */
	
	this.setInputValuesElement = function(element) {
		this._InputValuesElement = element;
	};
			
	/**
	 * Set the location of the user.
	 *
	 * @param	string	section		Examples: Search, Report, Dialog
	 * @param	array	breadcrumbs	Example: [profile|my_account]
	 */
	
	this.setLocation = function(section, breadcrumbs) {
		this._Breadcrumbs = breadcrumbs;
		this._Section = section;
	};
	
	/**
	 * Set the DOM Element, that when pressed, will serve as the "Submit" button and trigger the runSubmitFunction()
	 *
	 * @param	selector	element
	 */
	
	this.setOnClickElement = function(element) {
		this._OnClickElement = element;
		this._bindElement();
	};
	
	/**
	 * Set extra data to submit along with the Support Ticket subject and description.
	 * 
	 * @param	object		data	An object to pass along with the gathered Support Ticket data.
	 * @return	void
	 */
	
	this.setSubmitData = function(data) {
		this._SubmitData = data;
		this._bindElement();
	};
	
	/**
	 * Set the function that will run when the Support Ticket is submitted.
	 *
	 * @param	function	callback	The function to be called when the user click the Bug Report button.
	 * @return	void
	 */
	
	this.setSubmitFunction = function(callback) {
		this._SubmitFunction = callback;
		this._bindElement();
	};
	
	/**
	 * Sets the back-end URL that we will submit the Support Ticket to.
	 * 
	 * @param	string		url	The back-end URL.
	 * @return	void
	 */
	
	this.setSubmitURL = function(url) {
		this._SubmitURL = url;
		this._bindElement();
	};
	
	// Initialize this instance.
	this._initialize();
};
