"use strict"
//
//txt 〇〇〇
//txt 破壊神をぬぐうとき、小学校に行くと、サイバードラゴンに出会う
//
//

function ModifyData(str){
	var conductscenestr = (str+"\n").split("	").join("").split("@");
	var sceneobj = [];
	var attributeobj = {
		begin: null,//in case of null,first scene is scene that you first wrote.
		isTest: false
	};
	var titleobj = null;//NULL
	var loadimgobj = [];//配列
	var loadbgmobj = [];//配列
	var loadseobj = [];//配列
	//i:1なのは、最初の部分は見ないから
	for(var i=1;i<=conductscenestr.length-1;i++){
		var prefix = conductscenestr[i].substring(0,conductscenestr[i].indexOf("\n"));
		console.log(prefix);
		if(prefix === "attribute"){
			
		}else if(prefix === "title"){
			
		}else if(prefix === "imgload" || prefix === "loadimg"){
			if(loadimgobj !== []){
				//warningくらい
				loadimgobj = ModifyImgLoad(conductscenestr[i]);
			}else{
				loadimgobj = ModifyImgLoad(conductscenestr[i]);
			}
		}else if(prefix === "bgmload" || prefix === "loadbgm"){
			if(loadbgmobj !== []){
				//warningくらい
				loadbgmobj = ModifyBGMLoad(conductscenestr[i]);
			}else{
				loadbgmobj = ModifyBGMLoad(conductscenestr[i]);
			}
		}else if(prefix === "seload" || prefix === "loadse"){
			if(loadbgmobj !== []){
				//warningくらい
				loadseobj = ModifySELoad(conductscenestr[i]);
			}else{
				loadseobj = ModifySELoad(conductscenestr[i]);
			}
		}else{
			sceneobj[sceneobj.length] = ModifyScene(conductscenestr[i]);
		}
	}
	if(sceneobj === []){
		throw "エラーが発生しました。シナリオデータがありません。sceneがシナリオの文字です。書き間違いがないかチェックしてください。";
	}
	
	return [attributeobj,sceneobj,titleobj,loadimgobj,loadbgmobj,loadseobj];
}

function ModifyImgLoad(str){
	//文章を処理型フォームに変更する
	var returnobj = [];
	var getobj = toScriptForm(str);
	for(var i=1;i<=getobj.length-1;i++){
		var x = getArgs(getobj[i]);
		if(x.length === 0){
			continue;
		}else if(x.length === 2){
			returnobj[returnobj.length] = [x[0],x[1]];
		}else if(x.length > 2){
			getWarning("文法ミス：imgloadの書式は「key path」の形です",i,"imgload");
			returnobj[returnobj.length] = [x[0],x[1]];
		}else{
			getError("文法ミス：imgloadの書式は「key path」の形です",i,"imgload");
		}
	}
	return returnobj;
	
	//graphics.add("1","src/img1.jpg");
}
function ModifyBGMLoad(str){
	//文章を処理型フォームに変更する
	var returnobj = [];
	var getobj = toScriptForm(str);
	for(var i=1;i<=getobj.length-1;i++){
		var x = getArgs(getobj[i]);
		if(x.length === 0){
			continue;
		}else if(x.length === 2){
			returnobj[returnobj.length] = [x[0],x[1]];
		}else if(x.length > 2){
			getWarning("文法ミス：bgmloadの書式は「key path」の形です",i,"bgmload");
			returnobj[returnobj.length] = [x[0],x[1]];
		}else{
			getError("文法ミス：bgmloadの書式は「key path」の形です",i,"bgmload");
		}
	}
	return returnobj;
}
function ModifySELoad(str){
	//文章を処理型フォームに変更する
	var returnobj = [];
	var getobj = toScriptForm(str);
	for(var i=1;i<=getobj.length-1;i++){
		var x = getArgs(getobj[i]);
		if(x.length === 0){
			continue;
		}else if(x.length === 2){
			returnobj[returnobj.length] = [x[0],x[1]];
		}else if(x.length > 2){
			getWarning("文法ミス：seloadの書式は「key path」の形です",i,"seload");
			returnobj[returnobj.length] = [x[0],x[1]];
		}else{
			getError("文法ミス：seloadの書式は「key path」の形です",i,"seload");
		}
	}
	return returnobj;
}

function ModifyScene(str){
	//文章を処理型フォームに変更する
	var returnobj = [],scenenum,nextgoobj;
	var getobj = toScriptForm(str);
	
	//ヘッダー部分(最初は無視)
	var tmpscenenum = getArgs(getobj[0]);
	if(tmpscenenum[0] !== "scene"){
		getError("かたまり属性が異なります！",0,tmpscenenum);
	}
	scenenum = tmpscenenum[1];
	
	//メイン部分（フッター含む）
	var i = 1;
	while(true){
		//シーン遷移の部分かどうかチェックする
		if(i === getobj.length){
			throw "シーン遷移用のが記述されていません。確認してください:\n"+i+"行目：FatalError";
		}
		
		//シーンを当て込む
		var args = getArgs(getobj[i],i,scenenum);
		if(args.length === 0){
			i++;
			continue;
		}else{
			//EVENTごとに処理系を分ける
			
			
			if(args[0] === "txt" || args[0] === "text"){
				if(typeof args[1] === "undefined"){
					returnobj[returnobj.length] = new Text(" ");
				}else{
					returnobj[returnobj.length] = new Text(args[1]);
				}
				
			}else if(args[0] === "setbg" || args[0] === "bgset"){
				if(typeof args[1] === "undefined"){
					getError("setbgの第１引数がありません。",i,scenenum);
				}
				
				if(typeof args[2] === "undefined"){
					args[2] = true;
				}else if(args[2] === "T" || args[2] === "t" || args[2] === "true"){
					args[2] = true;
				}else if(args[2] === "F" || args[2] === "f" || args[2] === "false"){
					args[2] = false;
				}else{
					getError("setbgの第２引数をつける場合、必ずtrue,falseにしてください。",i,scenenum);
				}
				
				if(typeof args[3] === "undefined"){
					args[3] = args[2] ? 40 : 1;
				}else if(isNaN(Number(args[3]))){
					getError("setbgの第３引数は数値でなければなりません。文字列を含めないでください。",i,scenenum);
				}else{
					var s = Number(args[3]);
					if(s < 0 || s > 50000000){
						getError("第３引数の範囲は0以上50000000以下の数値です。",i,scenenum);
					}
					args[3] = s;
				}
				
				returnobj[returnobj.length] = new SetBG(args[1],args[2],args[3]);
			}else if(args[0] === "setstand" || args[0] === "standset"){
				if(typeof args[1] === "undefined"){
					getError("setbgの第１引数がありません。",i,scenenum);
				}
				
				if(typeof args[2] === "undefined"){
					getError("setstandの第２引数がありません。",i,scenenum);
				}else if(args[2] === "l" || args[2] === "L" || args[2] === "left" || args[2] === "1"){
					args[2] = 1;
				}else if(args[2] === "c" || args[2] === "C" || args[2] === "center" || args[2] === "2"){
					args[2] = 2;
				}else if(args[2] === "r" || args[2] === "R" || args[2] === "right" || args[2] === "3"){
					args[2] = 3;
				}else{
					getError("setstandの第２引数をつける場合、center,left,right,c,r,lにすること",i,scenenum);
				}
				
				if(typeof args[3] === "undefined"){
					args[3] = true;
				}else if(args[3] === "T" || args[3] === "t" || args[3] === "true"){
					args[3] = true;
				}else if(args[3] === "F" || args[3] === "f" || args[3] === "false"){
					args[3] = false;
				}else{
					getError("setstandの第３引数をつける場合、必ずtrue,falseにしてください。",i,scenenum);
				}
				
				if(typeof args[4] === "undefined"){
					args[4] = args[3] ? 40 : 1;
				}else if(isNaN(Number(args[4]))){
					getError("setstandの第４引数は数値でなければなりません。文字列を含めないでください。",i,scenenum);
				}else{
					var s = Number(args[4]);
					if(s < 0 || s > 50000000){
						getError("setstandの第４引数の範囲は0以上50000000以下の数値です。",i,scenenum);
					}
					args[4] = s;
				}
				
				returnobj[returnobj.length] = new SetStand(args[1],args[2],args[3],args[4]);
			}else if(args[0] === "console"){
				if(typeof args[1] === "undefined"){
					getError("setbgの第１引数がありません。",i,scenenum);
				}
				returnobj[returnobj.length] = new Console(args[1]);
			}else if(args[0] === "alert"){
				if(typeof args[1] === "undefined"){
					getError("setbgの第１引数がありません。",i,scenenum);
				}
				returnobj[returnobj.length] = new Alert(args[1]);
			}else if(false){
				
			}else if(args[0] === "nextgo"){
				if(args[1] === "pain"){
					nextgoobj = [];
					if(args.length < 4 || args.length % 2 !== 0 || args.length > 10){
						getError("nextgo painの引数は偶数個(2～8)です",i,scenenum);
					}
					var leng = (args.length - 2) / 2;
					for(var a=0;a<=leng-1;a++){
						nextgoobj[a] = {key:args[(args.length - leng * 2 + a)],text:args[(args.length - leng + a)]};
					}
				}else if(args[1] === "to"){
					nextgoobj = [];
					nextgoobj[0] = {key:args[2],text:""};
				}
				console.log(nextgoobj);
				break;
			}else if(args[0] === "end"){
				nextgoobj = null;
				break;
			}else{
				getError("存在しない命令："+args[0],i,scenenum);
			}
			i++;
		}
	}
	return new Scene(returnobj,scenenum,nextgoobj);
}
//getError("",i,scenenum);

function toScriptForm(str){
	var reg = /\_.{0,}\n/;
	console.log(str);
	var getobj = str.split("\r").join("").split(reg).join("").split("\n");
	for(var i=0;i<=getobj.length-1;i++){
		var s = getobj[i].indexOf("#");
		if(s !== -1){
			getobj[i] = getobj[i].substring(0,s);
		}
	}
	return getobj;
}

function getError(str,linenum,scenenum){
	console.log("ERROR OCCURED! FINISHED THIS APP.");
	console.log("IF YOU ARE NOT DEVELOPER OF THIS APP, CONTACT THIS PRODUCTOR THAT THIS APP HAS BUGS!");
	console.log("ERRORDUMP:"+str);
	console.log("scenenum:"+scenenum);
	console.log("linenum:"+linenum);
	throw "エラーが発生しました。コンソールで確認してください。";
}

function getWarning(str,linenum,scenenum){
	console.log("注意：本来の文法と異なる記述があります。正常に動作はしますが、修正を推奨します。");
	console.log("WARNINGDUMP:"+str);
	console.log("scenenum:"+scenenum);
	console.log("linenum:"+linenum);
}

function getArgs(str,linenum,scenenum){
	var initstrarray = str.split(" ");//spaceで分割する
	var returnobj = [];
	for(var i=0;i<=initstrarray.length-1;i++){
		if(initstrarray[i] !== ""){
			if(initstrarray[i].length > 2 && initstrarray[i].substring(0,2) === "--"){
				getError("文法ミス：トークン「 - 」は、-abcのように使用することはできません。",linenum,scenenum);
			}
			returnobj[returnobj.length] = initstrarray[i];
		}
	}
	return returnobj;
}

/*
	Loader
*/
function CallGame(){
	initdata_gameinit = ModifyData($("#noveldata").html());
	init("shell");
}
