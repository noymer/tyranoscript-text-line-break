// tyrano/plugins/kag/kag.tag.jsを一部上書き
(function(){
    tyrano.plugin.kag.tag.text.showMessage = function(message_str,pm) {
        _showMessage.call(this, message_str, pm, false);
    }

    tyrano.plugin.kag.tag.text.showMessageVertical = function(message_str,pm) {
        _showMessage.call(this, message_str, pm, true);
    }

    var _showMessage = function(message_str,pm,isVertical) {
        var that = this;
        
        //特定のタグが直前にあった場合、ログの作り方に気をつける
        if(that.kag.stat.log_join=="true"){
            pm.backlog="join";
        }
        
        //バックログ用の値を格納
        var chara_name = $.isNull($(".chara_name_area").html());
        if((chara_name != "" && pm.backlog!="join") || (chara_name!="" && this.kag.stat.f_chara_ptext=="true")){
            
            this.kag.pushBackLog("<b class='backlog_chara_name "+chara_name+"'>"+chara_name+"</b>：<span class='backlog_text "+chara_name+"'>"+message_str+"</span>","add");
            
            if(this.kag.stat.f_chara_ptext=="true"){
                this.kag.stat.f_chara_ptext="false";
                this.kag.stat.log_join = "true";
            }
            
        }else{
            
            var log_str = "<span class='backlog_text "+chara_name+"'>"+ message_str +"</span>";
            
            if(pm.backlog=="join"){
                this.kag.pushBackLog(log_str,"join");
            }else{
                this.kag.pushBackLog(log_str,"add");
                
            }
        }

        //テキスト表示時に、まず、画面上の次へボタンアイコンを抹消
        that.kag.ftag.hideNextImg();

        (function(jtext) {

            if (jtext.html() == "") {
                //タグ作成
                if (isVertical) {
                    jtext.append("<p class='vertical_text'></p>");
                } else {
                    jtext.append("<p class=''></p>");
                }
            }

            var current_str = "";

            if (jtext.find("p").find(".current_span").length != 0) {

                current_str = jtext.find("p").find(".current_span").html();

            }

            that.kag.checkMessage(jtext);

            //メッセージ領域を取得
            var j_span = that.kag.getMessageCurrentSpan();
            

            j_span.css({
                        "color":that.kag.stat.font.color,
                        "font-weight": that.kag.stat.font.bold,
                        "font-size": that.kag.stat.font.size + "px",
                        "font-family": that.kag.stat.font.face,
                        "font-style":that.kag.stat.font.italic
                        });
                        
            
            
            if(that.kag.stat.font.edge !=""){
            
                var edge_color = that.kag.stat.font.edge;
                j_span.css("text-shadow","1px 1px 0 "+edge_color+", -1px 1px 0 "+edge_color+",1px -1px 0 "+edge_color+",-1px -1px 0 "+edge_color+"");
            
            }else if(that.kag.stat.font.shadow != ""){
                //j_span.css()
                j_span.css("text-shadow","2px 2px 2px "+that.kag.stat.font.shadow);
            }
            
            
                
            //既読管理中の場合、現在の場所が既読済みなら、色を変える 
            if(that.kag.config.autoRecordLabel == "true"){
                
                if(that.kag.stat.already_read == true){
                    //テキストの色調整
                    if(that.kag.config.alreadyReadTextColor !="default"){
                        j_span.css("color",$.convertColor(that.kag.config.alreadyReadTextColor));
                    }
                    
                }else{
                    //未読スキップがfalseの場合は、スキップ停止
                    if(that.kag.config.unReadTextSkip == "false"){
                        that.kag.stat.is_skip = false;
                    }
                }
                
            }
            
            var ch_speed = 30;
            
            if(that.kag.stat.ch_speed != ""){
                ch_speed = parseInt(that.kag.stat.ch_speed);
            }else if(that.kag.config.chSpeed){
                ch_speed = parseInt(that.kag.config.chSpeed);
            }
            
            var append_str = "";
            for (var i = 0; i < message_str.length; i++) {
                var c = message_str.charAt(i);
                //ルビ指定がされている場合
                if (that.kag.stat.ruby_str != "") {
                    c = "<ruby><rb>" + c + "</rb><rt>" + that.kag.stat.ruby_str + "</rt></ruby>";
                    that.kag.stat.ruby_str = "";
                }

                append_str += "<span style='visibility: hidden'>" + c + "</span>";
            }
            current_str += "<span>" + append_str + "</span>";

            // hidden状態で全部追加する
            that.kag.appendMessage(jtext, current_str);
            var append_span = j_span.children('span:last-child');
            var showMessage = function(index) {
                append_span.children("span:eq(" + index + ")").css('visibility', 'visible');
            };
            var showMessageAll = function() {
                append_span.children("span").css('visibility', 'visible');
            };

            var pchar = function(index) {
                var isSkipping = (
                    that.kag.stat.is_skip == true
                    || that.kag.stat.is_nowait == true
                    || ch_speed < 3
                );

                if (!isSkipping) {
                    showMessage(index);
                }
                
                if (index <= message_str.length) {

                    that.kag.stat.is_adding_text = true;

                    //再生途中にクリックされて、残りを一瞬で表示する
                    if (that.kag.stat.is_click_text == true || that.kag.stat.is_skip == true || that.kag.stat.is_nowait == true) {
                        pchar(++index);
                    } else {
                        setTimeout(function() {
                            pchar(++index);
                        }, ch_speed);
                    }
                } else {

                    that.kag.stat.is_adding_text = false;
                    that.kag.stat.is_click_text = false;
                    
                    
                    //すべて表示完了 ここまではイベント残ってたな

                    if (that.kag.stat.is_stop != "true") {
                        if(isSkipping){
                            showMessageAll();
                            setTimeout(function(){
                                if (!that.kag.stat.is_hide_message) that.kag.ftag.nextOrder();
                                }, parseInt(that.kag.config.skipSpeed));
                            
                        }else{
                            if (!that.kag.stat.is_hide_message) that.kag.ftag.nextOrder();
                        }
                    }
                }
            };

            pchar(0);

        })(this.kag.getMessageInnerLayer());
    }
})();
