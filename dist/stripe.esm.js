var V3_URL = 'http://ec2-52-22-196-75.compute-1.amazonaws.com/v3';

var injectScript = function injectScript() {
  var script = document.createElement('script');
  script.src = V3_URL;
  var headOrBody = document.head || document.body;

  if (!headOrBody) {
    throw new Error('Expected document.body not to be null. Stripe.js requires a <body> element.');
  }

  headOrBody.appendChild(script);
  return script;
};

var registerWrapper = function registerWrapper(stripe) {
  if (!stripe || !stripe._registerWrapper) {
    return;
  }

  stripe._registerWrapper({
    name: 'stripe-js',
    version: "1.3.2"
  });
}; // Execute our own script injection after a tick to give users time to
// do their own script injection.


var stripePromise = Promise.resolve().then(function () {
  if (typeof window === 'undefined') {
    // Resolve to null when imported server side. This makes the module
    // safe to import in an isomorphic code base.
    return null;
  }

  if (window.Stripe) {
    return window.Stripe;
  }

  var script = document.querySelector("script[src=\"".concat(V3_URL, "\"], script[src=\"").concat(V3_URL, "/\"]")) || injectScript();
  return new Promise(function (resolve, reject) {
    script.addEventListener('load', function () {
      if (window.Stripe) {
        resolve(window.Stripe);
      } else {
        reject(new Error('Stripe.js not available'));
      }
    });
    script.addEventListener('error', function () {
      reject(new Error('Failed to load Stripe.js'));
    });
  });
});
var loadCalled = false;
stripePromise["catch"](function (err) {
  if (!loadCalled) console.warn(err);
});
var loadStripe = function loadStripe() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  loadCalled = true;
  return stripePromise.then(function (maybeStripe) {
    if (maybeStripe === null) {
      return null;
    }

    var stripe = maybeStripe.apply(void 0, args);
    registerWrapper(stripe);
    return stripe;
  });
};

export { loadStripe };
