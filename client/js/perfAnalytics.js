// Client PerfAnalytic JS

class Performance {
    // Variables
    #metrics; // # is for to make it private
    #BASE_URL = "https://service-perf-analytics.herokuapp.com";
    performance;

    constructor() {
        this.performance = performance.getEntriesByType("navigation")[0];
        this.#metrics = {
            ttfb: null,
            domLoad: null,
            windowLoad: null,
            fcp: null,
            resources: null,
        };
        this.getMetrics();
    }

    convertMsToSec = (ms) => ms / 1000;

    getMetrics = () => {
        this.getTTFB();
        this.getFCP();
        this.getDOMLoad();
        this.getWindowLoad();
        this.#metrics.resources = this.#getResources();
        this.#metrics = {
            ...this.#metrics,
            UserAgent: navigator.userAgent,
            URL: window.location.href,
        };
    };

    getTTFB = () => {
        this.#metrics.ttfb = this.convertMsToSec(this.performance.responseStart - this.performance.requestStart);
    };

    getDOMLoad = () => {
        this.#metrics.domLoad = this.convertMsToSec(this.performance.domComplete);
    };

    getWindowLoad = () => {
        this.#metrics.windowLoad = this.convertMsToSec(this.performance.loadEventStart - this.performance.loadEventEnd);
    };

    getFCP = () => {
        const fcp = 
            window.performance
            .getEntriesByType("paint")
            .find((element) => element.name === "first-contentful-paint");
        if (fcp.startTime) {
            this.#metrics.fcp = this.convertMsToSec(fcp.startTime);
        }
    };

    #getResources = () => {
        const entries = performance.getEntriesByType("resource");
      
        return entries.map((entry) => {
            return {
                name: entry.name,
                initiatorType: entry.initiatorType,
                responseEnd: this.convertMsToSec(entry.responseEnd),
                transferSize: entry.transferSize,
            };
        });
    };

    request = () => {
        if (!navigator.sendBeacon) {
            console.log('NoN Beacon', this.#metrics);
            fetch(`${this.#BASE_URL}/metrics/collect-metrics`, {
                method: "POST",
                body: this.#metrics,
            })
            .then((response) => console.log(response.body.message))
            .catch((err) => console.error(err));
        } else {
            console.log('Beacon', this.#metrics);
            navigator.sendBeacon(
                `${this.#BASE_URL}/metrics/collect-metrics`,
                this.#metrics
            );
        }
    };
}

window.addEventListener("load", () => {
    const perfCalc = new Performance();
    perfCalc.request();
});