## RaideIO's RaideJS jQuery Object

---

This works hand-in-hand with the RaideIO API. The API is available in either [PHP](https://github.com/RaideIO/PHP) or [Ruby](https://github.com/RaideIO/Ruby).

---

### Requirements

- [jQuery](http://jquery.com/)
- [PHP](https://github.com/RaideIO/PHP) or [Ruby](https://github.com/RaideIO/Ruby) Back-end

---

### Function List

```javascript
clearAllHttpData()
clearHttpData(method)
log(type, data)
sendAjaxRequest(url, parameters)
setExtras(parameters)
setHttpData(method, type, data)
setInputValuesElement(element)
setLocation(section, breadcrumbs)
setOnClickElement(element)
setSubmitData(data)
setSubmitFunction(callback)
setSubmitURL(url)
```

---

### Initializing a new instance of the RaideJS Object.

```javascript
var Raide = new RaideJS;
```

---

### clearAllHttpData() - Clears both stored GET and POST requests.

Example(s)

```javascript
// Clear all logged HTTP requests.
Raide.clearAllHttpData();
```

---

### clearHttpData() - Clear information about a stored GET or POST request.

Parameter(s)

```
string  method  Either "GET" or "POST".
```

Example(s)

```javascript
// Clear information about a stored GET request.
Raide.clearHttpData("GET");

// Clear information about a stored POST request.
Raide.clearHttpData("POST");
```

---

### log() - Log an event.

Parameter(s)

```
string  type    The type of log.
mixed   data    Data to append to the log.
```

Example(s)

```javascript
// Catch when an error occurs and log it.
try {
    // Attempt to run the function doError(). This function does not exist, and will throw an error.
    doError();
}
catch(e) {
    // If the caught error was returned as an object.
    if (typeof e == 'object') {
		// Log this error.
		Raide.log('Javascript Errors', {
			'file':		e.fileName,
			'line': 	e.lineNumber,
			'message': 	e.message
		});
	}
}
```

---

### sendAjaxRequest() - Run an Asynchronous request and log the results.

** This function is a wrapper of jQuery's $.ajax() function. **

Parameter(s)

```
string  url
object  parameters
```

Example(s)

```javascript
// Fetch and log information about an Asynchronous request.
Raide.sendAjaxRequest("async/requests/get.html", {
    "data": {
        "method":   "fetch"
        "user":     15
    },
    "dataType": "json",
    "success": function(json) {
        // Output the retrieved results.
        console.log(json);
    }
    "type": "GET"
});
```

---

### setExtras() - Set extra information about this session, client, etc.

Parameter(s)

```
object  parameters
```

Example(s)

```javascript
// Set information about this client.
Raide.setExtras({
    "uniqueID": "91SKK1BAJ1NAL89",
    "user": {
        "id":       5,
        "name" :    "Kevin D"
    }
});
```

---

### setHttpData() - Store information about an Asynchronous request.

** This function can be avoided by using the sendRequest() function **

Parameter(s)

```
string  method  Either "GET" or "POST".
string  type    Either "http", "received", or "sent".
object  data    The data to log.
```

Example(s)

```javascript
// This is a GET request.
var type = "GET";

// What URL are we fetching the information from?
var url = "async/requests/get.html";

// Create a variable containing basic HTTP data concerning this request.
var http = {
	"code": 	0,
	"elapsed": 	"",
	"method":	type,
	"url":		url
};

// Log the sent data.
Raide.setHttpData(type, "sent", data);
		
// What time are we starting to send this Ajax request?
var execution_start = Math.round(new Date().getTime());
			
// Send the Asynchronous request.
$.ajax({
    "complete":	function(x, t) {
        // Override the HTTP code and execution time.
    	http.code = x.status;
    	http.elapsed = Math.round(new Date().getTime()) - execution_start;
    	
    	// Log the HTTP data.
    	Raide.setHttpData(type, "http", http);
    },
	"data": 	data,
	"success": 	function(data, status, xhr) {
        // Log the received data.
    	Raide.setHttpData(type, "received", data);
    	
    	success(data, status, xhr);
    },
	"type": type,
	"url":  url
});
```

---

### setInputValuesElement() - When the Support Ticket is submitted, we will gather all input values from this DOM element.

Parameter(s)

```
selector    element
```

Example(s)

```javascript
// Set the DOM element as a form.
Raide.setInputValuesElement($('form#myForm'));
```

---

### setLocation() - Determine which area of the application the client is browsing.

Parameter(s)

```
string  section
array   breadcrumbs
```

Example(s)

```javascript
// The client is editing a User.
Raide.setLocation("Dialog", ["User", "Edit"]);

// The client is browsing a message thread.
Raide.setLocation("HTML Report", ["Message Thread"]);
```

---

### setOnClickElement() - Sets the DOM element that will be used as a Submit button.

Parameter(s)

```
selector    element
```

Example(s)

```javascript
// Set the "Submit" button as the OnClick element.
Raide.setOnClickElement($(':button#submit'));
```

---

### setSubmitData() - Sets extra information to send to the back-end along with the Support Ticket data.

Parameter(s)

```
object	data
```

Example(s)

```javascript
// Set extra data that will be sent to the back-end along with the Support Ticket.
Raide.setSubmitData({
	"sessionID": "192KAM1MZO9A0A7S66DQIP"
});
```

---

### setSubmitFunction() - Sets the function that will be called when the Support Ticket was submitted, and data has been returned from the back-end.

Parameter(s)

```
function    callback
```

Example(s)

```javascript
// Set the function to run when the Support Ticket has been submitted, and back-end data was received.
Raide.setSubmitFunction(function(json) {
	// If no errors occurred.
	if (json.error == 0) {
		var result = json.result || {};
		
		// What is the unique Support Ticket ID that was created?
		var id = result.id;					
		
		// Redirect them to the Ticket.
		window.location.href = "view.php?id="+id;
	}
	// An error occurred, so throw an error.
	else {
		throw json.errorDescription;
	}
});
```

---

### setSubmitURL() - Sets the URL that we will submit the Support Ticket data to.

Parameter(s)

```
string	url
```

Example(s)

```javascript
// Sets the URL that we will submit the Support Ticket data to, which will use the API.
Raide.setSubmitURL("back-end/submit.php");
```
