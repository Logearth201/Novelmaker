var initdata_gameinit = null;
function isSmartPhone(){
    var ua = navigator.userAgent;
    if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
        return true;
    }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
        return true;
    }else{
        return false;
    }
}
var soundplayable = true;
function MusicArray(s0,isNoneSound,isloop0){
	this.str = s0;
	this.isMusic = isNoneSound;
	try{
		this.musicobj = new Audio("");
	}catch(e){
		this.musicobj = {loaded:false};
		this.musicobj.error = true;
	}
	this.musicobj.loaded = false;
	this.musicobj.error = false;
	this.isjingle = !isloop0;
}
MusicArray.prototype.play = function(){
	if(!this.musicobj.loaded || !soundplayable)return;
	//BGM
	if(this.isMusic){
		globalk_m.stopall();
		this.musicobj.currentTime = 0;
		this.musicobj.play();
	}else if(!this.musicobj.paused){
		this.musicobj.pause();
		this.musicobj.currentTime = 0;
		this.musicobj.play();
	}else{
		this.musicobj.currentTime = 0;
		this.musicobj.play();
	}
};
MusicArray.prototype.pause = function(){
	if(!this.musicobj.loaded || !soundplayable)return;
	this.musicobj.pause();
};
MusicArray.prototype.stop = function(){
	if(!this.musicobj.loaded || !soundplayable)return;
	this.musicobj.pause();
	this.musicobj.currentTime = 0;
};

var globalk_m = new Music();
function Music(){
	this.music = [];
}
Music.prototype.stopall = function(){
	for(var i=0;i<=this.music.length-1;i++){
		this.music[i].pause();
		this.music.currentTime = 0;
	}
};
Music.prototype.append = function(ft){
	this.music[this.music.length] = ft;
};
var musicloadnum = 0;
function MusicLoader(a0,nextgo){
	//ロードする配列組み
	this.loadarray = a0;
	this.loadnum = 0;
	this.next = nextgo;
	
	//ロード時間の管理
	this.loadtime = 0;
	
	//スマホであれば読み込まない
	this.sp = isSmartPhone();
	
	//タイムアウト回数
	this.timeout = 0;
}
MusicLoader.prototype.draw = function(){
	if(this.loadarray.length !== 0 && !this.sp && soundplayable){
		//ロードセット
		if(this.loadtime === 0){
			this.set(this.loadarray[this.loadnum]);
			this.loadtime = 1;
		}
		//ロード確認
		//読み込みバーの描画
		ctx.textAlign = "center";
		ctx.textBaseline = "bottom";
		ctx.fillStyle = "#FFFFFF";
		ctx.font = "25px 'ＭＳ Ｐ明朝 '";
		ctx.fillText("BGMを読み込んでいます。",initwidth*0.5,initheight*0.4);
		ctx.fillRect(initwidth*0.22,initheight*0.42,initwidth*0.56,initheight*0.16);
		ctx.fillStyle = "#FF0044";
		ctx.fillRect(initwidth*0.25,initheight*0.45,initwidth*0.50*(this.loadnum/this.loadarray.length),initheight*0.10);
		//読み込みバー
		if(this.loadarray[this.loadnum].musicobj.loaded){
			this.loadnum++;
			this.loadtime = 0;
			this.timeout = 0;
			if(this.loadnum === this.loadarray.length){
				scene = this.next;
			}
		}else if(this.loadarray[this.loadnum].musicobj.error){
			this.loadnum++;
			this.loadtime = 0;
			this.timeout = 0;
			if(this.loadnum === this.loadarray.length){
				scene = this.next;
			}
		}
		
	}else{
		scene = this.next;
	}
};
MusicLoader.prototype.set = function(ma){
	try{
		ma.musicobj.addEventListener("canplaythrough" , function(){
			globalk_m.append(this);
			this.loaded = true;
		},false);
		ma.musicobj.addEventListener("abort" , function(){
			console.log("abort to load file.");
			this.error = true;
		},false);
		ma.musicobj.addEventListener("stalled" , function(){
			console.log("stalled to load file.");
			this.error = true;
		},false);
		ma.musicobj.addEventListener("error" , function(){
			console.log("failed to load file."+this.src);
			this.error = true;
		},false);
		if(ma.isMusic && !ma.isjingle){
			ma.musicobj.addEventListener("ended",function(){
				this.pause();
				this.currentTime = 0;
				this.play();//for loop
			},false);
		}
		//ロードする音楽のタイプを指定する
		var canPlayOgg = ("" !== ma.musicobj.canPlayType("audio/ogg"));
		var canPlayMp3 = ("" !== ma.musicobj.canPlayType("audio/mpeg"));
		var canPlayWav = ("" !== ma.musicobj.canPlayType("audio/wav"));
		
		if(ma.isMusic){
			if(canPlayOgg){
				ma.musicobj.src = ma.str + ".ogg";
			}else if(canPlayMp3){
				ma.musicobj.src = ma.str + ".mp3";
			}else{
				ma.musicobj.error = true;
				return;
			}
			ma.musicobj.volume = 0.7;
			ma.musicobj.loop = !ma.isjingle;
		}else{
			if(canPlayWav){
				ma.musicobj.src = ma.str + ".wav";
			}else if(canPlayMp3){
				ma.musicobj.src = ma.str + ".mp3";
			}else{
				ma.musicobj.error = true;
				return;
			}
			ma.musicobj.loop = false;
		}
	}catch(e){
		alert("IE8はAudioに非対応です。効果音なしとなります。\n効果音が必要ならGoogle Chromeなどを使用してください\n(※なくてもクリアは可能です)");
		soundplayable = false;
		scene = this.next;
	}
};
var mousex=0,mousey=0,mouseclick=false,mousedowns=false,mouseshot=false;
var scene,ctx,timer,isSyorityuu=false,clickguard=false,clickguard2=false,shotguard=false,shotguard2=false,scale=1.0,smartphone=false;
var firstloadactivity = false;
var initwidth = 640;
var initheight = 480;
var loop;
var graphics,bgm,se,me;
function init() {
	/* canvas要素のノードオブジェクト */
	var canvas = document.getElementById("novel_canvas");
	/* canvas要素の存在チェックとCanvas未対応ブラウザの対処 */
	if ( ! canvas || !canvas.getContext ) {
		alert("Canvasに対応していません。最新のブラウザをダウンロードしてください。");
		return false;
	}
	/* 2Dコンテキスト */
	ctx = canvas.getContext('2d');
	//スマホチェックおよびリサイズ
	var ua = navigator.userAgent;
	if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
		smartphone = true;
	}else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
		smartphone = true;
	}else{
		smartphone = false;
	}
	if(smartphone){
		canvas.width = document.documentElement.clientWidth;
		canvas.height = Math.floor(canvas.width * initheight / initwidth);
	}
	
	scale = canvas.width / initwidth;
	ctx.scale(scale,scale);
	ctx.fillarc = function(cx,cy,w,h,sa,sg,b){
		if(w === 0 || h === 0)return;
		ctx.translate(cx,cy);
		ctx.scale(1,h/w);
		ctx.beginPath();
		ctx.arc(0,0,w,sa,sg,b);
		ctx.fill();
		//w90h30:hを1/3に
		ctx.setTransform(scale,0,0,scale,0,0);
	};
	ctx.strokearc = function(cx,cy,w,h,sa,sg,b){
		if(w === 0 || h === 0)return;
		ctx.translate(cx,cy);
		ctx.scale(1,h/w);
		ctx.beginPath();
		ctx.arc(0,0,w,sa,sg,b);
		ctx.stroke();
		ctx.setTransform(scale,0,0,scale,0,0);
	};
	loop=function(){
		mouseclick = clickguard || clickguard2;
		clickguard = false;
		clickguard2 = false;
		mouseshot = shotguard || shotguard2;
		shotguard = false;
		shotguard2 = false;
		isSyorityuu = false;
		//TODO 本番用はここに加える
		isSyorityuu = true;
		//背景を塗りつぶし、透明度をリセットする
		ctx.clearRect(0,0,initwidth,initheight);
		ctx.globalAlpha = 1.0;
		ctx.fillStyle = "#000000";
		ctx.fillRect(0,0,initwidth,initheight);
		//中心物体の描画
		scene.draw();
		
		timer = setTimeout(loop,20);
	};
	canvas.addEventListener("mousedown",function(e){
		var rect = e.target.getBoundingClientRect();
		mousex = (e.clientX - rect.left) / scale;
		mousey = (e.clientY - rect.top) / scale;
		mousedowns = true;
		shotguard = true;
		shotguard2 = true;
	},false);
	canvas.addEventListener("mouseup",function(e){
		var rect = e.target.getBoundingClientRect();
		mousex = (e.clientX - rect.left) / scale;
		mousey = (e.clientY - rect.top) / scale;
		mousedowns = false;
		clickguard = true;
		clickguard2 = true;
	},false);
	canvas.addEventListener("mouseout",function(e){
		mousedowns = false;
		clickguard = false;
		clickguard2 = false;
		mouseclick = false;
	},false);
	if(smartphone){
		canvas.addEventListener("touchmove",function(e){
			var rect = e.target.getBoundingClientRect();
			mousex = (event.touches[0].clientX - rect.left) / scale;
			mousey = (event.touches[0].clientY - rect.top) / scale;
			e.preventDefault();
		},false);
	}else{
		canvas.addEventListener("mousemove",function(e){
			var rect = e.target.getBoundingClientRect();
			mousex = (e.clientX - rect.left) / scale;
			mousey = (e.clientY - rect.top) / scale;
		},false);
	}
	
	//resファイルの操作関連
	graphics = {
		graph : [],
		strarray : [],
		pathstr : [],
		add : function(key,imgpath){
			var i;
			for(i=0;i<=this.strarray.length-1;i++){
				if(this.strarray[i] === key){
					alert("重複した");
					throw "";
				}
			}
			this.graph[i] = new Image();
			this.strarray[i] = key;
			this.pathstr[i] = imgpath;
		},
		getImage : function(key){
			for(var i=0;i<=this.strarray.length-1;i++){
				if(this.strarray[i] === key){
					return this.graph[i];
				}
			}
			alert("ERROR:"+key+"が関連付けられた画像が存在しません。");
			throw "ERROR:"+key+"が関連付けられた画像が存在しません。";
		}
	};

	music = {
		musicarraylist : [],
		strarray : [],
		playing : "",
		add : function(key,imgpath){
			var i;
			for(i=0;i<=this.strarray.length-1;i++){
				if(this.strarray[i] === key){
					alert("重複した");
					throw "";
				}
			}
			this.musicarraylist[i] = new MusicArray(imgpath,true,true);
			this.strarray[i] = key;
		},
		play : function(key){
			if(key === this.playing)return;
			for(var i=0;i<=this.strarray.length-1;i++){
				if(this.strarray[i] === key){
					this.musicarraylist[i].play();
					this.playing = key;
					return;
				}
			}
			alert("ERROR:"+key+"が関連付けられたBGMが存在しません。");
			throw "ERROR:"+key+"が関連付けられたBGMが存在しません。";
		},
		stop : function(){
			for(var i=0;i<=this.strarray.length-1;i++){
				this.musicarraylist[i].stop();
			}
			this.playing = null;
		}
	};
	se = {
		musicarraylist : [],
		strarray : [],
		add : function(key,imgpath){
			var i;
			for(i=0;i<=this.strarray.length-1;i++){
				if(this.strarray[i] === key){
					alert("重複した");
					throw "";
				}
			}
			this.musicarraylist[i] = new MusicArray(imgpath,false,false);
			this.strarray[i] = key;
		},
		play : function(key){
			for(var i=0;i<=this.strarray.length-1;i++){
				if(this.strarray[i] === key){
					this.musicarraylist[i].play();
					return;
				}
			}
			alert("ERROR:"+key+"が関連付けられたBGMが存在しません。");
			throw "ERROR:"+key+"が関連付けられたBGMが存在しません。";
		},
		stop : function(key){
			for(var i=0;i<=this.strarray.length-1;i++){
				if(this.strarray[i] === key){
					this.musicarraylist[i].stop();
					return;
				}
			}
			alert("ERROR:"+key+"が関連付けられたBGMが存在しません。");
			throw "ERROR:"+key+"が関連付けられたBGMが存在しません。";
		}
	};
	me = {
		musicarraylist : [],
		strarray : [],
		add : function(key,imgpath){
			var i;
			for(i=0;i<=this.strarray.length-1;i++){
				if(this.strarray[i] === key){
					alert("重複した");
					throw "";
				}
			}
			this.musicarraylist[i] = new MusicArray(imgpath,true,false);
			this.strarray[i] = key;
		},
		play : function(key){
			for(var i=0;i<=this.strarray.length-1;i++){
				if(this.strarray[i] === key){
					this.musicarraylist[i].play();
					return;
				}
			}
			alert("ERROR:"+key+"が関連付けられたBGMが存在しません。");
			throw "ERROR:"+key+"が関連付けられたBGMが存在しません。";
		},
		stop : function(key){
			for(var i=0;i<=this.strarray.length-1;i++){
				if(this.strarray[i] === key){
					this.musicarraylist[i].stop();
					return;
				}
			}
			alert("ERROR:"+key+"が関連付けられたBGMが存在しません。");
			throw "ERROR:"+key+"が関連付けられたBGMが存在しません。";
		}
	};
	
	datacomplete = initcommand(initdata_gameinit);
	scene = new Loader(graphics.graph,graphics.pathstr,
	new MusicLoader(music.musicarraylist.concat(se.musicarraylist).concat(me.musicarraylist),new Novel(datacomplete.data)));
	loop();
	
}
//
//読み込みパート(画像オンリー)
//
var loadsubekikazu = 0;
var loadednum = 0;
var errorappeared = false;
var loading = false;
var loaded = false;
function Loader(loadimgarray,loadimgstr,aa){
	//画像ファイルの情報
	this.imgarray = loadimgarray;
	this.imgstr = loadimgstr;
	loadsubekikazu = this.imgarray.length;
	if(loadimgarray.length !== loadimgstr.length)alert("warning.loading file length differ");
	this.after = aa;
	
	//もうここで読み込んでしまう
	for(var i=0;i<=loadimgarray.length-1;i++){
		this.imgload(i);
	}
}
Loader.prototype.draw = function(){
	//読み込み中です・・・
	if(loadsubekikazu === loadednum){
		scene = this.after;
		loaded = true;
	}
	//読み込みバーの描画
	ctx.textAlign = "center";
	ctx.textBaseline = "bottom";
	ctx.fillStyle = "#FFFFFF";
	ctx.font = "25px 'ＭＳ Ｐ明朝 '";
	ctx.fillText("読み込んでいます。",initwidth*0.5,initheight*0.4);
	ctx.fillRect(initwidth*0.22,initheight*0.42,initwidth*0.56,initheight*0.16);
	ctx.fillStyle = "#4400FF";
	ctx.fillRect(initwidth*0.25,initheight*0.45,initwidth*0.50*(loadednum/loadsubekikazu),initheight*0.10);
	
};
Loader.prototype.imgload = function(i){
	this.imgarray[i].onload = function(){
		loadednum += 1;
		loading = false;
	};
	this.imgarray[i].onerror = function(){
		if(!errorappeared){
			alert("ファイルの読み込みに失敗しました。更新などを押して、リロードしてください。");
			scene = new Error("#00001 FILE_NOT_FOUND",false);
			errorappeared = true;
		}
	};
	try{
		this.imgarray[i].src = this.imgstr[i];
	}catch(e){
		alert("ファイル"+this.imgstr[i]+"の読み込みに失敗しました。更新などを押して、リロードしてください。");
		scene = new Error(e,false);
	}
	
};
function Error(e){
	this.text = e;
}
Error.prototype.draw = function(){
	ctx.textAlign = "center";
	ctx.textBaseline = "bottom";
	ctx.fillStyle = "#FFFFFF";
	
	ctx.font = "15px 'ＭＳ Ｐ明朝 '";
	ctx.fillText("A ERROR OCUURED!",initwidth*0.50,initheight*0.30);
	ctx.fillText("ERROR:"+this.text,initwidth*0.50,initheight*0.40);
	ctx.fillText("If you see this first time,restart.",initwidth*0.50,initheight*0.50);
	ctx.fillText("Or you see it second, send the screen to log.",initwidth*0.50,initheight*0.70);
};

function initnovelget(){
	return {data:[],add:function(obj){
		for(var i=0;i<=this.data.length;i++){
			if(i === this.data.length){
				this.data[i] = obj;
				break;
			}else if(this.data[i].keyname === obj.keyname){
				alert("キーの名前が重複しています。");
				alert(i+"番目のkey:"+this.data[i].keyname+" 、 加えようとしたobjのキー："+obj.keyname);
				throw "E";
			}
		}
	}};
}

//
//これ以降がゲーム
//

function initcommand(str){
	var novel = initnovelget();
	novel.initscenenum = 0;
	
	//第１引数：attribute（未定）暫定的にnull
	var attribute = {
		test: true,
		begin: null,//nullおよび記述がない場合は、第１要素より処理を始めます。
		imgpath: "src/",
		bgmpath: "src/",
		sepath: "src/"
	};
	var loader = str;
	
	//第２引数：シーン管理
	var scenechank = loader[1];
	for(var i=0;i<=scenechank.length-1;i++){
		novel.add(loader[1][i]);
		if(attribute.begin === loader[1][i][1]){
			novel.initscenenum = i;
		}
	}
	
	//第３引数：タイトル（まだnull）
	if(loader[2] !== null){
		
	}
	
	//第４引数：IMG情報(key,materialpath)
	var imgchank = loader[3];
	for(var i=0;i<=imgchank.length-1;i++){
		graphics.add(imgchank[i][0],attribute.imgpath+imgchank[i][1]);
	}
	
	//第５引数：BGM情報
	var bgmchank = loader[4];
	for(var i=0;i<=bgmchank.length-1;i++){
		music.add(bgmchank[i][0],attribute.bgmpath+bgmchank[i][1]);
	}
	
	//第６引数：SE情報
	var sechank = loader[5];
	for(var i=0;i<=sechank.length-1;i++){
		se.add(sechank[i][0],attribute.sepath+sechank[i][1]);
	}
	return novel;
}

//ここが基底シナリオ
function Novel(scene0){
	this.scene = scene0;
	if(this.scene.length === 0){
		alert("sceneが存在しません。");
		throw "シーンが存在しない";
	}
	this.bv = null;
	this.bv2 = null;
	this.bvtime = 0;//40
	this.bvlimittime = 1;
	this.stand = [[null,null,0,1],[null,null,0,1],[null,null,0,1]];//left,right,center
	this.face = [null];
	
	this.processingscenenum = 0;
	this.flash = {time : 0,power : 1,rgb:"#FFFFFF",limittime : 0};
	this.variable = new Array(128);
	for(var i=0;i<=this.variable.length-1;i++){
		this.variable[i] = 0;
	}
}
Novel.prototype.setvariable = function(i,num){
	if(i >= 0 && i <= this.variable.length-1){
		this.variable[i] = num;
	}
};
Novel.prototype.draw = function(){
	//背景情報の描画
	if(this.bvtime === 0){
		if(this.bv2 !== null){
			ctx.drawImage(this.bv2,0,0,initwidth,initheight);
		}
	}else{
		if(this.bv2 === null)ctx.globalAlpha = this.bvtime / this.bvlimittime;
		if(this.bv !== null){
			ctx.drawImage(this.bv,0,0,initwidth,initheight);
		}
		if(this.bv2 !== null){
			ctx.globalAlpha = 1 - this.bvtime / this.bvlimittime;
			ctx.drawImage(this.bv2,0,0,initwidth,initheight);
		}
		this.bvtime --;
	}
	
	//立ち絵の描画(TODO CENTERのみ実装済みなので、残り)
	for(var i=0;i<=2;i++){
		if(this.stand[i][2] === 0){
			if(this.stand[i][1] !== null){
				ctx.drawImage(this.stand[i][1],160*((3-i)%3)+160-this.stand[i][1].width/2,480-this.stand[i][1].height);
			}
		}else{
			if(this.stand[i][1] === null)ctx.globalAlpha = this.stand[i][2] / this.stand[i][3];
			if(this.stand[i][0] !== null){
				ctx.drawImage(this.stand[i][0],160*((3-i)%3)+160-this.stand[i][0].width/2,480-this.stand[i][0].height);
			}
			ctx.globalAlpha = 1 - this.stand[i][2] / this.stand[i][3];
			if(this.stand[i][1] !== null){
				ctx.drawImage(this.stand[i][1],160*((3-i)%3)+160-this.stand[i][1].width/2,480-this.stand[i][1].height);
			}
			this.stand[i][2] --;
		}
	}
	//シーン情報の描画
	var getkey = this.scene[this.processingscenenum].draw(this);
	if(getkey !== null){
		if(getkey !== "DONOTUSE_FINISH"){
			//返り値のシーンを取得させる。
			var regained = false;
			for(var i=0;i<=this.scene.length-1;i++){
				if(this.scene[i].keyname === getkey){
					this.scene[this.processingscenenum].reset();
					this.processingscenenum = i;
					regained = true;
					break;
				}
			}
			if(!regained){
				alert("エラーが発生しました。コンソールを確認してください。");
				console.log("選択肢の分岐処理についてエラーが発生しました。存在しないキーを参照しているようです。");
				console.log("シーン名："+this.scene[this.processingscenenum].keyname+" における、ジャンプキーの値："+getkey);
				console.log("sceneオブジェクトに加え忘れていないかどうかチェックしてください。");
				console.log("そうでなければ、ジャンプキーの値が正しいかチェックしてください。");
				throw "ERROR";
			}
		}else{
			throw "END";
		}
		
	}
	
	//フラッシュ情報の描画
	if(this.flash.time > 0){
		ctx.globalAlpha = this.flash.time / this.flash.limittime * this.flash.power;
		ctx.fillStyle = this.flash.rgb;
		ctx.fillRect(0,0,initwidth,initheight);
		ctx.globalAlpha = 1.0;
		this.flash.time --;
	}
};


function Scene(chank,keyname0,choosepain){
	this.scene = chank;
	this.nextgo = choosepain;
	if(this.nextgo !== null){
		//選択式の場合
		var tmpchoosetext = [];
		for(var i=0;i<=this.nextgo.length-1;i++){
			tmpchoosetext[i] = this.nextgo[i].text;
		}
		this.choosep = new Choosepain(tmpchoosetext);
	}
	
	
	//undefined check
	if(keyname0 === "" || typeof keyname0 !== "string"){
		alert();
		throw "ERROR:KEYNAME NOT DEFINED OR KEYNAME IS NOT STRING!";
	}else{
		//keyの調査
	}
	this.keyname = keyname0;
	this.scenenum = 0;
}
Scene.prototype.reset = function(){
	this.scenenum = 0;
	for(var i=0;i<=this.scene.length-1;i++){
		this.scene[i].reset();
	}
};
Scene.prototype.draw = function(t){
	if(this.scenenum < this.scene.length){
		if(this.scene[this.scenenum].draw(t)){
			this.scenenum ++;
		}
	}else{
		if(this.nextgo === null){
			scene = new End();
		}else{
			var s = this.choosep.draw();
			if(s !== -1){
				return this.nextgo[s].key;
			}
		}
	}
	return null;
};
Scene.prototype.isgonext = function(){
	//1-4:nextgo -1:end
	return 0;
};
Scene.prototype.choose = function(i){
	return this.nextgo.chooseobj(i);
};





/*
	文章の表示
	
	使い方：txtにあてはめる。
	/:改行コード
*/
var global_donotmodify_textinitx = 50;
var global_donotmodify_textinity = 327;
var global_donotmodify_fontsize = 21;
var global_donotmodify_textfont = global_donotmodify_fontsize+"px 'ＭＳ Ｐ明朝 '";
var global_donotmodify_textgap = 6;
var global_donotmodify_textarealength = 540;
function Logo(str,opentime){
	this.text = str;
	this.time = 0;
	this.length = Math.min(5,this.text.length);
}
Logo.prototype.draw = function(){
	ctx.font = Math.floor(global_donotmodify_fontsize*1.7)+"px 'ＭＳ Ｐ明朝 '";
	ctx.fillStyle = "#FFFFFF";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.globalAlpha = 1.0;
	for(var i=0;i<=this.length-1;i++){
		ctx.fillText(this.text[i],320,240+(global_donotmodify_textgap+global_donotmodify_fontsize)*1.7*(i+(this.length-1)/2));
	}
	this.time ++;
};
function Text(txt0){
	if(typeof txt0 !== "string"){
		alert("エラーが発生しました。コンソールを確認してください。");
		console.log("Text:引数情報：");
		console.log("第一引数："+txt0+" 文字でなければいけない");
	}
	this.temptext = txt0.split("/");
	
	this.time = -1;
}
Text.prototype.init = function(){
	ctx.font = global_donotmodify_textfont;
	this.text = [];
	//文字数ごとに分割する(最大４)
	var linenumber = 0;
	endif:for(var i=0;i<=4;i++){//i:回数
		for(var j=0;j<=this.temptext[linenumber].length-1;j++){
			var leng = ctx.measureText(this.temptext[linenumber].substring(0,j+1)).width;
			//長さがオーバーしている場合、またはlengthが大きすぎる場合
			if(leng > global_donotmodify_textarealength){
				if(j === 0){
					this.text[i] = "";//空欄
				}else{
					this.text[i] = this.temptext[linenumber].substring(0,j);//j+1でない
					this.temptext[linenumber] = this.temptext[linenumber].substring(j,this.temptext[linenumber].length);
				}
				break;
			}else if(j === this.temptext[linenumber].length-1){
				this.text[i] = this.temptext[linenumber];
				linenumber ++;
				if(linenumber === this.temptext.length){
					break endif;
				}else{
					break;
				}
				
			}
		}
	}
	
	//打ち切り点の算出
	this.nowposition = [0,0];
	if(this.text.length !== 0){
		this.limit = [this.text.length,this.text[this.text.length-1].length];
	}else{
		this.limit = [0,0];
	}
};
Text.prototype.draw = function(t){
	//文章の吐出
	if(this.time === -1){
		this.init();
		this.time = 0;
	}
	ctx.globalAlpha = 0.7;
	ctx.fillRect(0,320,640,160);
	ctx.globalAlpha = 1.0;
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.font = global_donotmodify_textfont;
	ctx.fillStyle = "#FFFFFF";
	for(var i=0;i<=Math.min(this.nowposition[0],this.text.length-1);i++){
		if(this.nowposition[0] === i){
			ctx.fillText(this.text[i].substring(0,this.nowposition[1]+1),global_donotmodify_textinitx,global_donotmodify_textinity+(global_donotmodify_textgap+global_donotmodify_fontsize)*i);
		}else{
			ctx.fillText(this.text[i],global_donotmodify_textinitx,global_donotmodify_textinity+(global_donotmodify_textgap+global_donotmodify_fontsize)*i);
		}
	}
	
	//文章を進める
	if(this.nowposition[0] < this.limit[0]){
		this.nowposition[1] ++;
		if(this.nowposition[1] === this.text[this.nowposition[0]].length){
			this.nowposition[0] ++;
			this.nowposition[1] = 0;
		}
		if(mouseclick){
			this.nowposition[0] = this.limit[0];
		}
	}else{
		ctx.textAlign = "right";
		ctx.textBaseline = "bottom";
		ctx.fillText("↓",630,470+3*Math.sin(this.time/15));
		if(mouseclick){
			return true;
		}
		
	}
	this.time ++;
	return false;
};
Text.prototype.reset = function(){
	this.time = 0;
	this.nowposition[0] = 0;
	this.nowposition[1] = 0;
};

function Choosepain(txt){
	this.text = txt;
	this.time = 0;
}
Choosepain.prototype.draw = function(t){
	if(this.text.length != 1){
		//文章の吐出
		var chooseposition = -1;
		ctx.globalAlpha = 0.7;
		ctx.fillRect(0,320,640,160);
		ctx.globalAlpha = 1.0;
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.font = global_donotmodify_textfont;
		ctx.fillStyle = "#FFFFFF";
		
		//マウスロール処理
		if(mousex >= 0 && mousex <= initwidth){
			chooseposition = Math.floor((mousey - global_donotmodify_textinity)/(global_donotmodify_textgap+global_donotmodify_fontsize));
		}
		//選択肢の表示
		for(var i=0;i<=Math.min(4,this.text.length-1);i++){
			if(chooseposition === i){
				ctx.globalAlpha = 0.5;
				ctx.fillStyle = "#888888";
				ctx.fillRect(global_donotmodify_textinitx,global_donotmodify_textinity+(global_donotmodify_textgap+global_donotmodify_fontsize)*i,global_donotmodify_textarealength,global_donotmodify_textgap+global_donotmodify_fontsize);
				ctx.globalAlpha = 1.0;
				ctx.fillStyle = "#FFFFFF";
			}
			ctx.fillText(this.text[i],global_donotmodify_textinitx,global_donotmodify_textinity+(global_donotmodify_textgap+global_donotmodify_fontsize)*i);
		}
		
		if(mouseclick){
			if(chooseposition >= 0 && chooseposition <= Math.min(4,this.text.length-1)){
				return chooseposition;
			}
		}
		return -1;
	}else{
		return 0;
	}
};

function SetBG(keycode,isWait0,time0){
	this.key = keycode;
	if(this.key === "--"){
		this.key = null;
	}
	this.time = 0;
	if(typeof isWait0 === "undefined"){
		this.isWait = true;
	}else if(typeof isWait0 === "boolean"){
		this.isWait = isWait0;
	}else{
		this.console(keycode,isWait0,time0);
	}
	if(typeof time0 === "undefined"){
		this.limittime = this.isWait?40:1;
	}else if(typeof time0 !== "number"){
		this.console(keycode,isWait0,time0);
	}else{
		this.limittime = Math.max(1,time0);
	}
}
SetBG.prototype.console = function(keycode,isWait0,time0){
	alert("エラーが発生しました。コンソールを確認してください。");
	console.log("SetBG:引数情報");
	console.log("第1引数："+keycode+" 画像のキー");
	console.log("第2引数："+isWait0+" :引数はtrue,falseのいずれか。引数なしでも良い");
	console.log("第3引数："+time0+" :数値(第2引数なしで第3引数を定めることはできない)");
	throw "引数エラー";
};
SetBG.prototype.draw = function(t){
	if(this.time === 0){
		t.bv = t.bv2;
		if(typeof this.key === "string" && this.key !== ""){
			t.bv2 = graphics.getImage(this.key);
			t.bvtime = this.limittime;
			t.bvlimittime = this.limittime;
		}else if(this.key === null || this.key === ""){
			t.bv2 = null;
			t.bvtime = this.limittime;
			t.bvlimittime = this.limittime;
		}
	}
	
	this.time ++;
	if(!this.isWait || this.time === this.limittime){
		return true;
	}else{
		return false;
	}
};
SetBG.prototype.reset = function(){
	this.time = 0;
};


//only center
function SetStand(key0,direction,isWait0,time){
	this.time = 0;
	
	//第１引数チェック
	if(typeof key0 !== "string" && key0 !== null){
		this.console(key0,direction,isWait0,time);
	}
	this.key = key0;
	if(this.key === "--"){
		this.key = null;
	}
	//第２引数チェック
	if(direction === "center" || direction === 2){
		this.order = 2;
	}else if(direction === "left" || direction === 1){
		this.order = 0;
	}else if(direction === "right" || direction === 0){
		this.order = 1;
	}else if(typeof direction !== "undefined"){
		this.console(key0,direction,isWait0,time);
	}else{
		this.console(key0,direction,isWait0,time);
	}
	
	//3
	if(typeof isWait0 === "undefined"){
		this.isWait = true;
	}else if(typeof isWait0 === "boolean"){
		this.isWait = isWait0;
	}else{
		this.console(key0,direction,isWait0,time);
	}
	
	//4
	if(typeof time === "undefined"){
		this.limittime = this.isWait?40:1;
	}else if(typeof time !== "number"){
		this.console(key0,direction,isWait0,time);
	}else{
		this.limittime = Math.max(1,time);
	}
}
SetStand.prototype.console = function(key0,direction,isWait0,time){
	alert("エラーが発生しました。コンソールを確認してください。");
	console.log("SetStand:引数情報");
	console.log("第1引数："+key0+" 画像のキー");
	console.log("第2引数："+direction+" :center,left,rightのいずれか、");
	console.log("第3引数："+isWait0+" :引数はtrue,falseのいずれか。引数なしでも良い");
	console.log("第4引数："+time+" :数値(第３引数なしで第４引数を定めることはできない)");
	throw "引数エラー";
};
SetStand.prototype.draw = function(t){
	if(this.time === 0){
		var i = t.stand[this.order][0] === null;
		t.stand[this.order][0] = t.stand[this.order][1];
		if(typeof this.key === "string" && this.key !== ""){
			t.stand[this.order][1] = graphics.getImage(this.key);
			t.stand[this.order][2] = this.limittime;
			t.stand[this.order][3] = this.limittime;
		}else if(this.key === null || typeof this.key === "undefined" || this.key === ""){
			t.stand[this.order][1] = null;
			t.stand[this.order][2] = this.limittime;
			t.stand[this.order][3] = this.limittime;
		}
	}
	
	this.time ++;
	if(!this.isWait || this.time === this.limittime){
		return true;
	}else{
		return false;
	}
};
SetStand.prototype.reset = function(){
	this.time = 0;
};



function Flash(rgb0,time0,power0){
	if(typeof time0 !== "number"){
		throw "Flashの2つ目の引数は数値です";
	}else if(time0 < 0 || time0 > 500000){
		throw "Flashの2つ目の引数は0-500000までの数値です";
	}
	if(typeof power0 !== "number"){
		this.power = 1;
	}else if(power0 < 0 || power0 > 1){
		throw "Flashの3つ目の引数は0～1までの数値です";
	}
	if(typeof rgb0 !== "string"){
		throw "Flashの1つ目の引数は#FFFFFFのような形式です";
	}
	
	this.rgb = rgb0;
	this.time = time0;
	
}
Flash.prototype.draw = function(t){
	t.flash.time = this.time;
	t.flash.limittime = this.time;
	t.flash.rgb = this.rgb;
	t.flash.power = this.power;
	return true;
};
Flash.prototype.reset = function(){
	//nothing to do.
};
function Wait(time){
	if(typeof time !== "number"){
		throw "args[0]:TIME:YOU NEED TO INPUT NUMBER! "+time+" IS NOT NUMBER!";
	}
	this.limittime = Math.max(0,Math.floor(time));
	if(this.limittime > 100000000){
		throw "ERROR:TOO MUCH STOPPING TIME!\nvalue="+time;
	}
	this.time = 0;
}
Wait.prototype.draw = function(){
	if(this.time === this.limittime){
		return true;
	}else{
		return false;
	}
	this.time ++;
};
Wait.prototype.reset = function(){
	this.time = 0;
};

function Title(){
	this.gametitle = "ぱわふるめでぃすん！";
	this.choosepain = ["はじめから","つづきから"];
}
Title.prototype.draw = function(){
	//背景画像の表示
	ctx.drawImage(graphics.getImage("title"),0,0);
	
	//はじめからのテキスト内容取得
};
function BGMPlay(key0){
	this.key = key0;
}
BGMPlay.prototype.draw = function(){
	if(this.key === "" || this.key === null || typeof this.key === "undefined"){
		music.stop();
	}else{
		music.play(this.key);
	}
	
	return true;
};
BGMPlay.prototype.reset = function(){
	
};

function SEPlay(key0){
	this.key = key0;
}
SEPlay.prototype.draw = function(){
	if(this.key === "" || this.key === null || typeof this.key === "undefined"){
		
	}else{
		se.play(this.key);
	}
	
	return true;
};
SEPlay.prototype.reset = function(){
	
};

function Console(txt){
	this.text = txt;
}
Console.prototype.draw = function(){
	console.log(this.text);
	return true;
};
Console.prototype.reset = function(){
	
};
function Alert(txt){
	this.text = txt;
}
Alert.prototype.draw = function(){
	alert(this.text);
	return true;
}
Alert.prototype.reset = function(){
	
};

function Weather(){
	this.weather = 0;
}
Weather.prototype.draw = function(){
	if(this.weather === 1){
		
	}else if(this.weather === 2){
		
	}else if(this.weather === 3){
		
	}
};

function End(){
	alert("ゲームの終点に達しました。");//暫定的にこうしておく
}
End.prototype.draw = function(){
	
};
