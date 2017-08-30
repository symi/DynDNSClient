# simple-dynamic-dns-client
A simple dynamic DNS client written in Node.js. Supporting Node.js v4.2+.

Uses [*dynamicdns.park-your-domain.com*](https://dynamicdns.park-your-domain.com) to update the dynamic dns domain record.

## Installation
```
npm install simple-dynamic-dns-client
```

## Configuration
Create a `config.json` file containing ([see template for example](https://github.com/symi/simple-dynamic-dns-client/blob/master/config.template.json)):

| Property Name | Description | Type |
| --- | --- | --- |
| `interval` | The period of time to wait between checking for an updated ip address in *ms* | `Integer` |
| `domains` | The domains and hosts to update upon an address change | `Array<{name: String, hosts: Array<String>}>` |
| `password` | The password to authenticate against *dynamicdns.park-your-domain.com* | `String` |

## Recommended Usage
It is recommended that a process manager (i.e. [pm2](http://pm2.keymetrics.io/)) is used to keep the client constantly running.
