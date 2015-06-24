var config = require('./config.json'),
    co = require('co'),
    request = require('co-request'),
    querystring = require('querystring'),
    existingIp;

/*
 * Returns a url string with query string.
 */
function generateUrl(host, domain, ip) {
    return config.url + '?' + querystring.stringify({
        domain: domain,
        host: host,
        password: config.password,
        ip: ip
    });
}

/*
 * Check ip, if changed then update for all domains and hosts.
 */
function* checkAndUpdate() {
    // get our ip
    var ip = (yield request('https://api.ipify.org')).body;

    // if not changed then do nothing
    if (ip === existingIp) return;

    // update all hosts and domains
    config.domains.forEach(function* (domain) {
        domain.hosts.forEach(function* (host) {
            yield request(generateUrl(host, domain.name, ip));
        });
    });

    existingIp = ip;
    console.log('ip updated to: ' + ip + ' @ ' + new Date());
}

co(function* client(){
    yield checkAndUpdate();
    setInterval(co.wrap(client), config.interval);
}).catch(function (error) {
    console.err(error);
});
