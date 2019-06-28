const log = require('loglevel');
const devMode = process.env.NODE_ENV !== 'live'
const fs = require("fs");
const request = require("request");

function prepareUrl() {
    return `http://selfservice-api${devMode ? '.alpha' : ''}.redmart.com/v1.0.0/support/icms/all`;
}

function prepareInlineLibs() {
    const infix = devMode ? '.debug' : '';

    const lazUrls = [
        `//laz-g-cdn.alicdn.com/mtb/??3rd/0.0.10/require.js`,
        `//laz-g-cdn.alicdn.com/mtb/??lib-promise/3.0.1/polyfillB${infix}.js`,
        `//laz-g-cdn.alicdn.com/mtb/??lib-env/1.9.9/env${infix}.js`,
        `//laz-g-cdn.alicdn.com/mtb/??lib-mtop/2.4.11/mtop${infix}.js`,
        `//laz-g-cdn.alicdn.com/mtb/??lib-mtop/1.6.3/middleware${infix}.js`,
        `//laz-g-cdn.alicdn.com/mtb/??lib-windvane/2.1.8/windvane${infix}.js`
    ];

    return lazUrls.map(j => `<script src="${j}"></script>`).reduce((s1, s2) => s1 + s2);
}

function fetchComponent() {
    //const file = fs.createWriteStream("data.txt");
    const url = prepareUrl();
    log.info('Calling', url);

    return new Promise(function (resolve, reject) {
        // Do async job
        request(url, function (err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        })
    })
}

fetchComponent().then(result => {
    const desktopTemplate = prepareTemplate(result.desktop.head, result.desktop.header, result.desktop.footer, false);
    fs.writeFileSync('desktop.html', desktopTemplate);
    log.info('[TEMPLATE] Desktop template ready');

    const mobileTemplate = prepareTemplate(result.mobile.head, result.mobile.header, result.mobile.footer, true);
    fs.writeFileSync('mobile.html', mobileTemplate);
    log.info('[TEMPLATE] MOBILE template ready');
});

function prepareTemplate(head, header, footer, isMobile) {
    return `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <link rel="shortcut icon" href="//laz-img-cdn.alicdn.com/tfs/TB1f5qJef6H8KJjy0FjXXaXepXa-16-16.ico">
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="description" content="Get help with your RedMart delivery, a recent order, or browse through frequently asked questions.">
        <meta name="keywords" content="RedMart Help Center, RedMart Customer Care, RedMart Support, RedMart Customer Support, RedMart FAQ, RedMart Help, RedMart Issue, RedMart Issues, RedMart Ticket, RedMart Order, RedMart Delivery, Redmart LiveUp">
        ${isMobile ? '<link href="https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i" rel="stylesheet">' : '<link href="https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i" rel="stylesheet">'}
        ${prepareInlineLibs()}
        <script>__rm__env__="${process.env.NODE_ENV}"</script>
        <script>__rm__device__="${isMobile ? 'mobile' : 'desktop'}"</script>
        ${head}
        <!-- Google Analytics -->
        <script>
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
            ga('create', 'UA-26494190-22', 'auto');
        </script>
        <!-- End Google Analytics -->
    </head>
    <body>
        ${header}
        <div id="rm-cs-app"></div>    
        ${isMobile ? '' : footer}
    </body>
</html>`;
}