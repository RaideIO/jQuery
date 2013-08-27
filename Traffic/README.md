## RaideIO's Traffic JavaScript (and jQuery) File

---

This works hand-in-hand with the RaideIO's Traffic API. The API is available in [PHP](https://github.com/RaideIO/PHP/tree/master/Traffic).

You can use the latest version located on Raide's servers at [http://my.raide.io/media/js/RaideIOTraffic.js](http://my.raide.io/media/js/RaideIOTraffic.js)

---

### Requirements

- [jQuery](http://jquery.com/)
- [PHP](https://github.com/RaideIO/PHP/tree/master/Traffic) Back-end

---

### Function List

```javascript
setSubmitURL(url)
```

---

### setSubmitURL() - Sets the URL that we will submit the Traffic data to.

Parameter(s)

```
string	url
```

Example(s)

```javascript
// Sets the URL that we will submit the Traffic data to, which will use the API.
Raide.setSubmitURL("back-end/submit.php");
```
