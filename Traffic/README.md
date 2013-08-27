## RaideIO's RaideJS jQuery Object

---

This works hand-in-hand with the RaideIO's Traffic API. The API is available in [PHP](https://github.com/RaideIO/PHP/tree/master/Traffic).

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
