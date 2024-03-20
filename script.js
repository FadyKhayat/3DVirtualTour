(function(){
    var script = {
 "start": "this.init(); this.playList_4F758080_5527_D9C9_41D5_2FE3DE3B8714.set('selectedIndex', 0)",
 "overflow": "visible",
 "children": [
  "this.MainViewer",
  "this.Image_40BBC396_50E4_AC74_41CD_DB178DCE344E",
  "this.IconButton_1A355752_0A22_DDF6_4174_91EEE46D06FC",
  "this.Container_06295097_09E1_D37D_41A0_4F59CDA5B097"
 ],
 "id": "rootPlayer",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5,
 "contentOpaque": false,
 "paddingRight": 0,
 "width": "100%",
 "mobileMipmappingEnabled": false,
 "borderRadius": 0,
 "scrollBarWidth": 10,
 "scrollBarVisible": "rollOver",
 "propagateClick": false,
 "minHeight": 20,
 "scripts": {
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "getKey": function(key){  return window[key]; },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "existsKey": function(key){  return key in window; },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "registerKey": function(key, value){  window[key] = value; },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "unregisterKey": function(key){  delete window[key]; },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } }
 },
 "vrPolyfillScale": 1,
 "borderSize": 0,
 "minWidth": 20,
 "definitions": [{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -177.87,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4E071112_5527_D8C9_41C2_3A05DC4F4621",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 110.5,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_49CB91DE_5527_DB79_41CA_8A02FC34213B",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -90.45,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_484AD223_5527_D8CF_41CF_E0B5360BD4BF",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -112.93,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F4D826E_5527_D959_41CF_9B72B034D3EB",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": -43.59,
   "backwardYaw": 173.97,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_0B6EC80E_4CD0_8613_41C6_227755166D76",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D"
  }
 ],
 "vfov": 180,
 "label": "39",
 "id": "panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03",
 "class": "Panorama",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_0E7387CA_4FB3_8923_41D2_9AAE388BE040",
  "this.overlay_0E1C2A88_4F50_9B8D_41D0_C0D24CD92733",
  "this.overlay_0D8A30E1_4CF0_87EC_41A2_181FE64EA4E7"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 179.74,
  "hfov": 120,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4ECF812B_5527_D8DE_41A0_CEA0102FC864",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 94.58,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4EF63316_5527_D8C9_41C3_7CFC1F29DB38",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "items": [
  {
   "media": "this.panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_468CDF09_4DD0_986B_41BE_3A494626C999",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_468CDF09_4DD0_986B_41BE_3A494626C999_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_46886090_4DD0_8879_41C9_0592816F1BE4",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_46886090_4DD0_8879_41C9_0592816F1BE4_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_468E3752_4DD0_88F9_41D2_1251D4678612",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_468E3752_4DD0_88F9_41D2_1251D4678612_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_468A0506_4DD0_8859_41C9_249E6530A13B",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_468A0506_4DD0_8859_41C9_249E6530A13B_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 13)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 13, 14)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 14, 15)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 15, 16)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 16, 17)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_46889D1B_4DD3_986F_418C_C91A8229DC90",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 17, 18)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_46883404_4DD3_8859_41CB_7620618CF902",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 18, 19)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_46883404_4DD3_8859_41CB_7620618CF902_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 19, 20)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_468F9180_4DD3_8859_4145_D36188AFA280",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 20, 21)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_468F9180_4DD3_8859_4145_D36188AFA280_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 21, 22)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_4688EF20_4DD3_9859_41C7_787AA99356F7",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 22, 23)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 23, 24)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 24, 25)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 25, 26)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 26, 27)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 27, 28)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_46915890_4DD3_B878_419E_FA9CF156F3F2",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 28, 29)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 29, 30)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_7AB736C5_4F50_8864_419C_98699023C783",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 30, 31)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_7AB736C5_4F50_8864_419C_98699023C783_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 31, 32)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 32, 33)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 33, 34)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 34, 35)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_717A0897_4FD0_877B_41BB_C1BF96F36747",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 35, 36)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_717A0897_4FD0_877B_41BB_C1BF96F36747_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 36, 37)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 37, 38)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_0B6EC80E_4CD0_8613_41C6_227755166D76",
   "camera": "this.panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 38, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "end": "this.trigger('tourEnded')",
   "class": "PanoramaPlayListItem"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 171.2,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F508279_5527_D93B_41B0_7977788CE112",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 178.11,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4E7C92EB_5527_D95F_41B8_549993443EE9",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 68.06,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4FFC20CE_5527_D956_41CC_FF0CE4652E25",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_468F9180_4DD3_8859_4145_D36188AFA280_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -90.07,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4EDE513B_5527_DB3F_41D0_CC880DBD8F7B",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0.88,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4FC242B7_5527_D937_41C0_85424C425D15",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": -2.43,
   "backwardYaw": -88.69,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD",
   "distance": 1
  },
  {
   "yaw": 179.87,
   "backwardYaw": -179.12,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8",
   "distance": 1
  },
  {
   "yaw": -94.15,
   "backwardYaw": 94.7,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B",
   "distance": 1
  },
  {
   "yaw": 89.21,
   "backwardYaw": -91.95,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70",
   "distance": 1
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "13",
 "thumbnailUrl": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_5168DC13_4D71_9822_41C5_BFD1596DCBCA",
  "this.overlay_50E10541_4D51_881F_41C8_55CCC704A1ED",
  "this.overlay_504428AD_4D53_9867_41A6_A77E3DFDBCAB",
  "this.overlay_53AA3BAD_4D51_9864_41B4_DFF3D48CC9B8"
 ],
 "hfovMax": 130
},
{
 "adjacentPanoramas": [
  {
   "yaw": -157.77,
   "backwardYaw": 86.87,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712",
   "distance": 1
  },
  {
   "yaw": 67.07,
   "backwardYaw": -102.88,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333",
   "distance": 1
  },
  {
   "yaw": -86.17,
   "backwardYaw": 88.17,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2",
   "distance": 1
  },
  {
   "yaw": 101.86,
   "backwardYaw": -38.19,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D",
   "distance": 1
  }
 ],
 "vfov": 180,
 "label": "27",
 "id": "panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B",
 "class": "Panorama",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_61A0BF5A_4CF1_B80C_41C9_C79E47CA7FD2",
  "this.overlay_60E0320C_4CFF_8804_418E_BF24F4B7E4D5",
  "this.overlay_7B214AE0_4F70_9854_41C3_7A785529E05D",
  "this.overlay_748F2A1A_4FD0_BB9B_41A9_5B4A0EB2C66C",
  "this.overlay_674E34EE_55A6_6FF4_41C3_23894FDA4F9F"
 ],
 "hfovMax": 120
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 179.99,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4E1A111C_5527_D8FA_41D4_16F595362DCB",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -138.55,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F04F0B5_5527_D9CA_41D1_4D2847A13C4B",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 92.95,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4EAC1145_5527_DB4B_4199_D4CFCBC684F1",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -179,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_493D81A5_5527_DBCB_41D5_3FD995140C97",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": -2.61,
   "backwardYaw": -95.72,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B",
   "distance": 1
  },
  {
   "yaw": 56.78,
   "backwardYaw": -33.42,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB",
   "distance": 1
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "25",
 "thumbnailUrl": "media/panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_6561919F_4CB7_8833_4164_5C1F07277B94",
  "this.overlay_64C052D7_4CB0_8834_41B0_B0734F1E3DDB"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -174.13,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4E6762E2_5527_D949_4174_DD7F1D5FB053",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_7AB736C5_4F50_8864_419C_98699023C783"
  },
  {
   "yaw": 88.17,
   "backwardYaw": -86.17,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B",
   "distance": 1
  },
  {
   "yaw": -118.58,
   "backwardYaw": -140.18,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468A0506_4DD0_8859_41C9_249E6530A13B",
   "distance": 1
  },
  {
   "yaw": -38.44,
   "backwardYaw": 124.05,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_46915890_4DD3_B878_419E_FA9CF156F3F2",
   "distance": 1
  },
  {
   "yaw": -69.5,
   "backwardYaw": 97.25,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384",
   "distance": 1
  }
 ],
 "vfov": 180,
 "label": "28",
 "id": "panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2",
 "class": "Panorama",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_60FC6008_4CF0_880B_41B7_ED6A375451F1",
  "this.overlay_600A4D3B_4CF3_980E_41AC_E9054F33ADE8",
  "this.overlay_62FCA3F8_4CF0_880A_41AA_9BC1F3189842",
  "this.overlay_763E7C01_4F70_9FD5_41B6_16B7EC7F9190",
  "this.overlay_06ABA530_4CB7_8E1F_41C8_807E46C84999",
  "this.overlay_66B6FF4B_55A5_BA33_41D2_DF9CC53B61D3"
 ],
 "hfovMax": 120
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0.4,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": -0.56
 },
 "id": "panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 146.58,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4EDBD324_5527_D8C9_418A_2E56D810129A",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 88.05,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4FDEC2C0_5527_D949_41BC_C20FFA473730",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 136.41,
  "hfov": 120,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4E5642F5_5527_D94B_41D2_1AE2E50C8A5A",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -178.37,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4E156117_5527_D8F6_41AD_A66AA68B8650",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 178.99,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_490221AF_5527_DBD7_41D0_C1B5E2C006C8",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_468CDF09_4DD0_986B_41BE_3A494626C999_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": -57.03,
   "backwardYaw": 41.45,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_46886090_4DD0_8879_41C9_0592816F1BE4",
   "distance": 1
  },
  {
   "yaw": 54.76,
   "backwardYaw": -34.55,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468E3752_4DD0_88F9_41D2_1251D4678612",
   "distance": 1
  },
  {
   "yaw": -140.18,
   "backwardYaw": -118.58,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2"
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_468A0506_4DD0_8859_41C9_249E6530A13B",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "12",
 "thumbnailUrl": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_54678717_4D51_8856_41B9_FA5FFB515188",
  "this.overlay_568AB2E0_4D50_89EB_41BB_E05E186E27D2",
  "this.overlay_54F6EFA2_4D51_986E_41BF_1E2A0DBD4FF6",
  "this.overlay_5716695C_4D53_98D9_41C6_2A48A31C0280",
  "this.overlay_61F5B567_4CF7_8803_41C2_DF92CED2A4B4"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -87.56,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_495E1191_5527_DBCB_41C9_902503ECCFEB",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": 4.63,
   "backwardYaw": 5.14,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0"
  },
  {
   "yaw": 173.97,
   "backwardYaw": -43.59,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03",
   "distance": 1
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_0B6EC80E_4CD0_8613_41C6_227755166D76",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "40",
 "thumbnailUrl": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_0809207C_4CAF_86F5_41C9_1D156AD00652",
  "this.overlay_094408DD_4CB0_8637_4197_F15EFA213124",
  "this.overlay_0B524747_4CB0_8A14_41B0_54917D0B6100"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 125.23,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4910C1BA_5527_DB39_41C3_A3A66572DB2F",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 145.45,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F0940BA_5527_D93E_41BD_18EBAC5E82E8",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -159.78,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4E4C60FE_5527_D939_41CF_6E34C1EBBC82",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -82.75,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_496A3172_5527_DB49_41BA_91B50E55A627",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": 51.42,
   "backwardYaw": -116.71,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB",
   "distance": 1
  },
  {
   "yaw": -7.98,
   "backwardYaw": -100.12,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_46915890_4DD3_B878_419E_FA9CF156F3F2",
   "distance": 1
  }
 ],
 "vfov": 180,
 "label": "31",
 "id": "panorama_7AB736C5_4F50_8864_419C_98699023C783",
 "class": "Panorama",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_7AB736C5_4F50_8864_419C_98699023C783_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AB736C5_4F50_8864_419C_98699023C783_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7AB736C5_4F50_8864_419C_98699023C783_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7AB736C5_4F50_8864_419C_98699023C783_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AB736C5_4F50_8864_419C_98699023C783_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7AB736C5_4F50_8864_419C_98699023C783_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7AB736C5_4F50_8864_419C_98699023C783_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AB736C5_4F50_8864_419C_98699023C783_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7AB736C5_4F50_8864_419C_98699023C783_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7AB736C5_4F50_8864_419C_98699023C783_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AB736C5_4F50_8864_419C_98699023C783_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7AB736C5_4F50_8864_419C_98699023C783_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7AB736C5_4F50_8864_419C_98699023C783_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AB736C5_4F50_8864_419C_98699023C783_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7AB736C5_4F50_8864_419C_98699023C783_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7AB736C5_4F50_8864_419C_98699023C783_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AB736C5_4F50_8864_419C_98699023C783_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7AB736C5_4F50_8864_419C_98699023C783_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7AB736C5_4F50_8864_419C_98699023C783_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7AB736C5_4F50_8864_419C_98699023C783_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_7ABCD29B_4F57_88ED_41A9_2F35D5BA58B7",
  "this.overlay_7B9A0374_4F50_883B_41B8_67612071F064"
 ],
 "hfovMax": 120
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 61.42,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F1200BF_5527_D936_41D3_5244E5D32BB2",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 87.04,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_483EE231_5527_D8CB_41D3_FFB615D72BB8",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -0.76,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_49E191C3_5527_DB4F_418F_13E4FB55ACD2",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 177.98,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4FF782AE_5527_D9D9_41CC_799437189D86",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": -8.8,
   "backwardYaw": 54.01,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_46883404_4DD3_8859_41CB_7620618CF902",
   "distance": 1
  },
  {
   "yaw": 28.26,
   "backwardYaw": 20.22,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160",
   "distance": 1
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_46889D1B_4DD3_986F_418C_C91A8229DC90",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "18",
 "thumbnailUrl": "media/panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_6F39FD70_4CB0_98F4_41A1_19CCD1743CC4",
  "this.overlay_6EAF96F2_4CB1_89F7_4104_C0DA8698FB40"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_46886090_4DD0_8879_41C9_0592816F1BE4_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 91.46,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F8A50EA_5527_D95E_41C6_457C18E3569D",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 172.02,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F5EE09C_5527_D9FA_41BA_3243E15A4ACF",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 171.2,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F51E097_5527_D9F6_41D5_0EA4D887AFD0",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 101.74,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4992320F_5527_D8D7_41D1_42B1975D60BB",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 154.75,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4FA322C5_5527_D94B_41D3_FEA000B84CCE",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": 94.7,
   "backwardYaw": -94.15,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C",
   "distance": 1
  },
  {
   "yaw": -95.72,
   "backwardYaw": -2.61,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE",
   "distance": 1
  }
 ],
 "vfov": 180,
 "label": "24",
 "id": "panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B",
 "class": "Panorama",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_65517C7D_4CB0_98F7_41D0_6426F4A45177",
  "this.overlay_6574C14D_4CB1_8817_41C7_B655BAC13780"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -102.88,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_48717219_5527_D8FB_41D3_57814C937827",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 141.81,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F0C829A_5527_D9F9_41CF_A016C6CB0DB8",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 162.16,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F59227D_5527_D93B_419E_5FDB9B091C1A",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 177.98,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4860B214_5527_D8C9_4194_936F14F5A5A5",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -146.47,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4FB572CA_5527_D959_41CE_DE7F31041A2F",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -125.24,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4E29E2FE_5527_D939_41B3_076E6B2CCD07",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": 1,
   "backwardYaw": -4.03,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4688EF20_4DD3_9859_41C7_787AA99356F7",
   "distance": 1
  },
  {
   "yaw": -90.45,
   "backwardYaw": -2.02,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468F9180_4DD3_8859_4145_D36188AFA280",
   "distance": 1
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "22",
 "thumbnailUrl": "media/panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_6B3C6BDB_4CB3_9830_41C4_A14DB2ED3431",
  "this.overlay_6B5DAD1A_4CB0_B830_41AD_2BB0743C5B11"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_7AB736C5_4F50_8864_419C_98699023C783_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -151.74,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F2CD287_5527_D9D7_41A3_72C3FB0A672B",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -46.3,
  "hfov": 120,
  "class": "PanoramaCameraPosition",
  "pitch": -6.43
 },
 "id": "panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 79.88,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4FE920C9_5527_D95A_419D_BF067EC3F7C9",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -179,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4847B21E_5527_D8F9_41C7_CD69B6018816",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -123.34,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F34A0AB_5527_D9DE_41B9_8CC4FCF2F91B",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 70.34,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F85D0E6_5527_D949_41D0_CD9BAA79A6BD",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 175.97,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4FED42A9_5527_D9DB_41B5_4C735172B4EB",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -97.23,
  "hfov": 120,
  "class": "PanoramaCameraPosition",
  "pitch": -6.76
 },
 "id": "panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -173.22,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4E535103_5527_D8CE_41BF_6DF51A082A06",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "minimumZoomFactor": 0.7,
 "fieldOfViewOverlayInsideColor": "#FFFFFF",
 "label": "Floor Plans png",
 "id": "map_4327C897_5565_C913_41CF_A8B4976D294B",
 "thumbnailUrl": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_t.png",
 "fieldOfViewOverlayOutsideColor": "#000000",
 "width": 9990,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B.png",
    "width": 3200,
    "class": "ImageResourceLevel",
    "height": 1383
   },
   {
    "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_lq.png",
    "width": 389,
    "class": "ImageResourceLevel",
    "height": 169,
    "tags": "preload"
   }
  ]
 },
 "fieldOfViewOverlayRadiusScale": 0.3,
 "class": "Map",
 "maximumZoomFactor": 1.5,
 "scaleMode": "fit_inside",
 "fieldOfViewOverlayInsideOpacity": 0.4,
 "fieldOfViewOverlayOutsideOpacity": 0,
 "initialZoomFactor": 1,
 "overlays": [
  "this.overlay_436DF6C8_5562_797B_41D4_104031D68771",
  "this.overlay_40D5B4F3_5562_D92D_41C8_D7256EADF40F",
  "this.overlay_40D007DE_556D_C716_4174_07F163AA2C1E",
  "this.overlay_40DF5F68_556E_473A_41BE_C590BE335E4B",
  "this.overlay_40DC88C6_556E_4969_41CC_398F182B1029",
  "this.overlay_40DE9746_556E_C776_41D1_7FC75FBB475B",
  "this.overlay_40D572B0_556F_D929_41D1_C32B48CB9E59",
  "this.overlay_40D59AA1_556E_4928_41C5_6AE865492E9A",
  "this.overlay_40D79AFE_556E_4918_41C2_77FAF2F7F3CF",
  "this.overlay_40D177BD_556E_C718_41CC_D2E7942DD602",
  "this.overlay_40D62E02_556D_C8EB_41D0_305763C4A030",
  "this.overlay_40D703CA_556D_DF78_41B1_C53A59145EB6",
  "this.overlay_40D53EFE_5562_491B_41AD_AA37ABAFE316",
  "this.overlay_40D452D2_5562_D96A_41AC_262E35771E4B",
  "this.overlay_40D4C742_5562_476A_41D2_7748963935A3"
 ],
 "height": 4320
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 21.4,
  "hfov": 120,
  "class": "PanoramaCameraPosition",
  "pitch": 22.46
 },
 "id": "panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": -0.26,
   "backwardYaw": -92.96,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA",
   "distance": 1
  },
  {
   "yaw": 86.87,
   "backwardYaw": -157.77,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492"
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "8",
 "thumbnailUrl": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_5A02543E_4D50_8853_41CE_86405BFA6B10",
  "this.overlay_5AD5A30D_4D50_8831_41A0_4B3DB8E36E2B",
  "this.overlay_66E98CA8_4CD7_7818_41C8_6178A706F60F"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -78.14,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_49496186_5527_DBC9_41C4_8C8AACFCCA8D",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -85.3,
  "hfov": 120,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4FD4D2BC_5527_D939_41BE_4349B0011129",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0.12,
  "hfov": 120,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4978C17C_5527_DB39_41B8_FCD135135BCA",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": 55.26,
   "backwardYaw": -40.33,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_46886090_4DD0_8879_41C9_0592816F1BE4",
   "distance": 1
  },
  {
   "yaw": -55.53,
   "backwardYaw": 35.67,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468E3752_4DD0_88F9_41D2_1251D4678612",
   "distance": 1
  },
  {
   "yaw": 98.35,
   "backwardYaw": -78.26,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492",
   "distance": 1
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "11",
 "thumbnailUrl": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_55875FF2_4D51_97EC_41CD_6DB1CB4EAA13",
  "this.overlay_55A65342_4D50_882C_41C9_D77EACF62878",
  "this.overlay_5525256B_4D50_88FD_41D0_D843F84BDC39"
 ],
 "hfovMax": 130
},
{
 "adjacentPanoramas": [
  {
   "yaw": -2.02,
   "backwardYaw": -85.42,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7",
   "distance": 1
  },
  {
   "yaw": -54.77,
   "backwardYaw": 135.53,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70",
   "distance": 1
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "16",
 "thumbnailUrl": "media/panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_6D2A1E7A_4D57_F8EA_41C0_46DD371B51BB",
  "this.overlay_6CB24A6E_4D50_98ED_41C0_A3D31CBDC3F2"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 84.28,
  "hfov": 120,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4ED5231F_5527_D8F7_41D3_45506B9C7B2B",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -108.78,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F4A2092_5527_D9CE_41C0_2DCFA1654FEB",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 22.23,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F461269_5527_D95B_41A0_C2C33DB2C8CE",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -0.98,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 3.23
 },
 "id": "panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712"
  },
  {
   "yaw": -8.8,
   "backwardYaw": -179.88,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333",
   "distance": 1
  },
  {
   "yaw": -38.19,
   "backwardYaw": 101.86,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03"
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "38",
 "thumbnailUrl": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_730AAB8D_4FB1_994E_41C2_4DBD6A917C2C",
  "this.overlay_716B128C_4FB3_8B33_41A1_541916320113",
  "this.overlay_0E76BC6A_4FB0_9FF3_41CA_7101BE07CEDF",
  "this.overlay_71E10728_4FB0_8979_4160_9114C44B0382",
  "this.overlay_0E7CD015_4FB1_872C_41B7_20DEA976C3ED",
  "this.overlay_0EF05ADA_4F5F_9B8D_41CE_B9761B18F303"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -44.47,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4EC4A31B_5527_D8FF_41D3_6659AE841D84",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -43.47,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4E36810D_5527_D8DB_41D1_61EE6EF01A0B",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -123.22,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4828522C_5527_D8D9_41BF_D4D637AC0E27",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "items": [
  {
   "begin": "this.MapViewerMapPlayer.set('movementMode', 'constrained')",
   "media": "this.map_4327C897_5565_C913_41CF_A8B4976D294B",
   "player": "this.MapViewerMapPlayer",
   "class": "MapPlayListItem"
  }
 ],
 "id": "playList_4F758080_5527_D9C9_41D5_2FE3DE3B8714",
 "class": "PlayList"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -88.69,
   "backwardYaw": -2.43,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C",
   "distance": 1
  },
  {
   "yaw": 6.78,
   "backwardYaw": 90.18,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468F9180_4DD3_8859_4145_D36188AFA280",
   "distance": 1
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "20",
 "thumbnailUrl": "media/panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_690A51F7_4CB1_8BFE_41D1_8FCEA96E108F",
  "this.overlay_68F34B13_4CB0_B837_41C0_0D99EE38C233"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 122.97,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4FD1E0D8_5527_D979_41C5_FED84292C5A9",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 137.54,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F2630A1_5527_D9CA_41D0_C40655F31FCF",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD"
  },
  {
   "yaw": -4.03,
   "backwardYaw": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B",
   "distance": 1
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_4688EF20_4DD3_9859_41C7_787AA99356F7",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "23",
 "thumbnailUrl": "media/panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_6A0495DF_4CB0_8831_4195_336C1D0593BE",
  "this.overlay_65F34CDA_4CB0_9833_41D0_C4AED5C282BF"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 179.74,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F92E2DD_5527_D97B_41B4_71FAC6BEB753",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -175.37,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_492CF19B_5527_DBFF_41D5_27F151FF1900",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": -17.84,
   "backwardYaw": 71.22,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160",
   "distance": 1
  },
  {
   "yaw": 54.01,
   "backwardYaw": -8.8,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_46889D1B_4DD3_986F_418C_C91A8229DC90",
   "distance": 1
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_46883404_4DD3_8859_41CB_7620618CF902",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "19",
 "thumbnailUrl": "media/panorama_46883404_4DD3_8859_41CB_7620618CF902_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46883404_4DD3_8859_41CB_7620618CF902_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46883404_4DD3_8859_41CB_7620618CF902_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46883404_4DD3_8859_41CB_7620618CF902_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46883404_4DD3_8859_41CB_7620618CF902_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46883404_4DD3_8859_41CB_7620618CF902_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46883404_4DD3_8859_41CB_7620618CF902_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46883404_4DD3_8859_41CB_7620618CF902_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46883404_4DD3_8859_41CB_7620618CF902_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46883404_4DD3_8859_41CB_7620618CF902_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46883404_4DD3_8859_41CB_7620618CF902_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46883404_4DD3_8859_41CB_7620618CF902_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46883404_4DD3_8859_41CB_7620618CF902_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46883404_4DD3_8859_41CB_7620618CF902_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46883404_4DD3_8859_41CB_7620618CF902_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46883404_4DD3_8859_41CB_7620618CF902_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46883404_4DD3_8859_41CB_7620618CF902_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46883404_4DD3_8859_41CB_7620618CF902_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46883404_4DD3_8859_41CB_7620618CF902_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_46883404_4DD3_8859_41CB_7620618CF902_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_6EAB17A3_4CB0_8815_41B3_016C2141E292",
  "this.overlay_6E6E6085_4CB3_881D_41BD_B4A88FBC8B47"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -0.26,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_49AEF1F2_5527_DB49_41B7_7330DC67EEB4",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -97.23,
  "hfov": 120,
  "class": "PanoramaCameraPosition",
  "pitch": -6.76
 },
 "id": "camera_485B6227_5527_D8D7_41BC_6D1C463277B6",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 85.85,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4FA680DC_5527_D979_41D4_C9DA56C3F058",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 21.98,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4EE18312_5527_D8C9_419E_99EA5BB4760C",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -81.65,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4FBFC2CE_5527_D959_419C_59D2EBAFB794",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 177.39,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4FB700E1_5527_D94B_41D0_1A456BF18827",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": 90.18,
   "backwardYaw": 6.78,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD",
   "distance": 1
  },
  {
   "yaw": -2.02,
   "backwardYaw": -90.45,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4688EF20_4DD3_9859_41C7_787AA99356F7"
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_468F9180_4DD3_8859_4145_D36188AFA280",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "21",
 "thumbnailUrl": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_692D5902_4CB0_9811_417F_C3535C7C751A",
  "this.overlay_694E4DC7_4CB1_B81F_41B7_F7DD2C5EDA13",
  "this.overlay_688B5C0B_4CB0_9817_41C7_9ED1E7CAF0B4"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -91.83,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F05F295_5527_D9CB_41C9_DA2478882702",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 177.57,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F11029F_5527_D9F7_41C4_303CFB49F8A6",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": 77.12,
   "backwardYaw": -1.01,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7",
   "distance": 1
  },
  {
   "yaw": 135.53,
   "backwardYaw": -54.77,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB",
   "distance": 1
  },
  {
   "yaw": 0.25,
   "backwardYaw": 179.24,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160",
   "distance": 1
  },
  {
   "yaw": -91.95,
   "backwardYaw": 89.21,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C",
   "distance": 1
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "14",
 "thumbnailUrl": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_53D00AF1_4D50_B9FD_41D2_F4DF94D08BFE",
  "this.overlay_5362A748_4D51_882A_41BA_933DF09A8D1D",
  "this.overlay_52F9F48A_4D50_8829_41CB_656AD390E1C4",
  "this.overlay_5228AAE0_4D50_9818_41AB_1C09BFD2A6B0"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -128.58,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4E3F4303_5527_D8CF_41C1_2F824B826CC6",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": -1.89,
   "backwardYaw": 89.93,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA",
   "distance": 1
  },
  {
   "yaw": 91.69,
   "backwardYaw": -87.05,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468CDF09_4DD0_986B_41BE_3A494626C999",
   "distance": 1
  },
  {
   "yaw": 50.24,
   "backwardYaw": -35.05,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492",
   "distance": 1
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "6",
 "thumbnailUrl": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_5834A0CE_4DBF_89CB_41CB_96B7C0686050",
  "this.overlay_59B35AC0_4DB1_9836_41C4_EA4495BD9CA4",
  "this.overlay_598F4FCE_4DB3_97CA_41CB_9CD7E3ACAC2B"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -2.75,
  "hfov": 120,
  "class": "PanoramaCameraPosition",
  "pitch": -11.14
 },
 "id": "panorama_717A0897_4FD0_877B_41BB_C1BF96F36747_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -4.95,
  "hfov": 120,
  "class": "PanoramaCameraPosition",
  "pitch": -5.81
 },
 "id": "panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_468E3752_4DD0_88F9_41D2_1251D4678612_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -0.13,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4EFEF126_5527_D8C9_41BB_23FC2E30A25D",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -129.76,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F88B2D8_5527_D979_41BF_E284A1FBF021",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 92.05,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4E0DC307_5527_D8D7_41D4_AEEC74D90C83",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 44.08,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4E10F30D_5527_D8DB_41C0_79633603A2B2",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -55.95,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_49656168_5527_DB59_41C5_A1AC6C1531C4",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B"
  },
  {
   "yaw": -33.42,
   "backwardYaw": 56.78,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE",
   "distance": 1
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "26",
 "thumbnailUrl": "media/panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_6633C14D_4CB3_8815_41D1_DAD0A43D73AA",
  "this.overlay_6638D4DA_4CB0_883F_41BA_240A6873C92B"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -6.03,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F3DF0B0_5527_D9CA_41C3_159600AF38E9",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 144.95,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4EB0614F_5527_DB57_41D3_BF4C0A70286C",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -0.01,
  "hfov": 120,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F4BE273_5527_D94F_41D4_DDF13CF8D578",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": -25.25,
   "backwardYaw": 136.53,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492",
   "distance": 1
  },
  {
   "yaw": 89.55,
   "backwardYaw": 2.13,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70"
  },
  {
   "yaw": 5.87,
   "backwardYaw": 1.63,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_46886090_4DD0_8879_41C9_0592816F1BE4"
  },
  {
   "yaw": -88.54,
   "backwardYaw": -0.01,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468CDF09_4DD0_986B_41BE_3A494626C999",
   "distance": 1
  },
  {
   "yaw": -179.12,
   "backwardYaw": 179.87,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C",
   "distance": 1
  },
  {
   "yaw": -176.59,
   "backwardYaw": 179.87,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2"
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "3",
 "thumbnailUrl": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_422CFE49_4DD0_98C2_41BE_6C0C642C73FF",
  "this.overlay_42AE3C93_4DD0_B846_41C6_4C25F462CE81",
  "this.overlay_429BFC64_4DD0_98C2_4199_14701B840675",
  "this.overlay_5DCDABE0_4DD1_9FC1_41BE_FC9C266D1916",
  "this.overlay_51373F52_4D70_982B_41C6_457EB1EA99CF",
  "this.overlay_56CB4BDC_4D70_F823_41D0_C140A4CE712F",
  "this.overlay_51CC2E9A_4D70_B826_4152_14C85AA81C55",
  "this.overlay_51DAB3F1_4D70_8FE3_41CC_751AAF311EEE",
  "this.overlay_7EB6A205_4CB1_8BEB_41C0_D1E77944C431"
 ],
 "hfovMax": 130
},
{
 "adjacentPanoramas": [
  {
   "yaw": 179.99,
   "backwardYaw": -0.26,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333",
   "distance": 1
  }
 ],
 "vfov": 180,
 "label": "37",
 "id": "panorama_717A0897_4FD0_877B_41BB_C1BF96F36747",
 "class": "Panorama",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_717A0897_4FD0_877B_41BB_C1BF96F36747_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_717A0897_4FD0_877B_41BB_C1BF96F36747_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_717A0897_4FD0_877B_41BB_C1BF96F36747_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_717A0897_4FD0_877B_41BB_C1BF96F36747_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_717A0897_4FD0_877B_41BB_C1BF96F36747_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_717A0897_4FD0_877B_41BB_C1BF96F36747_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_717A0897_4FD0_877B_41BB_C1BF96F36747_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_717A0897_4FD0_877B_41BB_C1BF96F36747_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_717A0897_4FD0_877B_41BB_C1BF96F36747_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_717A0897_4FD0_877B_41BB_C1BF96F36747_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_717A0897_4FD0_877B_41BB_C1BF96F36747_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_717A0897_4FD0_877B_41BB_C1BF96F36747_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_717A0897_4FD0_877B_41BB_C1BF96F36747_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_717A0897_4FD0_877B_41BB_C1BF96F36747_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_717A0897_4FD0_877B_41BB_C1BF96F36747_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_717A0897_4FD0_877B_41BB_C1BF96F36747_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_717A0897_4FD0_877B_41BB_C1BF96F36747_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_717A0897_4FD0_877B_41BB_C1BF96F36747_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_717A0897_4FD0_877B_41BB_C1BF96F36747_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_717A0897_4FD0_877B_41BB_C1BF96F36747_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_71CA5A52_4FD0_9BC1_4181_A74D92871882",
  "this.overlay_7360A2AD_4FD1_8B41_4198_1740F5160659"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -124.74,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4FC250D2_5527_D94E_41B6_E977512CE8B7",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 92.07,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_49D821E7_5527_DB57_41C9_412DABB0ADF0",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": 35.67,
   "backwardYaw": -55.53,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46",
   "distance": 1
  },
  {
   "yaw": -34.55,
   "backwardYaw": 54.76,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468A0506_4DD0_8859_41C9_249E6530A13B",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2"
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_468E3752_4DD0_88F9_41D2_1251D4678612",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "10",
 "thumbnailUrl": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_5506B8B3_4D50_B853_41D1_F7547F3A3996",
  "this.overlay_55BF6709_4D5F_883F_41A4_51A8EB940E6B",
  "this.overlay_619940FE_4CF3_8803_41B9_3731699D4341"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -174.86,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4E4342F0_5527_D949_419F_C49B9E34635E",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_7AB736C5_4F50_8864_419C_98699023C783"
  },
  {
   "yaw": -158.02,
   "backwardYaw": -68.59,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468A0506_4DD0_8859_41C9_249E6530A13B"
  },
  {
   "yaw": 97.25,
   "backwardYaw": -69.5,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2",
   "distance": 1
  },
  {
   "yaw": 56.66,
   "backwardYaw": -87.93,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_46915890_4DD3_B878_419E_FA9CF156F3F2",
   "distance": 1
  }
 ],
 "vfov": 180,
 "label": "30",
 "id": "panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384",
 "class": "Panorama",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_7AD5BC3B_4F50_9821_41C5_CEC72244E672",
  "this.overlay_7B25405F_4F50_8863_41C6_478FC51F64F0",
  "this.overlay_794A0D68_4F51_782D_41BE_22578F5B1C57",
  "this.overlay_7A752D45_4F53_9867_41C3_377D795F4945",
  "this.overlay_7836E559_4F71_8875_41C7_CE4F9947025E",
  "this.overlay_09132938_4CBF_8604_41B0_119A9CA8D952"
 ],
 "hfovMax": 120
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 89.55,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4E21C108_5527_D8D9_41C7_F05F2FC3C3B8",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": -85.42,
   "backwardYaw": -2.02,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C"
  },
  {
   "yaw": -1.01,
   "backwardYaw": 77.12,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70",
   "distance": 1
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "15",
 "thumbnailUrl": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_5268F1C1_4D53_8818_41CC_A11C0F471DD7",
  "this.overlay_6DC90499_4D50_8829_41CC_74E88A7F9BDA",
  "this.overlay_6D31E3EA_4D51_8FEB_41A6_1DB24CBB64CE"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 138.54,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F8672D3_5527_D94F_41CE_4AE92683C24A",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -89.82,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F1B52A4_5527_D9C9_41D1_208A0B664B64",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "viewerArea": "this.MainViewer",
 "displayPlaybackBar": true,
 "touchControlMode": "drag_rotation",
 "id": "MainViewerPanoramaPlayer",
 "gyroscopeVerticalDraggingEnabled": true,
 "class": "PanoramaPlayer",
 "mouseControlMode": "drag_acceleration"
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -1.52,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": -6.21
 },
 "id": "panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": 179.74,
   "backwardYaw": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED",
   "distance": 1
  },
  {
   "yaw": 2.13,
   "backwardYaw": 89.55,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468CDF09_4DD0_986B_41BE_3A494626C999"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2"
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "2",
 "thumbnailUrl": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_43DE14B6_4DD1_884C_41D0_5A2AAF645EA0",
  "this.overlay_421C4A7E_4DD0_F8BC_41CD_720ED7B7B419",
  "this.overlay_57062C40_4D70_9827_41BC_36F6D075AF6D",
  "this.overlay_662AD4CA_559E_EE32_41CD_6B10CFB36794",
  "this.overlay_61871366_55AD_EAF7_4197_207F275BD0A9"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 141.56,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F2F70A6_5527_D9D6_41D0_B3A18E9EBB94",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": 71.22,
   "backwardYaw": -17.84,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_46883404_4DD3_8859_41CB_7620618CF902",
   "distance": 1
  },
  {
   "yaw": 179.24,
   "backwardYaw": 0.25,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70",
   "distance": 1
  },
  {
   "yaw": 20.22,
   "backwardYaw": 28.26,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_46889D1B_4DD3_986F_418C_C91A8229DC90",
   "distance": 1
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "17",
 "thumbnailUrl": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_6F83C2B5_4D50_887E_41B6_B611CB28B370",
  "this.overlay_6F13BB8E_4D51_782D_41C2_BA819806E504",
  "this.overlay_6EAB8B79_4D50_98F4_41CD_825AC1104DD5"
 ],
 "hfovMax": 130
},
{
 "adjacentPanoramas": [
  {
   "yaw": -102.88,
   "backwardYaw": 67.07,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B",
   "distance": 1
  },
  {
   "yaw": -0.26,
   "backwardYaw": 179.99,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_717A0897_4FD0_877B_41BB_C1BF96F36747",
   "distance": 1
  },
  {
   "yaw": -179.88,
   "backwardYaw": -8.8,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D",
   "distance": 1
  }
 ],
 "vfov": 180,
 "label": "36",
 "id": "panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333",
 "class": "Panorama",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_72464A65_4FD0_9BA3_41CF_9FFB65367B83",
  "this.overlay_734E2FB6_4FD3_B8A5_4171_92473A3BCBA9",
  "this.overlay_73503797_4FAF_8946_41C0_6685C6E3D8B6"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -179.75,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F261282_5527_D9C9_41D4_A87D5293BFFC",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -90.79,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_49F471CF_5527_DB57_41D1_078FB80E05FA",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -88.31,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4E6930F5_5527_D94B_4198_D511C03C7550",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 62.66,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F98D0EF_5527_D956_4170_BF7C53AB1ED9",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 77.12,
  "hfov": 120,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F324290_5527_D9C9_418F_2F14A34ACC85",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": -100.12,
   "backwardYaw": -7.98,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_7AB736C5_4F50_8864_419C_98699023C783",
   "distance": 1
  },
  {
   "yaw": -135.92,
   "backwardYaw": -42.46,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB",
   "distance": 1
  },
  {
   "yaw": 124.05,
   "backwardYaw": -38.44,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468A0506_4DD0_8859_41C9_249E6530A13B"
  },
  {
   "yaw": -87.93,
   "backwardYaw": 56.66,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384",
   "distance": 1
  }
 ],
 "vfov": 180,
 "label": "29",
 "id": "panorama_46915890_4DD3_B878_419E_FA9CF156F3F2",
 "class": "Panorama",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_62AA8B37_4CF0_9807_41C4_F7F87AF02424",
  "this.overlay_7E7E82B5_4CB0_882D_41BD_3B0DF38453EC",
  "this.overlay_7845D6E4_4F71_8853_41AC_5DFC94436964",
  "this.overlay_09F08447_4CB3_8E0F_41D3_9E88130BFDE6",
  "this.overlay_055B53B6_4CB3_8A05_41C6_1E22E9301232",
  "this.overlay_631276A3_556A_6A11_41B2_AC709B67DA9B"
 ],
 "hfovMax": 120
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 39.82,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4E94D163_5527_DB4E_41BB_5CDFF3B4B66D",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -152.5,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4E6802E6_5527_D949_41B3_A33243520B5A",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "viewerArea": "this.MapViewer",
 "id": "MapViewerMapPlayer",
 "class": "MapPlayer",
 "movementMode": "constrained"
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -93.13,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4F35928B_5527_D9DF_41C0_B0EBAE8560AB",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 91.31,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4FF9E2B3_5527_D9CF_41D0_9570B32ADCEB",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70"
  },
  {
   "yaw": -111.94,
   "backwardYaw": -109.66,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_46886090_4DD0_8879_41C9_0592816F1BE4",
   "distance": 1
  },
  {
   "yaw": -0.01,
   "backwardYaw": -88.54,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8",
   "distance": 1
  },
  {
   "yaw": -41.46,
   "backwardYaw": -117.34,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492",
   "distance": 1
  },
  {
   "yaw": -87.05,
   "backwardYaw": 91.69,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2",
   "distance": 1
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_468CDF09_4DD0_986B_41BE_3A494626C999",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "4",
 "thumbnailUrl": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_5DF8E6CB_4DD0_89C0_41C8_88DF7092D5A8",
  "this.overlay_5C720472_4DD0_88C3_41CA_9B3B6DB99A39",
  "this.overlay_5C59A282_4DD0_8842_41D1_E49CB4246953",
  "this.overlay_5CD896BB_4DD1_884C_41CC_CA7AE6B0F5FA",
  "this.overlay_56EF595E_4D71_98DC_418D_376491BCF0A0"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 124.47,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4E5AE2FA_5527_D939_41C5_BA4DE720B220",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 139.67,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_49BF21FC_5527_DB39_41BD_D7F1A1DE890F",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -125.99,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4E7FE0FA_5527_D939_4195_2528877B556E",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_468A0506_4DD0_8859_41C9_249E6530A13B_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": -116.71,
   "backwardYaw": 51.42,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_7AB736C5_4F50_8864_419C_98699023C783",
   "distance": 1
  },
  {
   "yaw": 92.44,
   "backwardYaw": -87.95,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7",
   "distance": 1
  },
  {
   "yaw": -42.46,
   "backwardYaw": -135.92,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_46915890_4DD3_B878_419E_FA9CF156F3F2",
   "distance": 1
  },
  {
   "yaw": -68.59,
   "backwardYaw": -158.02,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384",
   "distance": 1
  }
 ],
 "vfov": 180,
 "label": "32",
 "id": "panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB",
 "class": "Panorama",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_7626C745_4FAF_884E_41D3_6F15B7CA5474",
  "this.overlay_7961DF65_4FB0_984F_41D2_589B11AFC26D",
  "this.overlay_7982EE09_4FB0_9BC4_419C_0CD5E1D768DF",
  "this.overlay_76B0E37A_4FB1_8844_41D1_45ECAB5089F5",
  "this.overlay_7739783F_4FB7_783C_41A0_FEE7CE39A691"
 ],
 "hfovMax": 120
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": -87.95,
   "backwardYaw": 92.44,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE"
  },
  {
   "yaw": 5.14,
   "backwardYaw": 4.63,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_0B6EC80E_4CD0_8613_41C6_227755166D76",
   "distance": 1
  }
 ],
 "vfov": 180,
 "label": "34",
 "id": "panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7",
 "class": "Panorama",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_7712A97F_4FB1_9841_41C7_DB2C658EB461",
  "this.overlay_77574D79_4FB7_784E_41CB_C74E51BFF090",
  "this.overlay_0C2CB5E6_4CF0_89F7_41C8_6A899FC3574F",
  "this.overlay_7027FCDC_53FE_BF11_41C0_A6E2B8ADF623"
 ],
 "hfovMax": 120
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 63.29,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4FE4C0C4_5527_D94A_41C7_A5D23261EFCF",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 93.83,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4E86A158_5527_DB7A_41D2_FF5AF16E1251",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "items": [
  {
   "begin": "this.MapViewerMapPlayer.set('movementMode', 'constrained')",
   "media": "this.map_4327C897_5565_C913_41CF_A8B4976D294B",
   "player": "this.MapViewerMapPlayer",
   "class": "MapPlayListItem"
  }
 ],
 "id": "playList_4F759080_5527_D9C9_41D5_49ADCA6A3B16",
 "class": "PlayList"
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": -92.96,
   "backwardYaw": -0.26,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712",
   "distance": 1
  },
  {
   "yaw": 1.63,
   "backwardYaw": 5.87,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468A0506_4DD0_8859_41C9_249E6530A13B"
  },
  {
   "yaw": 33.53,
   "backwardYaw": 27.5,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46"
  },
  {
   "yaw": 89.93,
   "backwardYaw": -1.89,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2",
   "distance": 1
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "7",
 "thumbnailUrl": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_5885802C_4DB0_884D_41B5_27D142090498",
  "this.overlay_588BA7F0_4DB0_F7D5_41BB_34D7D09DA6F4",
  "this.overlay_58BE1ED7_4DB7_79DC_41B4_247ADB83EC84",
  "this.overlay_58E6AD87_4DB1_983D_41B6_1222972BEF81",
  "this.overlay_5B975261_4D50_88F3_41B5_3DD38294381D",
  "this.overlay_513E680F_4D70_F820_41D0_08533C517882",
  "this.overlay_66319F74_4CF0_9805_41BE_1B6D208D6DEE"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED"
  },
  {
   "yaw": 136.53,
   "backwardYaw": -25.25,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70"
  },
  {
   "yaw": 27.5,
   "backwardYaw": 33.53,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA",
   "distance": 1
  },
  {
   "yaw": -78.26,
   "backwardYaw": 98.35,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46",
   "distance": 1
  },
  {
   "yaw": -117.34,
   "backwardYaw": -41.46,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468CDF09_4DD0_986B_41BE_3A494626C999",
   "distance": 1
  },
  {
   "yaw": -35.05,
   "backwardYaw": 50.24,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2",
   "distance": 1
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "5",
 "thumbnailUrl": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_5F07278A_4DAF_884C_41C7_8B1D07474657",
  "this.overlay_5F486C49_4DB1_B8CD_41D2_C4C967A11F27",
  "this.overlay_5FB8CEFF_4DB3_79C5_41D0_A936A7B55D3C",
  "this.overlay_5E1134A7_4DB7_8846_4198_0F994BDCDDD6",
  "this.overlay_59E09148_4DB0_88C8_41A7_0FFD5535A1C7",
  "this.overlay_599A974C_4DB0_88C8_41D1_C1216E41F849",
  "this.overlay_56982F9D_4D70_B85F_41A6_5ABB5CB86188"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 111.41,
  "hfov": 110,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_49FAC1D9_5527_DB7B_41BB_4D15BD43CD25",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -0.13,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_4EE86121_5527_D8CB_41C0_9223E400BAC3",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": -144.33,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_498D8207_5527_D8D7_4192_51C27766454E",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_7AB736C5_4F50_8864_419C_98699023C783"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7"
  }
 ],
 "vfov": 180,
 "label": "35",
 "id": "panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE",
 "class": "Panorama",
 "hfovMin": "150%",
 "thumbnailUrl": "media/panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_7512882C_4FD0_87F3_4198_3C76F78842B4",
  "this.overlay_729FE739_4FD0_89D5_41C7_8B07813F844B",
  "this.overlay_0EC6A9EA_4F5F_998D_4198_15622C404DE3"
 ],
 "hfovMax": 130
},
{
 "manualRotationSpeed": 1000,
 "automaticRotationSpeed": 20,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_46883404_4DD3_8859_41CB_7620618CF902_camera",
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 5
},
{
 "adjacentPanoramas": [
  {
   "yaw": 1,
   "backwardYaw": 179.74,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0",
   "distance": 1
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "1",
 "thumbnailUrl": "media/panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_43DC0404_4DF1_884F_41B3_1BFD0159B676"
 ],
 "hfovMax": 130
},
{
 "adjacentPanoramas": [
  {
   "yaw": -109.66,
   "backwardYaw": -111.94,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468CDF09_4DD0_986B_41BE_3A494626C999",
   "distance": 1
  },
  {
   "yaw": -40.33,
   "backwardYaw": 55.26,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46",
   "distance": 1
  },
  {
   "yaw": 41.45,
   "backwardYaw": -57.03,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468A0506_4DD0_8859_41C9_249E6530A13B",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2"
  }
 ],
 "vfov": 180,
 "partial": false,
 "id": "panorama_46886090_4DD0_8879_41C9_0592816F1BE4",
 "class": "Panorama",
 "hfovMin": "150%",
 "label": "9",
 "thumbnailUrl": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_t.jpg",
 "pitch": 0,
 "hfov": 360,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "height": 1536,
      "tags": "ondemand",
      "width": 1536,
      "colCount": 3,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "height": 1024,
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "class": "TiledImageResourceLevel"
     }
    ]
   },
   "thumbnailUrl": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "overlays": [
  "this.overlay_559CA8E6_4D50_99F2_41C8_7B485E2310BF",
  "this.overlay_5A87F9C8_4D50_983D_41BD_4A6DF54EDC94",
  "this.overlay_66377202_4CD1_8800_4180_D11511E3D074",
  "this.overlay_7FDAF6C7_4CB1_886A_41CF_2FA62570F773",
  "this.overlay_7CC0DA57_559A_DACE_41D2_0091A16ACE89"
 ],
 "hfovMax": 130
},
{
 "transitionDuration": 500,
 "toolTipPaddingRight": 6,
 "toolTipBorderSize": 1,
 "id": "MainViewer",
 "left": 0,
 "toolTipPaddingTop": 4,
 "paddingLeft": 0,
 "progressBorderRadius": 4,
 "right": 0,
 "playbackBarProgressBackgroundColorRatios": [
  0,
  1
 ],
 "borderRadius": 0,
 "toolTipDisplayTime": 600,
 "toolTipPaddingLeft": 6,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarLeft": 0,
 "progressBackgroundColorRatios": [
  0,
  1
 ],
 "minHeight": 50,
 "toolTipBorderRadius": 3,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarHeadHeight": 30,
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressBarBorderColor": "#000000",
 "progressBackgroundColorDirection": "vertical",
 "progressBorderColor": "#AAAAAA",
 "progressBarBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarBottom": 10,
 "minWidth": 100,
 "playbackBarHeadOpacity": 1,
 "toolTipBorderColor": "#767676",
 "toolTipShadowSpread": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarBackgroundColor": [
  "#222222",
  "#444444"
 ],
 "class": "ViewerArea",
 "playbackBarBackgroundColor": [
  "#EEEEEE",
  "#CCCCCC"
 ],
 "progressBackgroundColor": [
  "#EEEEEE",
  "#CCCCCC"
 ],
 "paddingBottom": 0,
 "toolTipOpacity": 1,
 "playbackBarHeadWidth": 6,
 "toolTipShadowBlurRadius": 3,
 "toolTipFontSize": "12px",
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowColor": "#000000",
 "shadow": false,
 "playbackBarHeight": 20,
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 4,
 "playbackBarRight": 0,
 "toolTipFontWeight": "normal",
 "playbackBarProgressBorderSize": 0,
 "transitionMode": "blending",
 "toolTipShadowHorizontalLength": 0,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 4,
 "progressBarBorderSize": 0,
 "toolTipShadowVerticalLength": 0,
 "playbackBarHeadShadowVerticalLength": 0,
 "show": "this.setComponentVisibility(this.Container_19173ACE_09E6_54EE_4175_5F95190B4AC0, false, 0, null, null, false); this.setComponentVisibility(this.Image_40BBC396_50E4_AC74_41CD_DB178DCE344E, true, 0, null, null, false)",
 "toolTipShadowColor": "#333333",
 "playbackBarBorderRadius": 4,
 "playbackBarHeadBorderRadius": 0,
 "paddingRight": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipShadowOpacity": 1,
 "progressLeft": 10,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipFontStyle": "normal",
 "playbackBarBorderSize": 2,
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "toolTipFontFamily": "Arial",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "top": 0,
 "borderSize": 0,
 "playbackBarHeadShadowColor": "#000000",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "vrPointerSelectionTime": 2000,
 "progressRight": 10,
 "bottom": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "progressBarBackgroundColorDirection": "vertical",
 "displayTooltipInTouchScreens": true,
 "playbackBarHeadShadow": true,
 "progressBottom": 1,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "progressHeight": 20,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#222222",
  "#444444"
 ],
 "vrPointerColor": "#FFFFFF",
 "paddingTop": 0,
 "playbackBarHeadShadowOpacity": 0.7,
 "progressBarOpacity": 1,
 "playbackBarBorderColor": "#AAAAAA",
 "progressBorderSize": 2,
 "data": {
  "name": "Main Viewer"
 }
},
{
 "maxHeight": 592,
 "id": "Image_40BBC396_50E4_AC74_41CD_DB178DCE344E",
 "left": "7%",
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "scaleMode": "fit_inside",
 "paddingRight": 0,
 "borderRadius": 0,
 "right": "7%",
 "url": "skin/Image_40BBC396_50E4_AC74_41CD_DB178DCE344E.png",
 "minHeight": 1,
 "propagateClick": false,
 "horizontalAlign": "center",
 "top": "89.88%",
 "borderSize": 0,
 "minWidth": 1,
 "bottom": "1%",
 "class": "Image",
 "paddingBottom": 0,
 "shadow": false,
 "verticalAlign": "middle",
 "paddingTop": 0,
 "data": {
  "name": "Image5266"
 },
 "show": "this.setComponentVisibility(this.Image_40BBC396_50E4_AC74_41CD_DB178DCE344E, true, 0, null, null, false)",
 "maxWidth": 1749
},
{
 "transparencyActive": true,
 "maxHeight": 50,
 "id": "IconButton_1A355752_0A22_DDF6_4174_91EEE46D06FC",
 "left": "2%",
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "paddingRight": 0,
 "width": 50,
 "borderRadius": 0,
 "iconURL": "skin/IconButton_1A355752_0A22_DDF6_4174_91EEE46D06FC.png",
 "minHeight": 1,
 "propagateClick": false,
 "horizontalAlign": "center",
 "borderSize": 0,
 "minWidth": 1,
 "mode": "push",
 "click": "this.setComponentVisibility(this.Container_06295097_09E1_D37D_41A0_4F59CDA5B097, true, 0, null, null, false); this.setComponentVisibility(this.Container_19173ACE_09E6_54EE_4175_5F95190B4AC0, true, 0, null, null, false); this.setComponentVisibility(this.MapViewer, true, 0, null, null, false); this.setComponentVisibility(this.IconButton_18EE8675_09E2_5FBD_4155_1A9040D06494, true, 0, null, null, false)",
 "bottom": "2%",
 "class": "IconButton",
 "paddingBottom": 0,
 "height": 50,
 "shadow": false,
 "verticalAlign": "middle",
 "paddingTop": 0,
 "data": {
  "name": "IconButton8041"
 },
 "cursor": "hand",
 "maxWidth": 50
},
{
 "overflow": "scroll",
 "children": [
  "this.Container_19173ACE_09E6_54EE_4175_5F95190B4AC0"
 ],
 "id": "Container_06295097_09E1_D37D_41A0_4F59CDA5B097",
 "left": "0%",
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5,
 "contentOpaque": false,
 "paddingRight": 0,
 "borderRadius": 0,
 "right": "0%",
 "scrollBarWidth": 10,
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "propagateClick": false,
 "horizontalAlign": "left",
 "top": "0%",
 "borderSize": 0,
 "minWidth": 1,
 "scrollBarColor": "#000000",
 "layout": "absolute",
 "bottom": "0%",
 "class": "Container",
 "paddingBottom": 0,
 "click": "this.setComponentVisibility(this.Container_06295097_09E1_D37D_41A0_4F59CDA5B097, true, 0, null, null, false); this.setComponentVisibility(this.Container_19173ACE_09E6_54EE_4175_5F95190B4AC0, true, 0, null, null, false); this.setComponentVisibility(this.MapViewer, true, 0, null, null, false); this.setComponentVisibility(this.IconButton_18EE8675_09E2_5FBD_4155_1A9040D06494, true, 0, null, null, false)",
 "gap": 10,
 "shadow": false,
 "verticalAlign": "top",
 "paddingTop": 0,
 "data": {
  "name": "Container5557"
 },
 "scrollBarMargin": 2
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 36)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A917F9_4D73_8A24_41CE_D88BE12613EC",
   "yaw": 88.17,
   "hfov": 22.35,
   "pitch": -11.99,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_0E7387CA_4FB3_8923_41D2_9AAE388BE040",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_1_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 88.17,
   "hfov": 22.35,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -11.99
  }
 ]
},
{
 "bleachingDistance": 0.5,
 "yaw": 93.83,
 "bleaching": 0.3,
 "pitch": 16.89,
 "id": "overlay_0E1C2A88_4F50_9B8D_41D0_C0D24CD92733",
 "class": "LensFlarePanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_0B6EC80E_4CD0_8613_41C6_227755166D76, this.camera_4F3DF0B0_5527_D9CA_41C3_159600AF38E9); this.mainPlayList.set('selectedIndex', 38)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A8F7F9_4D73_8A24_41C8_B0A380F6E5CB",
   "yaw": -43.59,
   "hfov": 20.56,
   "pitch": -12.87,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_0D8A30E1_4CF0_87EC_41A2_181FE64EA4E7",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_1_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -43.59,
   "hfov": 20.56,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -12.87
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8, this.camera_4FC242B7_5527_D937_41C0_85424C425D15); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_6FAE2D39_559E_BE5E_41D0_F9AC8B943B8D",
   "yaw": 179.87,
   "hfov": 24.33,
   "pitch": -32.59,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5168DC13_4D71_9822_41C5_BFD1596DCBCA",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 179.87,
   "hfov": 24.33,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -32.59
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70, this.camera_4FDEC2C0_5527_D949_41BC_C20FFA473730); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A3C7F2_4D73_8A24_41BF_6603D378D41A",
   "yaw": 89.21,
   "hfov": 28.14,
   "pitch": -19.06,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_50E10541_4D51_881F_41C8_55CCC704A1ED",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 89.21,
   "hfov": 28.14,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -19.06
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B, this.camera_4FD4D2BC_5527_D939_41BE_4349B0011129); this.mainPlayList.set('selectedIndex', 23)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_6FAF4D39_559E_BE5E_4182_9E9DA09945A3",
   "yaw": -94.15,
   "hfov": 30.98,
   "pitch": -28.82,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_504428AD_4D53_9867_41A6_A77E3DFDBCAB",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0_HS_2_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -94.15,
   "hfov": 30.98,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -28.82
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD, this.camera_4FF9E2B3_5527_D9CF_41D0_9570B32ADCEB); this.mainPlayList.set('selectedIndex', 19)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_6FAF2D39_559E_BE5E_41D3_20A0137112C8",
   "yaw": -2.43,
   "hfov": 27.37,
   "pitch": -27.54,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_53AA3BAD_4D51_9864_41B4_DFF3D48CC9B8",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0_HS_3_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -2.43,
   "hfov": 27.37,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -27.54
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712, this.camera_4F35928B_5527_D9DF_41C0_B0EBAE8560AB); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A207F5_4D73_8A2C_41B4_8F4BF0B34612",
   "yaw": -157.77,
   "hfov": 33.1,
   "pitch": -36.99,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_61A0BF5A_4CF1_B80C_41C9_C79E47CA7FD2",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -157.77,
   "hfov": 33.1,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -36.99
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2, this.camera_4F05F295_5527_D9CB_41C9_DA2478882702); this.mainPlayList.set('selectedIndex', 27)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A237F5_4D73_8A2C_41BB_228BCCB4D2FC",
   "yaw": -86.17,
   "hfov": 25.92,
   "pitch": -10.61,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_60E0320C_4CFF_8804_418E_BF24F4B7E4D5",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -86.17,
   "hfov": 25.92,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10.61
  }
 ]
},
{
 "bleachingDistance": 0.5,
 "yaw": 0.88,
 "bleaching": 0.4,
 "pitch": 26.44,
 "id": "overlay_7B214AE0_4F70_9854_41C3_7A785529E05D",
 "class": "LensFlarePanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333, this.camera_4F324290_5527_D9C9_418F_2F14A34ACC85); this.mainPlayList.set('selectedIndex', 34)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05ADA7F5_4D73_8A2C_41C0_9AEC7F43421B",
   "yaw": 67.07,
   "hfov": 24.64,
   "pitch": -13.75,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_748F2A1A_4FD0_BB9B_41A9_5B4A0EB2C66C",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0_HS_2_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 67.07,
   "hfov": 24.64,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13.75
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D, this.camera_4F0C829A_5527_D9F9_41CF_A016C6CB0DB8); this.mainPlayList.set('selectedIndex', 36)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_682D5242_55AB_EA2C_41CC_B2AC16C65EA4",
   "yaw": 101.86,
   "hfov": 16.46,
   "pitch": -15.39,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_674E34EE_55A6_6FF4_41C3_23894FDA4F9F",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0_HS_3_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 101.86,
   "hfov": 16.46,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -15.39
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B, this.camera_4ED5231F_5527_D8F7_41D3_45506B9C7B2B); this.mainPlayList.set('selectedIndex', 23)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AD17F4_4D73_8A2C_41B2_A3B2D97C222D",
   "yaw": -2.61,
   "hfov": 18.01,
   "pitch": -13.67,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6561919F_4CB7_8833_4164_5C1F07277B94",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -2.61,
   "hfov": 18.01,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13.67
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB, this.camera_4EDBD324_5527_D8C9_418A_2E56D810129A); this.mainPlayList.set('selectedIndex', 25)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AD37F4_4D73_8A2C_417F_9EE5184512F4",
   "yaw": 56.78,
   "hfov": 18.74,
   "pitch": -24.92,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_64C052D7_4CB0_8834_41B0_B0734F1E3DDB",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 56.78,
   "hfov": 18.74,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -24.92
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468A0506_4DD0_8859_41C9_249E6530A13B, this.camera_4E94D163_5527_DB4E_41BB_5CDFF3B4B66D); this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AD77F5_4D73_8A2C_41B2_9AD1F2C9B076",
   "yaw": -118.58,
   "hfov": 29.51,
   "pitch": -22.29,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_60FC6008_4CF0_880B_41B7_ED6A375451F1",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -118.58,
   "hfov": 29.51,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -22.29
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B, this.camera_4E86A158_5527_DB7A_41D2_FF5AF16E1251); this.mainPlayList.set('selectedIndex', 26)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AD17F5_4D73_8A2C_41C8_B8B1F5A4A619",
   "yaw": 88.17,
   "hfov": 26.03,
   "pitch": -9.1,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_600A4D3B_4CF3_980E_41AC_E9054F33ADE8",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 88.17,
   "hfov": 26.03,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -9.1
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_46915890_4DD3_B878_419E_FA9CF156F3F2, this.camera_49656168_5527_DB59_41C5_A1AC6C1531C4); this.mainPlayList.set('selectedIndex', 28)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05ACC7F5_4D73_8A2C_41BF_4EA70D8033EF",
   "yaw": -38.44,
   "hfov": 25.33,
   "pitch": -16.14,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_62FCA3F8_4CF0_880A_41AA_9BC1F3189842",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0_HS_2_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -38.44,
   "hfov": 25.33,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -16.14
  }
 ]
},
{
 "bleachingDistance": 0.5,
 "yaw": 2.39,
 "bleaching": 0.3,
 "pitch": 26.44,
 "id": "overlay_763E7C01_4F70_9FD5_41B6_16B7EC7F9190",
 "class": "LensFlarePanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384, this.camera_496A3172_5527_DB49_41BA_91B50E55A627); this.mainPlayList.set('selectedIndex', 29)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_682CC243_55AB_EA2D_41B8_8C23D1594171",
   "yaw": -69.5,
   "hfov": 17.77,
   "pitch": -9.86,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_06ABA530_4CB7_8E1F_41C8_807E46C84999",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0_HS_3_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -69.5,
   "hfov": 17.77,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -9.86
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 30)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_68336243_55AB_EA2D_41B6_B7A99E8D2CE7",
   "yaw": -84.12,
   "hfov": 12.79,
   "pitch": -3.85,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_66B6FF4B_55A5_BA33_41D2_DF9CC53B61D3",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0_HS_4_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -84.12,
   "hfov": 12.79,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -3.85
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_46886090_4DD0_8879_41C9_0592816F1BE4, this.camera_4F04F0B5_5527_D9CA_41D1_4D2847A13C4B); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A0E7F2_4D73_8A27_41B2_473F08C8D64A",
   "yaw": -57.03,
   "hfov": 18.7,
   "pitch": -19.52,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_54678717_4D51_8856_41B9_FA5FFB515188",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -57.03,
   "hfov": 18.7,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -19.52
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468E3752_4DD0_88F9_41D2_1251D4678612, this.camera_4F0940BA_5527_D93E_41BD_18EBAC5E82E8); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A0A7F2_4D73_8A27_4166_E43FD9F55D92",
   "yaw": 54.76,
   "hfov": 19.49,
   "pitch": -24.05,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_568AB2E0_4D50_89EB_41BB_E05E186E27D2",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 54.76,
   "hfov": 19.49,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -24.05
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A057F2_4D73_8A27_41D1_DEAA3EBE5DE7",
   "yaw": -40.33,
   "hfov": 10.91,
   "pitch": -8.85,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_54F6EFA2_4D51_986E_41BF_1E2A0DBD4FF6",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0_HS_2_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -40.33,
   "hfov": 10.91,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -8.85
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_76CB06A9_4CF1_8809_41B7_B7EFA656A50B",
   "yaw": -67.58,
   "hfov": 15.05,
   "pitch": -10.61,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5716695C_4D53_98D9_41C6_2A48A31C0280",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_1_HS_3_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -67.58,
   "hfov": 15.05,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10.61
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2, this.camera_4F1200BF_5527_D936_41D3_5244E5D32BB2); this.mainPlayList.set('selectedIndex', 27)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": " Click Here for\u000dGarden Access"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0_HS_4_0.png",
      "width": 304,
      "class": "ImageResourceLevel",
      "height": 481
     }
    ]
   },
   "pitch": -20.45,
   "hfov": 25.08,
   "yaw": -140.18,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_61F5B567_4CF7_8803_41C2_DF92CED2A4B4",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0_HS_4_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 25
     }
    ]
   },
   "yaw": -140.18,
   "hfov": 25.08,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -20.45
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7, this.camera_4E4342F0_5527_D949_419F_C49B9E34635E); this.mainPlayList.set('selectedIndex', 32)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_5FA5CED3_50FC_B5E3_41D1_9B4EB91A1190",
   "yaw": 4.63,
   "hfov": 18.51,
   "pitch": -5.09,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_0809207C_4CAF_86F5_41C9_1D156AD00652",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 4.63,
   "hfov": 18.51,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -5.09
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03, this.camera_4E5642F5_5527_D94B_41D2_1AE2E50C8A5A); this.mainPlayList.set('selectedIndex', 37)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A8B7F9_4D73_8A24_41C1_9575820DFABF",
   "yaw": 173.97,
   "hfov": 29.22,
   "pitch": -14.26,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_094408DD_4CB0_8637_4197_F15EFA213124",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_1_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 173.97,
   "hfov": 29.22,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -14.26
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A857F9_4D73_8A24_41C9_385FD8515DC3",
   "yaw": 91.06,
   "hfov": 25.5,
   "pitch": -24.93,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_0B524747_4CB0_8A14_41B0_54917D0B6100",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_1_HS_2_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 91.06,
   "hfov": 25.5,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -24.93
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_46915890_4DD3_B878_419E_FA9CF156F3F2, this.camera_4FE920C9_5527_D95A_419D_BF067EC3F7C9); this.mainPlayList.set('selectedIndex', 28)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AF27F6_4D73_8A2C_41C1_1816135CABFE",
   "yaw": -7.98,
   "hfov": 21.64,
   "pitch": -9.22,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_7ABCD29B_4F57_88ED_41A9_2F35D5BA58B7",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AB736C5_4F50_8864_419C_98699023C783_1_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -7.98,
   "hfov": 21.64,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -9.22
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB, this.camera_4FE4C0C4_5527_D94A_41C7_A5D23261EFCF); this.mainPlayList.set('selectedIndex', 31)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AEC7F7_4D73_8A2C_41C5_2F7309997303",
   "yaw": 51.42,
   "hfov": 21.02,
   "pitch": -9.1,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_7B9A0374_4F50_883B_41B8_67612071F064",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AB736C5_4F50_8864_419C_98699023C783_1_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 51.42,
   "hfov": 21.02,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -9.1
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160, this.camera_4E4C60FE_5527_D939_41CF_6E34C1EBBC82); this.mainPlayList.set('selectedIndex', 16)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A357F3_4D73_8A24_41CE_5E040F808B64",
   "yaw": 28.26,
   "hfov": 21.25,
   "pitch": -15.89,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6F39FD70_4CB0_98F4_41A1_19CCD1743CC4",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 28.26,
   "hfov": 21.25,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -15.89
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_46883404_4DD3_8859_41CB_7620618CF902, this.camera_4E7FE0FA_5527_D939_4195_2528877B556E); this.mainPlayList.set('selectedIndex', 18)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A307F3_4D73_8A24_419A_67D5FB008F55",
   "yaw": -8.8,
   "hfov": 23.29,
   "pitch": -27.95,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6EAF96F2_4CB1_89F7_4104_C0DA8698FB40",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -8.8,
   "hfov": 23.29,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -27.95
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C, this.camera_4FA680DC_5527_D979_41D4_C9DA56C3F058); this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_6221F5DF_55FA_69C7_41CE_5C00CF6186D3",
   "yaw": 94.7,
   "hfov": 35.99,
   "pitch": -28.45,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_65517C7D_4CB0_98F7_41D0_6426F4A45177",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 94.7,
   "hfov": 35.99,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -28.45
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE, this.camera_4FB700E1_5527_D94B_41D0_1A456BF18827); this.mainPlayList.set('selectedIndex', 24)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AD67F4_4D73_8A2C_41A5_92CD6B3517EE",
   "yaw": -95.72,
   "hfov": 23.31,
   "pitch": -16.89,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6574C14D_4CB1_8817_41C7_B655BAC13780",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -95.72,
   "hfov": 23.31,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -16.89
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4688EF20_4DD3_9859_41C7_787AA99356F7, this.camera_4FED42A9_5527_D9DB_41B5_4C735172B4EB); this.mainPlayList.set('selectedIndex', 22)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A237F4_4D73_8A2C_41C9_3C538C7F8D57",
   "yaw": 1,
   "hfov": 24.63,
   "pitch": -20.91,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6B3C6BDB_4CB3_9830_41C4_A14DB2ED3431",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 1,
   "hfov": 24.63,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -20.91
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468F9180_4DD3_8859_4145_D36188AFA280, this.camera_4FF782AE_5527_D9D9_41CC_799437189D86); this.mainPlayList.set('selectedIndex', 20)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05ADD7F4_4D73_8A2C_41CE_0D548DA2AED5",
   "yaw": -90.45,
   "hfov": 24.68,
   "pitch": -27.7,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6B5DAD1A_4CB0_B830_41AD_2BB0743C5B11",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -90.45,
   "hfov": 24.68,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -27.7
  }
 ]
},
{
 "map": {
  "width": 444.55,
  "x": 1823.85,
  "height": 451.58,
  "offsetX": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_0_map.gif",
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16
    }
   ]
  },
  "offsetY": 0,
  "class": "HotspotMapOverlayMap",
  "y": 487.44
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 38)",
   "mapColor": "#FF0000",
   "class": "HotspotMapOverlayArea",
   "toolTip": "40"
  }
 ],
 "image": {
  "x": 1823.85,
  "height": 451.58,
  "y": 487.44,
  "class": "HotspotMapOverlayImage",
  "width": 444.55,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_0.png",
     "width": 142,
     "class": "ImageResourceLevel",
     "height": 144
    }
   ]
  }
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_436DF6C8_5562_797B_41D4_104031D68771",
 "class": "AreaHotspotMapOverlay"
},
{
 "map": {
  "width": 444.55,
  "x": 2092.32,
  "height": 451.58,
  "offsetX": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_1_map.gif",
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16
    }
   ]
  },
  "offsetY": 0,
  "class": "HotspotMapOverlayMap",
  "y": 1194.58
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotMapOverlayArea",
   "toolTip": "3"
  }
 ],
 "image": {
  "x": 2092.32,
  "height": 451.58,
  "y": 1194.58,
  "class": "HotspotMapOverlayImage",
  "width": 444.55,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_1.png",
     "width": 142,
     "class": "ImageResourceLevel",
     "height": 144
    }
   ]
  }
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_40D5B4F3_5562_D92D_41C8_D7256EADF40F",
 "class": "AreaHotspotMapOverlay"
},
{
 "map": {
  "width": 444.55,
  "x": 1731.65,
  "height": 451.58,
  "offsetX": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_2_map.gif",
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16
    }
   ]
  },
  "offsetY": 0,
  "class": "HotspotMapOverlayMap",
  "y": 1597.6
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotMapOverlayArea",
   "toolTip": "8"
  }
 ],
 "image": {
  "x": 1731.65,
  "height": 451.58,
  "y": 1597.6,
  "class": "HotspotMapOverlayImage",
  "width": 444.55,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_2.png",
     "width": 142,
     "class": "ImageResourceLevel",
     "height": 144
    }
   ]
  }
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_40D007DE_556D_C716_4174_07F163AA2C1E",
 "class": "AreaHotspotMapOverlay"
},
{
 "map": {
  "width": 444.55,
  "x": 2403.53,
  "height": 451.58,
  "offsetX": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_3_map.gif",
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16
    }
   ]
  },
  "offsetY": 0,
  "class": "HotspotMapOverlayMap",
  "y": 1604.66
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotMapOverlayArea",
   "toolTip": "6"
  }
 ],
 "image": {
  "x": 2403.53,
  "height": 451.58,
  "y": 1604.66,
  "class": "HotspotMapOverlayImage",
  "width": 444.55,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_3.png",
     "width": 142,
     "class": "ImageResourceLevel",
     "height": 144
    }
   ]
  }
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_40DF5F68_556E_473A_41BE_C590BE335E4B",
 "class": "AreaHotspotMapOverlay"
},
{
 "map": {
  "width": 444.55,
  "x": 3117.46,
  "height": 451.58,
  "offsetX": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_4_map.gif",
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16
    }
   ]
  },
  "offsetY": 0,
  "class": "HotspotMapOverlayMap",
  "y": 1611.73
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000",
   "class": "HotspotMapOverlayArea",
   "toolTip": "10"
  }
 ],
 "image": {
  "x": 3117.46,
  "height": 451.58,
  "y": 1611.73,
  "class": "HotspotMapOverlayImage",
  "width": 444.55,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_4.png",
     "width": 142,
     "class": "ImageResourceLevel",
     "height": 144
    }
   ]
  }
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_40DC88C6_556E_4969_41CC_398F182B1029",
 "class": "AreaHotspotMapOverlay"
},
{
 "map": {
  "width": 444.55,
  "x": 2911.16,
  "height": 451.58,
  "offsetX": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_5_map.gif",
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16
    }
   ]
  },
  "offsetY": 0,
  "class": "HotspotMapOverlayMap",
  "y": 2346.77
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 28)",
   "mapColor": "#FF0000",
   "class": "HotspotMapOverlayArea",
   "toolTip": "29"
  }
 ],
 "image": {
  "x": 2911.16,
  "height": 451.58,
  "y": 2346.77,
  "class": "HotspotMapOverlayImage",
  "width": 444.55,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_5.png",
     "width": 142,
     "class": "ImageResourceLevel",
     "height": 144
    }
   ]
  }
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_40DE9746_556E_C776_41D1_7FC75FBB475B",
 "class": "AreaHotspotMapOverlay"
},
{
 "map": {
  "width": 444.55,
  "x": 1231.09,
  "height": 451.58,
  "offsetX": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_6_map.gif",
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16
    }
   ]
  },
  "offsetY": 0,
  "class": "HotspotMapOverlayMap",
  "y": 2318.51
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 34)",
   "mapColor": "#FF0000",
   "class": "HotspotMapOverlayArea",
   "toolTip": "36"
  }
 ],
 "image": {
  "x": 1231.09,
  "height": 451.58,
  "y": 2318.51,
  "class": "HotspotMapOverlayImage",
  "width": 444.55,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_6.png",
     "width": 142,
     "class": "ImageResourceLevel",
     "height": 144
    }
   ]
  }
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_40D572B0_556F_D929_41D1_C32B48CB9E59",
 "class": "AreaHotspotMapOverlay"
},
{
 "map": {
  "width": 444.55,
  "x": 4184.99,
  "height": 451.58,
  "offsetX": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_7_map.gif",
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16
    }
   ]
  },
  "offsetY": 0,
  "class": "HotspotMapOverlayMap",
  "y": 2205.48
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 30)",
   "mapColor": "#FF0000",
   "class": "HotspotMapOverlayArea",
   "toolTip": "31"
  }
 ],
 "image": {
  "x": 4184.99,
  "height": 451.58,
  "y": 2205.48,
  "class": "HotspotMapOverlayImage",
  "width": 444.55,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_7.png",
     "width": 142,
     "class": "ImageResourceLevel",
     "height": 144
    }
   ]
  }
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_40D59AA1_556E_4928_41C5_6AE865492E9A",
 "class": "AreaHotspotMapOverlay"
},
{
 "map": {
  "width": 444.55,
  "x": 3654.76,
  "height": 451.58,
  "offsetX": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_8_map.gif",
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16
    }
   ]
  },
  "offsetY": 0,
  "class": "HotspotMapOverlayMap",
  "y": 1378.25
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 31)",
   "mapColor": "#FF0000",
   "class": "HotspotMapOverlayArea",
   "toolTip": "32"
  }
 ],
 "image": {
  "x": 3654.76,
  "height": 451.58,
  "y": 1378.25,
  "class": "HotspotMapOverlayImage",
  "width": 444.55,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_8.png",
     "width": 142,
     "class": "ImageResourceLevel",
     "height": 144
    }
   ]
  }
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_40D79AFE_556E_4918_41C2_77FAF2F7F3CF",
 "class": "AreaHotspotMapOverlay"
},
{
 "map": {
  "width": 444.55,
  "x": 3626.5,
  "height": 451.58,
  "offsetX": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_9_map.gif",
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16
    }
   ]
  },
  "offsetY": 0,
  "class": "HotspotMapOverlayMap",
  "y": 607.89
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 32)",
   "mapColor": "#FF0000",
   "class": "HotspotMapOverlayArea",
   "toolTip": "34"
  }
 ],
 "image": {
  "x": 3626.5,
  "height": 451.58,
  "y": 607.89,
  "class": "HotspotMapOverlayImage",
  "width": 444.55,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_9.png",
     "width": 142,
     "class": "ImageResourceLevel",
     "height": 144
    }
   ]
  }
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_40D177BD_556E_C718_41CC_D2E7942DD602",
 "class": "AreaHotspotMapOverlay"
},
{
 "map": {
  "width": 444.55,
  "x": 6002.12,
  "height": 451.58,
  "offsetX": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_10_map.gif",
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16
    }
   ]
  },
  "offsetY": 0,
  "class": "HotspotMapOverlayMap",
  "y": 1604.66
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 15)",
   "mapColor": "#FF0000",
   "class": "HotspotMapOverlayArea",
   "toolTip": "16"
  }
 ],
 "image": {
  "x": 6002.12,
  "height": 451.58,
  "y": 1604.66,
  "class": "HotspotMapOverlayImage",
  "width": 444.55,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_10.png",
     "width": 142,
     "class": "ImageResourceLevel",
     "height": 144
    }
   ]
  }
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_40D62E02_556D_C8EB_41D0_305763C4A030",
 "class": "AreaHotspotMapOverlay"
},
{
 "map": {
  "width": 444.55,
  "x": 6970.75,
  "height": 451.58,
  "offsetX": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_11_map.gif",
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16
    }
   ]
  },
  "offsetY": 0,
  "class": "HotspotMapOverlayMap",
  "y": 1901.36
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000",
   "class": "HotspotMapOverlayArea",
   "toolTip": "13"
  }
 ],
 "image": {
  "x": 6970.75,
  "height": 451.58,
  "y": 1901.36,
  "class": "HotspotMapOverlayImage",
  "width": 444.55,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_11.png",
     "width": 142,
     "class": "ImageResourceLevel",
     "height": 144
    }
   ]
  }
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_40D703CA_556D_DF78_41B1_C53A59145EB6",
 "class": "AreaHotspotMapOverlay"
},
{
 "map": {
  "width": 444.55,
  "x": 8066.54,
  "height": 451.58,
  "offsetX": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_12_map.gif",
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16
    }
   ]
  },
  "offsetY": 0,
  "class": "HotspotMapOverlayMap",
  "y": 1837.78
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 24)",
   "mapColor": "#FF0000",
   "class": "HotspotMapOverlayArea",
   "toolTip": "25"
  }
 ],
 "image": {
  "x": 8066.54,
  "height": 451.58,
  "y": 1837.78,
  "class": "HotspotMapOverlayImage",
  "width": 444.55,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_12.png",
     "width": 142,
     "class": "ImageResourceLevel",
     "height": 144
    }
   ]
  }
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_40D53EFE_5562_491B_41AD_AA37ABAFE316",
 "class": "AreaHotspotMapOverlay"
},
{
 "map": {
  "width": 444.55,
  "x": 6383.99,
  "height": 451.58,
  "offsetX": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_13_map.gif",
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16
    }
   ]
  },
  "offsetY": 0,
  "class": "HotspotMapOverlayMap",
  "y": 2523.73
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 16)",
   "mapColor": "#FF0000",
   "class": "HotspotMapOverlayArea",
   "toolTip": "17"
  }
 ],
 "image": {
  "x": 6383.99,
  "height": 451.58,
  "y": 2523.73,
  "class": "HotspotMapOverlayImage",
  "width": 444.55,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_13.png",
     "width": 142,
     "class": "ImageResourceLevel",
     "height": 144
    }
   ]
  }
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_40D452D2_5562_D96A_41AC_262E35771E4B",
 "class": "AreaHotspotMapOverlay"
},
{
 "map": {
  "width": 444.55,
  "x": 8123.06,
  "height": 451.58,
  "offsetX": 0,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_14_map.gif",
     "width": 16,
     "class": "ImageResourceLevel",
     "height": 16
    }
   ]
  },
  "offsetY": 0,
  "class": "HotspotMapOverlayMap",
  "y": 2714.47
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 20)",
   "mapColor": "#FF0000",
   "class": "HotspotMapOverlayArea",
   "toolTip": "21"
  }
 ],
 "image": {
  "x": 8123.06,
  "height": 451.58,
  "y": 2714.47,
  "class": "HotspotMapOverlayImage",
  "width": 444.55,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "url": "media/map_4327C897_5565_C913_41CF_A8B4976D294B_HS_14.png",
     "width": 142,
     "class": "ImageResourceLevel",
     "height": 144
    }
   ]
  }
 },
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_40D4C742_5562_476A_41D2_7748963935A3",
 "class": "AreaHotspotMapOverlay"
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA, this.camera_483EE231_5527_D8CB_41D3_FFB615D72BB8); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A647F1_4D73_8A25_41C8_924C6F725DB0",
   "yaw": -0.26,
   "hfov": 24.21,
   "pitch": -25.69,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5A02543E_4D50_8853_41CE_86405BFA6B10",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -0.26,
   "hfov": 24.21,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -25.69
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A667F1_4D73_8A25_41D2_A50B13A5C3FE",
   "yaw": -36.06,
   "hfov": 13.8,
   "pitch": -10.99,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_5AD5A30D_4D50_8831_41A0_4B3DB8E36E2B",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -36.06,
   "hfov": 13.8,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10.99
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B, this.camera_4F461269_5527_D95B_41A0_C2C33DB2C8CE); this.mainPlayList.set('selectedIndex', 26)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": " Click Here for\u000dGarden Access"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_0_HS_2_0.png",
      "width": 339,
      "class": "ImageResourceLevel",
      "height": 343
     }
    ]
   },
   "pitch": -13.63,
   "hfov": 28.97,
   "yaw": 86.87,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_66E98CA8_4CD7_7818_41C8_6178A706F60F",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_0_HS_2_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 86.87,
   "hfov": 28.97,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13.63
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468E3752_4DD0_88F9_41D2_1251D4678612, this.camera_498D8207_5527_D8D7_4192_51C27766454E); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A177F1_4D73_8A25_41D1_D16CCF68EECA",
   "yaw": -55.53,
   "hfov": 18.39,
   "pitch": -22.04,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_55875FF2_4D51_97EC_41CD_6DB1CB4EAA13",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -55.53,
   "hfov": 18.39,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -22.04
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_46886090_4DD0_8879_41C9_0592816F1BE4, this.camera_49BF21FC_5527_DB39_41BD_D7F1A1DE890F); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A127F2_4D73_8A27_41D0_BAF270D10998",
   "yaw": 55.26,
   "hfov": 20.49,
   "pitch": -23.55,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_55A65342_4D50_882C_41C9_D77EACF62878",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 55.26,
   "hfov": 20.49,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -23.55
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492, this.camera_4992320F_5527_D8D7_41D1_42B1975D60BB); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A0C7F2_4D73_8A27_41C2_337D5F97279F",
   "yaw": 98.35,
   "hfov": 19.51,
   "pitch": -13.74,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_5525256B_4D50_88FD_41D0_D843F84BDC39",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_0_HS_2_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 98.35,
   "hfov": 19.51,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13.74
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7, this.camera_4EF63316_5527_D8C9_41C3_7CFC1F29DB38); this.mainPlayList.set('selectedIndex', 14)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A037F2_4D73_8A24_41CF_79E080E7549D",
   "yaw": -2.02,
   "hfov": 24.17,
   "pitch": -23.55,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_6D2A1E7A_4D57_F8EA_41C0_46DD371B51BB",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -2.02,
   "hfov": 24.17,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -23.55
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70, this.camera_4EC4A31B_5527_D8FF_41D3_6659AE841D84); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A3D7F3_4D73_8A24_41D3_BE4CDF176738",
   "yaw": -54.77,
   "hfov": 24.08,
   "pitch": -24.05,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_6CB24A6E_4D50_98ED_41C0_A3D31CBDC3F2",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -54.77,
   "hfov": 24.08,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -24.05
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333, this.camera_4978C17C_5527_DB39_41B8_FCD135135BCA); this.mainPlayList.set('selectedIndex', 34)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AE37F8_4D73_8A24_4181_6B70384E52AB",
   "yaw": -8.8,
   "hfov": 24.71,
   "pitch": -13,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_730AAB8D_4FB1_994E_41C2_4DBD6A917C2C",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_1_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -8.8,
   "hfov": 24.71,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 37)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A9E7F8_4D73_8A24_41B0_3E959353BFF2",
   "yaw": -179.75,
   "hfov": 23.85,
   "pitch": -14.25,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_716B128C_4FB3_8B33_41A1_541916320113",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_1_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -179.75,
   "hfov": 23.85,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -14.25
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_27427C79_4D51_9E34_41D0_492C61EC91A6",
   "yaw": -132.65,
   "hfov": 17,
   "pitch": -21.92,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_0E76BC6A_4FB0_9FF3_41CA_7101BE07CEDF",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_0_HS_2_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -132.65,
   "hfov": 17,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -21.92
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A9A7F9_4D73_8A24_41CB_A211F241EFCF",
   "yaw": -87.3,
   "hfov": 15.13,
   "pitch": -19.66,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_71E10728_4FB0_8979_4160_9114C44B0382",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_1_HS_3_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -87.3,
   "hfov": 15.13,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -19.66
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B, this.camera_49496186_5527_DBC9_41C4_8C8AACFCCA8D); this.mainPlayList.set('selectedIndex', 26)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A957F9_4D73_8A24_41A8_FEF9C3958656",
   "yaw": -38.19,
   "hfov": 14.06,
   "pitch": -10.74,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_0E7CD015_4FB1_872C_41B7_20DEA976C3ED",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_1_HS_4_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -38.19,
   "hfov": 14.06,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10.74
  }
 ]
},
{
 "bleachingDistance": 0.5,
 "yaw": 1.88,
 "bleaching": 0.3,
 "pitch": 22.42,
 "id": "overlay_0EF05ADA_4F5F_9B8D_41CE_B9761B18F303",
 "class": "LensFlarePanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C, this.camera_4F11029F_5527_D9F7_41C4_303CFB49F8A6); this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_6FA41D3B_559E_BE52_41D2_9A352785CAC2",
   "yaw": -88.69,
   "hfov": 30.05,
   "pitch": -30.58,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_690A51F7_4CB1_8BFE_41D1_8FCEA96E108F",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -88.69,
   "hfov": 30.05,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -30.58
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468F9180_4DD3_8859_4145_D36188AFA280, this.camera_4F1B52A4_5527_D9C9_41D1_208A0B664B64); this.mainPlayList.set('selectedIndex', 20)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A297F3_4D73_8A24_41D0_B3ACCDCFA174",
   "yaw": 6.78,
   "hfov": 24.08,
   "pitch": -24.05,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_68F34B13_4CB0_B837_41C0_0D99EE38C233",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 6.78,
   "hfov": 24.08,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -24.05
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B, this.camera_493D81A5_5527_DBCB_41D5_3FD995140C97); this.mainPlayList.set('selectedIndex', 21)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AD87F4_4D73_8A2C_41C4_9CB60E9EC851",
   "yaw": -4.03,
   "hfov": 23.41,
   "pitch": -19.66,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6A0495DF_4CB0_8831_4195_336C1D0593BE",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -4.03,
   "hfov": 23.41,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -19.66
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 19)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05ADA7F4_4D73_8A2C_41C4_812E997B7E52",
   "yaw": 28.97,
   "hfov": 14.78,
   "pitch": -11.02,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_65F34CDA_4CB0_9833_41D0_C4AED5C282BF",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 28.97,
   "hfov": 14.78,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -11.02
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160, this.camera_4F4A2092_5527_D9CE_41C0_2DCFA1654FEB); this.mainPlayList.set('selectedIndex', 16)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A327F3_4D73_8A24_41C6_3C7BE1A4A009",
   "yaw": -17.84,
   "hfov": 24.75,
   "pitch": -20.16,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6EAB17A3_4CB0_8815_41B3_016C2141E292",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46883404_4DD3_8859_41CB_7620618CF902_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -17.84,
   "hfov": 24.75,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -20.16
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_46889D1B_4DD3_986F_418C_C91A8229DC90, this.camera_4F51E097_5527_D9F6_41D5_0EA4D887AFD0); this.mainPlayList.set('selectedIndex', 17)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A2C7F3_4D73_8A24_41C0_AAAD7774373B",
   "yaw": 54.01,
   "hfov": 24.08,
   "pitch": -24.05,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_6E6E6085_4CB3_881D_41BD_B4A88FBC8B47",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46883404_4DD3_8859_41CB_7620618CF902_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 54.01,
   "hfov": 24.08,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -24.05
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD, this.camera_4E535103_5527_D8CE_41BF_6DF51A082A06); this.mainPlayList.set('selectedIndex', 19)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_620BF7C0_56BB_AA01_41D4_5EDFFF6B73BA",
   "yaw": 90.18,
   "hfov": 23.98,
   "pitch": -24.56,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_692D5902_4CB0_9811_417F_C3535C7C751A",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 90.18,
   "hfov": 23.98,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -24.56
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B, this.camera_4E21C108_5527_D8D9_41C7_F05F2FC3C3B8); this.mainPlayList.set('selectedIndex', 21)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A267F4_4D73_8A2C_4186_07234DF75178",
   "yaw": -2.02,
   "hfov": 23.93,
   "pitch": -24.81,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_694E4DC7_4CB1_B81F_41B7_F7DD2C5EDA13",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -2.02,
   "hfov": 23.93,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -24.81
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 22)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A217F4_4D73_8A2C_41B7_F9980E181772",
   "yaw": -51.13,
   "hfov": 20.29,
   "pitch": -15.89,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_688B5C0B_4CB0_9817_41C7_9ED1E7CAF0B4",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_0_HS_2_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -51.13,
   "hfov": 20.29,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -15.89
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160, this.camera_49E191C3_5527_DB4F_418F_13E4FB55ACD2); this.mainPlayList.set('selectedIndex', 16)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_622E65DD_55FA_69CB_41D1_957FCE941ABD",
   "yaw": 0.25,
   "hfov": 30.13,
   "pitch": -25.56,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_53D00AF1_4D50_B9FD_41D2_F4DF94D08BFE",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 0.25,
   "hfov": 30.13,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -25.56
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C, this.camera_49F471CF_5527_DB57_41D1_078FB80E05FA); this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A357F2_4D73_8A24_41B7_BB81F09C1590",
   "yaw": -91.95,
   "hfov": 24.59,
   "pitch": -21.16,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5362A748_4D51_882A_41BA_933DF09A8D1D",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -91.95,
   "hfov": 24.59,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -21.16
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7, this.camera_490221AF_5527_DBD7_41D0_C1B5E2C006C8); this.mainPlayList.set('selectedIndex', 14)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A0F7F2_4D73_8A24_4197_179371A4E88A",
   "yaw": 77.12,
   "hfov": 23.71,
   "pitch": -25.94,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_52F9F48A_4D50_8829_41CB_656AD390E1C4",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0_HS_2_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 77.12,
   "hfov": 23.71,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -25.94
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB, this.camera_4910C1BA_5527_DB39_41C3_A3A66572DB2F); this.mainPlayList.set('selectedIndex', 15)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A097F2_4D73_8A24_41C8_D7302ED9B6AD",
   "yaw": 135.53,
   "hfov": 18.34,
   "pitch": -24.05,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5228AAE0_4D50_9818_41AB_1C09BFD2A6B0",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0_HS_3_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 135.53,
   "hfov": 18.34,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -24.05
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA, this.camera_4EDE513B_5527_DB3F_41D0_CC880DBD8F7B); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A677F0_4D73_8A23_41B1_520288C8B725",
   "yaw": -1.89,
   "hfov": 23.4,
   "pitch": -18.02,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5834A0CE_4DBF_89CB_41CB_96B7C0686050",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -1.89,
   "hfov": 23.4,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -18.02
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468CDF09_4DD0_986B_41BE_3A494626C999, this.camera_4EAC1145_5527_DB4B_4199_D4CFCBC684F1); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A787F0_4D73_8A23_41C2_5CF9D246031C",
   "yaw": 91.69,
   "hfov": 17.39,
   "pitch": -18.4,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_59B35AC0_4DB1_9836_41C4_EA4495BD9CA4",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 91.69,
   "hfov": 17.39,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -18.4
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492, this.camera_4EB0614F_5527_DB57_41D3_BF4C0A70286C); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A7A7F0_4D73_8A23_41D0_46A5C82B8CA6",
   "yaw": 50.24,
   "hfov": 17.63,
   "pitch": -15.89,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_598F4FCE_4DB3_97CA_41CB_9CD7E3ACAC2B",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_0_HS_2_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 50.24,
   "hfov": 17.63,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -15.89
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE, this.camera_4828522C_5527_D8D9_41BF_D4D637AC0E27); this.mainPlayList.set('selectedIndex', 24)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05ACD7F4_4D73_8A2C_41AE_0CFFDBA82EA6",
   "yaw": -33.42,
   "hfov": 24.69,
   "pitch": -25.56,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6633C14D_4CB3_8815_41D1_DAD0A43D73AA",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -33.42,
   "hfov": 24.69,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -25.56
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.setCameraSameSpotAsMedia(this.camera_485B6227_5527_D8D7_41BC_6D1C463277B6, this.panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB); this.startPanoramaWithCamera(this.panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B, this.camera_485B6227_5527_D8D7_41BC_6D1C463277B6); this.mainPlayList.set('selectedIndex', 23)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_76FCD6B2_4CF1_881B_41C6_9E5BCC67B6AF",
   "yaw": 43.58,
   "hfov": 15.15,
   "pitch": -19.4,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_6638D4DA_4CB0_883F_41BA_240A6873C92B",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_1_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 43.58,
   "hfov": 15.15,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -19.4
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0, this.camera_4E071112_5527_D8C9_41C2_3A05DC4F4621); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A507EF_4D73_8A3D_41CF_693B561A404F",
   "yaw": 89.55,
   "hfov": 20.75,
   "pitch": -30.58,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_422CFE49_4DD0_98C2_41BE_6C0C642C73FF",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 89.55,
   "hfov": 20.75,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -30.58
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468CDF09_4DD0_986B_41BE_3A494626C999, this.camera_4E1A111C_5527_D8FA_41D4_16F595362DCB); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A527EF_4D73_8A3D_41A3_7F8072AD3152",
   "yaw": -88.54,
   "hfov": 14.67,
   "pitch": -21.9,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_42AE3C93_4DD0_B846_41C6_4C25F462CE81",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -88.54,
   "hfov": 14.67,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -21.9
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492, this.camera_4E36810D_5527_D8DB_41D1_61EE6EF01A0B); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A4C7EF_4D73_8A3D_41C4_E07A04522F50",
   "yaw": -25.25,
   "hfov": 17.2,
   "pitch": -33.35,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_429BFC64_4DD0_98C2_4199_14701B840675",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0_HS_2_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -25.25,
   "hfov": 17.2,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -33.35
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA, this.camera_4E156117_5527_D8F6_41AD_A66AA68B8650); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A4F7EF_4D73_8A3D_419B_C55D720DD6D3",
   "yaw": 5.87,
   "hfov": 15.96,
   "pitch": -16.07,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5DCDABE0_4DD1_9FC1_41BE_FC9C266D1916",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0_HS_3_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 5.87,
   "hfov": 15.96,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -16.07
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C, this.camera_4EE86121_5527_D8CB_41C0_9223E400BAC3); this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A497EF_4D73_8A3D_41D1_F4CE102BE422",
   "yaw": -179.12,
   "hfov": 17.49,
   "pitch": -44.15,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_51373F52_4D70_982B_41C6_457EB1EA99CF",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0_HS_4_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -179.12,
   "hfov": 17.49,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -44.15
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Arrow 01"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A4B7EF_4D73_8A3D_41C1_76E6BB8CAC8F",
   "yaw": -129.35,
   "hfov": 6.98,
   "pitch": -5.54,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_56CB4BDC_4D70_F823_41D0_C140A4CE712F",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0_HS_5_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -129.35,
   "hfov": 6.98,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -5.54
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A457EF_4D73_8A3D_41CC_7DF587EDFA6B",
   "yaw": -61.42,
   "hfov": 10.05,
   "pitch": -11.4,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_51CC2E9A_4D70_B826_4152_14C85AA81C55",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0_HS_6_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -61.42,
   "hfov": 10.05,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -11.4
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A407EF_4D73_8A3D_418C_4A8E5F52DCE7",
   "yaw": -37.9,
   "hfov": 10.11,
   "pitch": -13.23,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_51DAB3F1_4D70_8FE3_41CC_751AAF311EEE",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0_HS_7_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -37.9,
   "hfov": 10.11,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13.23
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C, this.camera_4EFEF126_5527_D8C9_41BB_23FC2E30A25D); this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "To 1st Floor"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0_HS_8_0.png",
      "width": 197,
      "class": "ImageResourceLevel",
      "height": 360
     }
    ]
   },
   "pitch": -17.78,
   "hfov": 16.52,
   "yaw": -176.59,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_7EB6A205_4CB1_8BEB_41C0_D1E77944C431",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0_HS_8_0_map.gif",
      "width": 15,
      "class": "ImageResourceLevel",
      "height": 29
     }
    ]
   },
   "yaw": -176.59,
   "hfov": 16.52,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -17.78
  }
 ]
},
{
 "bleachingDistance": 0.5,
 "yaw": 1.38,
 "bleaching": 0.4,
 "pitch": 22.67,
 "id": "overlay_71CA5A52_4FD0_9BC1_4181_A74D92871882",
 "class": "LensFlarePanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333, this.camera_4ECF812B_5527_D8DE_41A0_CEA0102FC864); this.mainPlayList.set('selectedIndex', 34)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AE17F8_4D73_8A24_41BA_9095C3DA57B5",
   "yaw": 179.99,
   "hfov": 23.9,
   "pitch": -7.47,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_7360A2AD_4FD1_8B41_4198_1740F5160659",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_717A0897_4FD0_877B_41BB_C1BF96F36747_1_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 179.99,
   "hfov": 23.9,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.47
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468A0506_4DD0_8859_41C9_249E6530A13B, this.camera_4E29E2FE_5527_D939_41B3_076E6B2CCD07); this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A1A7F1_4D73_8A25_41C4_3E39B6A613BB",
   "yaw": -34.55,
   "hfov": 18.05,
   "pitch": -22.8,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5506B8B3_4D50_B853_41D1_F7547F3A3996",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -34.55,
   "hfov": 18.05,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -22.8
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46, this.camera_4E5AE2FA_5527_D939_41C5_BA4DE720B220); this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A147F1_4D73_8A25_41B7_416C5CE30C3D",
   "yaw": 35.67,
   "hfov": 17.89,
   "pitch": -22.29,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_55BF6709_4D5F_883F_41A4_51A8EB940E6B",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 35.67,
   "hfov": 17.89,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -22.29
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 27)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": " Click Here for\u000dGarden Access"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_0_HS_2_0.png",
      "width": 227,
      "class": "ImageResourceLevel",
      "height": 298
     }
    ]
   },
   "pitch": -11.4,
   "hfov": 19.58,
   "yaw": -59.41,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_619940FE_4CF3_8803_41B9_3731699D4341",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_0_HS_2_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 21
     }
    ]
   },
   "yaw": -59.41,
   "hfov": 19.58,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -11.4
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2, this.camera_49CB91DE_5527_DB79_41CA_8A02FC34213B); this.mainPlayList.set('selectedIndex', 27)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AFC7F6_4D73_8A2C_41D2_BF9EBC14E462",
   "yaw": 97.25,
   "hfov": 19.51,
   "pitch": -10.98,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_7AD5BC3B_4F50_9821_41C5_CEC72244E672",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_1_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 97.25,
   "hfov": 19.51,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10.98
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_46915890_4DD3_B878_419E_FA9CF156F3F2, this.camera_49D821E7_5527_DB57_41C9_412DABB0ADF0); this.mainPlayList.set('selectedIndex', 28)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AFE7F6_4D73_8A2C_41CE_EBCD9FEFBB94",
   "yaw": 56.66,
   "hfov": 17.36,
   "pitch": -16.13,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_7B25405F_4F50_8863_41C6_478FC51F64F0",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_1_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 56.66,
   "hfov": 17.36,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -16.13
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AF97F6_4D73_8A2C_41D1_DB66604456F6",
   "yaw": 121.75,
   "hfov": 16.65,
   "pitch": -13.24,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_794A0D68_4F51_782D_41BE_22578F5B1C57",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_1_HS_2_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 121.75,
   "hfov": 16.65,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13.24
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 30)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AF47F6_4D73_8A2C_41AA_D765065C66D3",
   "yaw": -84.47,
   "hfov": 18.99,
   "pitch": -15.93,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_7A752D45_4F53_9867_41C3_377D795F4945",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_1_HS_3_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -84.47,
   "hfov": 18.99,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -15.93
  }
 ]
},
{
 "bleachingDistance": 0.5,
 "yaw": 2.14,
 "bleaching": 0.3,
 "pitch": 23.43,
 "id": "overlay_7836E559_4F71_8875_41C7_CE4F9947025E",
 "class": "LensFlarePanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB, this.camera_49FAC1D9_5527_DB7B_41BB_4D15BD43CD25); this.mainPlayList.set('selectedIndex', 31)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AF77F6_4D73_8A2C_41A5_390D9DCC23DA",
   "yaw": -158.02,
   "hfov": 26.22,
   "pitch": -12.62,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_09132938_4CBF_8604_41B0_119A9CA8D952",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_1_HS_4_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -158.02,
   "hfov": 26.22,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -12.62
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70, this.camera_48717219_5527_D8FB_41D3_57814C937827); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A0B7F2_4D73_8A24_41D0_24A2D7AF5D71",
   "yaw": -1.01,
   "hfov": 28.05,
   "pitch": -26.69,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_5268F1C1_4D53_8818_41CC_A11C0F471DD7",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -1.01,
   "hfov": 28.05,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -26.69
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB, this.camera_4860B214_5527_D8C9_4194_936F14F5A5A5); this.mainPlayList.set('selectedIndex', 15)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A057F2_4D73_8A24_41CA_2E4740B495EC",
   "yaw": -85.42,
   "hfov": 22.58,
   "pitch": -31.09,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6DC90499_4D50_8829_41CC_74E88A7F9BDA",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -85.42,
   "hfov": 22.58,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -31.09
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A017F2_4D73_8A24_41C2_94D74E5C4734",
   "yaw": -1.01,
   "hfov": 14.67,
   "pitch": -7.97,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_6D31E3EA_4D51_8FEB_41A6_1DB24CBB64CE",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_0_HS_2_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -1.01,
   "hfov": 14.67,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.97
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8, this.camera_484AD223_5527_D8CF_41CF_E0B5360BD4BF); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_621FD5D4_55FA_69DA_41CB_31244E9938F8",
   "yaw": 2.13,
   "hfov": 21.39,
   "pitch": -27.44,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_43DE14B6_4DD1_884C_41D0_5A2AAF645EA0",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 2.13,
   "hfov": 21.39,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -27.44
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED, this.camera_4847B21E_5527_D8F9_41C7_CD69B6018816); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A5B7EE_4D73_8A3F_41A7_1AD9F9CF4E00",
   "yaw": 179.74,
   "hfov": 21.43,
   "pitch": -33.22,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_421C4A7E_4DD0_F8BC_41CD_720ED7B7B419",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 179.74,
   "hfov": 21.43,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -33.22
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A557EF_4D73_8A3D_41D1_5EFA9DB03DC1",
   "yaw": -30.78,
   "hfov": 15.39,
   "pitch": -25.69,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_57062C40_4D70_9827_41BC_36F6D075AF6D",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0_HS_2_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -30.78,
   "hfov": 15.39,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -25.69
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_6D2DD912_55AB_A629_41B7_3D2DDC945218",
   "yaw": 38.57,
   "hfov": 9.28,
   "pitch": -10.89,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_662AD4CA_559E_EE32_41CD_6B10CFB36794",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0_HS_3_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 38.57,
   "hfov": 9.28,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10.89
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_6D2DA913_55AB_A62F_41A9_472ED18B217A",
   "yaw": 0.8,
   "hfov": 10.81,
   "pitch": -13.07,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_61871366_55AD_EAF7_4197_207F275BD0A9",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0_HS_4_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 0.8,
   "hfov": 10.81,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13.07
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70, this.camera_4F261282_5527_D9C9_41D4_A87D5293BFFC); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_622CF5DE_55FA_69C9_41D3_98D3297D1013",
   "yaw": 179.24,
   "hfov": 27.21,
   "pitch": -25.43,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6F83C2B5_4D50_887E_41B6_B611CB28B370",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 179.24,
   "hfov": 27.21,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -25.43
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_46889D1B_4DD3_986F_418C_C91A8229DC90, this.camera_4F2CD287_5527_D9D7_41A3_72C3FB0A672B); this.mainPlayList.set('selectedIndex', 17)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A397F3_4D73_8A24_41B9_C6082F17BABE",
   "yaw": 20.22,
   "hfov": 21.72,
   "pitch": -23.05,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6F13BB8E_4D51_782D_41C2_BA819806E504",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 20.22,
   "hfov": 21.72,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -23.05
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_46883404_4DD3_8859_41CB_7620618CF902, this.camera_4F59227D_5527_D93B_419E_5FDB9B091C1A); this.mainPlayList.set('selectedIndex', 18)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A3B7F3_4D73_8A24_41C9_21024B138FBF",
   "yaw": 71.22,
   "hfov": 19.75,
   "pitch": -20.54,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6EAB8B79_4D50_98F4_41CD_825AC1104DD5",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_0_HS_2_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 71.22,
   "hfov": 19.75,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -20.54
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B, this.camera_4F4D826E_5527_D959_41CF_9B72B034D3EB); this.mainPlayList.set('selectedIndex', 26)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AE87F8_4D73_8A24_41C8_60D58546B90C",
   "yaw": -102.88,
   "hfov": 21.32,
   "pitch": -15.26,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_72464A65_4FD0_9BA3_41CF_9FFB65367B83",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_1_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -102.88,
   "hfov": 21.32,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -15.26
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_717A0897_4FD0_877B_41BB_C1BF96F36747, this.camera_4F4BE273_5527_D94F_41D4_DDF13CF8D578); this.mainPlayList.set('selectedIndex', 35)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AEA7F8_4D73_8A24_41BC_B52AF25906D5",
   "yaw": -0.26,
   "hfov": 19.27,
   "pitch": -4.46,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_734E2FB6_4FD3_B8A5_4171_92473A3BCBA9",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_1_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -0.26,
   "hfov": 19.27,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -4.46
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D, this.camera_4F508279_5527_D93B_41B0_7977788CE112); this.mainPlayList.set('selectedIndex', 36)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AE47F8_4D73_8A24_4199_C6B62EEC6AB4",
   "yaw": -179.88,
   "hfov": 25.14,
   "pitch": -17.52,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_73503797_4FAF_8946_41C0_6685C6E3D8B6",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_1_HS_2_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -179.88,
   "hfov": 25.14,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -17.52
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2, this.camera_4F2F70A6_5527_D9D6_41D0_B3A18E9EBB94); this.mainPlayList.set('selectedIndex', 27)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AC97F5_4D73_8A2C_41CE_8A9059C187B3",
   "yaw": 124.05,
   "hfov": 24.77,
   "pitch": -20.03,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_62AA8B37_4CF0_9807_41C4_F7F87AF02424",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 124.05,
   "hfov": 24.77,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -20.03
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384, this.camera_4F34A0AB_5527_D9DE_41B9_8CC4FCF2F91B); this.mainPlayList.set('selectedIndex', 29)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AC47F6_4D73_8A2C_41D0_E2E1DC6C5E13",
   "yaw": -87.93,
   "hfov": 25.09,
   "pitch": -17.9,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_7E7E82B5_4CB0_882D_41BD_3B0DF38453EC",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -87.93,
   "hfov": 25.09,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -17.9
  }
 ]
},
{
 "bleachingDistance": 0.5,
 "yaw": 1.38,
 "bleaching": 0.3,
 "pitch": 25.18,
 "id": "overlay_7845D6E4_4F71_8853_41AC_5DFC94436964",
 "class": "LensFlarePanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB, this.camera_4F2630A1_5527_D9CA_41D0_C40655F31FCF); this.mainPlayList.set('selectedIndex', 31)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AC77F6_4D73_8A2C_41D1_219442CBF36C",
   "yaw": -135.92,
   "hfov": 13.69,
   "pitch": -7.35,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_09F08447_4CB3_8E0F_41D3_9E88130BFDE6",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0_HS_2_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -135.92,
   "hfov": 13.69,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.35
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7AB736C5_4F50_8864_419C_98699023C783, this.camera_4F5EE09C_5527_D9FA_41BA_3243E15A4ACF); this.mainPlayList.set('selectedIndex', 30)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AC27F6_4D73_8A2C_41D2_A18BF9A7500C",
   "yaw": -100.12,
   "hfov": 20.04,
   "pitch": -4.08,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_055B53B6_4CB3_8A05_41C6_1E22E9301232",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0_HS_3_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -100.12,
   "hfov": 20.04,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -4.08
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_620217C3_56BB_AA07_41A1_26A0AA2D1F76",
   "yaw": 175.98,
   "hfov": 20.85,
   "pitch": -15.22,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_631276A3_556A_6A11_41B2_AC709B67DA9B",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0_HS_4_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 175.98,
   "hfov": 20.85,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -15.22
  }
 ]
},
{
 "transitionDuration": 500,
 "toolTipPaddingRight": 6,
 "toolTipBorderSize": 1,
 "id": "MapViewer",
 "left": "0%",
 "toolTipPaddingTop": 4,
 "paddingLeft": 0,
 "progressBorderRadius": 4,
 "right": "0%",
 "playbackBarProgressBackgroundColorRatios": [
  0,
  1
 ],
 "borderRadius": 0,
 "toolTipDisplayTime": 600,
 "toolTipPaddingLeft": 6,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarLeft": 0,
 "progressBackgroundColorRatios": [
  0,
  1
 ],
 "minHeight": 1,
 "toolTipBorderRadius": 3,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarHeadHeight": 30,
 "progressBackgroundColorDirection": "vertical",
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressBarBorderColor": "#000000",
 "progressBorderColor": "#AAAAAA",
 "progressBarBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarBottom": 0,
 "minWidth": 1,
 "playbackBarHeadOpacity": 1,
 "toolTipBorderColor": "#767676",
 "toolTipShadowSpread": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarBackgroundColor": [
  "#222222",
  "#444444"
 ],
 "class": "ViewerArea",
 "playbackBarBackgroundColor": [
  "#EEEEEE",
  "#CCCCCC"
 ],
 "progressBackgroundColor": [
  "#EEEEEE",
  "#CCCCCC"
 ],
 "paddingBottom": 0,
 "toolTipOpacity": 1,
 "playbackBarHeadWidth": 6,
 "toolTipShadowBlurRadius": 3,
 "toolTipFontSize": "12px",
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowColor": "#000000",
 "shadow": false,
 "playbackBarHeight": 20,
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 4,
 "playbackBarRight": 0,
 "toolTipFontWeight": "normal",
 "playbackBarProgressBorderSize": 0,
 "transitionMode": "blending",
 "toolTipShadowHorizontalLength": 0,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 4,
 "progressBarBorderSize": 0,
 "toolTipShadowVerticalLength": 0,
 "playbackBarHeadShadowVerticalLength": 0,
 "show": "this.setComponentVisibility(this.IconButton_18EE8675_09E2_5FBD_4155_1A9040D06494, true, 0, null, null, false)",
 "toolTipShadowColor": "#333333",
 "playbackBarBorderRadius": 4,
 "playbackBarHeadBorderRadius": 0,
 "paddingRight": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipFontStyle": "normal",
 "progressLeft": 10,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipShadowOpacity": 1,
 "playbackBarBorderSize": 2,
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "toolTipFontFamily": "Arial",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "top": "0%",
 "borderSize": 0,
 "playbackBarHeadShadowColor": "#000000",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "vrPointerSelectionTime": 2000,
 "progressRight": 10,
 "bottom": "0%",
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "progressBarBackgroundColorDirection": "vertical",
 "displayTooltipInTouchScreens": true,
 "playbackBarHeadShadow": true,
 "progressBottom": 2,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "progressHeight": 20,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#222222",
  "#444444"
 ],
 "vrPointerColor": "#FFFFFF",
 "paddingTop": 0,
 "playbackBarHeadShadowOpacity": 0.7,
 "progressBarOpacity": 1,
 "playbackBarBorderColor": "#AAAAAA",
 "progressBorderSize": 2,
 "data": {
  "name": "Floor Plan"
 }
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8, this.camera_4F8A50EA_5527_D95E_41C6_457C18E3569D); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A437EF_4D73_8A3D_4195_5913B89343E9",
   "yaw": -0.01,
   "hfov": 18.18,
   "pitch": -19.91,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5DF8E6CB_4DD0_89C0_41C8_88DF7092D5A8",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -0.01,
   "hfov": 18.18,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -19.91
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2, this.camera_4E6930F5_5527_D94B_4198_D511C03C7550); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A7E7EF_4D73_8A3D_41C4_0C62F38532BE",
   "yaw": -87.05,
   "hfov": 18.31,
   "pitch": -16.39,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5C720472_4DD0_88C3_41CA_9B3B6DB99A39",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -87.05,
   "hfov": 18.31,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -16.39
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_46886090_4DD0_8879_41C9_0592816F1BE4, this.camera_4F85D0E6_5527_D949_41D0_CD9BAA79A6BD); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A787EF_4D73_8A3D_41CB_D7775F8D4029",
   "yaw": -111.94,
   "hfov": 14.62,
   "pitch": -13.88,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_5C59A282_4DD0_8842_41D1_E49CB4246953",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0_HS_2_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -111.94,
   "hfov": 14.62,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13.88
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492, this.camera_4F98D0EF_5527_D956_4170_BF7C53AB1ED9); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A7A7EF_4D73_8A3D_41CF_DE66A7AA5168",
   "yaw": -41.46,
   "hfov": 18.56,
   "pitch": -27.07,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5CD896BB_4DD1_884C_41CC_CA7AE6B0F5FA",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0_HS_3_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -41.46,
   "hfov": 18.56,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -27.07
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Arrow 01"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A747EF_4D73_8A3D_41CA_593437A21ADE",
   "yaw": 36.3,
   "hfov": 9.47,
   "pitch": -7.09,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_56EF595E_4D71_98DC_418D_376491BCF0A0",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0_HS_4_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 36.3,
   "hfov": 9.47,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.09
  }
 ]
},
{
 "bleachingDistance": 0.5,
 "yaw": -87.8,
 "bleaching": 0.3,
 "pitch": 19.91,
 "id": "overlay_7626C745_4FAF_884E_41D3_6F15B7CA5474",
 "class": "LensFlarePanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7AB736C5_4F50_8864_419C_98699023C783, this.camera_4E3F4303_5527_D8CF_41C1_2F824B826CC6); this.mainPlayList.set('selectedIndex', 30)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AEF7F7_4D73_8A2C_41C5_2BA5F0884E41",
   "yaw": -116.71,
   "hfov": 18.76,
   "pitch": -16.64,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_7961DF65_4FB0_984F_41D2_589B11AFC26D",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_1_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -116.71,
   "hfov": 18.76,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -16.64
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384, this.camera_4EE18312_5527_D8C9_419E_99EA5BB4760C); this.mainPlayList.set('selectedIndex', 29)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AEA7F7_4D73_8A2C_41B3_E5E7AB414D19",
   "yaw": -68.59,
   "hfov": 21.87,
   "pitch": -11.87,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_7982EE09_4FB0_9BC4_419C_0CD5E1D768DF",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_1_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -68.59,
   "hfov": 21.87,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -11.87
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_46915890_4DD3_B878_419E_FA9CF156F3F2, this.camera_4E10F30D_5527_D8DB_41C0_79633603A2B2); this.mainPlayList.set('selectedIndex', 28)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AE47F7_4D73_8A2C_41C5_84407B4551B2",
   "yaw": -42.46,
   "hfov": 14.13,
   "pitch": -9.1,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_76B0E37A_4FB1_8844_41D1_45ECAB5089F5",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_1_HS_2_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -42.46,
   "hfov": 14.13,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -9.1
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7, this.camera_4E0DC307_5527_D8D7_41D4_AEEC74D90C83); this.mainPlayList.set('selectedIndex', 32)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AE67F7_4D73_8A2C_41A8_EB2F735EE5AA",
   "yaw": 92.44,
   "hfov": 21.59,
   "pitch": -15.01,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_7739783F_4FB7_783C_41A0_FEE7CE39A691",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_1_HS_3_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 92.44,
   "hfov": 21.59,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -15.01
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB, this.camera_495E1191_5527_DBCB_41C9_902503ECCFEB); this.mainPlayList.set('selectedIndex', 31)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AE17F7_4D73_8A2C_41B3_271C7A503166",
   "yaw": -87.95,
   "hfov": 25.54,
   "pitch": -14.38,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_7712A97F_4FB1_9841_41C7_DB2C658EB461",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_1_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -87.95,
   "hfov": 25.54,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -14.38
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 33)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AFA7F7_4D73_8A2C_41BB_FBB7AFA444BF",
   "yaw": -169.96,
   "hfov": 21.19,
   "pitch": -11.11,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_77574D79_4FB7_784E_41CB_C74E51BFF090",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_1_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -169.96,
   "hfov": 21.19,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -11.11
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_0B6EC80E_4CD0_8613_41C6_227755166D76, this.camera_492CF19B_5527_DBFF_41D5_27F151FF1900); this.mainPlayList.set('selectedIndex', 38)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AF57F8_4D73_8A24_41B0_A520C9D26915",
   "yaw": 5.14,
   "hfov": 16.52,
   "pitch": -4.58,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_0C2CB5E6_4CF0_89F7_41C8_6A899FC3574F",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_1_HS_2_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 5.14,
   "hfov": 16.52,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -4.58
  }
 ]
},
{
 "bleachingDistance": 0.5,
 "yaw": -83.53,
 "bleaching": 0.1,
 "pitch": 8.1,
 "id": "overlay_7027FCDC_53FE_BF11_41C0_A6E2B8ADF623",
 "class": "LensFlarePanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8, this.camera_4E6762E2_5527_D949_4174_DD7F1D5FB053); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A757F0_4D73_8A23_41C2_A8F2F8F42DDF",
   "yaw": 1.63,
   "hfov": 18.24,
   "pitch": -17.13,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5885802C_4DB0_884D_41B5_27D142090498",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 1.63,
   "hfov": 18.24,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -17.13
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492, this.camera_4E6802E6_5527_D949_41B3_A33243520B5A); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A777F0_4D73_8A23_4193_1C6899CA204D",
   "yaw": 33.53,
   "hfov": 15.92,
   "pitch": -21.15,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_588BA7F0_4DB0_F7D5_41BB_34D7D09DA6F4",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 33.53,
   "hfov": 15.92,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -21.15
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A717F0_4D73_8A23_41B1_9BBCD2CAEB3E",
   "yaw": 107.19,
   "hfov": 15.47,
   "pitch": -10.04,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_58BE1ED7_4DB7_79DC_41B4_247ADB83EC84",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0_HS_2_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 107.19,
   "hfov": 15.47,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10.04
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712, this.camera_4F92E2DD_5527_D97B_41B4_71FAC6BEB753); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A737F0_4D73_8A23_41A3_F06857AD5422",
   "yaw": -92.96,
   "hfov": 21.33,
   "pitch": -21.04,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_58E6AD87_4DB1_983D_41B6_1222972BEF81",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0_HS_3_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -92.96,
   "hfov": 21.33,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -21.04
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_76CFB6A8_4CF1_8837_41D0_A188C7FA927D",
   "yaw": 76.24,
   "hfov": 11.38,
   "pitch": -9.73,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_5B975261_4D50_88F3_41B5_3DD38294381D",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_1_HS_4_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 76.24,
   "hfov": 11.38,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -9.73
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2, this.camera_4E7C92EB_5527_D95F_41B8_549993443EE9); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A687F1_4D73_8A25_41D1_A06129114615",
   "yaw": 89.93,
   "hfov": 24.71,
   "pitch": -20.41,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_513E680F_4D70_F820_41D0_08533C517882",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0_HS_5_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 89.93,
   "hfov": 24.71,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -20.41
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 26)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": " Click Here for\u000dGarden Access"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0_HS_6_0.png",
      "width": 370,
      "class": "ImageResourceLevel",
      "height": 268
     }
    ]
   },
   "pitch": -12.11,
   "hfov": 31.85,
   "yaw": -148.93,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_66319F74_4CF0_9805_41BE_1B6D208D6DEE",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0_HS_6_0_map.gif",
      "width": 22,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -148.93,
   "hfov": 31.85,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -12.11
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2, this.camera_4F88B2D8_5527_D979_41BF_E284A1FBF021); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A777F0_4D73_8A23_41C8_D35C20D0C278",
   "yaw": -35.05,
   "hfov": 18.73,
   "pitch": -21.16,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5F07278A_4DAF_884C_41C7_8B1D07474657",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -35.05,
   "hfov": 18.73,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -21.16
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA, this.camera_4FB572CA_5527_D959_41CE_DE7F31041A2F); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A717F0_4D73_8A23_41BB_92CA735495D6",
   "yaw": 27.5,
   "hfov": 19.05,
   "pitch": -22.29,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5F486C49_4DB1_B8CD_41D2_C4C967A11F27",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 27.5,
   "hfov": 19.05,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -22.29
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46, this.camera_4FBFC2CE_5527_D959_419C_59D2EBAFB794); this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_76D366A7_4CF1_8839_41D2_32A9E4F6A25F",
   "yaw": -78.26,
   "hfov": 13.74,
   "pitch": -12.12,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5FB8CEFF_4DB3_79C5_41D0_A936A7B55D3C",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_1_HS_2_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -78.26,
   "hfov": 13.74,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -12.12
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8, this.camera_4FA322C5_5527_D94B_41D3_FEA000B84CCE); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A6E7F0_4D73_8A23_41C7_097483DE0323",
   "yaw": 136.53,
   "hfov": 17.72,
   "pitch": -34.86,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5E1134A7_4DB7_8846_4198_0F994BDCDDD6",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0_HS_3_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 136.53,
   "hfov": 17.72,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -34.86
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A687F0_4D73_8A23_4195_0CB93E59143E",
   "yaw": 107.01,
   "hfov": 13.26,
   "pitch": -16.14,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_59E09148_4DB0_88C8_41A7_0FFD5535A1C7",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0_HS_4_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 107.01,
   "hfov": 13.26,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -16.14
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468CDF09_4DD0_986B_41BE_3A494626C999, this.camera_4F8672D3_5527_D94F_41CE_4AE92683C24A); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A6A7F0_4D73_8A23_41D2_D6BE0FEA9C05",
   "yaw": -117.34,
   "hfov": 16.34,
   "pitch": -26.94,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_599A974C_4DB0_88C8_41D1_C1216E41F849",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0_HS_5_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -117.34,
   "hfov": 16.34,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -26.94
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Arrow 01"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A647F0_4D73_8A23_41D1_679B2F8656B8",
   "yaw": -171.32,
   "hfov": 5.76,
   "pitch": -5.65,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_56982F9D_4D70_B85F_41A6_5ABB5CB86188",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0_HS_6_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -171.32,
   "hfov": 5.76,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -5.65
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 32)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AF27F8_4D73_8A24_41B1_FFFE2369C98E",
   "yaw": 4.27,
   "hfov": 22.06,
   "pitch": -9.23,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_7512882C_4FD0_87F3_4198_3C76F78842B4",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_1_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 4.27,
   "hfov": 22.06,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -9.23
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 30)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05AEC7F8_4D73_8A24_41CE_EB145BE95DCC",
   "yaw": -75.25,
   "hfov": 18,
   "pitch": -5.21,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_729FE739_4FD0_89D5_41C7_8B07813F844B",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_1_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -75.25,
   "hfov": 18,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -5.21
  }
 ]
},
{
 "bleachingDistance": 0.5,
 "yaw": -66.2,
 "bleaching": 0.2,
 "pitch": 24.43,
 "id": "overlay_0EC6A9EA_4F5F_998D_4198_15622C404DE3",
 "class": "LensFlarePanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0, this.camera_49AEF1F2_5527_DB49_41B7_7330DC67EEB4); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05BA57EE_4D73_8A3F_41A9_00D1BB48BBAC",
   "yaw": 1,
   "hfov": 24.29,
   "pitch": -22.92,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_43DC0404_4DF1_884F_41B3_1BFD0159B676",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 1,
   "hfov": 24.29,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -22.92
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468A0506_4DD0_8859_41C9_249E6530A13B, this.camera_4FD1E0D8_5527_D979_41C5_FED84292C5A9); this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A617F1_4D73_8A25_4197_0E81F333E937",
   "yaw": 41.45,
   "hfov": 18.46,
   "pitch": -24.79,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_559CA8E6_4D50_99F2_41C8_7B485E2310BF",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0_HS_0_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 41.45,
   "hfov": 18.46,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -24.79
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46, this.camera_4FC250D2_5527_D94E_41B6_E977512CE8B7); this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A1C7F1_4D73_8A25_41CD_6C8AC27011BF",
   "yaw": -40.33,
   "hfov": 16.62,
   "pitch": -23.17,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5A87F9C8_4D50_983D_41BD_4A6DF54EDC94",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0_HS_1_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -40.33,
   "hfov": 16.62,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -23.17
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 27)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": " Click Here for\u000dGarden Access"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0_HS_2_0.png",
      "width": 382,
      "class": "ImageResourceLevel",
      "height": 150
     }
    ]
   },
   "pitch": -6.03,
   "hfov": 33.39,
   "yaw": 64.22,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_66377202_4CD1_8800_4180_D11511E3D074",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0_HS_2_0_map.gif",
      "width": 40,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": 64.22,
   "hfov": 33.39,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -6.03
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_05A1F7F1_4D73_8A25_4173_201354E1B494",
   "yaw": -173.6,
   "hfov": 29.47,
   "pitch": -46.66,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": true,
 "id": "overlay_7FDAF6C7_4CB1_886A_41CF_2FA62570F773",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0_HS_3_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -173.6,
   "hfov": 29.47,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -46.66
  }
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_468CDF09_4DD0_986B_41BE_3A494626C999, this.camera_4FFC20CE_5527_D956_41CC_FF0CE4652E25); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Circle Point 02c"
 },
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_7ACAC923_559D_A647_41D3_B832B5DF2936",
   "yaw": -109.66,
   "hfov": 22.1,
   "pitch": -23.55,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_7CC0DA57_559A_DACE_41D2_0091A16ACE89",
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0_HS_4_0_0_map.gif",
      "width": 48,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "yaw": -109.66,
   "hfov": 22.1,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -23.55
  }
 ]
},
{
 "overflow": "visible",
 "children": [
  "this.MapViewer",
  "this.IconButton_18EE8675_09E2_5FBD_4155_1A9040D06494"
 ],
 "id": "Container_19173ACE_09E6_54EE_4175_5F95190B4AC0",
 "left": "10%",
 "backgroundOpacity": 0.1,
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5,
 "contentOpaque": true,
 "paddingRight": 0,
 "right": "10%",
 "borderRadius": 0,
 "scrollBarWidth": 10,
 "propagateClick": false,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "top": "10%",
 "borderSize": 0,
 "minWidth": 1,
 "horizontalAlign": "left",
 "scrollBarColor": "#000000",
 "layout": "absolute",
 "scrollBarVisible": "rollOver",
 "bottom": "10%",
 "class": "Container",
 "backgroundColorDirection": "vertical",
 "paddingBottom": 0,
 "gap": 10,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "shadow": false,
 "verticalAlign": "top",
 "paddingTop": 0,
 "data": {
  "name": "Container5854"
 },
 "scrollBarMargin": 2
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A917F9_4D73_8A24_41CE_D88BE12613EC",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_1_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A8F7F9_4D73_8A24_41C8_B0A380F6E5CB",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_75F04894_4FD0_877C_41C7_BCFEC3677A03_1_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_6FAE2D39_559E_BE5E_41D0_F9AC8B943B8D",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A3C7F2_4D73_8A24_41BF_6603D378D41A",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_6FAF4D39_559E_BE5E_4182_9E9DA09945A3",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_6FAF2D39_559E_BE5E_41D3_20A0137112C8",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468E6BC0_4DD0_9FD9_41C9_E089BFA3846C_0_HS_3_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A207F5_4D73_8A2C_41B4_8F4BF0B34612",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A237F5_4D73_8A2C_41BB_228BCCB4D2FC",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05ADA7F5_4D73_8A2C_41C0_9AEC7F43421B",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_682D5242_55AB_EA2C_41CC_B2AC16C65EA4",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_4689DAC1_4DD3_99D8_41C4_8E587FCD6A9B_0_HS_3_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AD17F4_4D73_8A2C_41B2_A3B2D97C222D",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AD37F4_4D73_8A2C_417F_9EE5184512F4",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468DFC61_4DD3_F8D8_41CA_0E04C96B1DDE_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AD77F5_4D73_8A2C_41B2_9AD1F2C9B076",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AD17F5_4D73_8A2C_41C8_B8B1F5A4A619",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05ACC7F5_4D73_8A2C_41BF_4EA70D8033EF",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_682CC243_55AB_EA2D_41B8_8C23D1594171",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0_HS_3_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_68336243_55AB_EA2D_41B6_B7A99E8D2CE7",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_4696B1B6_4DD3_8BB9_4189_1A71B9BB6CA2_0_HS_4_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A0E7F2_4D73_8A27_41B2_473F08C8D64A",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A0A7F2_4D73_8A27_4166_E43FD9F55D92",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A057F2_4D73_8A27_41D1_DEAA3EBE5DE7",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_0_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_76CB06A9_4CF1_8809_41B7_B7EFA656A50B",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468A0506_4DD0_8859_41C9_249E6530A13B_1_HS_3_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_5FA5CED3_50FC_B5E3_41D1_9B4EB91A1190",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A8B7F9_4D73_8A24_41C1_9575820DFABF",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_1_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A857F9_4D73_8A24_41C9_385FD8515DC3",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_0B6EC80E_4CD0_8613_41C6_227755166D76_1_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AF27F6_4D73_8A2C_41C1_1816135CABFE",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_7AB736C5_4F50_8864_419C_98699023C783_1_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AEC7F7_4D73_8A2C_41C5_2F7309997303",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_7AB736C5_4F50_8864_419C_98699023C783_1_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A357F3_4D73_8A24_41CE_5E040F808B64",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A307F3_4D73_8A24_419A_67D5FB008F55",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_46889D1B_4DD3_986F_418C_C91A8229DC90_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_6221F5DF_55FA_69C7_41CE_5C00CF6186D3",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AD67F4_4D73_8A2C_41A5_92CD6B3517EE",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_4695F61E_4DD3_8869_41C0_09519EF2CB9B_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A237F4_4D73_8A2C_41C9_3C538C7F8D57",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05ADD7F4_4D73_8A2C_41CE_0D548DA2AED5",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_4688F86C_4DD3_98A8_4194_6FD8378C875B_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A647F1_4D73_8A25_41C8_924C6F725DB0",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A667F1_4D73_8A25_41D2_A50B13A5C3FE",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468EA9AB_4DD0_9BAF_41CE_2C4861DD2712_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A177F1_4D73_8A25_41D1_D16CCF68EECA",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A127F2_4D73_8A27_41D0_BAF270D10998",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A0C7F2_4D73_8A27_41C2_337D5F97279F",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468EDE24_4DD0_B858_41D2_111DE9DBCF46_0_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A037F2_4D73_8A24_41CF_79E080E7549D",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A3D7F3_4D73_8A24_41D3_BE4CDF176738",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_46881F6E_4DD3_78A9_41C4_C502630C14BB_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AE37F8_4D73_8A24_4181_6B70384E52AB",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_1_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A9E7F8_4D73_8A24_41B0_3E959353BFF2",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_1_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_27427C79_4D51_9E34_41D0_492C61EC91A6",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_0_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A9A7F9_4D73_8A24_41CB_A211F241EFCF",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_1_HS_3_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A957F9_4D73_8A24_41A8_FEF9C3958656",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_75CB8106_4FD0_895C_418F_7FE2CAC0B40D_1_HS_4_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_6FA41D3B_559E_BE52_41D2_9A352785CAC2",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A297F3_4D73_8A24_41D0_B3ACCDCFA174",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_46883AD9_4DD3_B9EB_41D2_8A0A95E502CD_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AD87F4_4D73_8A2C_41C4_9CB60E9EC851",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05ADA7F4_4D73_8A2C_41C4_812E997B7E52",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_4688EF20_4DD3_9859_41C7_787AA99356F7_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A327F3_4D73_8A24_41C6_3C7BE1A4A009",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_46883404_4DD3_8859_41CB_7620618CF902_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A2C7F3_4D73_8A24_41C0_AAAD7774373B",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_46883404_4DD3_8859_41CB_7620618CF902_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_620BF7C0_56BB_AA01_41D4_5EDFFF6B73BA",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A267F4_4D73_8A2C_4186_07234DF75178",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A217F4_4D73_8A2C_41B7_F9980E181772",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468F9180_4DD3_8859_4145_D36188AFA280_0_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_622E65DD_55FA_69CB_41D1_957FCE941ABD",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A357F2_4D73_8A24_41B7_BB81F09C1590",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A0F7F2_4D73_8A24_4197_179371A4E88A",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A097F2_4D73_8A24_41C8_D7302ED9B6AD",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468DC21A_4DD0_8869_41D2_B9896E02EE70_0_HS_3_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A677F0_4D73_8A23_41B1_520288C8B725",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A787F0_4D73_8A23_41C2_5CF9D246031C",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A7A7F0_4D73_8A23_41D0_46A5C82B8CA6",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468CDC2F_4DD0_F8A7_41C9_8B79828479D2_0_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05ACD7F4_4D73_8A2C_41AE_0CFFDBA82EA6",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_76FCD6B2_4CF1_881B_41C6_9E5BCC67B6AF",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_468A13B0_4DD3_8FB9_41D0_1CBBCA55B9FB_1_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A507EF_4D73_8A3D_41CF_693B561A404F",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A527EF_4D73_8A3D_41A3_7F8072AD3152",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A4C7EF_4D73_8A3D_41C4_E07A04522F50",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A4F7EF_4D73_8A3D_419B_C55D720DD6D3",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0_HS_3_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A497EF_4D73_8A3D_41D1_F4CE102BE422",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0_HS_4_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A4B7EF_4D73_8A3D_41C1_76E6BB8CAC8F",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0_HS_5_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A457EF_4D73_8A3D_41CC_7DF587EDFA6B",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0_HS_6_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A407EF_4D73_8A3D_418C_4A8E5F52DCE7",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468F57D8_4DD0_97E9_41CF_8C00ED4D26E8_0_HS_7_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AE17F8_4D73_8A24_41BA_9095C3DA57B5",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_717A0897_4FD0_877B_41BB_C1BF96F36747_1_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A1A7F1_4D73_8A25_41C4_3E39B6A613BB",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A147F1_4D73_8A25_41B7_416C5CE30C3D",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468E3752_4DD0_88F9_41D2_1251D4678612_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AFC7F6_4D73_8A2C_41D2_BF9EBC14E462",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_1_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AFE7F6_4D73_8A2C_41CE_EBCD9FEFBB94",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_1_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AF97F6_4D73_8A2C_41D1_DB66604456F6",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_1_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AF47F6_4D73_8A2C_41AA_D765065C66D3",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_1_HS_3_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AF77F6_4D73_8A2C_41A5_390D9DCC23DA",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_7F6B3550_4CB1_8863_41A9_8451EE8F3384_1_HS_4_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A0B7F2_4D73_8A24_41D0_24A2D7AF5D71",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A057F2_4D73_8A24_41CA_2E4740B495EC",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A017F2_4D73_8A24_41C2_94D74E5C4734",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468FB8B7_4DD3_79A7_41C0_51CCF45FB2E7_0_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_621FD5D4_55FA_69DA_41CB_31244E9938F8",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A5B7EE_4D73_8A3F_41A7_1AD9F9CF4E00",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A557EF_4D73_8A3D_41D1_5EFA9DB03DC1",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_6D2DD912_55AB_A629_41B7_3D2DDC945218",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0_HS_3_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_6D2DA913_55AB_A62F_41A9_472ED18B217A",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468FF4AB_4DD0_89AF_41CA_738AFA1906B0_0_HS_4_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_622CF5DE_55FA_69C9_41D3_98D3297D1013",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A397F3_4D73_8A24_41B9_C6082F17BABE",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A3B7F3_4D73_8A24_41C9_21024B138FBF",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_46959655_4DD3_88F8_41AB_4E06F2CBD160_0_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AE87F8_4D73_8A24_41C8_60D58546B90C",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_1_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AEA7F8_4D73_8A24_41BC_B52AF25906D5",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_1_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AE47F8_4D73_8A24_4199_C6B62EEC6AB4",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_775CEC9F_4FD7_98CC_41AF_5446316BB333_1_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AC97F5_4D73_8A2C_41CE_8A9059C187B3",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AC47F6_4D73_8A2C_41D0_E2E1DC6C5E13",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AC77F6_4D73_8A2C_41D1_219442CBF36C",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AC27F6_4D73_8A2C_41D2_A18BF9A7500C",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0_HS_3_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_620217C3_56BB_AA07_41A1_26A0AA2D1F76",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_46915890_4DD3_B878_419E_FA9CF156F3F2_0_HS_4_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A437EF_4D73_8A3D_4195_5913B89343E9",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A7E7EF_4D73_8A3D_41C4_0C62F38532BE",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A787EF_4D73_8A3D_41CB_D7775F8D4029",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A7A7EF_4D73_8A3D_41CF_DE66A7AA5168",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0_HS_3_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A747EF_4D73_8A3D_41CA_593437A21ADE",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468CDF09_4DD0_986B_41BE_3A494626C999_0_HS_4_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AEF7F7_4D73_8A2C_41C5_2BA5F0884E41",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_1_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AEA7F7_4D73_8A2C_41B3_E5E7AB414D19",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_1_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AE47F7_4D73_8A2C_41C5_84407B4551B2",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_1_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AE67F7_4D73_8A2C_41A8_EB2F735EE5AA",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_794DF9BD_4F73_7833_41BD_0FA1630A47EB_1_HS_3_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AE17F7_4D73_8A2C_41B3_271C7A503166",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_1_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AFA7F7_4D73_8A2C_41BB_FBB7AFA444BF",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_1_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AF57F8_4D73_8A24_41B0_A520C9D26915",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_775B6EC2_4FB0_9846_41CA_731F3E2C5CC7_1_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A757F0_4D73_8A23_41C2_A8F2F8F42DDF",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A777F0_4D73_8A23_4193_1C6899CA204D",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A717F0_4D73_8A23_41B1_9BBCD2CAEB3E",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A737F0_4D73_8A23_41A3_F06857AD5422",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0_HS_3_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_76CFB6A8_4CF1_8837_41D0_A188C7FA927D",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_1_HS_4_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A687F1_4D73_8A25_41D1_A06129114615",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468EB303_4DD0_8858_41BB_9F622C7A9FDA_0_HS_5_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A777F0_4D73_8A23_41C8_D35C20D0C278",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A717F0_4D73_8A23_41BB_92CA735495D6",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_76D366A7_4CF1_8839_41D2_32A9E4F6A25F",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_1_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A6E7F0_4D73_8A23_41C7_097483DE0323",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0_HS_3_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A687F0_4D73_8A23_4195_0CB93E59143E",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0_HS_4_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A6A7F0_4D73_8A23_41D2_D6BE0FEA9C05",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0_HS_5_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A647F0_4D73_8A23_41D1_679B2F8656B8",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_468C45AD_4DD0_8BAB_416B_9BB0F1548492_0_HS_6_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AF27F8_4D73_8A24_41B1_FFFE2369C98E",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_1_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05AEC7F8_4D73_8A24_41CE_EB145BE95DCC",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_74F8C470_4FD7_8855_41C3_4BBCF439ACCE_1_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05BA57EE_4D73_8A3F_41A9_00D1BB48BBAC",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_41D7975F_4DD1_88E7_41B4_05EE712BD8ED_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A617F1_4D73_8A25_4197_0E81F333E937",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A1C7F1_4D73_8A25_41CD_6C8AC27011BF",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_05A1F7F1_4D73_8A25_4173_201354E1B494",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0_HS_3_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_7ACAC923_559D_A647_41D3_B832B5DF2936",
 "frameDuration": 50,
 "levels": [
  {
   "url": "media/panorama_46886090_4DD0_8879_41C9_0592816F1BE4_0_HS_4_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ]
},
{
 "transparencyActive": true,
 "maxHeight": 30,
 "id": "IconButton_18EE8675_09E2_5FBD_4155_1A9040D06494",
 "backgroundOpacity": 0,
 "width": 30,
 "paddingRight": 0,
 "paddingLeft": 0,
 "borderRadius": 0,
 "right": "0.42%",
 "iconURL": "skin/IconButton_18EE8675_09E2_5FBD_4155_1A9040D06494.png",
 "minHeight": 1,
 "propagateClick": false,
 "horizontalAlign": "center",
 "top": "0.67%",
 "borderSize": 0,
 "minWidth": 1,
 "mode": "push",
 "click": "this.setComponentVisibility(this.Container_06295097_09E1_D37D_41A0_4F59CDA5B097, false, 0, null, null, false); this.setComponentVisibility(this.Container_19173ACE_09E6_54EE_4175_5F95190B4AC0, false, 0, null, null, false); this.setComponentVisibility(this.MapViewer, false, 0, null, null, false); this.setComponentVisibility(this.IconButton_18EE8675_09E2_5FBD_4155_1A9040D06494, false, 0, null, null, false)",
 "class": "IconButton",
 "paddingBottom": 0,
 "height": 30,
 "shadow": false,
 "verticalAlign": "middle",
 "paddingTop": 0,
 "data": {
  "name": "IconButton6678"
 },
 "cursor": "hand",
 "maxWidth": 30
}],
 "horizontalAlign": "left",
 "scrollBarColor": "#000000",
 "layout": "absolute",
 "class": "Player",
 "downloadEnabled": false,
 "paddingBottom": 0,
 "gap": 10,
 "shadow": false,
 "data": {
  "name": "Player14994"
 },
 "verticalAlign": "top",
 "paddingTop": 0,
 "defaultVRPointer": "laser",
 "mouseWheelEnabled": true,
 "scrollBarMargin": 2,
 "desktopMipmappingEnabled": false,
 "height": "100%",
 "backgroundPreloadEnabled": true
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
