// Safely parse JSON (handles 204/205, empty body, and non-JSON responses)
async function parseJsonSafe(response) {
  try {
    if (response.status === 204 || response.status === 205) {
      return null;
    }
    var text = await response.text();
    if (!text) {
      return null;
    }
    return JSON.parse(text);
  } catch (_e) {
    return null;
  }
}

// Unified response handling (friendly message + throw)
async function handleResponse(response) {
  var data = await parseJsonSafe(response);

  if (response.ok) {
    return data;
  } else {
    console.error("Detailed error:", { status: response.status, data: data });

    // Build a user-facing message from the payload if present
    var userMessage = "Something went wrong!";
    if (data && data.message) {
      userMessage = data.message;
    }

    var field = "";
    if (data && data.field) {
      field = " [Field: " + data.field + "]";
    }

    var code = "";
    if (data && data.code) {
      code = " [Code: " + data.code + "]";
    }

    alert("FAILED: " + userMessage + field + code);

    var err = new Error(userMessage);
    err.status = response.status;
    err.payload = data;
    throw err;
  }
}

// Safe fetch wrapper with minimal loader, callbacks, and timeout
async function safeFetch(url, options, callbacks) {
  if (!options) {
    options = {};
  }
  if (!callbacks) {
    callbacks = {};
  }

  // Resolve callbacks and flags without ternary
  var onSuccess = callbacks.onSuccess;
  if (typeof onSuccess !== "function") {
    onSuccess = function () {};
  }

  var onError = callbacks.onError;
  if (typeof onError !== "function") {
    onError = function () {};
  }

  var showLoading = callbacks.showLoading;
  if (typeof showLoading !== "boolean") {
    showLoading = true; // default
  }

  var timeoutMs = callbacks.timeoutMs;
  if (typeof timeoutMs !== "number") {
    timeoutMs = 10000; // default 10s
  }

  // Minimal loader (keeps your old #loader behavior)
  var loader;
  if (showLoading) {
    loader = document.createElement("div");
    loader.innerText = "Loading...";
    loader.id = "loader";
    document.body.appendChild(loader);
  }

  // Abort on timeout
  var controller = new AbortController();
  var timer = setTimeout(function () {
    controller.abort();
  }, timeoutMs);

  try {
    // Merge options + signal (avoids spread/ternary)
    var merged = {};
    for (var k in options) {
      if (Object.prototype.hasOwnProperty.call(options, k)) {
        merged[k] = options[k];
      }
    }
    merged.signal = controller.signal;

    var response = await fetch(url, merged);
    var data = await handleResponse(response);
    onSuccess(data);
    return data;
  } catch (err) {
    var msg;
    if (err && err.name === "AbortError") {
      msg = "Request timeout";
    } else if (err && err.message) {
      msg = err.message;
    } else {
      msg = "Unknown error";
    }
    console.error("🔴 safeFetch Error:", msg, err);
    alert("⚠️ Error: " + msg);
    onError(err);
    return null; // keep the same contract as your original code
  } finally {
    clearTimeout(timer);
    if (loader) {
      loader.remove();
    }
  }
}

// Expose globally (browser)
window.safeFetch = safeFetch;
window.handleResponse = handleResponse;
window.parseJsonSafe = parseJsonSafe;
