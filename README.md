Proof-of-Concept, play-area to demonstrate feasibility of recreating `pmview` using modern browser technologies. 

Prerequisites
=============

1. Latest [PCP](https://pcp.io) installation with modern `pmwebapi`
1. `pmproxy` running on a host accessible 
    1. `/etc/pcp/pmproxy.options` will need the `--timeseries` option added (it's not by default)
    1. `pmlogger` collecting metrics on the same host as `pmproxy` to feed `redis`
1. `redis-server` v5.x+ running along side `pmproxy`

Installation
============

* [Install `npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) - JavaScript package manager/build
* `npm install -g http-server` - this will install a simple local HTTP server to serve content
* `npm install` 
* `npm run watch` - this will build/bundle/package ready to execute in the browser
* [In a separate terminal window within the code directory] `http-server` 
* Open a browser to [http://localhost:8080]

Demo
====

1. Configure the Host & Port to point to your running instance of `pmproxy` - defaults to `localhost:44322`
1. Select a metric from the Metric Selection drop down (it doesn't matter what is selected for this POC)
1. Choose an Instance value that is mapped to that metric value
1. Click "Add Disk" button
1. Click "Start Animation" 