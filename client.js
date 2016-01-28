const config = require('./config.json'),
    suspend = require('suspend'),
    request = require('request'),
    querystring = require('querystring'),
    parseString = require('xml2js').parseString,
    url = 'https://dynamicdns.park-your-domain.com/update';

let existingIp;

/*
 * Returns a url string with query string.
 */
function generateUrl(host, domain, ip) {
    return url + '?' + querystring.stringify({
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
    let ip = (yield request('https://api.ipify.org', suspend.resume())).body,
        responses,
        interfaceRes;

    // if not changed then do nothing
    if (ip === existingIp) return;

    // update all hosts and domains
    config.domains.forEach(domain => {
        domain.hosts.forEach(host => {
            request(generateUrl(host, domain.name, ip), suspend.fork());
        });
    });
    
    responses = yield suspend.join();
    
    responses.forEach(res => {
        parseString(res.body, suspend.fork());
    });
        
    responses = yield suspend.join();
    
    responses.forEach(res => {
        interfaceRes = res['interface-response'];
        
        if (interfaceRes.ErrCount[0] !== '0') {
            console.error(interfaceRes);
        } else {
            console.log(`ip updated to: ${interfaceRes.IP[0]} @ ${new Date()}`);
        }
    });
    
    existingIp = ip;
}

suspend.run(function* client(){
    yield* checkAndUpdate();
    setTimeout(suspend(client), config.interval);
}, function (err) {
    if (err) console.error(err);
});