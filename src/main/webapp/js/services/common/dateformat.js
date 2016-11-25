/**
 * @ngdoc service
 * @name adminApp.dateformat
 * @description
 * author sweetyx
 * Service in the adminApp.
 */
angular.module('adminApp')
  .factory('dateformat', ['$filter',function ($filter) {
    var validFormat = function(str,format){
        if(str.length !== format.length)
            return false;
        for(var i=0;i<format.length;i++){
            if(format.charAt(i) === "-" || format.charAt(i) === " " || format.charAt(i) === "/"){
                if(format.charAt(i) !== str.charAt(i))
                    return false;
            }
        }
        return true;
    }
    var service = {
        addMin:function(dt,count){
            if(count == 0)
                return this.praseDate(dt);
            var datetime = this.praseDate(dt).getTime();
            datetime = datetime + (count)*60000;
            return new Date(datetime);
        },
        addHour:function(dt,count){
            if(count == 0)
                return this.praseDate(dt);
            var datetime = this.praseDate(dt).getTime();
            datetime = datetime + (count)*60000*60;
            return new Date(datetime);
        },
    	addDay:function(dt,count){
            if(count == 0)
                return this.praseDate(dt);
            var datetime = this.praseDate(dt).getTime();
            datetime = datetime + (count)*86400000;
            return new Date(datetime);
        },
        addMonth:function(dt,count){
    		if(count == 0)
    			return this.praseDate(dt);
    		var date = this.praseDate(dt);
    		var dtArr = this.getYMDHMS(date);
			var y = parseInt(count/12);
			var m = count % 12;
			dtArr[0] = dtArr[0] + y;
			dtArr[1] = dtArr[1] + m;
    		if(count>0){
    			if(dtArr[1] > 12){
    				dtArr[1] = dtArr[1] - 12;
    				dtArr[0] = dtArr[0] + 1;
    			}
    		}
    		else{
    			if(dtArr[1] < 1){
    				dtArr[1] = dtArr[1] + 12;
    				dtArr[0] = dtArr[0] - 1;
    			}
    		}
    		date.setFullYear(dtArr[0]);
    		date.setMonth(dtArr[1]-1);
    		return date;
    	},
    	
    	addYear:function(dt,count){
    		if(count == 0)
    			return this.praseDate(dt);
    		var date = this.praseDate(dt);
    		var dtArr = this.getYMDHMS(date);
    		dtArr[0] = dtArr[0] + count;
    		date.setFullYear(dtArr[0]);
    		return date;
    	},
        /**获取年月日时分秒毫秒
        *params dt 日期
        *return dtArr 年月日时分秒毫秒数组
        */
    	getYMDHMS:function(dt){
    		var date = this.praseDate(dt);
    		return [date.getFullYear(),date.getMonth()+1,date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds(),date.getMilliseconds()]
    	},
        /**设置年月日时分秒毫秒
        *params dt 日期
        *params dtArr 年月日时分秒毫秒数组
        *return date 日期
        */
    	setYMDHMS:function(dt,dtArr){
    		var date = this.praseDate(dt);
    		date.setFullYear(dtArr[0]);
    		date.setMonth(dtArr[1]-1);
    		date.setDate(dtArr[2]);
    		date.setHours(dtArr[3]);
    		date.setMinutes(dtArr[4]);
    		date.setSeconds(dtArr[5]);
    		date.setMilliseconds(dtArr[6]);
    		return date;
    	},
        //格式化日期
        formatDate:function(dt,pattern){
            //pattern  完整格式类似于 YYYY-MM-DD HH:mm:ss
            var date = new Date(this.praseDate(dt).setMilliseconds(0));
            if(pattern.length == 4)
                date = new Date($filter('date')(date,'yyyy/01/01 00:00:00'));
            else if(pattern.length == 7)
                date = new Date($filter('date')(date,'yyyy/MM/01 00:00:00'));
            else if(pattern.length == 10)
                date = new Date($filter('date')(date,'yyyy/MM/dd 00:00:00'));
            else if(pattern.length == 13)
                date = new Date($filter('date')(date,'yyyy/MM/dd HH:00:00'));
            else if(pattern.length == 16)
                date = new Date($filter('date')(date,'yyyy/MM/dd HH:mm:00'));
            else if(pattern.length == 19)
                date = new Date($filter('date')(date,'yyyy/MM/dd HH:mm:ss'));
            return date;
        },
        //日期转换为字符串
        toDateString:function(dt,pattern){
            //pattern  完整格式类似于 YYYY-MM-DD HH:mm:ss
            return $filter('date')(this.praseDate(dt),pattern.replace("YYYY","yyyy").replace("DD","dd"));
        },
        //转换为日期格式
        praseDate:function(dt){
            return typeof dt === "string"?new Date(dt.replace(/-/g,"/")):new Date(dt);
        },
        /**
         * 严格判断对象是否为日期类型（包括YYYY-MM-DD等字符串类型）
         * params dt  要判断的对象
         * params format   日期（字符串类型）的格式
         * @return {Boolean} [description]
         */
        isDate:function(dt,formatStr){
            if (typeof dt === "object" && dt != null && dt instanceof Date && dt.toString() !== "Invalid Date")
                return true;
            if (typeof dt === "string" && validFormat(dt, formatStr) && this.praseDate(dt).toString() !== "Invalid Date")
                return true;
            if(typeof dt === "number")
                return true;
            return false;
        }
    };
    return service;
  }]);
