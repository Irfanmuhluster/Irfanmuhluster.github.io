var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BBfWuvyTBpe7-TX4rJ60H2JVSR7giQdBN-52HvTJZq2B8jj8lHjp8NsElVaripAJ8mtK2ztGWlFeeVvvY_xJsDE",
   "privateKey": "sfWTLtjQRjtsCzQsruVr0TgEwiIkss0d7KTSv0codi0"
};
 
 
webPush.setVapidDetails(
   'mailto:muhirfan234@gmail.com',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/c5nXai9kdhc:APA91bGNZJLZWxCdYtc3Z2KciCMm_CO8lqf1-kenSDk8qUPd2yrUgrGM2oB4JyBMUEvnKfnoVzx8QzaXxEAZ3uwSTdIF86YYx3sheS4evX-ZXhILMCOzrxLbnsOXLXZLWrxJ3fTtnFu2",
   "keys": {
       "p256dh": "BFE8aJVTc1Dl+iFEozyYgEpO5xGXdlKyuMwW6d/O5RrjVtcJ7/9i7yjesZzKqLyZ/bawvQrTsPdxs2xlW6xuxNs=",
       "auth": "jgS8WoOszMENDFeY2hJOfw=="
   }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
   gcmAPIKey: '446557584006',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);