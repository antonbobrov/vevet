"use strict";(self.webpackChunkvevet=self.webpackChunkvevet||[]).push([[50],{50:(e,t,c)=>{c.r(t);var n=c(345);new n.Application;var r=document.querySelector("#ctx2d-container"),i=new n.Ctx2D({container:r||void 0,updateOnResize:!0});function a(){var e=i.ctx,t=i.width,c=i.height;e.clearRect(0,0,t,c),e.beginPath(),e.fillStyle="#ccc",e.fillRect(t/2,c/2,t/4,c/4),e.closePath()}function d(){var e=document.querySelector("#ctx2d-dpr");e&&(e.innerHTML="".concat(i.dpr));var t=document.querySelector("#ctx2d-width");t&&(t.innerHTML="".concat(i.width));var c=document.querySelector("#ctx2d-height");c&&(c.innerHTML="".concat(i.width))}a(),i.addCallback("resize",(function(){a()})),d(),i.addCallback("resize",(function(){d()}))}}]);