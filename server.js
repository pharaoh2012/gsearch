var http = require('http');
var https = require("https");
var url = require('url');
var qs = require('querystring');

var server = http.createServer(function(req, res) {

	if (req.url === "/favicon.ico") {
		res.writeHead(404, {});
		res.end('not found');
	}

	var u = url.parse(req.url);
	if (u.pathname === "/search") {
		var query = qs.parse(u.query);
		if (!query.q) {
			res.end("usage: /search?q=...");
			return;
		}
		var options = {
			hostname: "www.google.com",
			port: 443,
			path: req.url,
			headers: {
				"Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.6,en-US;q=0.4,en;q=0.2",
				"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.104 Safari/537.36",
				"Cookie": "PREF=ID=047808f19f6de346:U=0f62f33dd8549d11:FF=2:LD=zh-CN:NW=1:TM=1325338577:LM=1332142444:GM=1:SG=2:S=rE0SyJh2w1IQ-Maw"
			}
		};

		var request = https.request(options, function(response) {
			var data = "";
			response.on("data", function(d) {
				data += d;
			});
			response.on("end", function(d) {
				data += d;
				res.end(data);
			});

		}).on("error", function(err) {
			var googleurl = "https://www.google.com" + req.url;
			var baiduurl = "https://www.baidu.com/s?wd=" + query.q;
			res.writeHead(200, {
				"Content-Type": "text/html;charset=utf-8"
			});

			res.end(err.message + "<br /><a href='" + googleurl + "'>" + googleurl + "</a>" +
				"<br /><a href='" + baiduurl + "'>" + baiduurl + "</a>");
		});
		request.setTimeout(5000,function(){
			request.abort();
		});
		request.end();
		return;
	}

	res.end("usage: /search?q=...");

});

server.listen(process.env.VCAP_APP_PORT || 8888);