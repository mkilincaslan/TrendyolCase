"use strict";

const MetricModel = require("../models/Metrics");

let metrics = [],
    metric;

module.exports = {
    getMetricsBetweenSpecificDates: async (startDate, endDate) => {
        try {
            metrics = await MetricModel.find(
                {
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            );
        } catch (error) {
            throw new Error(error.message);
        }

        return metrics;
    },

    getMetricsByLast30Mins: async () => {
        try {
            const date = new Date();
            const localeDate = Date(date.toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" }));

            console.log("Make request with", new Date(localeDate), "--> for last 30mins");
            metrics = await MetricModel.find(
                {
                    createdAt: {
                        $gte: new Date(new Date(localeDate).getTime() - (1000 * 60 * 30)),
                    },
                },
            );
        } catch (error) {
            throw new Error(error.message);
        }

        return metrics;
    },

    createMetric: async (data) => {
        try {
            metric = await MetricModel.create(data);
        } catch (error) {
            throw new Error(error.message);
        }

        return metric;
    },
};
