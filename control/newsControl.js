var newsControl = function() {};

newsControl.prototype.newsList = function( req,res,next ) {
	var ep = new EventProxy();
	dataSource.getConn(ep);
	if( req.params.pid ) {
		adminModule.newsList(ep,[req.params.pid]);
	} else {
		adminModule.newsList(ep);
	}
	
	ep.on("success",function( data ) {
		res.json(data).end();
	});
	ep.fail(function( err ){
		next(err);
	});
}

newsControl.prototype.newsAdd = function( req,res,next ) {
	var ep = new EventProxy();
	dataSource.getConn(ep);
	adminModule.newsAdd(ep,[req.body.ntitle,req.body.content,req.body.pubdate,req.body.aid]);
	ep.on("success",function( data ) {
		if( data.insertId ) {
			res.json(config.info.suc).end();
		} else {
			res.json(config.error.newsAddErr).end();
		}
	});
	ep.fail(function( err ){
		next(err);
	});
}

newsControl.prototype.newsDel = function( req,res,next ) {
	var ep = new EventProxy();
	dataSource.getConn(ep);
	console.log(req.params.id);
	adminModule.newsDel(ep,[req.params.id]);
	ep.on("success",function() {
		res.json(config.info.suc).end();
	});
	ep.fail(function( err ){
		next(err);
	});
}


module.exports = function() {
	return new newsControl();
}
