$(function() {
	var router = new Router({
   		container: '#container',
   		enterTimeout : 200,
   		leaveTimeout : 250
	});
	
	//用户路由
	var adminList = {
		url : "/adminList",
		className :  "adminList",
		ajaxData : function() {
			var that = this;
			return $._ajax({
				url  : "/admin/admin",
				type : "get"
			}).done(function( data ) {
				that.data = data;
			});
		},
		render : function() {
			return ejs.render($("#adminList").html(),{admins:this.data});
		}
	}
	
	var adminAdd = {
		url : "/adminAdd",
		render : function() {
			return $("#adminAdd").html();
		},
		bind : function() {
			var t = $(this);
			t.find("#sub").click(function(){
				var aname = t.find("#aname").val();
				var email = t.find("#email").val();
				var password = t.find("#password").val();
				
				if( $.validate.isEmpty(aname) == false ) {
					return t.find(".alert").alterMes({message:"用户名不能为空!"});
				}
				if( $.validate.isEmpty(email) == false ) {
					return t.find(".alert").alterMes({message:"邮箱不能为空!"});
				}
				if( $.validate.isEmpty(password) == false ) {
					return t.find(".alert").alterMes({message:"密码不能为空!"});
				}
				if( $.validate.isEmail(email) == false ) {
					return t.find(".alert").alterMes({message:"邮箱格式不正确!"});
				}
				
				//提交ajax
				$._ajax({
					url : "/admin/admin",
					data : {"aname":aname,"email":email,"password":password}
				}).done(function( obj ){
					if( obj.code ) {
						//如果增加成功，返回列表
						location.href = "/admin/index#/adminList";
					} else {
						t.find(".alert").alterMes({type:"danger",message:obj.msg})
					}
				});
			});
		}
	}
	
	var adminDel = {
		url : "/adminDel/:id",
		ajaxData : function() {
			var t = this;
			$._ajax({
				url : "/admin/admin/" + t.params.id,
				type : "delete"
			}).done(function() {
				location.href = "/admin/index#/adminList";
			});
			
			return false; //停止路由
		}
	}
	
	//商品分类路由
	var typeList = {
		url : "/typeList",
		ajaxData : function() {
			var that = this;
			return $._ajax({
				url  : "/admin/producttype",
				type : "get"
			}).done(function( data ) {
				that.data = data;
			});
		},
		render : function() {
			return ejs.render($("#typeList").html(),{types:this.data});
		}
	}
	
	var typeAdd = {
		url : "/typeAdd",
		render : function() {
			return ejs.render($("#typeAdd").html(),{types:this.data});
		},
		ajaxData : function() {
			var that = this;
			return $._ajax({
				url  : "/admin/producttype/0",
				type : "get"
			}).done(function( data ) {
				that.data = data;
			});
		},
		bind : function() {
			var t = $(this);
			t.find("#sub").click(function(){
				var typename = t.find("#typename").val();
				var typeinfo = t.find("#typeinfo").val();
				var pid = t.find("#pid").val();
				
				if( $.validate.isEmpty(typename) == false ) {
					return t.find(".alert").alterMes({message:"分类名不能为空!"});
				}
				if( $.validate.isEmpty(typeinfo) == false ) {
					return t.find(".alert").alterMes({message:"分类描述不能为空!"});
				}
				
				//提交ajax
				$._ajax({
					url : "/admin/producttype",
					data : {"typename":typename,"typeinfo":typeinfo,"pid":pid}
				}).done(function( obj ){
					if( obj.code ) {
						//如果增加成功，返回列表
						location.href = "/admin/index#/typeList";
					} else {
						t.find(".alert").alterMes({type:"danger",message:obj.msg})
					}
				});
			});
		}
	}
	
	var typeDel = {
		url : "/typeDel/:id",
		ajaxData : function() {
			var t = this;
			$._ajax({
				url : "/admin/producttype/" + t.params.id,
				type : "delete"
			}).done(function() {
				location.href = "/admin/index#/typeList";
			});
			
			return false; //停止路由
		}
	}
	
	//商品路由
	var proList = {
		url : "/proList",
		ajaxData : function() {
			var that = this;
			return $._ajax({
				url  : "/admin/product",
				type : "get"
			}).done(function( data ) {
				that.data = data;
			});
		},
		render : function() {
			return ejs.render($("#proList").html(),{products:this.data});
		}
	}
	
	var proAdd = {
		url : "/proAdd",
		ajaxData : function() {
			var that = this;
			return $._ajax({
				url  : "/admin/producttype",
				type : "get"
			}).done(function( data ) {
				that.data = data;
			});
		},
		render : function() {
			return ejs.render($("#proAdd").html(),{types:this.data});
		},
		bind :function() {
			var t = $(this);
			t.find("#sub").click(function(){
				var pname = t.find("#pname").val();
				var price = t.find("#price").val();
				var strock = t.find("#strock").val();
				var type = t.find("#type").val();
				
				if( $.validate.isEmpty(pname) == false ) {
					return t.find(".alert").alterMes({message:"商品名称不能为空!"});
				}
				if( $.validate.isEmpty(price) == false ) {
					return t.find(".alert").alterMes({message:"商品价格不能为空!"});
				}
				if( $.validate.isEmpty(strock) == false ) {
					return t.find(".alert").alterMes({message:"商品库存不能为空!"});
				}
				
				var data = new FormData();
				data.append("pname",pname);
				data.append("price",price);
				data.append("strock",strock);
				data.append("type",type);
				data.append("upfile",t.find("#imgpath").get(0).files[0]);
				
				$._ajax({
					url : "/admin/product",
					data : data,
					cache: false,
		            processData: false,
		            contentType: false
				}).done(function( obj ) {
					if( obj.code ) {
						location.href = "/admin/index#/proList";
					} else {
						t.find(".alert").alterMes({type:"danger",message:obj.msg});
					}
				});
			});
			
			t.find("#imgpath").change(function(){
				var file = this.files[0];
				if( file.type.indexOf("image") == -1 ) {
					$(this).val("");
					t.find(".alert").alterMes({type:"danger",message:"只能上传图片"});
					return false;
				}
				
				if( file.size > (1024 * 512) ) {
					$(this).val("");
					t.find(".alert").alterMes({type:"danger",message:"只能上传小于512K的图片"});
					return false;
				}
				
				var fr = new FileReader();
				fr.readAsDataURL(file);
				fr.onload = function() {
					$("#showimg").attr("src",fr.result);
				}
			});
		}
	}
	
	var proDel = {
		url : "/proDel/:pid",
		ajaxData : function() {
			var t = this;
			$._ajax({
				url : "/admin/product/" + t.params.pid,
				type : "delete"
			}).done( function( obj ){
				location.href = "/admin/index#/proList";
			});
			
			return false;
		}
	}
	
	//新闻路由
	var newsList = {
		url : "/newsList",
		ajaxData : function() {
			var that = this;
			return $._ajax({
				url : "/admin/news",
				type : "get"
			}).done(function( data ) {
				that.data = data;
			});
		},
		render : function() {
			return ejs.render($("#newsList").html(),{news:this.data});
		}
	}
	var newsAdd = {
		url : "/newsAdd",
		render : function() {
			return $("#newsAdd").html();
		},
		bind : function() {
			var t = $(this);
			
			t.find('#editor').wysiwyg();
			t.find("#sub").click(function() {
				var ntitle = t.find("#ntitle").val();
				var ncontent = t.find("#editor").html();
				
				//验证
				if( $.validate.isEmpty(ntitle) == false ) {
					return t.find(".alert").alterMes({message:"新闻标题不能为空!"});
				}if( $.validate.isEmpty(ncontent) == false ) {
					return t.find(".alert").alterMes({message:"新闻内容不能为空!"});
				}
				
				//提交
				$._ajax({
					url : "/admin/news",
					data : {ntitle:ntitle,ncontent:ncontent}
				}).done(function( obj ) {
					if( obj.code ) {
						location.href = "/admin/index#/newsList";
					} else {
						t.find(".alert").alterMes({type:"danger",message:obj.msg});
					}
				});
			});
		}
	}
	
	var newsDel = {
		url : "/newsDel/:nid",
		ajaxData : function() {
			var that = this;
			$._ajax({
				url : "/admin/news/" + that.params.nid,
				type : "delete"
			}).done(function(){
				location.href = "/admin/index#/newsList";
			});
			return false;
		}
	}
	
	//新闻预览
	var preview = {
		url : "/preview/:nid",
		ajaxData : function() {
			var that = this;
			return $._ajax({
				url : "/admin/news/" + that.params.nid,
				type : "get"
			}).done(function( data ){
				that.data = data;
			});
		},
		render : function() {
			return ejs.render($("#newspreview").html(),{n:this.data[0]});
		}
	}
	
	var home = {
		url : "/",
		render : function() {
			return "<div><h1>欢迎</h1><div>"
		}
	}
	
	router.push(adminList)
		  .push(home)
		  .push(adminAdd)
		  .push(adminDel)
		  .push(typeList)
		  .push(typeAdd)
		  .push(typeDel)
		  .push(proList)
		  .push(proAdd)
		  .push(proDel)
		  .push(newsList)
		  .push(newsAdd)
		  .push(newsDel)
		  .push(preview)
		  .setDefault('/').init();
});