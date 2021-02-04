odoo.define('attendance.attendance_button', function (require) {
"use strict";

var SystrayMenu = require('web.SystrayMenu');
var Widget = require('web.Widget');
var core = require('web.core');
var _t = core._t;
var time = require('web.time');

var QWeb = core.qweb;

var attend_status;
var user_status;
var curr_hour_arr;
var login_hour_arr;
var login_time_arr = false;
var timing_status;
var tooltip_details;
var check_sign_in_status;

QWeb.add_template('/attendance/static/src/xml/attendance.xml');

var attend_btn = Widget.extend({
	
	events: {
        "click .e_sign_in_out_icon": function() {
        	var self = this;
        	this.delay_button();
        	setTimeout(function() {
        		self.attendance_update();
        	}, 500);
        },
        mouseenter: function() {
        	this.tooltip_show();
        }
    },
    
	start: function () {
    	var self = this;
    	
         this._rpc({
             model: 'hr.employee',
             method: 'search_read',
             args: [[['user_id', '=', self.getSession().uid]], ['attendance_state', 'name']],
         })
         .then(function (res) {
             if (_.isEmpty(res) ) {
                 self.$('.o_hr_attendance_employee').append(_t("Error : Could not find employee linked to user"));
                 return;
             }
             self.employee = res[0];
             check_sign_in_status = res[0].attendance_state;
             self.$el.html(QWeb.render("attendance.attendance_button_main_template", {widget: self}));
             
             //set_login_time
             self._rpc({
                 model: 'hr.employee',
                 method: 'tooltip_data',
                 args: [[self.employee.id]],
             })
             .then(function(result) {
            	 
            	 user_status = result;
            	 //check_allready_had_a_record_for_the_current_user_or_not
            	 if(result == false){
            		 self.default_tooltip();
            	 }else{
            		 login_time_arr = (new Date((new Date(result))- (new Date()).getTimezoneOffset()*60*1000)).toString();
            		 login_time_arr = moment(login_time_arr).format("DD/MM/YY,HH:mm:ss");
            		 login_hour_arr = login_time_arr.split(",")
	                 
	                 //get_login_hour
	                 login_hour_arr = login_hour_arr[1].split(":").map(Number);
	                 
	                 //check_sign_in_out_status
	                 if(check_sign_in_status == 'checked_in'){
	                	 attend_status = 'click to sign out'
	                	 self.tooltip_show();
	                 }else{
	                	 attend_status = 'click to sign in'
	            		 self.default_tooltip();
	                 }
            	 }
             })
         });
         return this._super.apply(this, arguments);
    },
    default_tooltip : function(){
    	
    	$('.attendance_btn_li').attr({
       		 'data-toggle':'tooltip',
       		 'data-original-title': 'Click To sign in',
       		 'delay':'0'
       		 }).tooltip({
       			 placement: 'bottom',
       			 html: true
       			 });
    },
    attendance_update: function () {
        var self = this;
        
        this._rpc({
                model: 'hr.employee',
                method: 'attendance_manual',
                args: [[self.employee.id],'hr_attendance.hr_attendance_action_my_attendances'],
            })
            .then(function(result) {
            	
            	login_time_arr = (new Date((new Date(result.action.attendance.check_in))- (new Date()).getTimezoneOffset()*60*1000)).toString();
            	login_time_arr = moment(login_time_arr).format("DD/MM/YY,HH:mm:ss");
            	
                //get_login_hour
            	var separate_signin = login_time_arr.split(",");
            	login_hour_arr = separate_signin[1].split(":");
            	
            	//set_tooltip_signin_out_status
            	if(result.action.attendance.check_out == false){
            		attend_status = 'click to sign out'
            	}else{
            		attend_status = 'click to sign in'
            	}
            	
            	//set_login_status
	        	if(self.employee.attendance_state === 'checked_in'){
	        		self.employee.attendance_state = 'checked_out';
	        	}else{
	        		self.employee.attendance_state = 'checked_in'
	        	}
            	self.$el.html(QWeb.render("attendance.attendance_button_main_template", {widget: self}));
            	
            	self.tooltip_show();
            	
            	if (result.warning) {
                    self.do_warn(result.warning);
                }
//            	this.delay_button().delay
            	
            });
    },
    delay_button: function(){
    	$('.sign_in_out_btn_div_wrap').css({
    		cursor:'wait',
    	})
    	$('.e_sign_in_out_icon').css({
          	"pointer-events":"none",
     	});
    },
    tooltip_show : function(){
			
    		//get_current_hour
        	var get_curr_date = moment(new Date()).format('DD/MM/YY,HH:mm:ss').split(",");
        	curr_hour_arr = get_curr_date[1].split(":").map(Number);
        	
        	console.log(curr_hour_arr)
        	
        	if(login_time_arr == false){
        		this.default_tooltip();
        	}else{
        		//get_curr_date_and_month
        		var curr_date = get_curr_date[0].split("/");
    	    	var login_date = login_time_arr.split(",");
    	    	login_date = login_date[0].split("/");
    	    	
    	    	//compute_login_time_from_last_signin
    	    	if(curr_date[1] == login_date[1]){
    	    		if(curr_date[0] == login_date[0]){
    	    			
    	    			if(curr_hour_arr[0] == login_hour_arr[0]){
    	            		timing_status = ("Just Now");
    	            		if(curr_hour_arr[1] == login_hour_arr[1]){
    	            			timing_status = ("Just Now");
    	            			if(curr_hour_arr[2] == login_hour_arr[2]){
    	            				timing_status = ("Just Now");
    	            			}else{
    	            				timing_status = (curr_hour_arr[2]-login_hour_arr[2]+" sec ago")
    	            			}
    	            		}else{
    	            			timing_status = (curr_hour_arr[1]-login_hour_arr[1]+" min ago")
    	            		}
    	            	}else{
    	            		timing_status = (curr_hour_arr[0]-login_hour_arr[0]+" hours ago")
    	            	}
    	    			
    	    		}else{
    	    			timing_status = (curr_date[0]-login_date[0]+" day ago")
    	    		}
    	    	}else{
    	    		timing_status = (curr_date[1]-login_date[1]+" month ago")
    	    	}
    	    	
    	    	//if_system_date_time_not_proper
            	var t_status = timing_status.split(" ");
            	if(t_status[0] < 0){
            		timing_status = 'Check System Date and time';
            	}
            	
    	    	//set_current_tooltip_details
    	    	tooltip_details = "Last sign in : "+ login_time_arr +"</br>"+ timing_status +"</br>"+ attend_status +"";
    	    	
    	       	$('.attendance_btn_li').attr({
    	       		'data-toggle':'tooltip',
    	       		'data-original-title': tooltip_details,
    	       		'delay':'0'
    	       	}).tooltip({
    	       		placement: 'bottom',
    	       		html: true
    	       	});
        	}
    },
});

SystrayMenu.Items.push(attend_btn);
});