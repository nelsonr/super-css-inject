/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************************!*\
  !*** ./src/worker/background.ts ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
const activeTabs = {};
const env = chrome || browser;
function getActiveStylesheetsCount(tabId) {
    if (activeTabs[tabId]) {
        return activeTabs[tabId].length.toString();
    }
    return "";
}
env.runtime.onMessage.addListener((message, sender) => {
    const tabId = message.tabId || sender.tab?.id;
    if (message.action === "pageLoad" && activeTabs[tabId]) {
        env.action.setBadgeText({
            text: getActiveStylesheetsCount(tabId),
            tabId: tabId,
        });
        env.tabs.sendMessage(tabId, {
            action: "inject",
            urlList: activeTabs[tabId],
        });
    }
    if (message.action === "inject") {
        if (!activeTabs[tabId]) {
            activeTabs[tabId] = [];
        }
        activeTabs[tabId].push(message.url);
        env.action.setBadgeText({
            text: getActiveStylesheetsCount(tabId),
            tabId: tabId,
        });
        env.tabs.sendMessage(tabId, {
            action: "inject",
            urlList: [message.url],
        });
    }
    if (message.action === "clear" && activeTabs[tabId]) {
        activeTabs[tabId].forEach((stylesheetURL, index) => {
            if (stylesheetURL === message.url) {
                activeTabs[tabId].splice(index, 1);
            }
        });
        if (activeTabs[tabId].length < 1) {
            delete activeTabs[tabId];
        }
        env.action.setBadgeText({
            text: getActiveStylesheetsCount(tabId),
            tabId: tabId,
        });
        env.tabs.sendMessage(tabId, { action: "clear", url: message.url });
    }
});


/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOztVQUFBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Qsc0NBQXNDLG1DQUFtQztBQUN6RTtBQUNBLENBQUM7QUFDUyIsInNvdXJjZXMiOlsid2VicGFjazovL2FwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9hcHAvLi9zcmMvd29ya2VyL2JhY2tncm91bmQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImNvbnN0IGFjdGl2ZVRhYnMgPSB7fTtcclxuY29uc3QgZW52ID0gY2hyb21lIHx8IGJyb3dzZXI7XHJcbmZ1bmN0aW9uIGdldEFjdGl2ZVN0eWxlc2hlZXRzQ291bnQodGFiSWQpIHtcclxuICAgIGlmIChhY3RpdmVUYWJzW3RhYklkXSkge1xyXG4gICAgICAgIHJldHVybiBhY3RpdmVUYWJzW3RhYklkXS5sZW5ndGgudG9TdHJpbmcoKTtcclxuICAgIH1cclxuICAgIHJldHVybiBcIlwiO1xyXG59XHJcbmVudi5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobWVzc2FnZSwgc2VuZGVyKSA9PiB7XHJcbiAgICBjb25zdCB0YWJJZCA9IG1lc3NhZ2UudGFiSWQgfHwgc2VuZGVyLnRhYj8uaWQ7XHJcbiAgICBpZiAobWVzc2FnZS5hY3Rpb24gPT09IFwicGFnZUxvYWRcIiAmJiBhY3RpdmVUYWJzW3RhYklkXSkge1xyXG4gICAgICAgIGVudi5hY3Rpb24uc2V0QmFkZ2VUZXh0KHtcclxuICAgICAgICAgICAgdGV4dDogZ2V0QWN0aXZlU3R5bGVzaGVldHNDb3VudCh0YWJJZCksXHJcbiAgICAgICAgICAgIHRhYklkOiB0YWJJZCxcclxuICAgICAgICB9KTtcclxuICAgICAgICBlbnYudGFicy5zZW5kTWVzc2FnZSh0YWJJZCwge1xyXG4gICAgICAgICAgICBhY3Rpb246IFwiaW5qZWN0XCIsXHJcbiAgICAgICAgICAgIHVybExpc3Q6IGFjdGl2ZVRhYnNbdGFiSWRdLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKG1lc3NhZ2UuYWN0aW9uID09PSBcImluamVjdFwiKSB7XHJcbiAgICAgICAgaWYgKCFhY3RpdmVUYWJzW3RhYklkXSkge1xyXG4gICAgICAgICAgICBhY3RpdmVUYWJzW3RhYklkXSA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhY3RpdmVUYWJzW3RhYklkXS5wdXNoKG1lc3NhZ2UudXJsKTtcclxuICAgICAgICBlbnYuYWN0aW9uLnNldEJhZGdlVGV4dCh7XHJcbiAgICAgICAgICAgIHRleHQ6IGdldEFjdGl2ZVN0eWxlc2hlZXRzQ291bnQodGFiSWQpLFxyXG4gICAgICAgICAgICB0YWJJZDogdGFiSWQsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZW52LnRhYnMuc2VuZE1lc3NhZ2UodGFiSWQsIHtcclxuICAgICAgICAgICAgYWN0aW9uOiBcImluamVjdFwiLFxyXG4gICAgICAgICAgICB1cmxMaXN0OiBbbWVzc2FnZS51cmxdLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKG1lc3NhZ2UuYWN0aW9uID09PSBcImNsZWFyXCIgJiYgYWN0aXZlVGFic1t0YWJJZF0pIHtcclxuICAgICAgICBhY3RpdmVUYWJzW3RhYklkXS5mb3JFYWNoKChzdHlsZXNoZWV0VVJMLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoc3R5bGVzaGVldFVSTCA9PT0gbWVzc2FnZS51cmwpIHtcclxuICAgICAgICAgICAgICAgIGFjdGl2ZVRhYnNbdGFiSWRdLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoYWN0aXZlVGFic1t0YWJJZF0ubGVuZ3RoIDwgMSkge1xyXG4gICAgICAgICAgICBkZWxldGUgYWN0aXZlVGFic1t0YWJJZF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVudi5hY3Rpb24uc2V0QmFkZ2VUZXh0KHtcclxuICAgICAgICAgICAgdGV4dDogZ2V0QWN0aXZlU3R5bGVzaGVldHNDb3VudCh0YWJJZCksXHJcbiAgICAgICAgICAgIHRhYklkOiB0YWJJZCxcclxuICAgICAgICB9KTtcclxuICAgICAgICBlbnYudGFicy5zZW5kTWVzc2FnZSh0YWJJZCwgeyBhY3Rpb246IFwiY2xlYXJcIiwgdXJsOiBtZXNzYWdlLnVybCB9KTtcclxuICAgIH1cclxufSk7XHJcbmV4cG9ydCB7fTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9