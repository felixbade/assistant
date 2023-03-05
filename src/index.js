import './style/main.css'
import './js/app.js'

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope)
    }, (error) => {
        console.log('ServiceWorker registration failed: ', error)
    })
}