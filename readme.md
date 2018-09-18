![reports](./screenshots/logo.png 'Reports')

<p align="center">
  <p align="center">Tool to gather lighthouse metrics and supports CRON jobs and webhooks.<p>
  <p align="center"><a href="https://travis-ci.org/boyney123/garie-lighthouse"><img src="https://img.shields.io/travis/boyney123/garie-lighthouse/master.svg" alt="Build Status"></a>
    <a href="https://codecov.io/gh/boyney123/garie-lighthouse/"><img src="https://codecov.io/gh/boyney123/garie-lighthouse/branch/master/graph/badge.svg?token=AoXW3EFgMP" alt="Codecov"></a>
	<a href="https://github.com/boyney123/garie"><img src="https://img.shields.io/badge/plugin%20built%20for-garie-blue.svg" alt="garie"></a>  
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT"></a>

  </p>
</p>

**Highlights**

-   Poll for lighthouse performance metrics on any website and stores the data into InfluxDB
-   Webhook support
-   Understand your performance metrics with recommend improvements thanks to lighthouse reports
-   View all historic lighthouse reports.
-   Setup within minutes

## Overview of garie-lighthouse

Garie-lighthouse was developed as a plugin for the [Garie](https://github.com/boyney123/garie) Architecture.

[Garie](https://github.com/boyney123/garie) is an out the box web performance toolkit, and `garie-lighthouse` is a plugin that generates and stores lighthouse data into `InfluxDB`.

`Garie-lighthouse` can also be run outside the `Garie` environment and run as standalone.

If your interested in an out the box solution that supports multiple performance tools like `lighthouse`, `google-speed-insight` and `web-page-test` then checkout [Garie](https://github.com/boyney123/garie).

If you want to run `garie-lighthouse` standalone you can find out how below.

## Getting Started

### Prerequisites

-   Docker installed

### Running garie-lighthouse

You can get setup with the basics in a few minutes.

First clone the repo.

```sh
git clone git@github.com:boyney123/garie-lighthouse.git
```

Next setup you're config. Edit the `config.json` and add websites to the list.

```javascript
{
	"cron": "00 00 */6 * * *",
	"urls": [
		{
			"url": "https://www.comparethemarket.com",
			"report": true
		},
		{
			"url": "https://www.bbc.co.uk",
			"report": true
		},
		{
			"url": "https://www.cnn.com",
			"report": true
		}
	]
}
```

Once you finished edited your config, lets build our docker image and setup our environment.

```sh
docker build -t garie-lighthouse . && docker-compose up
```

This will build your copy of `garie-lighthouse` and run the application.

On start garie-lighthouse will start to gather performance metrics for the websites added to the `config.json`.

## Data collected

Lighthouse comes with loads of audits out the box. You can view all metrics in the reports.

Garie-lighthouse filters what data is stored into influxDB and returned in the webhook.

| Property                | Type     | Description                             |
| ----------------------- | -------- | --------------------------------------- |
| `performance-score`     | `number` | Overall performance score.              |
| `pwa-score`             | `number` | Overall progressive web app score.      |
| `accessibility-score`   | `number` | Overall accessibility score.            |
| `best-practices-score`  | `number` | Overall best practices score.           |
| `seo-score`             | `number` | Overall seo score.                      |
| `time-to-first-byte`    | `number` | Number of ms to first byte.             |
| `firstContentfulPaint`  | `number` | Number of ms to first contentful paint. |
| `firstMeaningfulPaint`  | `number` | Number of ms to first meaningful paint. |
| `interactive`           | `number` | Number of ms to interactive.            |
| `firstCPUIdle`          | `number` | Number of ms to CPU idle.               |
| `speedIndex`            | `number` | Google speed index.                     |
| `estimatedInputLatency` | `number` | Input Latency.                          |
| `errors-in-console`     | `number` | Number of errors in the console.        |
| `redirects`             | `number` | Number of redirects.                    |
| `redirects`             | `number` | Number of redirects.                    |

## Viewing reports

Viewing lighthouse reports is straight forward. Once you have your application running just go to `localhost:3000/reports` and you should see all the reports lighthouse has generated.

![reports](./screenshots/reports.png 'Reports')
![reports](./screenshots/lighthouse.png 'Reports')

If you don't want to generate reports you can turn this off in the `config.json` by setting `report` to false.

## Webhook

Garie-lighthouse also supports webhooks. You will need to `POST` to `localhost:3000/collect`.

**Payload**

| Property | Type                 | Description                                            |
| -------- | -------------------- | ------------------------------------------------------ |
| `url`    | `string` (required)  | Url to get metrics for.                                |
| `report` | `boolean` (optional) | When set to true a lighthouse report will be generated |

**Payload Example**

```javascript
{
  "url": "https://www.bbc.co.uk",
  "report": true
}
```

_By default, reports on webhook's are not generated unless you set `report` to true_

## config.json

| Property | Type                | Description                                                                          |
| -------- | ------------------- | ------------------------------------------------------------------------------------ |
| `cron`   | `string` (optional) | Cron timer. Supports syntax can be found [here].(https://www.npmjs.com/package/cron) |
| `urls`   | `object` (required) | Config for lighthouse. More detail below                                             |

**urls object**

| Property         | Type                 | Description                                               |
| ---------------- | -------------------- | --------------------------------------------------------- |
| `url`            | `string` (required)  | Url to get lighthouse metrics for.                        |
| `plugins`        | `object` (optional)  | To setup custom lighthouse config.                        |
| `plugins.name`   | `string` (required)  | Needs to be set to `lighthouse`                           |
| `plugins.report` | `boolean` (optional) | If set to true, lighthouse report will also be generated. |

## Example

```javascript
{
  "url": "https://www.bbc.co.uk",
  "plugins": [
	  {
		  "name": "lighthouse",
		  "report": true
	  }
  ]
}
```
